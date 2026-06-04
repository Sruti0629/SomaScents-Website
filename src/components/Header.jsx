import { useState } from "react";
import { FaShoppingCart, FaUser, FaHeart, FaTimes, FaTrash, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo-scents.png";
import { useStore } from "../context/StoreContext.jsx";

function Header() {
  const { cart, wishlist, cartCount, wishlistCount, updateQty, removeFromCart, toggleWishlist, addToCart } = useStore();
  const [cartOpen, setCartOpen]   = useState(false);
  const [wishOpen, setWishOpen]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const navLinks = [
    { to: "/",          label: "Home" },
    { to: "/categories", label: "Shop" },
    { to: "/about",     label: "About" },
    { to: "/contact",   label: "Contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-[#fff8f0]/90 backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="Lumière Logo" className="h-14 sm:h-20 w-auto" />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 text-[#5c4033] font-medium">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="hover:text-[#c68b59] transition duration-300">{label}</Link>
            ))}
          </nav>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-4 sm:gap-5 text-[#5c4033] text-xl">

            {/* WISHLIST */}
            <button className="relative cursor-pointer hover:text-[#c68b59] transition"
              onClick={() => { setWishOpen(true); setCartOpen(false); setMenuOpen(false); }}>
              <FaHeart />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  style={{ animation: "badgePop 0.3s ease" }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* CART */}
            <button className="relative cursor-pointer hover:text-[#c68b59] transition"
              onClick={() => { setCartOpen(true); setWishOpen(false); setMenuOpen(false); }}>
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c68b59] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  style={{ animation: "badgePop 0.3s ease" }} key={cartCount}>
                  {cartCount}
                </span>
              )}
            </button>

            <FaUser className="hidden sm:block cursor-pointer hover:text-[#c68b59] transition" />

            {/* HAMBURGER (mobile only) */}
            <button className="md:hidden cursor-pointer hover:text-[#c68b59] transition"
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV DROPDOWN */}
        {menuOpen && (
          <div className="md:hidden bg-[#fff8f0] border-t border-[#f0e4d7] px-6 py-4 flex flex-col gap-4">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                onClick={() => setMenuOpen(false)}
                className="text-[#5c4033] font-medium text-lg hover:text-[#c68b59] transition py-1">
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#f0e4d7]">
              <h2 className="text-xl sm:text-2xl font-bold text-[#2f221c]">Shopping Bag</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-[#2f221c] transition text-xl"><FaTimes /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <FaShoppingCart className="mx-auto text-4xl text-gray-200 mb-4" />
                  <p className="text-gray-400">Your bag is empty</p>
                  <Link to="/categories" onClick={() => setCartOpen(false)}>
                    <button className="mt-6 bg-[#2f221c] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#c68b59] transition">Browse Products</button>
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.name} className="flex gap-3 items-start pb-5 border-b border-[#f9f0e7] last:border-0">
                    <img src={item.image} alt={item.name} className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-2xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#2f221c] text-sm">{item.name}</p>
                      <p className="text-[#c68b59] font-semibold text-sm mt-0.5">₹{item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-2 border border-[#e8d5c0] rounded-full px-2 py-0.5">
                          <button onClick={() => updateQty(item.name, -1)} className="w-5 h-5 flex items-center justify-center text-[#5c4033] font-bold hover:text-[#c68b59]">−</button>
                          <span className="text-sm font-semibold text-[#2f221c] w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.name, 1)} className="w-5 h-5 flex items-center justify-center text-[#5c4033] font-bold hover:text-[#c68b59]">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.name)} className="text-gray-400 hover:text-red-400 transition text-xs flex items-center gap-1">
                          <FaTrash size={10} /> Remove
                        </button>
                      </div>
                    </div>
                    <p className="font-bold text-[#2f221c] text-sm whitespace-nowrap">₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-[#f0e4d7] space-y-4">
                <div className="flex justify-between font-bold text-[#2f221c] text-lg">
                  <span>Total</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <Link to="/checkout" onClick={() => setCartOpen(false)}>
                  <button className="w-full bg-[#2f221c] hover:bg-[#c68b59] transition text-white py-4 rounded-full font-semibold">
                    Proceed to Checkout →
                  </button>
                </Link>
                <button onClick={() => setCartOpen(false)} className="w-full border border-[#c68b59] text-[#c68b59] hover:bg-[#c68b59] hover:text-white transition py-3 rounded-full font-medium text-sm">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WISHLIST DRAWER */}
      {wishOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setWishOpen(false)} />
          <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#f0e4d7]">
              <h2 className="text-xl sm:text-2xl font-bold text-[#2f221c]">Wishlist</h2>
              <button onClick={() => setWishOpen(false)} className="text-gray-400 hover:text-[#2f221c] transition text-xl"><FaTimes /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {wishlist.length === 0 ? (
                <div className="text-center py-16">
                  <FaHeart className="mx-auto text-4xl text-gray-200 mb-4" />
                  <p className="text-gray-400">Nothing saved yet</p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div key={item.name} className="flex gap-3 items-start pb-5 border-b border-[#f9f0e7] last:border-0">
                    <img src={item.image} alt={item.name} className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-2xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#2f221c] text-sm">{item.name}</p>
                      <p className="text-[#c68b59] font-semibold text-sm mt-0.5">
                        {typeof item.price === "number" ? `₹${item.price}` : item.price}
                      </p>
                      <button
                        onClick={() => { addToCart({ ...item, price: typeof item.price === "number" ? item.price : parseInt(String(item.price).replace(/[^0-9]/g, "")) }); }}
                        className="mt-2 bg-[#2f221c] hover:bg-[#c68b59] transition text-white px-4 py-1.5 rounded-full text-xs font-medium"
                      >
                        Add to Bag
                      </button>
                    </div>
                    <button onClick={() => toggleWishlist(item)} className="text-gray-300 hover:text-red-400 transition text-sm mt-1">
                      <FaTimes />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes badgePop {
          0% { transform: scale(0.5); }
          70% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}

export default Header;
