import { useNavigate } from "react-router";
import { Home, Search } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-orange-500 mb-4">404</h1>
        <h2 className="font-bold text-gray-900 mb-4">Страница не найдена</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          К сожалению, запрашиваемая страница не существует. Возможно, она была удалена или вы ввели неверный адрес.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            На главную
          </button>
          <button
            onClick={() => navigate("/catalog")}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Каталог
          </button>
        </div>
      </div>
    </div>
  );
}
