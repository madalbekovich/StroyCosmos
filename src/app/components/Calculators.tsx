import { useState } from "react";
import { Calculator } from "lucide-react";

export function Calculators() {
  const [activeCalc, setActiveCalc] = useState("plaster");

  // Plaster Calculator
  const [plasterArea, setPlasterArea] = useState("");
  const [plasterThickness, setPlasterThickness] = useState("10");
  const plasterResult =
    plasterArea && plasterThickness
      ? (parseFloat(plasterArea) * parseFloat(plasterThickness) * 0.85).toFixed(1)
      : 0;

  // Tile Grout Calculator
  const [tileArea, setTileArea] = useState("");
  const [tileWidth, setTileWidth] = useState("300");
  const [tileHeight, setTileHeight] = useState("300");
  const [seamWidth, setSeamWidth] = useState("3");
  const groutResult =
    tileArea && tileWidth && tileHeight && seamWidth
      ? (
          ((parseFloat(tileWidth) + parseFloat(tileHeight)) /
            (parseFloat(tileWidth) * parseFloat(tileHeight))) *
          parseFloat(seamWidth) *
          5 *
          1.6 *
          parseFloat(tileArea)
        ).toFixed(2)
      : 0;

  // Paint Calculator
  const [paintArea, setPaintArea] = useState("");
  const [paintLayers, setPaintLayers] = useState("2");
  const paintResult =
    paintArea && paintLayers
      ? ((parseFloat(paintArea) * parseFloat(paintLayers)) / 10).toFixed(1)
      : 0;

  // Wallpaper Calculator
  const [wallpaperPerimeter, setWallpaperPerimeter] = useState("");
  const [wallpaperHeight, setWallpaperHeight] = useState("2.5");
  const [wallpaperRollWidth, setWallpaperRollWidth] = useState("0.53");
  const wallpaperResult =
    wallpaperPerimeter && wallpaperHeight && wallpaperRollWidth
      ? Math.ceil(
          parseFloat(wallpaperPerimeter) /
            (parseFloat(wallpaperRollWidth) * 10)
        )
      : 0;

  const calculators = [
    { id: "plaster", name: "Расход штукатурки" },
    { id: "grout", name: "Расход затирки для плитки" },
    { id: "paint", name: "Расход краски" },
    { id: "wallpaper", name: "Количество обоев" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-bold mb-2">Калькуляторы расхода материалов</h1>
          <p className="text-gray-600">
            Рассчитайте необходимое количество материалов для вашего проекта
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Calculator Menu */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 sticky top-24">
              <h2 className="font-semibold mb-4">Выберите калькулятор</h2>
              <div className="space-y-2">
                {calculators.map((calc) => (
                  <button
                    key={calc.id}
                    onClick={() => setActiveCalc(calc.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      activeCalc === calc.id
                        ? "bg-orange-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {calc.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Calculator Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-8">
              {/* Plaster Calculator */}
              {activeCalc === "plaster" && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Calculator className="w-8 h-8 text-orange-500" />
                    <h2 className="font-bold text-2xl">Калькулятор расхода штукатурки</h2>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <label className="block font-medium mb-2">
                        Площадь стены (м²)
                      </label>
                      <input
                        type="number"
                        value={plasterArea}
                        onChange={(e) => setPlasterArea(e.target.value)}
                        placeholder="Введите площадь"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2">
                        Толщина слоя (мм)
                      </label>
                      <input
                        type="number"
                        value={plasterThickness}
                        onChange={(e) => setPlasterThickness(e.target.value)}
                        placeholder="Обычно 10-15 мм"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">Результат:</h3>
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {plasterResult} кг
                    </div>
                    <p className="text-gray-700">
                      Для площади {plasterArea || 0} м² при толщине слоя{" "}
                      {plasterThickness || 0} мм
                    </p>
                    <p className="text-sm text-gray-600 mt-3">
                      * Расчёт приблизительный, рекомендуется брать с запасом 10%
                    </p>
                  </div>
                </div>
              )}

              {/* Grout Calculator */}
              {activeCalc === "grout" && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Calculator className="w-8 h-8 text-orange-500" />
                    <h2 className="font-bold text-2xl">
                      Калькулятор расхода затирки для плитки
                    </h2>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <label className="block font-medium mb-2">
                        Площадь облицовки (м²)
                      </label>
                      <input
                        type="number"
                        value={tileArea}
                        onChange={(e) => setTileArea(e.target.value)}
                        placeholder="Введите площадь"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium mb-2">
                          Ширина плитки (мм)
                        </label>
                        <input
                          type="number"
                          value={tileWidth}
                          onChange={(e) => setTileWidth(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-2">
                          Высота плитки (мм)
                        </label>
                        <input
                          type="number"
                          value={tileHeight}
                          onChange={(e) => setTileHeight(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium mb-2">
                        Ширина шва (мм)
                      </label>
                      <input
                        type="number"
                        value={seamWidth}
                        onChange={(e) => setSeamWidth(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">Результат:</h3>
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {groutResult} кг
                    </div>
                    <p className="text-gray-700">
                      Затирки для {tileArea || 0} м² плитки {tileWidth}x{tileHeight} мм
                    </p>
                    <p className="text-sm text-gray-600 mt-3">
                      * Рекомендуется покупать с запасом 5-10%
                    </p>
                  </div>
                </div>
              )}

              {/* Paint Calculator */}
              {activeCalc === "paint" && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Calculator className="w-8 h-8 text-orange-500" />
                    <h2 className="font-bold text-2xl">Калькулятор расхода краски</h2>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <label className="block font-medium mb-2">
                        Площадь окрашивания (м²)
                      </label>
                      <input
                        type="number"
                        value={paintArea}
                        onChange={(e) => setPaintArea(e.target.value)}
                        placeholder="Введите площадь"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2">
                        Количество слоёв
                      </label>
                      <select
                        value={paintLayers}
                        onChange={(e) => setPaintLayers(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      >
                        <option value="1">1 слой</option>
                        <option value="2">2 слоя</option>
                        <option value="3">3 слоя</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">Результат:</h3>
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {paintResult} л
                    </div>
                    <p className="text-gray-700">
                      Краски для {paintArea || 0} м² в {paintLayers} слоя
                    </p>
                    <p className="text-sm text-gray-600 mt-3">
                      * Расход 1 л = ~10 м² (зависит от типа краски и поверхности)
                    </p>
                  </div>
                </div>
              )}

              {/* Wallpaper Calculator */}
              {activeCalc === "wallpaper" && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Calculator className="w-8 h-8 text-orange-500" />
                    <h2 className="font-bold text-2xl">Калькулятор количества обоев</h2>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <label className="block font-medium mb-2">
                        Периметр комнаты (м)
                      </label>
                      <input
                        type="number"
                        value={wallpaperPerimeter}
                        onChange={(e) => setWallpaperPerimeter(e.target.value)}
                        placeholder="Введите периметр"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2">
                        Высота потолка (м)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={wallpaperHeight}
                        onChange={(e) => setWallpaperHeight(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2">
                        Ширина рулона (м)
                      </label>
                      <select
                        value={wallpaperRollWidth}
                        onChange={(e) => setWallpaperRollWidth(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      >
                        <option value="0.53">0.53 м (стандартные)</option>
                        <option value="1.06">1.06 м (широкие)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">Результат:</h3>
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {wallpaperResult} рулонов
                    </div>
                    <p className="text-gray-700">
                      Для комнаты с периметром {wallpaperPerimeter || 0} м и высотой{" "}
                      {wallpaperHeight || 0} м
                    </p>
                    <p className="text-sm text-gray-600 mt-3">
                      * Длина рулона 10 м. Рекомендуется добавить 1-2 рулона на запас
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
