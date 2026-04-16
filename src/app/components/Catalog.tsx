import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Filter, Grid, List, ShoppingCart, Star, Package } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

type Product = {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  specs: string;
  tag: string | null;
  price: number;
  old_price: number | null;
  rating: number;
  reviews: number;
  in_stock: boolean;
  image: string;
};

const SLUG_TO_KEYWORD: Record<string, string> = {
  "dry-mixes":        "смес",
  "tools":            "Инструменты",
  "timber":           "Пиломатериалы",
  "electrica":        "Электрика",
  "plumbing":         "Сантехника",
  "finishing":        "Отделочные",
};

const PAGE_SIZE = 9;

export function Catalog() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Определяем ключевое слово для фильтрации
  // Если slug есть в маппинге — берём его, иначе используем slug как есть
  const categoryKeyword = category
    ? (SLUG_TO_KEYWORD[category] ?? category.replace(/-/g, " "))
    : null;

  // Загружаем бренды (с учётом текущей категории)
  useEffect(() => {
    let query = supabase
      .from("products")
      .select("brand")
      .not("brand", "is", null)
      .neq("brand", "");

    if (categoryKeyword) {
      query = query.ilike("category", `%${categoryKeyword}%`);
    }

    query.then(({ data }) => {
      if (data) {
        const unique = [
          ...new Set(
            data.map((d: { brand: string }) => d.brand).filter(Boolean)
          ),
        ].sort() as string[];
        setBrands(unique);
      }
    });
  }, [categoryKeyword]);

  // Сбрасываем страницу при смене фильтров
  useEffect(() => {
    setPage(1);
  }, [category, selectedBrands, priceRange, sortBy]);

  // Загружаем товары
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .gte("price", priceRange[0])
        .lte("price", priceRange[1])
        .range(from, to);

      // Фильтрация по категории через ключевое слово
      if (categoryKeyword) {
        query = query.ilike("category", `%${categoryKeyword}%`);
      }

      if (selectedBrands.length > 0) query = query.in("brand", selectedBrands);

      if (sortBy === "price_asc") query = query.order("price", { ascending: true });
      else if (sortBy === "price_desc") query = query.order("price", { ascending: false });
      else if (sortBy === "rating") query = query.order("rating", { ascending: false });
      else query = query.order("id", { ascending: false });

      const { data, error, count } = await query.returns<Product[]>();

      if (error) setError("Не удалось загрузить товары");
      else {
        setProducts(data ?? []);
        setTotalCount(count ?? 0);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [categoryKeyword, selectedBrands, priceRange, sortBy, page]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      specs: product.specs,
      price: product.price,
      image: product.image,
    });
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1000);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Красивый заголовок из slug
  const title = category
    ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Все товары";

  const getPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
      .reduce<(number | "...")[]>((acc, p, i, arr) => {
        if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
        acc.push(p);
        return acc;
      }, []);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-bold mb-2">{title}</h1>
          <p className="text-gray-600">
            {loading ? "Загрузка..." : `Найдено товаров: ${totalCount}`}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="font-semibold text-lg">Фильтры</h2>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-medium mb-4">Цена</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full accent-orange-500"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0].toLocaleString()} ₽</span>
                    <span>{priceRange[1].toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>

              {brands.length > 0 && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="font-medium mb-4">Бренд</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 accent-orange-500"
                        />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setPriceRange([0, 50000]);
                  setSelectedBrands([]);
                }}
                className="w-full py-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                Сбросить фильтры
              </button>
            </div>
          </aside>

          {/* Products */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              >
                <option value="default">По умолчанию</option>
                <option value="price_asc">По цене (возрастание)</option>
                <option value="price_desc">По цене (убывание)</option>
                <option value="rating">По рейтингу</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {error && (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {loading && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg overflow-hidden border border-gray-200 animate-pulse"
                  >
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all group ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    {/* Изображение */}
                    <div
                      className={`bg-gray-100 overflow-hidden flex-shrink-0 ${
                        viewMode === "list"
                          ? "w-48 h-48"
                          : "aspect-square"
                      }`}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ShoppingCart className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Контент */}
                    <div
                      className={`p-4 flex flex-col ${
                        viewMode === "list" ? "flex-1" : ""
                      }`}
                    >
                      {/* Теги */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {product.tag && (
                          <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded">
                            {product.tag}
                          </span>
                        )}
                        {!product.in_stock ? (
                          <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                            Нет в наличии
                          </span>
                        ) : (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                            В наличии
                          </span>
                        )}
                      </div>

                      {/* Название */}
                      <h3
                        className="font-semibold mb-1 group-hover:text-orange-500 transition cursor-pointer line-clamp-2"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {product.name}
                      </h3>

                      {/* Бренд */}
                      {product.brand && (
                        <p className="text-xs text-gray-400 mb-1">
                          {product.brand}
                        </p>
                      )}

                      {/* Категория — только в list-режиме */}
                      {viewMode === "list" && product.category && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                          <Package className="w-3 h-3" />
                          <span className="line-clamp-1">{product.category}</span>
                        </div>
                      )}

                      {/* Рейтинг */}
                      {product.rating > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                          <span className="text-sm font-medium">
                            {product.rating}
                          </span>
                          {product.reviews > 0 && (
                            <span className="text-xs text-gray-500">
                              ({product.reviews} отзывов)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Цена + кнопка */}
                      <div className="flex items-end justify-between mt-auto">
                        <div>
                          <div className="font-bold text-2xl text-gray-900">
                            {Number(product.price).toLocaleString()} ₽
                          </div>
                          {product.old_price && (
                            <div className="text-sm text-gray-400 line-through">
                              {Number(product.old_price).toLocaleString()} ₽
                            </div>
                          )}
                        </div>

                        <button
                          disabled={!product.in_stock}
                          onClick={() => handleAddToCart(product)}
                          className={`p-3 rounded-lg transition ${
                            addedIds.includes(product.id)
                              ? "bg-green-500 text-white"
                              : "bg-orange-500 text-white hover:bg-orange-600"
                          } disabled:bg-gray-300 disabled:cursor-not-allowed`}
                        >
                          {addedIds.includes(product.id) ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <ShoppingCart className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Товары не найдены</p>
                <p className="text-gray-400 text-sm mt-2">
                  Попробуйте изменить фильтры
                </p>
                {/* Дебаг: показываем что ищем */}
                {categoryKeyword && (
                  <p className="text-gray-300 text-xs mt-1">
                    Поиск по: «{categoryKeyword}»
                  </p>
                )}
              </div>
            )}

            {/* Пагинация */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ←
                </button>

                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-10 h-10 rounded-lg border transition ${
                        page === p
                          ? "bg-orange-500 text-white border-orange-500"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}