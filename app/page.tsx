// app/page.tsx
'use client';

import { useState } from 'react';

export default function PersonalPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'feature', // feature, bug, collaboration
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', type: 'feature', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-2xl">
            1N
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-bold mb-2">1napz</h1>
            <p className="text-xl text-gray-400 mb-4">Developer & AI Enthusiast</p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="https://github.com/1napz" target="_blank" className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">GitHub</a>
              <a href="https://agent-hub-snowy.vercel.app" target="_blank" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition">Agent Hub</a>            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">About Me</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            สวัสดีครับ ผมชอบพัฒนาเครื่องมือและแพลตฟอร์มที่ช่วยให้การทำงานกับ AI ง่ายขึ้น 
            ปัจจุบันกำลังพัฒนา Agent Hub เพื่อเป็นศูนย์กลางในการจัดการและสร้าง AI Agents ครับ
          </p>
        </section>

        {/* Request Form Section */}
        <section className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-2">📩 Send a Request</h2>
          <p className="text-gray-400 mb-6">มีไอเดีย ฟีเจอร์ที่อยากได้ หรืออยาก collaborate? ส่งมาได้เลยครับ!</p>

          {status === 'success' && (
            <div className="bg-green-900/50 text-green-300 p-4 rounded-lg mb-6 border border-green-800">
              ✅ ส่งคำขอเรียบร้อยแล้ว! ขอบคุณครับ
            </div>
          )}
          {status === 'error' && (
            <div className="bg-red-900/50 text-red-300 p-4 rounded-lg mb-6 border border-red-800">
              ❌ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">ชื่อ / นามแฝง</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">อีเมล (ไม่บังคับ)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition"
                />
              </div>            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">ประเภทคำขอ</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="feature"> ขอฟีเจอร์ใหม่ (Feature Request)</option>
                <option value="bug">🐛 แจ้งบัค (Bug Report)</option>
                <option value="collaboration">🤝 ขอร่วมพัฒนา (Collaboration)</option>
                <option value="other">💬 อื่นๆ (Other)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">รายละเอียด</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'กำลังส่ง...' : 'ส่งคำขอ'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}