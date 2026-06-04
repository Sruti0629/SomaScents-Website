import { Link } from "react-router-dom";
import { FaBan, FaUndoAlt, FaHeadset } from "react-icons/fa";

function About() {
  return (
    <>
      <section className="bg-[#ffffff] py-16 sm:py-24 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* IMAGE */}
          <div className="relative">
            <img
              src="https://houseofaroma.in/wp-content/uploads/2023/10/GERANIUM-YLANG-1.webp"
              alt="Scented Candles"
              className="rounded-[30px] sm:rounded-[40px] shadow-2xl w-full h-[380px] sm:h-[500px] lg:h-[650px] object-cover"
            />
            {/* CARD — hidden on very small screens to avoid overflow */}
            <div className="hidden sm:block absolute -bottom-6 -right-4 sm:-bottom-7 sm:-right-7 bg-white p-5 sm:p-8 rounded-3xl shadow-2xl max-w-[200px] sm:max-w-xs">
              <h3 className="text-3xl sm:text-4xl font-bold text-[#c68b59]">10k+</h3>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">
                Happy customers enjoying our premium fragrance collections worldwide.
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-6 sm:mt-10 lg:mt-0">
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
              From floral and fruity aromas to woody and spa-inspired collections, each candle
              is carefully created to bring comfort, relaxation, and timeless elegance to your lifestyle.
            </p>
            <Link to="/categories">
              <button className="mt-8 bg-[#3d2b1f] hover:bg-[#5c4033] transition text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold">
                Explore Collection
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#fdf8f3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2f221c] mb-4">Our Policies</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              We strive to provide a smooth shopping experience with clear policies and dedicated support.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { Icon: FaBan, title: "No Exchange", desc: "Exchanges are not available once an order has been placed." },
              { Icon: FaUndoAlt, title: "No Return Policy", desc: "All sales are final. Returns are not accepted after purchase." },
              { Icon: FaHeadset, title: "Best Customer Support", desc: "Our support team is available 24/7 to assist you with any questions." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-[24px] border border-[#eee3d8] p-6 sm:p-8 text-center hover:shadow-lg transition">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 sm:mb-6 rounded-full bg-[#f7ede4] flex items-center justify-center text-[#c68b59] text-xl sm:text-2xl">
                  <Icon />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#2f221c] mb-3">{title}</h3>
                <p className="text-gray-600 leading-7 text-sm sm:text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
