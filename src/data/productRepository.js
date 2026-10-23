import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";

function getDatabase() {
  if (!db) {
    throw new Error("Firebase is not configured. Follow FIREBASE_SETUP.md to connect the app.");
  }
  return db;
}

export async function fetchProductCatalog() {
  const database = getDatabase();
  const [productsSnapshot, categoriesSnapshot] = await Promise.all([
    getDocs(collection(database, "products")),
    getDocs(collection(database, "categories")),
  ]);

  const products = {};
  categoriesSnapshot.forEach((categoryDocument) => {
    const { name } = categoryDocument.data();
    if (name) products[name] = [];
  });

  productsSnapshot.forEach((productDocument) => {
    const product = { ...productDocument.data(), id: productDocument.id };
    if (!products[product.category]) products[product.category] = [];
    products[product.category].push(product);
  });

  return products;
}

export async function createProduct(product) {
  const database = getDatabase();
  const productDocument = await addDoc(collection(database, "products"), product);
  return { ...product, id: productDocument.id };
}

export async function importLocalProduct(product) {
  const database = getDatabase();
  const { id, ...data } = product;
  const productDocument = id
    ? doc(database, "products", encodeURIComponent(String(id)))
    : doc(collection(database, "products"));
  await setDoc(productDocument, data, { merge: true });
}

export async function updateProduct(id, product) {
  await updateDoc(doc(getDatabase(), "products", id), product);
}

export async function deleteProduct(id) {
  await deleteDoc(doc(getDatabase(), "products", id));
}

export async function createCategory(name) {
  const categoryId = encodeURIComponent(name.toLowerCase());
  await setDoc(doc(getDatabase(), "categories", categoryId), { name }, { merge: true });
}
