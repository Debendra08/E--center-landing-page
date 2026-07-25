/* =========================================================
   PRODUCTS-DATA.JS
   Shared helper functions used across index.html, the
   category pages (rickshaw.html, scooter.html, moped.html,
   cycle.html, battery.html, loader.html) and product-detail.html.
   Talks directly to Firestore — no backend server needed.
   ========================================================= */

// ---------- Fetch products ----------

async function fetchAllProducts() {
  const snap = await db.collection("products")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function fetchProductsByCategory(category) {
  const snap = await db.collection("products")
    .where("category", "==", category)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function fetchFeaturedProducts() {
  const snap = await db.collection("products")
    .where("featured", "==", true)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function fetchProductById(id) {
  const doc = await db.collection("products").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

// ---------- Leads (customer interest form) ----------

async function submitLead({ name, phone, address, productId, productName, message }) {
  return db.collection("leads").add({
    name: name || "",
    phone: phone || "",
    address: address || "",
    productId: productId || "",
    productName: productName || "",
    message: message || "",
    status: "new",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// ---------- Skeleton loading ----------

function renderSkeletonCards(container, count = 6) {
  if (!container) return;
  let html = "";
  for (let i = 0; i < count; i++) {
    html += `
      <div class="grid-item skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-line skeleton-title"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
      </div>`;
  }
  container.innerHTML = html;
}

function renderEmptyState(container, message = "No products added yet. Check back soon!") {
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">
      <img src="./images/leaf charge.png" alt="" class="empty-state-icon">
      <p>${message}</p>
    </div>`;
}

// ---------- Product card HTML ----------

function productCardHTML(product) {
  const img = (product.images && product.images.length) ? product.images[0] : "./images/logo.png";
  const desc = product.shortDescription || (product.fullDescription || "").slice(0, 150);
  return `
    <a href="product-detail.html?id=${product.id}" class="card-link">
      <div class="grid-item fade-in-card">
        <img src="${img}" alt="${escapeHTML(product.name)}" loading="lazy">
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(desc)}</p>
      </div>
    </a>`;
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
