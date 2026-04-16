import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { ShoppingCart, User, Search, Phone, Menu, Calculator as CalcIcon, LogOut } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

const LogoIcon = () => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#1a237e' }} />
        <stop offset="100%" style={{ stopColor: '#0d47a1' }} />
      </linearGradient>
    </defs>
    <path d="M120 300 H280 V180 L200 100 L120 180 Z" fill="url(#logoGrad)" />
    <path d="M 50 250 Q 200 50 350 250" fill="none" stroke="#f97316" strokeWidth="20" strokeLinecap="round" />
    <path d="M200 60 L210 85 L235 95 L210 105 L200 130 L190 105 L165 95 L190 85 Z" fill="#f97316" />
  </svg>
);

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalCount } = useCart();
  const { user, loading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const userName = user?.user_metadata?.name ?? user?.email?.split("@")[0];

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Top bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <a href="tel:+79999999999" className="flex items-center gap-2 hover:text-orange-400 transition">
            <Phone className="w-4 h-4" />
            <span>+7 (999) 999-99-99</span>
          </a>
          <span>Режим работы: Пн-Пт 9:00-18:00</span>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <LogoIcon />
              </div>
              <div>
                <div className="font-bold text-2xl text-gray-900">СтройКосмос</div>
                <div className="text-xs text-gray-500">Строительные материалы</div>
              </div>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск товаров..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-3">

              {/* Телефон + мессенджеры */}
              <div className="hidden md:flex items-center gap-3">
                <a href="tel:+79096549666" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition">
                  +7 (909) 654-96-66
                </a>
                <div className="flex items-center gap-2">
                  {/* WhatsApp */}
                  <a href="https://wa.me/79096549666" target="_blank" rel="noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                  {/* Telegram */}
                  <a href="https://t.me/+79096549666" target="_blank" rel="noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                  {/* Max */}
                  <a href="https://max.ru/+79096549666" target="_blank" rel="noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 text-white hover:bg-purple-600 transition overflow-hidden">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/%D0%9B%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF_MAX.svg/1280px-%D0%9B%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF_MAX.svg.png" alt="Max" className="w-5 h-5 object-contain" />
                  </a>
                </div>
              </div>

              {/* Авторизация */}
              {!loading && (
                user ? (
                  <div className="hidden md:flex items-center gap-2">
                    <button onClick={() => navigate("/orders")} className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {userName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{userName}</span>
                    </button>
                    <button onClick={handleLogout} title="Выйти" className="p-2 text-gray-400 hover:text-red-500 transition">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => navigate("/auth")} className="hidden md:flex items-center gap-2 px-4 py-2 hover:text-orange-500 transition">
                    <User className="w-5 h-5" />
                    <span>Вход</span>
                  </button>
                )
              )}

              {/* Корзина */}
              <button onClick={() => navigate("/cart")} className="relative p-2 hover:text-orange-500 transition">
                <ShoppingCart className="w-6 h-6" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>

              {/* Мобильное меню */}
              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 mt-4 pt-4 border-t border-gray-100">
            <Link to="/" className={`font-medium transition ${isActive("/") ? "text-orange-500" : "text-gray-700 hover:text-orange-500"}`}>
              Главная
            </Link>
            <Link to="/catalog" className={`font-medium transition ${location.pathname.startsWith("/catalog") ? "text-orange-500" : "text-gray-700 hover:text-orange-500"}`}>
              Каталог
            </Link>
            <Link to="/calculators" className={`font-medium transition flex items-center gap-1 ${isActive("/calculators") ? "text-orange-500" : "text-gray-700 hover:text-orange-500"}`}>
              <CalcIcon className="w-4 h-4" />
              Калькуляторы
            </Link>
            <Link to="/about" className={`font-medium transition ${isActive("/about") ? "text-orange-500" : "text-gray-700 hover:text-orange-500"}`}>
              О компании
            </Link>
            <Link to="/contacts" className={`font-medium transition ${isActive("/contacts") ? "text-orange-500" : "text-gray-700 hover:text-orange-500"}`}>
              Контакты
            </Link>
          </nav>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-100 space-y-2">
              {/* Мобильный поиск */}
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск товаров..."
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-orange-500">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>
              <Link to="/" className="block py-2 font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Главная</Link>
              <Link to="/catalog" className="block py-2 font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Каталог</Link>
              <Link to="/calculators" className="block py-2 font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Калькуляторы</Link>
              <Link to="/about" className="block py-2 font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>О компании</Link>
              <Link to="/contacts" className="block py-2 font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Контакты</Link>
              <Link to="/cart" className="block py-2 font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Корзина</Link>
              {user ? (
                <>
                  <Link to="/orders" className="block py-2 font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Мои заказы</Link>
                  <button onClick={handleLogout} className="block w-full text-left py-2 font-medium text-red-500">
                    Выйти ({userName})
                  </button>
                </>
              ) : (
                <Link to="/auth" className="block py-2 font-medium text-orange-500" onClick={() => setMobileMenuOpen(false)}>Вход</Link>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">СтройКосмос</h3>
              <p className="text-gray-400 text-sm">
                Интернет-магазин строительных и отделочных материалов с доставкой по Москве и области
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/catalog/dry-mixes" className="hover:text-white transition">Сухие смеси</Link></li>
                <li><Link to="/catalog/tools" className="hover:text-white transition">Инструменты</Link></li>
                <li><Link to="/catalog/timber" className="hover:text-white transition">Пиломатериалы</Link></li>
                <li><Link to="/catalog" className="hover:text-white transition">Все товары</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition">О компании</Link></li>
                <li><Link to="/calculators" className="hover:text-white transition">Калькуляторы</Link></li>
                <li><a href="#" className="hover:text-white transition">Доставка и оплата</a></li>
                <li><Link to="/contacts" className="hover:text-white transition">Контакты</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>+7 (495) 123-45-67</li>
                <li>info@stroymag.ru</li>
                <li>Пн-Пт 9:00-20:00</li>
                <li>Сб-Вс 10:00-18:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 СтройКосмос. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}