import { useState } from "react";
import { useNavigate } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/context/CartContext";

type CartItem = {
  id: number;
  name: string;
  specs: string;
  price: number;
  quantity: number;
  image: string;
};

export function Cart() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const subtotal = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  const deliveryCost = subtotal > 5000 ? 0 : 500;
  const total = subtotal + deliveryCost;

  const handleOrder = async () => {
    if (!form.name || !form.phone) return;
    setSubmitting(true);

    const orderItems = cartItems.map((item: CartItem) => ({
      id: item.id,
      name: item.name,
      specs: item.specs,
      price: item.price,
      quantity: item.quantity,
    }));

    await supabase.from("orders").insert({
      user_id: user?.id ?? null,
      items: orderItems,
      total,
      customer_name: form.name,
      customer_phone: form.phone,
      customer_address: form.address,
      status: "new",
    });

    const itemsList = cartItems
      .map((item: CartItem) => `• ${item.name} (${item.specs}) × ${item.quantity} = ${(item.price * item.quantity).toLocaleString()} ₽`)
      .join("\n");

    const message = `🛒 *Новый заказ с сайта СтройМаг*\n\n` +
      `👤 Имя: ${form.name}\n` +
      `📞 Телефон: ${form.phone}\n` +
      `📍 Адрес: ${form.address || "не указан"}\n\n` +
      `*Товары:*\n${itemsList}\n\n` +
      `💰 Итого: ${total.toLocaleString()} ₽` +
      (deliveryCost === 0 ? " (доставка бесплатно)" : ` (включая доставку ${deliveryCost} ₽)`);

    window.open(`https://wa.me/996500030371?text=${encodeURIComponent(message)}`, "_blank");

    clearCart();
    setShowModal(false);
    setSubmitting(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-bold mb-8">Корзина</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Корзина пуста</h2>
            <p className="text-gray-500 mb-6">Добавьте товары из каталога в корзину</p>
            <button onClick={() => navigate("/catalog")} className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition">
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-6 flex gap-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 cursor-pointer hover:text-orange-500" onClick={() => navigate(`/product/${item.id}`)}>
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{item.specs}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100 transition">
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-12 text-center border-x border-gray-300 py-2 focus:outline-none"
                          />
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100 transition">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-2xl">{(item.price * item.quantity).toLocaleString()} ₽</div>
                        <div className="text-sm text-gray-500">{item.price.toLocaleString()} ₽ за шт.</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <h2 className="font-bold text-xl mb-6">Итого</h2>
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Товары ({cartItems.length})</span>
                    <span>{subtotal.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Доставка</span>
                    <span>{deliveryCost === 0 ? <span className="text-green-600 font-medium">Бесплатно</span> : `${deliveryCost} ₽`}</span>
                  </div>
                </div>
                {deliveryCost > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-orange-800">
                      Добавьте товаров ещё на <span className="font-bold">{(5000 - subtotal).toLocaleString()} ₽</span> для бесплатной доставки
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-xl">Всего:</span>
                  <span className="text-3xl font-bold">{total.toLocaleString()} ₽</span>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 mb-3"
                >
                  Оформить заказ
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => navigate("/catalog")} className="w-full py-3 text-orange-500 font-medium hover:bg-orange-50 rounded-lg transition">
                  Продолжить покупки
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модалка оформления заказа */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>

            <h2 className="font-bold text-2xl mb-2">Оформление заказа</h2>
            <p className="text-gray-500 mb-6 text-sm">После заполнения откроется WhatsApp с готовым сообщением</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ваше имя"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+7 (999) 999-99-99"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес доставки</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Улица, дом, квартира"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Итого:</span>
                <span>{total.toLocaleString()} ₽</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={submitting || !form.name || !form.phone}
              className="w-full py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {submitting ? "Оформляем..." : "Отправить в WhatsApp"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}