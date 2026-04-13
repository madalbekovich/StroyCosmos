import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { Package, ChevronDown, ChevronUp } from "lucide-react";

type OrderItem = { id: number; name: string; specs: string; price: number; quantity: number };
type Order = {
  id: number;
  items: OrderItem[];
  total: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  status: string;
  created_at: string;
};

const statusLabels: Record<string, { label: string; color: string }> = {
  new: { label: "Новый", color: "bg-blue-100 text-blue-700" },
  processing: { label: "В обработке", color: "bg-yellow-100 text-yellow-700" },
  delivered: { label: "Доставлен", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Отменён", color: "bg-red-100 text-red-700" },
};

export function Orders() {
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    if (userLoading) return;
    if (!user) { navigate("/auth"); return; }

    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }: { data: Order[] | null }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, [user, userLoading]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-bold mb-8">История заказов</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-bold mb-8">История заказов</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Заказов пока нет</h2>
            <p className="text-gray-500 mb-6">Оформите первый заказ в каталоге</p>
            <button onClick={() => navigate("/catalog")} className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition">
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusLabels[order.status] ?? statusLabels.new;
              const isExpanded = expanded === order.id;
              const date = new Date(order.created_at).toLocaleDateString("ru-RU", {
                day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
              });

              return (
                <div key={order.id} className="bg-white rounded-lg overflow-hidden border border-gray-200">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : order.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div>
                        <div className="font-semibold">Заказ №{order.id}</div>
                        <div className="text-sm text-gray-500">{date}</div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-xl">{order.total.toLocaleString()} ₽</span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="font-medium text-gray-700 mb-2">Контакты</h3>
                          <p className="text-sm">{order.customer_name}</p>
                          <p className="text-sm text-gray-600">{order.customer_phone}</p>
                          {order.customer_address && <p className="text-sm text-gray-600">{order.customer_address}</p>}
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-700 mb-3">Товары</h3>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                            <div>
                              <div className="text-sm font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500">{item.specs} × {item.quantity} шт.</div>
                            </div>
                            <div className="font-medium">{(item.price * item.quantity).toLocaleString()} ₽</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                        <span className="font-bold text-lg">Итого: {order.total.toLocaleString()} ₽</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}