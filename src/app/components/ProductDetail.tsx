import { useParams, useNavigate } from "react-router";
import { ShoppingCart, Star, Truck, Shield, ArrowLeft, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  category: string;
  brand: string;
  specs: string | null;
  tag: string | null;
  price: number;
  old_price: number | null;
  rating: number | null;
  reviews: number | null;
  in_stock: boolean;
  stock_qty: string | null;
  image: string | null;
};

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) setError("Товар не найден");
      else setProduct(data);

      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

  // Парсим specs из JSON-строки в массив { name, value }
  const characteristics = (() => {
    if (!product?.specs) return [];
    try {
      const obj = typeof product.specs === "string" ? JSON.parse(product.specs) : product.specs;
      return Object.entries(obj).map(([name, value]) => ({
        name: name.replace(" :", "").trim(),
        value: String(value),
      }));
    } catch {
      return [];
    }
  })();

  const handleAddToCart = () => {
    if (!product) return;
    alert(`Добавлено в корзину: ${product.name} x ${quantity} шт.`);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="bg-gray-200 rounded-lg aspect-square" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || "Товар не найден"}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад к каталогу</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Image */}
          <div>
            <div className="bg-white rounded-lg p-8 mb-4 flex items-center justify-center aspect-square">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-gray-300 flex flex-col items-center gap-2">
                  <ShoppingCart className="w-16 h-16" />
                  <span className="text-sm">Нет фото</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            {/* Артикул */}
            {product.tag && (
              <div className="mb-4">
                <span className="text-sm text-gray-500">Артикул: {product.tag}</span>
              </div>
            )}

            {/* Бренд */}
            {product.brand && (
              <div className="mb-2">
                <span className="text-sm font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded">
                  {product.brand}
                </span>
              </div>
            )}

            <h1 className="font-bold text-2xl mb-4">{product.name}</h1>

            {/* Рейтинг */}
            {product.rating && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(product.rating!)
                            ? "fill-orange-400 text-orange-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.rating}</span>
                </div>
                {product.reviews && (
                  <span className="text-gray-500">({product.reviews} отзывов)</span>
                )}
              </div>
            )}

            {/* Категория */}
            {product.category && (
              <p className="text-sm text-gray-500 mb-4">{product.category}</p>
            )}

            {/* Цена и корзина */}
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <div className="flex items-baseline gap-4 mb-4">
                <div className="text-4xl font-bold text-gray-900">
                  {product.price.toLocaleString()} ₽
                </div>
                {product.old_price && (
                  <div className="text-xl text-gray-400 line-through">
                    {product.old_price.toLocaleString()} ₽
                  </div>
                )}
              </div>

              {product.in_stock ? (
                <div className="text-green-600 font-medium mb-6">
                  В наличии{product.stock_qty ? `: ${product.stock_qty} шт.` : ""}
                </div>
              ) : (
                <div className="text-red-600 font-medium mb-6">Нет в наличии</div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-x border-gray-300 py-3 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-gray-600">
                  Итого:{" "}
                  <span className="font-bold text-xl">
                    {(product.price * quantity).toLocaleString()} ₽
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="w-full py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Добавить в корзину
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                <Truck className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="font-medium text-sm">Доставка</div>
                  <div className="text-xs text-gray-600">от 500 ₽</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                <Shield className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="font-medium text-sm">Гарантия</div>
                  <div className="text-xs text-gray-600">Оригинал 100%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Характеристики */}
        {characteristics.length > 0 && (
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="font-bold text-xl mb-6">Характеристики</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
              {characteristics.map((char, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-gray-200"
                >
                  <span className="text-gray-600">{char.name}</span>
                  <span className="font-medium">{char.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Отзывы */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="font-bold text-xl mb-6">Отзывы покупателей</h2>
          <p className="text-gray-500 text-center py-8">
            Отзывы о товаре появятся здесь
          </p>
        </div>
      </div>
    </div>
  );
}