import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import { useStore } from "../context/StoreContext.jsx";
import { auth, missingFirebaseConfig } from "../firebase.js";
import {
  createCategory,
  createProduct,
  deleteProduct,
  importLocalProduct,
  updateProduct,
} from "../data/productRepository.js";
import { loadStoredProducts } from "../data/productStorage.js";

function Admin() {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(auth));
  const [authError, setAuthError] = useState(() =>
    auth ? "" : `Firebase is not configured. Missing: ${missingFirebaseConfig.join(", ")}. See FIREBASE_SETUP.md.`
  );
  const [emailInput, setEmailInput] = useState("");
  const [pwInput, setPwInput] = useState("");

  // ── Products ───────────────────────────────────────────────────────────────
  const { products, categories, productsError, refetchProducts } = useStore();
  const [activeTab, setActiveTab]           = useState("");
  const [editingId, setEditingId]           = useState(null); // use id not index
  const [form, setForm]                     = useState({ name: "", price: "", description: "", image: "" });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const activeCategory = activeTab || categories[0] || "";
  const [localProductCount] = useState(() =>
    Object.values(loadStoredProducts()).reduce((count, items) => count + items.length, 0)
  );

  // ── Settings ──────────────────────────────────────────────────────────────
  const [showSettings, setShowSettings] = useState(false);
  const [oldPw, setOldPw]               = useState("");
  const [newPw, setNewPw]               = useState("");
  const [confirmPw, setConfirmPw]       = useState("");
  const [pwChangeMsg, setPwChangeMsg]   = useState({ text: "", ok: true });

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setAuthError("");
    if (!auth) {
      setAuthError(`Firebase is not configured. Missing: ${missingFirebaseConfig.join(", ")}. See FIREBASE_SETUP.md.`);
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, emailInput.trim(), pwInput);
      setPwInput("");
    } catch (error) {
      console.error("Admin sign-in failed:", error);
      setAuthError(error.message);
    }
  };
  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setShowSettings(false);
    } catch (error) {
      console.error("Admin sign-out failed:", error);
      showToast(error.message);
    }
  };

  // ── Password change ───────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (newPw.length < 6) { setPwChangeMsg({ text: "New password must be at least 6 characters.", ok: false }); return; }
    if (newPw !== confirmPw) { setPwChangeMsg({ text: "New passwords do not match.", ok: false }); return; }
    if (!auth || !user?.email) {
      setPwChangeMsg({ text: "You must be signed in to change your password.", ok: false });
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(user.email, oldPw);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPw);
      setOldPw(""); setNewPw(""); setConfirmPw("");
      setPwChangeMsg({ text: "Password changed successfully.", ok: true });
      showToast("✓ Password updated!");
      setTimeout(() => setPwChangeMsg({ text: "", ok: true }), 3000);
    } catch (error) {
      console.error("Admin password update failed:", error);
      setPwChangeMsg({ text: error.message, ok: false });
    }
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const { name, price, description, image } = form;
    if (!name.trim() || !price) { showToast("Please fill in name and price."); return; }
    if (!activeCategory) { showToast("Add or select a category first."); return; }

    const product = { name: name.trim(), price: Number(price), description, image, category: activeCategory };
    try {
      if (editingId !== null) {
        await updateProduct(editingId, product);
      } else {
        await createProduct(product);
      }
      const refreshed = await refetchProducts();
      if (!refreshed) throw new Error("The product was saved, but the storefront could not reload the catalog.");
    } catch (error) {
      console.error("Could not save product:", error);
      showToast(error.message);
      return;
    }

    setEditingId(null);
    setForm({ name: "", price: "", description: "", image: "" });
    showToast(editingId !== null ? "✓ Product updated!" : "✓ Product added!");
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, price: String(product.price), description: product.description, image: product.image });
    setEditingId(product.id);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      if (!await refetchProducts()) throw new Error("The product was deleted, but the storefront could not reload the catalog.");
    } catch (error) {
      console.error("Could not delete product:", error);
      showToast(error.message);
      return;
    }
    showToast("✓ Product deleted!");
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    try {
      await createCategory(name);
      if (!await refetchProducts()) throw new Error("The category was saved, but the catalog could not be reloaded.");
    } catch (error) {
      console.error("Could not save category:", error);
      showToast(error.message);
      return;
    }
    setActiveTab(name);
    setNewCategoryName("");
  };

  const handleImportLocalProducts = async () => {
    const catalog = loadStoredProducts();
    const productCount = Object.values(catalog).reduce((count, items) => count + items.length, 0);
    if (productCount === 0) return;
    if (!window.confirm(`Import ${productCount} locally saved product(s) into Firebase?`)) return;

    setIsImporting(true);
    try {
      for (const [category, items] of Object.entries(catalog)) {
        await createCategory(category);
        for (const product of items) {
          await importLocalProduct({ ...product, category });
        }
      }
      if (!await refetchProducts()) throw new Error("Products were imported, but the catalog could not be reloaded.");
      showToast(`✓ Imported ${productCount} product(s) to Firebase!`);
    } catch (error) {
      console.error("Could not import local products:", error);
      showToast(error.message);
    } finally {
      setIsImporting(false);
    }
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
  if (authLoading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9a7e6b" }}>
        Checking admin sign-in…
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", border: "1px solid #ede3d8", borderRadius: 20, padding: "40px 48px", width: "min(420px, calc(100% - 32px))", textAlign: "center", boxShadow: "0 8px 32px rgba(47,34,28,0.08)" }}>
          <p style={{ fontSize: 13, letterSpacing: 4, color: "#b8895f", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Soma Scents</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2f221c", marginBottom: 6 }}>Admin Panel</h1>
          <p style={{ fontSize: 14, color: "#9a7e6b", marginBottom: 20 }}>Sign in with your Firebase admin account</p>
          <input
            type="email" placeholder="Admin email" value={emailInput}
            onChange={(e) => { setEmailInput(e.target.value); setAuthError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ ...inputStyle, marginBottom: 10 }}
          />
          <input
            type="password" placeholder="Password" value={pwInput}
            onChange={(e) => { setPwInput(e.target.value); setAuthError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ ...inputStyle, marginBottom: 8 }}
          />
          {authError && <p style={{ color: "#e53e3e", fontSize: 13, marginBottom: 8, overflowWrap: "anywhere" }}>{authError}</p>}
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
      <div style={{ maxWidth: 500, margin: "90px auto", padding: "60px 20px" }}>
        <button onClick={() => { setShowSettings(false); setPwChangeMsg({ text: "", ok: true }); }}
          style={{ background: "none", border: "none", color: "#b8895f", fontSize: 14, cursor: "pointer", marginBottom: 15, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to products
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2f221c", marginBottom: 32 }}>Settings</h1>
        <p style={{ fontSize: 12, letterSpacing: 4, color: "#b8895f", fontWeight: 600, textTransform: "uppercase" }}>Soma Scents</p>
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
          <p style={{ fontSize: 13, color: "#9a7e6b", marginTop: 2 }}>Saved products are shared with all visitors ✦</p>
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
              background: activeCategory === tab ? "#2f221c" : "#f5ede3",
              color: activeCategory === tab ? "#fff" : "#7a5c47" }}>
            {tab} <span style={{ fontSize: 12, opacity: 0.7 }}>({products[tab].length})</span>
          </button>
        ))}
      </div>
      {productsError && (
        <p role="alert" style={{ color: "#b42318", fontSize: 13, margin: "0 0 16px", overflowWrap: "anywhere" }}>
          Could not load shared products: {productsError}
        </p>
      )}

      {/* New category */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        <input type="text" placeholder="+ New category name (e.g. Wedding)"
          value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAddCategory(); }}
          style={{ flex: 1, padding: "9px 14px", borderRadius: 10, border: "1.5px solid #ede3d8", fontSize: 14, color: "#2f221c", outline: "none" }}
        />
        <button onClick={handleAddCategory}
          style={{ background: "#b8895f", color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Add
        </button>
      </div>
      {localProductCount > 0 && (
        <button
          onClick={handleImportLocalProducts}
          disabled={isImporting}
          style={{ marginBottom: 20, background: "#f5ede3", color: "#7a5c47", border: "1px solid #ede3d8", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: isImporting ? "wait" : "pointer" }}
        >
          {isImporting ? "Importing local products…" : `Import ${localProductCount} local product(s) to Firebase`}
        </button>
      )}

      {/* Product list */}
      {!products[activeCategory] || products[activeCategory].length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#b8895f", fontSize: 15 }}>No products in this category yet</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {(products[activeCategory] || []).map((p) => (
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
          <p style={{ fontSize: 13, color: "#b8895f", marginBottom: 16 }}>Editing in: <strong>{activeCategory}</strong></p>
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
        <div style={{ position: "fixed", bottom: 24, right: 24, maxWidth: "min(420px, calc(100vw - 48px))", background: "#2f221c", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 500, zIndex: 999, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", overflowWrap: "anywhere" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

export default Admin;
