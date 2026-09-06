typescript
// src/lib/api.ts
import axios from "axios";
import { loadEnv } from "./env";

const api = axios.create({ timeout: 20000 });

api.interceptors.request.use((config) => {
  const { webAppUrl, webAppSecret } = loadEnv();
  if (!webAppUrl) throw new Error("Web App URL not set.");

  // Append the action as a query parameter for Apps Script routing
  if (config.url && !config.url.startsWith("http")) {
    const joiner = webAppUrl.includes("?") ? "&" : "?";
    config.url = `$`{webAppUrl}`${joiner}${config.url.replace(/^\?/, "")}`;
  }

  // Inject the shared secret into the headers [13, 15]
  if (webAppSecret) {
    config.headers = { ...config.headers, "X-WebApp-Secret": webAppSecret };
  }
  return config;
});

export const Api = {
  async getStats() {
    const { data } = await api.get("action=stats");
    return data; // Returns { inboxCount, processedToday, dlqCount, lastRunAt } [16]
  },
  async reprocessDLQ(id: string) {
    const { data } = await api.post("action=dlq.reprocess", { id });
    return data; // { ok: boolean } [17]
  }
};
