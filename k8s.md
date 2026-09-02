### *ชุดไฟล์ k8s สำหรับ agent-hub*

#### *1. `k8s/namespace.yaml`*
apiVersion: v1
kind: Namespace
metadata:
  name: agent-hub
#### *2. `k8s/secret.yaml`*
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: agent-hub
type: Opaque
stringData:
  OPENROUTER_API_KEY: "sk-or-v1-ใส่ของจริงตรงนี้"
  REDIS_URL: "redis://redis:6379"
#### *3. `k8s/redis.yaml`*
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: agent-hub
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
            - name: redis
        image: redis:7-alpine
        ports:
                - containerPort: 6379
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: agent-hub
spec:
  selector:
    app: redis
  ports:
    - port: 6379
#### *4. `k8s/deployment.yaml`*
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agent-hub
  namespace: agent-hub
spec:
  replicas: 3
  selector:
    matchLabels:
      app: agent-hub
  template:
    metadata:
      labels:
        app: agent-hub
    spec:
      containers:
            - name: app
        image: ghcr.io/zyntro/agent-hub:latest # เปลี่ยนเป็น image คุณ
        ports:
                - containerPort: 3000
        envFrom:
                - secretRef:
            name: app-secrets
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
        resources:
          requests:
            cpu: "200m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
#### *5. `k8s/service.yaml`*
apiVersion: v1
kind: Service
metadata:
  name: agent-hub
  namespace: agent-hub
spec:
  type: ClusterIP
  selector:
    app: agent-hub
  ports:
    - port: 80
    targetPort: 3000
#### *6. `k8s/hpa.yaml` - Auto Scale*
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: agent-hub-hpa
  namespace: agent-hub
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: agent-hub
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
#### *7. `k8s/ingress.yaml`*
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: agent-hub-ingress
  namespace: agent-hub
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
    - hosts:
        - api.agenthub.com # เปลี่ยนเป็น domain คุณ
    secretName: agent-hub-tls
  rules:
    - host: api.agenthub.com
    http:
      paths:
            - path: /
        pathType: Prefix
        backend:
          service:
            name: agent-hub
            port:
              number: 80
### *วิธี Deploy 4 ขั้นตอน*
1. สร้าง ns
kubectl apply -f k8s/namespace.yaml

2. แก้ Secret ก่อน แล้ว apply ทั้งหมด
kubectl apply -f k8s/

3. เช็ค
kubectl get pods -n agent-hub
kubectl get hpa -n agent-hub

4. ดู log
kubectl logs -f deployment/agent-hub -n agent-hub
### *ที่เพิ่มจากของเดิม*
1.  *Liveness Probe*: pod ค้างมันจะ restart เอง = self-healing ฝั่ง infra
2.  *HPA*: คนเยอะมัน scale เป็น 10 pod เอง ประหยัดตอนคนน้อย
3.  *Resource limit*: กันกิน CPU RAM จนล่ม

อยากให้ผมทำ `Github Actions` สำหรับ `build image + deploy to k8s` อัตโนมัติให้ด้วยไหมครับ? 
หรืออยากให้เพิ่ม `Prometheus + Grafana` ไว้ดู Token ที่ใช้แบบ realtime