import Banner from "./pages/Banner";
import Features from "./components/FeaturedCollection";
import { FaTruck, FaLeaf, FaStar, FaGift } from "react-icons/fa";
import './App.css';
import { Link } from "react-router-dom";

const features = [
  { icon: FaTruck, title: "Free Shipping",  desc: "On all orders over ₹1500" },
  { icon: FaLeaf,  title: "Natural Wax",    desc: "100% coconut & soy blend" },
  { icon: FaStar,  title: "Grasse Scents",  desc: "Crafted in France's perfume capital" },
  { icon: FaGift,  title: "Gift Ready",     desc: "Beautiful packaging included" },
];

function Home() {
  return (
    <div className="App">
      <Banner />

      {/* ABOUT SECTION */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* IMAGE */}
          <div className="relative">
            <img
              src="https://houseofaroma.in/wp-content/uploads/2023/10/GERANIUM-YLANG-1.webp"
              alt="Scented Candles"
              className="rounded-[30px] sm:rounded-[40px] shadow-2xl w-full h-[320px] sm:h-[480px] lg:h-[650px] object-cover"
            />
            <div className="hidden sm:block absolute -bottom-6 -right-4 sm:-bottom-7 sm:-right-7 bg-white p-5 sm:p-8 rounded-3xl shadow-2xl max-w-[180px] sm:max-w-xs">
              <h3 className="text-3xl sm:text-4xl font-bold text-[#c68b59]">10k+</h3>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">
                Happy customers enjoying our premium fragrance collections worldwide.
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-4 lg:mt-0">
            <p className="uppercase tracking-[5px] text-[#c68b59] font-semibold mb-4 text-sm">
              About Soma Scents
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#3d2b1f] leading-tight">
              Crafted To Bring Warmth &amp; Luxury
            </h2>
            <p className="mt-6 text-base sm:text-lg text-gray-700 leading-8">
              At Soma Scents, we believe fragrance has the power to transform spaces and emotions.
              Our handcrafted scented candles are made with natural soy wax, premium oils, and
              elegant designs that create a calming atmosphere in every home.
            </p>
            <p className="mt-4 text-base sm:text-lg text-gray-700 leading-8">
              From floral and fruity aromas to woody and spa-inspired collections, each candle is
              carefully crafted to bring comfort, relaxation, and timeless elegance to your lifestyle.
            </p>
            <Link to="/categories">
              <button className="mt-8 bg-[#3d2b1f] hover:bg-[#5c4033] transition text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold">
                Explore Collection
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Features />

      {/* FEATURES BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-amber-200/20">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group bg-neutral-50 flex flex-col items-center text-center p-5 sm:p-8 hover:bg-neutral-50 transition-colors">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-[#c68b59]/40 flex items-center justify-center mb-4 sm:mb-5 transition-transform group-hover:scale-110 group-hover:ring-4 group-hover:ring-[#c68b59]/15">
                <Icon className="text-[#c68b59] text-xl sm:text-[28px]" />
              </div>
              <p className="text-sm sm:text-lg font-medium text-neutral-800 mb-1">{title}</p>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
