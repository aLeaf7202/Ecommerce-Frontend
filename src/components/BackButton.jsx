import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed bottom-6 left-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-110 hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer group"
      aria-label="Go back"
    >
      <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
    </button>
  );
}
