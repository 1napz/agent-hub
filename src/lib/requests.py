ได้ครับ นี่คือตัวอย่างโค้ด Python สำหรับเชื่อมต่อกับ Obsidian Local REST API เพื่อดึงข้อมูลโน้ต โดยใช้ไลบรารี  requests  ซึ่งเป็นวิธีที่นิยมและง่ายต่อการใช้งาน:

 
import requests

# กำหนด URL ของ API (เปลี่ยน PORT เป็นพอร์ตที่ปลั๊กอินใช้)
api_url = "http://localhost:PORT/api/v1/notes"

# ใส่ API key ที่ได้จากการตั้งค่าปลั๊กอิน
api_key = "your_api_key_here"

# กำหนด headers สำหรับการยืนยันตัวตน
headers = {
    "Authorization": f"Bearer {api_key}"
}

try:
    # ส่งคำขอ GET ไปยัง API
    response = requests.get(api_url, headers=headers)

    # ตรวจสอบสถานะการตอบกลับ
    if response.status_code == 200:
        notes = response.json()
        print("List of notes:")
        for note in notes:
            print(f"- {note['name']} (ID: {note['id']})")
    else:
        print(f"Failed to fetch notes. Status code: {response.status_code}")
        print("Response:", response.text)

except Exception as e:
    print("Error occurred:", e)
 

วิธีใช้งาน

เปลี่ยน  PORT  เป็นพอร์ตที่ปลั๊กอิน Local REST API ใช้งาน (ค่าปกติอาจเป็น 27123 หรือค่าที่ตั้งไว้)
แทนที่  your_api_key_here  ด้วย API key ที่ปลั๊กอินสร้างให้
รันสคริปต์นี้เพื่อดึงรายชื่อโน้ตจาก Obsidian vault ผ่าน API

ถ้าต้องการตัวอย่างการแก้ไขหรือเพิ่มโน้ต ผมสามารถช่วยเขียนโค้ดตัวอย่างให้เพิ่มเติมได้ครับ!
