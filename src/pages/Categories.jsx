import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";

const tabToSlug = (tab) => tab.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

// Fallback hero images for categories that have no products with images
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200&auto=format&fit=crop";

function Categories() {
  const { categories, products, productsLoading } = useStore();

  if (productsLoading) {
    return (
      <section className="min-h-screen bg-[#fdf8f3] pt-32 pb-24 px-6 flex items-center justify-center">
        <p className="text-[#b8895f] font-semibold animate-pulse text-lg">Loading collections…</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#fdf8f3] pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="uppercase font-semibold text-[#b8895f]" style={{ letterSpacing: "5px", fontSize: "0.85rem" }}>
            Our Categories
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-[#2f221c] mt-5">
            Explore Candle Collections
          </h1>
          <p className="text-gray-500 mt-4 text-base max-w-xl mx-auto">
            Every collection tells a different story. Find yours.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg">No collections available yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((tab) => {
              const slug = tabToSlug(tab);
              const tabProducts = products[tab] || [];
              const heroImage = tabProducts.find(p => p.image)?.image || FALLBACK_IMAGE;

              return (
                <div
                  key={slug}
                  className="relative h-[450px] rounded-[30px] overflow-hidden group cursor-pointer"
                >
                  <img
                    src={heroImage}
                    alt={tab}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-0 left-0 p-8 text-white">
                    <p className="text-sm font-semibold uppercase mb-1" style={{ letterSpacing: "3px", color: "#f0c98a", fontSize: "0.75rem" }}>
                      {tabProducts.length} product{tabProducts.length !== 1 ? "s" : ""}
                    </p>
                    <h2 className="text-3xl font-bold leading-tight">{tab}</h2>
                    <Link to={`/collection/${slug}`}>
                      <button className="mt-5 border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
                        Shop Collection
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;
