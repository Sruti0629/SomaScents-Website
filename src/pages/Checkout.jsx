import { useState } from "react";
import { FaLock, FaTrash, FaChevronRight, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";

function Checkout() {
  const { cart, updateQty, removeFromCart } = useStore();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", pincode: "",
  });

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 1500 ? 0 : 99;
  const total = subtotal + shipping;

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProceedToPayment = () => setStep(3);
  const handlePlaceOrder = () => {
    alert(`Confirmation email sent to ${form.email}\n\nYour order will be delivered soon.`);
    setStep(4);
  };

  const handleCOD = () => {
    const message = `New COD Order\n\nName: ${form.firstName} ${form.lastName}\nPhone: ${form.phone}\n\nAddress:\n${form.address}, ${form.city}, ${form.state} - ${form.pincode}\n\nTotal: ₹${total}`;
    window.open(`https://wa.me/917416778158?text=${encodeURIComponent(message)}`, "_blank");
  };

  const inputClass =
    "w-full border border-[#e8d5c0] rounded-xl px-4 py-3 text-sm text-[#3d2b1f] bg-white focus:outline-none focus:ring-2 focus:ring-[#c68b59]/40 placeholder-gray-400";

  if (step === 4) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] pt-28 sm:pt-32 pb-16 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <FaCheckCircle className="mx-auto text-[#c68b59] mb-6" style={{ fontSize: "64px" }} />
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2f221c] mb-4">Order Placed!</h2>
          <p className="text-gray-600 leading-7 mb-8 text-sm sm:text-base">
            Thank you for your order. We've sent a confirmation to your email.
            Your candles will be crafted and shipped within 2–3 business days.
          </p>
          <Link to="/">
            <button className="bg-[#2f221c] hover:bg-[#c68b59] transition text-white px-8 sm:px-10 py-4 rounded-full font-semibold">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f3] pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <div className="mb-8 sm:mb-12 text-center">
          <p className="uppercase font-semibold text-[#b8895f] mb-3 text-xs" style={{ letterSpacing: "5px" }}>
            Secure Checkout
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2f221c]">Complete Your Order</h1>
        </div>

        {/* STEPPER */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
          {["Cart", "Shipping", "Payment"].map((label, i) => {
            const s = i + 1;
            const active = step === s;
            const done = step > s;
            return (
              <div key={label} className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all"
                    style={{ backgroundColor: done || active ? "#c68b59" : "#e8d5c0", color: done || active ? "#fff" : "#9a7560" }}>
                    {done ? "✓" : s}
                  </div>
                  <span className="text-xs sm:text-sm font-medium hidden xs:inline sm:inline"
                    style={{ color: active ? "#c68b59" : "#9a7560" }}>{label}</span>
                </div>
                {i < 2 && <FaChevronRight className="text-[#d4b8a0] text-xs" />}
              </div>
            );
          })}
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-10 items-start">

          {/* LEFT PANEL */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">

            {/* STEP 1: CART */}
            {step === 1 && (
              <div className="bg-white rounded-[24px] border border-[#eee3d8] p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-[#2f221c] mb-6 sm:mb-8">Your Cart</h2>
                {cart.length === 0 ? (
                  <div className="text-center py-10 sm:py-12">
                    <p className="text-gray-500 mb-6">Your cart is empty.</p>
                    <Link to="/categories">
                      <button className="bg-[#2f221c] text-white px-8 py-3 rounded-full font-medium hover:bg-[#c68b59] transition">Browse Products</button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-5 sm:space-y-6">
                    {cart.map((item) => (
                      <div key={item.name} className="flex gap-3 sm:gap-5 items-start pb-5 sm:pb-6 border-b border-[#f0e4d7] last:border-0 last:pb-0">
                        <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#2f221c] text-base sm:text-lg">{item.name}</h3>
                          <p className="text-[#c68b59] font-semibold mt-1 text-sm sm:text-base">₹{item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-3 mt-2 sm:mt-3">
                            <div className="flex items-center gap-2 border border-[#e8d5c0] rounded-full px-2 sm:px-3 py-1">
                              <button onClick={() => updateQty(item.name, -1)} className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#5c4033] font-bold hover:text-[#c68b59] transition">−</button>
                              <span className="text-sm font-semibold text-[#2f221c] w-4 text-center">{item.qty}</span>
                              <button onClick={() => updateQty(item.name, 1)} className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#5c4033] font-bold hover:text-[#c68b59] transition">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.name)} className="text-gray-400 hover:text-red-400 transition text-xs flex items-center gap-1">
                              <FaTrash size={10} /> Remove
                            </button>
                          </div>
                        </div>
                        <p className="font-bold text-[#2f221c] text-sm whitespace-nowrap">₹{(item.price * item.qty).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: SHIPPING */}
            {step === 2 && (
              <div className="bg-white rounded-[24px] border border-[#eee3d8] p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-[#2f221c] mb-6 sm:mb-8">Shipping Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {[
                    ["First Name",  "firstName", "text",  "Priya"],
                    ["Last Name",   "lastName",  "text",  "Sharma"],
                    ["Email",       "email",     "email", "priya@email.com"],
                    ["Phone",       "phone",     "tel",   "+91 98765 43210"],
                  ].map(([label, name, type, ph]) => (
                    <div key={name}>
                      <label className="block text-xs font-semibold text-[#7a5c47] mb-2 uppercase tracking-wider">{label}</label>
                      <input name={name} type={type} value={form[name]} onChange={handleInput} placeholder={ph} className={inputClass} />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#7a5c47] mb-2 uppercase tracking-wider">Address</label>
                    <input name="address" value={form.address} onChange={handleInput} placeholder="Flat 12, Rose Apartments, MG Road" className={inputClass} />
                  </div>
                  {[
                    ["City",    "city",    "Hyderabad"],
                    ["State",   "state",   "Telangana"],
                    ["Pincode", "pincode", "500032"],
                  ].map(([label, name, ph]) => (
                    <div key={name}>
                      <label className="block text-xs font-semibold text-[#7a5c47] mb-2 uppercase tracking-wider">{label}</label>
                      <input name={name} value={form[name]} onChange={handleInput} placeholder={ph} className={inputClass} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <div className="bg-white rounded-[24px] border border-[#eee3d8] p-5 sm:p-8 space-y-5 sm:space-y-6">
                {/* UPI */}
                <div className="bg-[#fdf8f3] p-5 sm:p-6 rounded-xl text-center">
                  <h3 className="font-bold text-[#2f221c] mb-4">Scan &amp; Pay via UPI</h3>
                  <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] bg-gray-200 mx-auto flex items-center justify-center rounded-xl text-gray-500 text-sm">
                    QR Code
                  </div>
                  <p className="mt-4 text-sm text-gray-600">UPI ID: <span className="font-semibold text-[#2f221c]">9876543210@paytm</span></p>
                </div>
                {/* COD */}
                <div className="border border-[#eee3d8] p-5 sm:p-6 rounded-xl">
                  <h3 className="font-bold text-[#2f221c] mb-2">Cash On Delivery</h3>
                  <p className="text-sm text-gray-500 mb-4">Place your order through WhatsApp.</p>
                  <button onClick={handleCOD}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition">
                    Order via WhatsApp
                  </button>
                </div>
              </div>
            )}

            {/* NAV BUTTONS */}
            <div className="flex justify-between items-center pt-1 gap-3">
              {step > 1 ? (
                <button onClick={() => setStep((s) => s - 1)}
                  className="border border-[#c68b59] text-[#c68b59] px-5 sm:px-8 py-3 rounded-full font-medium hover:bg-[#c68b59] hover:text-white transition text-sm sm:text-base">
                  ← Back
                </button>
              ) : (
                <Link to="/categories">
                  <button className="border border-[#c68b59] text-[#c68b59] px-4 sm:px-8 py-3 rounded-full font-medium hover:bg-[#c68b59] hover:text-white transition text-sm sm:text-base">
                    ← Shop
                  </button>
                </Link>
              )}
              <button
                onClick={() => {
                  if (step === 2) handleProceedToPayment();
                  else if (step < 3) setStep((s) => s + 1);
                  else handlePlaceOrder();
                }}
                disabled={cart.length === 0}
                className="bg-[#2f221c] hover:bg-[#c68b59] transition text-white px-6 sm:px-10 py-3 rounded-full font-semibold disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base">
                {step === 1 && "Proceed to Shipping →"}
                {step === 2 && "Proceed to Payment →"}
                {step === 3 && "Place Order →"}
              </button>
            </div>
          </div>

          {/* ORDER SUMMARY — shown below on mobile, sidebar on desktop */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="bg-white rounded-[24px] border border-[#eee3d8] p-5 sm:p-7 lg:sticky lg:top-28">
              <h3 className="text-lg sm:text-xl font-bold text-[#2f221c] mb-5 sm:mb-6">Order Summary</h3>
              {cart.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No items yet</p>
              ) : (
                <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6 max-h-48 sm:max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-[#2f221c] truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-[#2f221c] whitespace-nowrap">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-[#f0e4d7] pt-4 sm:pt-5 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#c68b59]">Add ₹{(1500 - subtotal).toLocaleString()} more for free shipping</p>
                )}
                <div className="border-t border-[#f0e4d7] pt-3 flex justify-between font-bold text-[#2f221c] text-base sm:text-lg">
                  <span>Total</span><span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 flex items-center gap-2 text-xs text-gray-400 justify-center">
                <FaLock size={10} /><span>Secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
