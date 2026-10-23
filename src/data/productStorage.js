const PRODUCTS_KEY = "soma_scents_products";

export function loadStoredProducts() {
  try {
    const storedProducts = localStorage.getItem(PRODUCTS_KEY);
    if (!storedProducts) return {};

    const products = JSON.parse(storedProducts);
    if (!products || typeof products !== "object" || Array.isArray(products)) {
      throw new Error("Saved products have an invalid format.");
    }

    return products;
  } catch (error) {
    console.error("Could not load saved products:", error);
    return {};
  }
}

export function saveStoredProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Could not save products:", error);
    throw new Error(`Could not save products in this browser: ${error.message}`, { cause: error });
  }
}
