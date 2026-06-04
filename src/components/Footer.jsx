import { FaInstagram, FaFacebookF, FaPinterestP, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo-scents-w.png";

function Footer() {
  return (
    <footer className="bg-[#241813] text-white pt-16 sm:pt-24 pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* TOP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-14 border-b border-white/10 pb-12 sm:pb-16">

          {/* BRAND — full width on mobile */}
          <div className="col-span-2 lg:col-span-1">
            <img src={logo} alt="Lumière" className="w-28 sm:w-32 mb-4 sm:mb-6" />
            <p className="text-gray-400 leading-7 text-sm sm:text-base">
              Premium handcrafted scented candles designed to create warmth, comfort, and luxury in every space.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg sm:text-2xl font-semibold mb-5 sm:mb-8">Quick Links</h3>
            <ul className="space-y-3 sm:space-y-5 text-gray-400 text-sm sm:text-base">
              {[["/" , "Home"], ["/categories", "Shop"], ["/categories", "Collections"], ["/about", "About Us"], ["/contact", "Contact"]].map(([to, label]) => (
                <li key={label} className="hover:text-[#d4a373] transition cursor-pointer">
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLLECTIONS */}
          <div>
            <h3 className="text-lg sm:text-2xl font-semibold mb-5 sm:mb-8">Collections</h3>
            <ul className="space-y-3 sm:space-y-5 text-gray-400 text-sm sm:text-base">
              {["Seasonal Candles","Festival Collection","Anniversary Gifts","Birthday Specials","Mood Therapy"].map((label) => (
                <li key={label} className="hover:text-[#d4a373] transition cursor-pointer">
                  <Link to="/categories">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIAL */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-2xl font-semibold mb-5 sm:mb-8">Join Us</h3>
            <div className="flex gap-3 sm:gap-4">
              {[FaInstagram, FaFacebookF, FaPinterestP, FaTwitter].map((Icon, i) => (
                <div key={i} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#d4a373] hover:border-[#d4a373] transition cursor-pointer">
                  <Icon />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 sm:pt-10 text-gray-500 text-xs sm:text-sm text-center sm:text-left">
          <p>© 2026 Soma Scents. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {["Privacy Policy", "Terms & Conditions", "Shipping Policy"].map((p) => (
              <p key={p} className="hover:text-[#d4a373] transition cursor-pointer">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
