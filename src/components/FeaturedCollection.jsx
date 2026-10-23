import { useState } from "react";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";

// slug helper (matches CollectionPage)
const tabToSlug = (tab) => tab.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

function FeaturedCollection() {
  const { addToCart, toggleWishlist, isWishlisted, products, categories, productsLoading } = useStore();
  const [activeTab, setActiveTab] = useState(null);

  // Use first category as default once loaded
  const effectiveTab = activeTab || categories[0] || "";
  const tabProducts = products[effectiveTab] || [];

  const handleAddToCart = (item) => {
    const price = typeof item.price === "number" ? item.price : parseInt(String(item.price).replace(/[^0-9]/g, ""));
    addToCart({ ...item, price });
  };

  const displayPrice = (p) => (typeof p.price === "number" ? `₹${p.price}` : p.price);

  if (productsLoading) {
    return (
      <section className="pt-16 pb-16 bg-[#fdf8f3]">
        <div className="max-w-7xl mx-auto px-6 text-center py-20">
          <p className="text-[#b8895f] font-semibold animate-pulse">Loading collection…</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="pt-16 pb-16 bg-[#fdf8f3]">
      <div className="max-w-7xl mx-auto px-6">

        {/* TITLE */}
        <div className="text-center mb-10">
          <p className="uppercase font-semibold text-[#b8895f]" style={{ letterSpacing: "5px", fontSize: "0.85rem" }}>
            Our Collection
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-[#2f221c] mt-4">Best Selling Candles</h2>
          <p className="text-gray-500 mt-4 text-base max-w-xl mx-auto">
            Handcrafted with intention. Each candle is a sensory experience made to elevate your space.
          </p>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full p-1.5 gap-1 flex-wrap justify-center" style={{ backgroundColor: "#ede3d8" }}>
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
                style={
                  effectiveTab === tab
                    ? { backgroundColor: "#2f221c", color: "#fff", boxShadow: "0 4px 14px rgba(47,34,28,0.25)" }
                    : { backgroundColor: "transparent", color: "#7a5c47" }
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        {tabProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No products in this collection yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {tabProducts.map((item, index) => {
              const wishlisted = isWishlisted(item.name);
              return (
                <div
                  key={`${effectiveTab}-${item.id || index}`}
                  className="bg-white rounded-[25px] overflow-hidden border border-[#eee3d8] hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[230px] w-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="absolute top-4 right-4 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors duration-200"
                      style={{ color: wishlisted ? "#e53e3e" : "#2f221c" }}
                    >
                      <FaHeart size={14} style={{ fill: wishlisted ? "#e53e3e" : "currentColor" }} />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-[#2f221c]">{item.name}</h3>
                    <p className="text-gray-500 mt-1 text-sm leading-relaxed flex-1">{item.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xl font-bold" style={{ color: "#b8895f" }}>{displayPrice(item)}</p>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-[#2f221c] hover:bg-[#b8895f] transition-colors duration-200 text-white w-11 h-11 rounded-full flex items-center justify-center"
                        title="Add to Cart"
                      >
                        <FaShoppingBag size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BUTTON */}
        <div className="flex justify-center mt-14">
          <Link to="/categories">
            <button className="bg-[#2f221c] hover:bg-[#b8895f] transition-colors duration-300 text-white px-10 py-4 rounded-full text-base font-semibold">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollection;
