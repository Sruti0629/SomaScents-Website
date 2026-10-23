import { productsByTab, tabToSlug } from "./defaultProducts.js";

const PRODUCTS_KEY = "soma_scents_products";
const CATALOG_VERSION_KEY = "soma_scents_catalog_version";
const CATALOG_VERSION = "4";
const REFRESHED_PRODUCT_IMAGES = {
  Seasonal: new Set(["Spring Bloom", "Monsoon Petrichor", "Autumn Leaves", "Summer Citrus"]),
  Birthday: new Set(["Sugar & Cake"]),
  "Mood Therapy": new Set(["Calm & Breathe"]),
  "Gift Sets": new Set(["Trio Gift Box", "Anniversary Duo"]),
};

function createDefaultCatalog() {
  return Object.fromEntries(
    Object.entries(productsByTab).map(([category, items]) => [
      category,
      items.map((product, index) => ({
        ...product,
        price: typeof product.price === "number"
          ? product.price
          : Number(String(product.price).replace(/[^\d.-]/g, "")),
        id: `default-${tabToSlug(category)}-${index + 1}`,
        category,
      })),
    ])
  );
}

export function loadStoredProducts() {
  try {
    const storedProducts = localStorage.getItem(PRODUCTS_KEY);
    const version = localStorage.getItem(CATALOG_VERSION_KEY);
    const products = storedProducts ? JSON.parse(storedProducts) : {};
    if (!products || typeof products !== "object" || Array.isArray(products)) {
      throw new Error("Saved products have an invalid format.");
    }

    if (version !== CATALOG_VERSION) {
      const defaultProducts = createDefaultCatalog();

      for (const [category, items] of Object.entries(products)) {
        const seededItems = defaultProducts[category] || [];
        const combinedItems = [...seededItems];
        for (const item of items) {
          const existingIndex = combinedItems.findIndex((product) => product.name === item.name);
          if (existingIndex === -1) combinedItems.push(item);
          else combinedItems[existingIndex] = {
            ...combinedItems[existingIndex],
            ...item,
            ...(REFRESHED_PRODUCT_IMAGES[category]?.has(item.name)
              ? { image: seededItems[existingIndex].image }
              : {}),
          };
        }
        defaultProducts[category] = combinedItems;
      }

      try {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
        localStorage.setItem(CATALOG_VERSION_KEY, CATALOG_VERSION);
      } catch (error) {
        console.error("Could not initialize the default product catalog:", error);
      }
      return defaultProducts;
    }

    return products;
  } catch (error) {
    console.error("Could not load saved products:", error);
    return createDefaultCatalog();
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
