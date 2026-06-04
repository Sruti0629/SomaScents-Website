import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Banner() {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1600&auto=format&fit=crop",
      title: "Luxury Scented Candles",
      subtitle: "Transform your home with calming fragrances and warm elegant vibes.",
    },
    {
      image: "https://soydelicious.com/cdn/shop/articles/Holiday-Banner_1.jpg?v=1700489138",
      title: "Relax Your Mind",
      subtitle: "Handcrafted soy wax candles made for peaceful and cozy evenings.",
    },
    {
      image: "https://mwcandle.com/wp-content/uploads/%E9%A6%96%E9%A1%B5banner-1920-1080-3.jpg",
      title: "Premium Fragrance Collection",
      subtitle: "Explore floral, woody, fruity, and luxury candle collections.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(slider);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? "opacity-100" : "opacity-0"}`}
        >
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
                <div className="max-w-3xl text-white">
                  <p className="uppercase tracking-[4px] sm:tracking-[6px] text-[#d4a373] mb-3 sm:mb-4 text-xs sm:text-sm">
                    Premium Candle Store
                  </p>
                  <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-tight">
                    {slide.title}
                  </h1>
                  <p className="mt-5 sm:mt-8 text-base sm:text-lg md:text-xl text-gray-200 leading-7 sm:leading-8 max-w-xl">
                    {slide.subtitle}
                  </p>
                  <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-5">
                    <Link to="/categories">
                      <button className="bg-[#c68b59] hover:bg-[#a56d3e] transition px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold">
                        Shop Now
                      </button>
                    </Link>
                    <Link to="/categories">
                      <button className="border border-white hover:bg-white hover:text-black transition px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold">
                        Explore
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* DOTS */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 z-20">
        {slides.map((_, index) => (
          <button key={index} onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition ${currentSlide === index ? "bg-[#c68b59] scale-125" : "bg-white/60"}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Banner;
