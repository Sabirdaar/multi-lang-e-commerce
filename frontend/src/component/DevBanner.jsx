export default function DevBanner() {
  if (import.meta.env.PROD) return null;

  return (
    <div className="bg-yellow-500 text-black text-center py-2 px-4 text-sm">
      🚧 Development Mode: Using Mock Data - Backend microservices not connected yet
    </div>
  );
}