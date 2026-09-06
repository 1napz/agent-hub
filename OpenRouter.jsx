import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // เปลี่ยนโมเดลได้
        messages: newMessages,
      }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.choices[0].message.content }]);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="h-96 overflow-y-auto border rounded-lg p-3 mb-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <p className="inline-block bg-gray-100 rounded-lg px-3 py-2 my-1">
              {m.content}
            </p>
          </div>
        ))}
        {loading && <p>AI กำลังพิมพ์...</p>}
      </div>
      <div className="flex gap-2">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="พิมพ์ข้อความ..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}