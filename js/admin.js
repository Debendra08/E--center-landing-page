/* =========================================================
   ADMIN.JS — E-CENTER admin panel logic
   ========================================================= */

const loginScreen = document.getElementById("loginScreen");
const adminShell = document.getElementById("adminShell");

// ---------- Auth ----------

auth.onAuthStateChanged(user => {
  if (user) {
    loginScreen.style.display = "none";
    adminShell.classList.add("active");
    loadDashboard();
    loadProducts();
    loadLeads();
  } else {
    loginScreen.style.display = "flex";
    adminShell.classList.remove("active");
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("loginBtn");
  const err = document.getElementById("loginError");
  err.textContent = "";
  btn.disabled = true;
  btn.textContent = "Signing in…";
  try {
    await auth.signInWithEmailAndPassword(
      document.getElementById("loginEmail").value,
      document.getElementById("loginPassword").value
    );
  } catch (e2) {
    err.textContent = "Invalid email or password.";
  } finally {
    btn.disabled = false;
    btn.textContent = "Sign In";
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => auth.signOut());

// ---------- Nav switching ----------

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.panel).classList.add("active");
  });
});

// ---------- Helpers ----------

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fmtDate(ts) {
  if (!ts || !ts.toDate) return "-";
  return ts.toDate().toLocaleString();
}

// ---------- Dashboard ----------

async function loadDashboard() {
  const [productsSnap, leadsSnap] = await Promise.all([
    db.collection("products").get(),
    db.collection("leads").orderBy("createdAt", "desc").get()
  ]);

  document.getElementById("statProducts").textContent = productsSnap.size;
  document.getElementById("statLeads").textContent = leadsSnap.size;

  const newCount = leadsSnap.docs.filter(d => d.data().status === "new").length;
  document.getElementById("statNewLeads").textContent = newCount;

  const badge = document.getElementById("newLeadsBadge");
  if (newCount > 0) {
    badge.style.display = "inline-block";
    badge.textContent = newCount;
  } else {
    badge.style.display = "none";
  }

  const recentBody = document.getElementById("recentLeadsBody");
  const recent = leadsSnap.docs.slice(0, 6);
  if (!recent.length) {
    recentBody.innerHTML = `<tr><td colspan="4" class="empty-row">No leads yet.</td></tr>`;
  } else {
    recentBody.innerHTML = recent.map(doc => {
      const d = doc.data();
      return `<tr>
        <td>${escapeHTML(d.name)}</td>
        <td>${escapeHTML(d.productName || "-")}</td>
        <td>${escapeHTML(d.phone)}</td>
        <td>${fmtDate(d.createdAt)}</td>
      </tr>`;
    }).join("");
  }
}

// ---------- Products ----------

let productsCache = [];

async function loadProducts() {
  const body = document.getElementById("productsBody");
  const snap = await db.collection("products").orderBy("createdAt", "desc").get();
  productsCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  if (!productsCache.length) {
    body.innerHTML = `<tr><td colspan="5" class="empty-row">No products yet — click "Add Product" to create your first one.</td></tr>`;
    return;
  }

  body.innerHTML = productsCache.map(p => {
    const img = (p.images && p.images.length) ? p.images[0] : "./images/logo.png";
    return `<tr>
      <td><img class="thumb" src="${img}" alt=""></td>
      <td>${escapeHTML(p.name)}</td>
      <td>${escapeHTML(p.category)}</td>
      <td>${p.featured ? "⭐ Yes" : "-"}</td>
      <td>
        <button class="btn-secondary" onclick="openEditProduct('${p.id}')">Edit</button>
        <button class="btn-danger" onclick="deleteProduct('${p.id}')">Delete</button>
      </td>
    </tr>`;
  }).join("");
}

const productModal = document.getElementById("productModal");
const productForm = document.getElementById("productForm");

document.getElementById("addProductBtn").addEventListener("click", () => {
  document.getElementById("productModalTitle").textContent = "Add Product";
  productForm.reset();
  document.getElementById("productId").value = "";
  productModal.classList.add("active");
});

document.getElementById("cancelProductBtn").addEventListener("click", () => {
  productModal.classList.remove("active");
});

function openEditProduct(id) {
  const p = productsCache.find(x => x.id === id);
  if (!p) return;
  document.getElementById("productModalTitle").textContent = "Edit Product";
  document.getElementById("productId").value = p.id;
  document.getElementById("pName").value = p.name || "";
  document.getElementById("pCategory").value = p.category || "rickshaw";
  document.getElementById("pShortDesc").value = p.shortDescription || "";
  document.getElementById("pFullDesc").value = p.fullDescription || "";
  document.getElementById("pSpecs").value = p.specs || "";
  document.getElementById("pImages").value = (p.images || []).join("\n");
  document.getElementById("pFeatured").checked = !!p.featured;
  productModal.classList.add("active");
}

async function deleteProduct(id) {
  if (!confirm("Delete this product? This cannot be undone.")) return;
  await db.collection("products").doc(id).delete();
  loadProducts();
  loadDashboard();
}

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const saveBtn = document.getElementById("saveProductBtn");
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving…";

  const id = document.getElementById("productId").value;
  const images = document.getElementById("pImages").value
    .split("\n").map(s => s.trim()).filter(Boolean);

  const data = {
    name: document.getElementById("pName").value.trim(),
    category: document.getElementById("pCategory").value,
    shortDescription: document.getElementById("pShortDesc").value.trim(),
    fullDescription: document.getElementById("pFullDesc").value.trim(),
    specs: document.getElementById("pSpecs").value.trim(),
    images,
    featured: document.getElementById("pFeatured").checked
  };

  try {
    if (id) {
      await db.collection("products").doc(id).update(data);
    } else {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection("products").add(data);
    }
    productModal.classList.remove("active");
    loadProducts();
    loadDashboard();
  } catch (err) {
    alert("Error saving product: " + err.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save Product";
  }
});

// ---------- Leads ----------

async function loadLeads() {
  const body = document.getElementById("leadsBody");
  const snap = await db.collection("leads").orderBy("createdAt", "desc").get();

  if (snap.empty) {
    body.innerHTML = `<tr><td colspan="8" class="empty-row">No customer leads yet.</td></tr>`;
    return;
  }

  body.innerHTML = snap.docs.map(doc => {
    const d = doc.data();
    const status = d.status || "new";
    return `<tr>
      <td>${escapeHTML(d.name)}</td>
      <td><a href="tel:${escapeHTML(d.phone)}">${escapeHTML(d.phone)}</a></td>
      <td>${escapeHTML(d.address)}</td>
      <td>${escapeHTML(d.productName || "-")}</td>
      <td>${escapeHTML(d.message || "-")}</td>
      <td>${fmtDate(d.createdAt)}</td>
      <td><span class="status-pill ${status}">${status}</span></td>
      <td>
        ${status === "new"
          ? `<button class="btn-secondary" onclick="markContacted('${doc.id}')">Mark Contacted</button>`
          : ""}
        <button class="btn-danger" onclick="deleteLead('${doc.id}')">Delete</button>
      </td>
    </tr>`;
  }).join("");
}

async function markContacted(id) {
  await db.collection("leads").doc(id).update({ status: "contacted" });
  loadLeads();
  loadDashboard();
}

async function deleteLead(id) {
  if (!confirm("Delete this lead?")) return;
  await db.collection("leads").doc(id).delete();
  loadLeads();
  loadDashboard();
}
