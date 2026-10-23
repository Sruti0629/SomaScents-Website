import { createContext, useContext, useState, useEffect } from "react";
import { fetchProductCatalog } from "../data/productRepository.js";

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

  // ── Shared product catalog from Firestore ───────────────────────────────
  const [products, setProducts] = useState({});
  const categories = Object.keys(products);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const refreshProducts = async () => {
    setProductsLoading(true);
    setProductsError("");
    try {
      setProducts(await fetchProductCatalog());
      return true;
    } catch (error) {
      console.error("Could not load product catalog:", error);
      setProductsError(error.message);
      return false;
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetchProductCatalog()
      .then((catalog) => {
        if (active) setProducts(catalog);
      })
      .catch((error) => {
        console.error("Could not load product catalog:", error);
        if (active) setProductsError(error.message);
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });

    return () => { active = false; };
  }, []);

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
        products, categories, productsLoading, productsError,
        refetchProducts: refreshProducts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() { return useContext(StoreContext); }
