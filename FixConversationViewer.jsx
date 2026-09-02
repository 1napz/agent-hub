export default function FigCard({ shareUrl }) {
  return (
    <div className="border p-4 rounded-lg">
      <h3 className="font-bold mb-2">Fig Conversation</h3>
      <a href={shareUrl} target="_blank" className="text-purple-600 break-all">
        {shareUrl}
      </a>
      <button className="mt-3 bg-purple-500 text-white px-4 py-2 rounded-lg">
        Open in Fig App
      </button>
    </div>
  );
}