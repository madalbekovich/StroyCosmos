import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export function Contacts() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-bold mb-8 text-center">Контакты</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-bold text-xl mb-6">Свяжитесь с нами</h2>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-orange-500 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Телефон</div>
                    <a
                      href="tel:+74951234567"
                      className="text-orange-500 hover:text-orange-600 text-lg"
                    >
                      +7 (495) 123-45-67
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      Звонок по России бесплатный
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-orange-500 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Email</div>
                    <a
                      href="mailto:info@stroymag.ru"
                      className="text-orange-500 hover:text-orange-600"
                    >
                      info@stroymag.ru
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-orange-500 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Адрес</div>
                    <p className="text-gray-700">
                      г. Москва, ул. Строительная, д. 15
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-orange-500 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Режим работы</div>
                    <p className="text-gray-700">Пн-Пт: 9:00 - 20:00</p>
                    <p className="text-gray-700">Сб-Вс: 10:00 - 18:00</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="font-semibold mb-3">Мессенджеры</div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    <MessageCircle className="w-5 h-5" />
                    Telegram
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-orange-500 text-white rounded-lg p-6">
              <h3 className="font-bold text-xl mb-2">Нужна консультация?</h3>
              <p className="mb-4">
                Оставьте заявку, и наш специалист свяжется с вами в течение 15 минут
              </p>
              <button className="w-full py-3 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition">
                Заказать звонок
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="font-bold text-xl mb-6">Написать нам</h2>

            <form className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Имя *</label>
                <input
                  type="text"
                  placeholder="Введите ваше имя"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Email *</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Телефон</label>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Тема обращения</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
                  <option>Вопрос по товару</option>
                  <option>Вопрос по заказу</option>
                  <option>Вопрос по доставке</option>
                  <option>Сотрудничество</option>
                  <option>Другое</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">Сообщение *</label>
                <textarea
                  rows={5}
                  placeholder="Опишите ваш вопрос..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
              >
                Отправить сообщение
              </button>

              <p className="text-sm text-gray-600 text-center">
                * Обязательные поля для заполнения
              </p>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="bg-gray-200 h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-16 h-16 mx-auto mb-3" />
              <p className="text-lg">Карта с расположением офиса</p>
              <p className="text-sm">г. Москва, ул. Строительная, д. 15</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
