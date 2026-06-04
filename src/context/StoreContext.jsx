import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../pages/supabase";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // ── Global products state (live from Supabase) ──────────────────────────
  const [products, setProducts] = useState({});      // { category: [...] }
  const [categories, setCategories] = useState([]);  // ordered list of category names
  const [productsLoading, setProductsLoading] = useState(true);

  const fetchProducts = async () => {
    setProductsLoading(true);
    const { data, error } = await supabase.from("products").select("*");
    if (error) { console.error(error); setProductsLoading(false); return; }

    const grouped = {};
    data.forEach((p) => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });

    setProducts(grouped);
    setCategories(Object.keys(grouped));
    setProductsLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // ── Cart helpers ────────────────────────────────────────────────────────
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === product.name);
      if (existing) return prev.map((i) => i.name === product.name ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (name) => setCart((prev) => prev.filter((i) => i.name !== name));

  const updateQty = (name, delta) =>
    setCart((prev) =>
      prev.map((i) => (i.name === name ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0)
    );

  const toggleWishlist = (product) =>
    setWishlist((prev) =>
      prev.find((i) => i.name === product.name)
        ? prev.filter((i) => i.name !== product.name)
        : [...prev, product]
    );

  const isWishlisted = (name) => wishlist.some((i) => i.name === name);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  return (
    <StoreContext.Provider
      value={{
        cart, wishlist,
        addToCart, removeFromCart, updateQty,
        toggleWishlist, isWishlisted,
        cartCount, wishlistCount,
        products, categories, productsLoading,
        refetchProducts: fetchProducts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() { return useContext(StoreContext); }
