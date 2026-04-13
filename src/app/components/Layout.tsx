import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { ShoppingCart, User, Search, Phone, Menu, Calculator as CalcIcon, LogOut } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useUser();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const userName = user?.user_metadata?.name ?? user?.email?.split("@")[0];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:+79999999999" className="flex items-center gap-2 hover:text-orange-400 transition">
              <Phone className="w-4 h-4" />
              <span>+7 (999) 999-99-99</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span>Режим работы: Пн-Пт 9:00-18:00</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">СМ</span>
              </div>
              <div>
                <div className="font-bold text-2xl text-gray-900">СтройКосмос</div>
                <div className="text-xs text-gray-500">Строительные материалы</div>
              </div>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {!loading && (
                user ? (
                  <div className="hidden md:flex items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {userName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">{userName}</span>
                    </div>
                    <button
                      onClick={() => navigate("/orders")}
                      className="text-sm text-gray-500 hover:text-orange-500 transition px-2 py-2"
                    >
                      Мои заказы
                    </button>
                    <button
                      onClick={handleLogout}
                      title="Выйти"
                      className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-red-500 transition"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/auth")}
                    className="hidden md:flex items-center gap-2 px-4 py-2 hover:text-orange-500 transition"
                  >
                    <User className="w-5 h-5" />
                    <span>Вход</span>
                  </button>
                )
              )}

              <button onClick={() => navigate("/cart")} className="relative p-2 hover:text-orange-500 transition">
                <ShoppingCart className="w-6 h-6" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>

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