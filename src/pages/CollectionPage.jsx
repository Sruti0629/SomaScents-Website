import { useParams, Link } from "react-router-dom";
import { FaHeart, FaShoppingBag, FaArrowLeft } from "react-icons/fa";
import { useStore } from "../context/StoreContext.jsx";

const slugToTab = (slug, categories) =>
  categories.find((t) => t.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") === slug) || null;

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200&auto=format&fit=crop";

function CollectionPage() {
  const { slug } = useParams();
  const { addToCart, toggleWishlist, isWishlisted, products, categories, productsLoading } = useStore();

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex items-center justify-center">
        <p className="text-[#b8895f] font-semibold animate-pulse text-lg">Loading collection…</p>
      </div>
    );
  }

  const tab = slugToTab(slug, categories);

  if (!tab) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold text-[#2f221c]">Collection not found</p>
        <Link to="/categories" className="text-[#b8895f] underline">Back to categories</Link>
      </div>
    );
  }

  const tabProducts = products[tab] || [];
  const heroImage = tabProducts.find(p => p.image)?.image || FALLBACK_IMAGE;

  const handleAddToCart = (item) => {
    const price = typeof item.price === "number" ? item.price : parseInt(String(item.price).replace(/[^0-9]/g, ""));
    addToCart({ ...item, price });
  };

  const displayPrice = (p) => (typeof p.price === "number" ? `₹${p.price}` : p.price);

  return (
    <section className="min-h-screen bg-[#fdf8f3]">
      {/* Hero Banner */}
      <div className="relative h-[340px] md:h-[420px] overflow-hidden">
        <img src={heroImage} alt={tab} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <Link
            to="/categories"
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition"
          >
            <FaArrowLeft size={12} /> Back to collections
          </Link>
          <p className="uppercase font-semibold text-[#f0c98a]" style={{ letterSpacing: "5px", fontSize: "0.8rem" }}>
            Lumière Collection
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mt-3">{tab}</h1>
          <p className="mt-3 text-white/70 text-base">
            {tabProducts.length} product{tabProducts.length !== 1 ? "s" : ""} in this collection
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {tabProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-2xl font-bold text-[#2f221c]">No products yet</p>
            <p className="text-gray-500 mt-2">Check back soon — new candles are on their way.</p>
            <Link to="/categories">
              <button className="mt-8 bg-[#2f221c] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#b8895f] transition">
                Browse other collections
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {tabProducts.map((item, index) => {
                const wishlisted = isWishlisted(item.name);
                return (
                  <div
                    key={item.id || index}
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
                        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
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
                          aria-label={`Add ${item.name} to cart`}
                        >
                          <FaShoppingBag size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center mt-16">
              <Link to="/categories">
                <button className="border-2 border-[#2f221c] text-[#2f221c] hover:bg-[#2f221c] hover:text-white transition-colors duration-300 px-10 py-4 rounded-full text-base font-semibold">
                  ← View All Collections
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default CollectionPage;
