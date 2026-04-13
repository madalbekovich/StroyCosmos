import { useNavigate } from "react-router";
import { ChevronRight, Truck, Shield, Clock, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase client ──────────────────────────────────────────────────────────
// Замени на свои значения из Settings → API в Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  slug: string;
  sort_order: number;
}

// Плейсхолдер если image_url не задан
const FALLBACK_IMAGE = "/placeholder-category.jpg";

// ─── Features (статика) ───────────────────────────────────────────────────────
const features = [
  {
    icon: Truck,
    title: "Бесплатная доставка",
    description: "При заказе от 5000 рублей",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Только оригинальная продукция",
  },
  {
    icon: Clock,
    title: "Быстрая доставка",
    description: "Доставка по Москве за 1 день",
  },
  {
    icon: Star,
    title: "Лучшие цены",
    description: "Скидки до 30% на весь ассортимент",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, title, description, image_url, slug, sort_order")
        .order("sort_order", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setCategories(data ?? []);
      }
      setLoading(false);
    }

    fetchCategories();
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-bold mb-6">
                Строительные и отделочные материалы
              </h1>
              <p className="text-xl mb-8 text-orange-50">
                Широкий ассортимент товаров для строительства, ремонта и
                отделки. Доставка по Москве и области. Гарантия качества.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/catalog")}
                  className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                >
                  Перейти в каталог
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/calculators")}
                  className="px-8 py-4 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800 transition"
                >
                  Калькуляторы расхода
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="/hero-materials.png"
                alt="Строительные материалы"
                className="w-full h-auto drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-400 opacity-20 blur-3xl" />
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-bold mb-12 text-center">Популярные категории</h2>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 animate-pulse"
              >
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <p className="text-center text-red-500">
            Ошибка загрузки категорий: {error}
          </p>
        )}

        {/* Loaded categories */}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate(`/catalog/${category.slug}`)}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-orange-500 transition-all hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={category.image_url ?? FALLBACK_IMAGE}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-orange-500 transition">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 text-orange-500 font-medium">
                    <span>Смотреть товары</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── Features ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white text-center">
          <h2 className="font-bold mb-4">
            Нужна помощь в подборе материалов?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Наши специалисты помогут рассчитать необходимое количество и
            подобрать оптимальные материалы для вашего проекта
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition">
              Получить консультацию
            </button>
            <button
              onClick={() => navigate("/calculators")}
              className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Открыть калькуляторы
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}