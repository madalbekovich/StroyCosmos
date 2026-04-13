import { Building2, Users, Award, Clock } from "lucide-react";

export function About() {
  const stats = [
    { icon: Clock, value: "15 лет", label: "на рынке" },
    { icon: Users, value: "50 000+", label: "довольных клиентов" },
    { icon: Building2, value: "5 филиалов", label: "по Москве" },
    { icon: Award, value: "100%", label: "гарантия качества" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-bold mb-8 text-center">О компании</h1>

        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="font-bold text-2xl mb-4">
            Интернет-магазин строительных и отделочных материалов
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Наша компания специализируется на продаже строительных и отделочных
              материалов с 2011 года. За это время мы заслужили доверие тысяч клиентов
              благодаря широкому ассортименту, конкурентным ценам и высокому качеству
              обслуживания.
            </p>
            <p>
              Мы предлагаем продукцию только от проверенных производителей: Knauf,
              Ceresit, Weber, Makita, Bosch, ABB и многих других. Все товары сертифицированы
              и имеют гарантию качества.
            </p>
            <p>
              В нашем каталоге представлены: сухие смеси, пиломатериалы, инструменты,
              электротовары, сантехника, отделочные материалы и многое другое. Мы постоянно
              расширяем ассортимент и следим за новинками рынка.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 text-center"
            >
              <stat.icon className="w-12 h-12 text-orange-500 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Advantages */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="font-bold text-2xl mb-6">Наши преимущества</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">🏆 Гарантия качества</h3>
              <p className="text-gray-700">
                Работаем только с официальными поставщиками. Все товары сертифицированы.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">💰 Выгодные цены</h3>
              <p className="text-gray-700">
                Прямые поставки от производителей позволяют нам предлагать лучшие цены.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">🚚 Быстрая доставка</h3>
              <p className="text-gray-700">
                Доставка по Москве в день заказа. Работаем с транспортными компаниями
                по всей России.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">🎯 Индивидуальный подход</h3>
              <p className="text-gray-700">
                Консультируем по выбору материалов, помогаем рассчитать необходимое
                количество.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
