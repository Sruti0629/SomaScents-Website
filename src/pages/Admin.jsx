import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { useStore } from "../context/StoreContext.jsx";

const DEFAULT_PASSWORD = "sruti78";
const PW_KEY = "lumiere_admin_pw";
function getStoredPassword() { return localStorage.getItem(PW_KEY) || DEFAULT_PASSWORD; }

function Admin() {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const [authed, setAuthed]   = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  // ── Products (local admin state) ──────────────────────────────────────────
  const { refetchProducts } = useStore();
  const [products, setProducts]             = useState({});
  const [activeTab, setActiveTab]           = useState("");
  const [editingId, setEditingId]           = useState(null); // use id not index
  const [form, setForm]                     = useState({ name: "", price: "", description: "", image: "" });
  const [newCategoryName, setNewCategoryName] = useState("");

  // ── Settings ──────────────────────────────────────────────────────────────
  const [showSettings, setShowSettings] = useState(false);
  const [oldPw, setOldPw]               = useState("");
  const [newPw, setNewPw]               = useState("");
  const [confirmPw, setConfirmPw]       = useState("");
  const [pwChangeMsg, setPwChangeMsg]   = useState({ text: "", ok: true });

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const totalCount = Object.values(products).reduce((s, a) => s + a.length, 0);

  // ── Login ─────────────────────────────────────────────────────────────────
  const handleLogin = () => {
    if (pwInput === getStoredPassword()) { setAuthed(true); setPwError(false); setPwInput(""); }
    else setPwError(true);
  };
  const handleLogout = () => { setAuthed(false); setPwInput(""); setShowSettings(false); };

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) { console.error(error); return; }
    const grouped = {};
    data.forEach((p) => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
    setProducts(grouped);
    if (Object.keys(grouped).length > 0 && !activeTab) setActiveTab(Object.keys(grouped)[0]);
  };

  useEffect(() => { fetchProducts(); }, []);

  // ── Password change ───────────────────────────────────────────────────────
  const handleChangePassword = () => {
    if (oldPw !== getStoredPassword()) { setPwChangeMsg({ text: "Current password is incorrect.", ok: false }); return; }
    if (newPw.length < 6) { setPwChangeMsg({ text: "New password must be at least 6 characters.", ok: false }); return; }
    if (newPw !== confirmPw) { setPwChangeMsg({ text: "New passwords do not match.", ok: false }); return; }
    localStorage.setItem(PW_KEY, newPw);
    setOldPw(""); setNewPw(""); setConfirmPw("");
    setPwChangeMsg({ text: "✓ Password changed successfully!", ok: true });
    showToast("✓ Password updated!");
    setTimeout(() => setPwChangeMsg({ text: "", ok: true }), 3000);
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const { name, price, description, image } = form;
    if (!name.trim() || !price) { showToast("Please fill in name and price."); return; }

    if (editingId !== null) {
      const { error } = await supabase.from("products")
        .update({ name, price: Number(price), description, image, category: activeTab })
        .eq("id", editingId);
      if (error) { showToast("Error updating product"); return; }
      showToast("✓ Product updated!");
    } else {
      const { error } = await supabase.from("products")
        .insert([{ name, price: Number(price), description, image, category: activeTab }]);
      if (error) { showToast("Error saving product"); return; }
      showToast("✓ Product added!");
    }

    setEditingId(null);
    setForm({ name: "", price: "", description: "", image: "" });
    await fetchProducts();
    refetchProducts(); // sync the live storefront
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, price: String(product.price), description: product.description, image: product.image });
    setEditingId(product.id);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { showToast("Error deleting product"); return; }
    await fetchProducts();
    refetchProducts(); // sync the live storefront
    showToast("✓ Product deleted!");
  };

  const cancelEdit = () => { setEditingId(null); setForm({ name: "", price: "", description: "", image: "" }); };

  // ── Input style ───────────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1.5px solid #ede3d8", fontSize: 14, color: "#2f221c",
    outline: "none", boxSizing: "border-box",
  };

  // ════════════════════════════════════════════════════════════════════════
  // LOGIN
  // ════════════════════════════════════════════════════════════════════════
  if (!authed) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", border: "1px solid #ede3d8", borderRadius: 20, padding: "40px 48px", width: 360, textAlign: "center", boxShadow: "0 8px 32px rgba(47,34,28,0.08)" }}>
          <p style={{ fontSize: 13, letterSpacing: 4, color: "#b8895f", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Soma Scents</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2f221c", marginBottom: 6 }}>Admin Panel</h1>
          <p style={{ fontSize: 14, color: "#9a7e6b", marginBottom: 28 }}>Enter your password to continue</p>
          <input
            type="password" placeholder="Password" value={pwInput}
            onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ ...inputStyle, border: `1.5px solid ${pwError ? "#e53e3e" : "#ede3d8"}`, marginBottom: 8 }}
          />
          {pwError && <p style={{ color: "#e53e3e", fontSize: 13, marginBottom: 8 }}>Incorrect password. Try again.</p>}
          <button onClick={handleLogin} style={{ width: "100%", background: "#2f221c", color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>
            Login
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // SETTINGS
  // ════════════════════════════════════════════════════════════════════════
  if (showSettings) {
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "60px 20px" }}>
        <button onClick={() => { setShowSettings(false); setPwChangeMsg({ text: "", ok: true }); }}
          style={{ background: "none", border: "none", color: "#b8895f", fontSize: 14, cursor: "pointer", marginBottom: 32, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to products
        </button>
        <p style={{ fontSize: 12, letterSpacing: 4, color: "#b8895f", fontWeight: 600, textTransform: "uppercase" }}>Soma Scents</p>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2f221c", marginBottom: 32 }}>Settings</h1>
        <div style={{ background: "#fff", border: "1px solid #ede3d8", borderRadius: 20, padding: "28px" }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2f221c", marginBottom: 20 }}>🔒 Change password</h2>
          {[["Current password", oldPw, setOldPw], ["New password", newPw, setNewPw], ["Confirm new password", confirmPw, setConfirmPw]].map(([label, val, setter]) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, color: "#9a7e6b", fontWeight: 600, marginBottom: 6 }}>{label}</label>
              <input type="password" value={val} onChange={(e) => setter(e.target.value)} style={inputStyle} />
            </div>
          ))}
          {pwChangeMsg.text && <p style={{ fontSize: 13, color: pwChangeMsg.ok ? "#2f7a2f" : "#e53e3e", marginBottom: 12 }}>{pwChangeMsg.text}</p>}
          <button onClick={handleChangePassword} style={{ background: "#2f221c", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }}>
            Update password
          </button>
        </div>
        <div style={{ marginTop: 20 }}>
          <button onClick={handleLogout} style={{ background: "transparent", color: "#e53e3e", border: "1.5px solid #ffd5d5", borderRadius: 10, padding: "11px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%" }}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // MAIN ADMIN
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ maxWidth: 860, margin: "120px auto", padding: "24px 16px 80px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 12, letterSpacing: 4, color: "#b8895f", fontWeight: 600, textTransform: "uppercase" }}>Soma Scents</p>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#2f221c" }}>Product Manager</h1>
          <p style={{ fontSize: 13, color: "#9a7e6b", marginTop: 2 }}>Changes publish to the storefront instantly ✦</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* <span style={{ background: "#fdf0e6", color: "#b8895f", fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 99 }}>
            {totalCount} products
          </span> */}
          <button onClick={() => setShowSettings(true)} title="Settings"
            style={{ background: "#f5ede3", border: "none", borderRadius: 10, width: 38, height: 38, cursor: "pointer", fontSize: 17 }}>⚙️</button>
          <button onClick={handleLogout} title="Logout"
            style={{ background: "#fff0f0", border: "none", borderRadius: 10, width: 38, height: 38, cursor: "pointer", fontSize: 17 }}>⏻</button>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {Object.keys(products).map((tab) => (
          <button key={tab}
            onClick={() => { setActiveTab(tab); cancelEdit(); }}
            style={{ padding: "8px 18px", borderRadius: 99, fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none",
              background: activeTab === tab ? "#2f221c" : "#f5ede3",
              color: activeTab === tab ? "#fff" : "#7a5c47" }}>
            {tab} <span style={{ fontSize: 12, opacity: 0.7 }}>({products[tab].length})</span>
          </button>
        ))}
      </div>

      {/* New category */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        <input type="text" placeholder="+ New category name (e.g. Wedding)"
          value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newCategoryName.trim()) {
              const name = newCategoryName.trim();
              if (!products[name]) { setProducts({ ...products, [name]: [] }); setActiveTab(name); }
              setNewCategoryName("");
            }
          }}
          style={{ flex: 1, padding: "9px 14px", borderRadius: 10, border: "1.5px solid #ede3d8", fontSize: 14, color: "#2f221c", outline: "none" }}
        />
        <button onClick={() => {
            const name = newCategoryName.trim();
            if (!name) return;
            if (!products[name]) { setProducts({ ...products, [name]: [] }); setActiveTab(name); }
            setNewCategoryName("");
          }}
          style={{ background: "#b8895f", color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Add
        </button>
      </div>

      {/* Product list */}
      {!products[activeTab] || products[activeTab].length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#b8895f", fontSize: 15 }}>No products in this category yet</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {(products[activeTab] || []).map((p) => (
            <div key={p.id} style={{ background: editingId === p.id ? "#fdf0e6" : "#fff", border: `1px solid ${editingId === p.id ? "#b8895f" : "#ede3d8"}`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s" }}>
              <img src={p.image} alt={p.name} style={{ width: 54, height: 54, borderRadius: 10, objectFit: "cover", background: "#f5ede3", flexShrink: 0 }} onError={(e) => (e.target.style.opacity = 0.3)} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, color: "#2f221c", fontSize: 15, margin: 0 }}>{p.name}</p>
                <p style={{ fontSize: 13, color: "#9a7e6b", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.description}</p>
              </div>
              <span style={{ fontWeight: 700, color: "#b8895f", fontSize: 15, marginRight: 8, whiteSpace: "nowrap" }}>₹{p.price}</span>
              <button onClick={() => handleEdit(p)} title="Edit"
                style={{ background: editingId === p.id ? "#b8895f" : "#f5ede3", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 16 }}>✏️</button>
              <button onClick={() => handleDelete(p.id)} title="Delete"
                style={{ background: "#fff0f0", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 16 }}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit form */}
      <div style={{ background: "#fff", border: "1px solid #ede3d8", borderRadius: 20, padding: "28px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#2f221c", marginBottom: 4 }}>
          {editingId !== null ? "Edit product" : "Add new product"}
        </h2>
        {editingId !== null && (
          <p style={{ fontSize: 13, color: "#b8895f", marginBottom: 16 }}>Editing in: <strong>{activeTab}</strong></p>
        )}
        {editingId === null && <div style={{ marginBottom: 20 }} />}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[["Product name", "name", "text", "e.g. Rose Garden"], ["Price (₹)", "price", "number", "e.g. 899"]].map(([lbl, key, type, ph]) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 13, color: "#9a7e6b", fontWeight: 600, marginBottom: 6 }}>{lbl}</label>
              <input type={type} placeholder={ph} value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={inputStyle} />
            </div>
          ))}
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ display: "block", fontSize: 13, color: "#9a7e6b", fontWeight: 600, marginBottom: 6 }}>Description</label>
            <textarea placeholder="A short, evocative description…" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ ...inputStyle, resize: "vertical", minHeight: 72, fontFamily: "inherit" }} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ display: "block", fontSize: 13, color: "#9a7e6b", fontWeight: 600, marginBottom: 6 }}>Image URL</label>
            <input type="url" placeholder="https://…" value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })} style={inputStyle} />
            {form.image && (
              <img src={form.image} alt="Preview" onError={(e) => (e.target.style.display = "none")}
                style={{ marginTop: 10, width: "100%", height: 140, objectFit: "cover", borderRadius: 10, border: "1px solid #ede3d8" }} />
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
          <button onClick={handleSave}
            style={{ background: "#2f221c", color: "#fff", border: "none", borderRadius: 10, padding: "12px 26px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {editingId !== null ? "Save changes" : "Add product"}
          </button>
          {editingId !== null && (
            <button onClick={cancelEdit}
              style={{ background: "transparent", color: "#9a7e6b", border: "1.5px solid #ede3d8", borderRadius: 10, padding: "12px 20px", fontSize: 15, cursor: "pointer" }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#2f221c", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 500, zIndex: 999, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

export default Admin;
