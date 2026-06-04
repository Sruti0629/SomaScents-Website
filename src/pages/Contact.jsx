import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  const inputClass =
    "w-full border border-[#e8d5c0] rounded-xl px-4 py-3 text-sm text-[#3d2b1f] bg-white focus:outline-none focus:ring-2 focus:ring-[#c68b59]/40";

  return (
    <div className="min-h-screen bg-[#fdf8f3] pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10 sm:mb-16">
          <p className="uppercase font-semibold text-[#b8895f] mb-3 bg-white inline-block px-5 py-2 rounded-full text-xs sm:text-sm"
            style={{ letterSpacing: "4px" }}>
            Get In Touch
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2f221c] mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-7 text-sm sm:text-base">
            We'd love to hear from you. Whether you have a question about our candles, orders, or gifting options, our team is ready to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">

          {/* Left */}
          <div className="space-y-6">
            <div className="bg-white rounded-[24px] border border-[#eee3d8] p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#2f221c] mb-6 sm:mb-8">Contact Information</h2>
              <div className="space-y-5 sm:space-y-6">
                {[
                  { Icon: FaEnvelope, label: "Email Address",  value: "somascents5@gmail.com" },
                  { Icon: FaPhoneAlt, label: "Phone Number",   value: "+91 7416778158" },
                  { Icon: FaMapMarkerAlt, label: "Address",    value: "Mehdipatnam, Hyderabad" },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex gap-4 items-start">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f7ede4] flex items-center justify-center text-[#c68b59] flex-shrink-0">
                      <Icon />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#2f221c] text-sm sm:text-base">{label}</h4>
                      <p className="text-gray-600 text-sm sm:text-base">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[24px] border border-[#eee3d8] overflow-hidden">
              <iframe
                title="map"
                src="https://maps.google.com/maps?q=Mehdipatnam%20Hyderabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-[260px] sm:h-[350px]"
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-[24px] border border-[#eee3d8] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2f221c] mb-6 sm:mb-8">Send a Message</h2>
            <div className="space-y-4 sm:space-y-5">
              {[
                { label: "Full Name",      type: "text",  placeholder: "Enter your name" },
                { label: "Email Address",  type: "email", placeholder: "Enter your email" },
                { label: "Phone Number",   type: "tel",   placeholder: "+91 9876543210" },
              ].map(({ label, type, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-[#7a5c47] mb-2 uppercase tracking-wider">{label}</label>
                  <input type={type} placeholder={placeholder} className={inputClass} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#7a5c47] mb-2 uppercase tracking-wider">Message</label>
                <textarea rows="5" placeholder="Write your message here..." className={inputClass} />
              </div>
              <button className="w-full bg-[#2f221c] hover:bg-[#c68b59] transition text-white py-4 rounded-full font-semibold">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
