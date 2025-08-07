// ---- "Credentials" (frontend-only; not secure) ----
const USERS = {
  admin: 'admin123',
  asad: 'motor123'
};

// ---- DOM helpers ----
const $ = (sel) => document.querySelector(sel);
const topbar = $('#topbar');
const catalog = $('#catalog');
const loginScreen = $('#loginScreen');
const loginForm = $('#loginForm');
const loginError = $('#loginError');
const printBtn = $('#printBtn');
const logoutBtn = $('#logoutBtn');

// ---- Auth state helpers ----
const AUTH_KEY = 'catalog_auth_user';

function isLoggedIn() {
  return !!localStorage.getItem(AUTH_KEY);
}
function login(user) {
  localStorage.setItem(AUTH_KEY, user);
}
function logout() {
  localStorage.removeItem(AUTH_KEY);
  // Reset UI
  catalog.innerHTML = '';
  showLogin();
}
function showLogin() {
  loginScreen.classList.remove('hidden');
  topbar.classList.add('hidden');
  catalog.classList.add('hidden');
}
function showApp() {
  loginScreen.classList.add('hidden');
  topbar.classList.remove('hidden');
  catalog.classList.remove('hidden');
}

// ---- Init catalog ----
function buildCatalog(products) {
  const frag = document.createDocumentFragment();
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <div class="size">Size: ${product.size}</div>
      <div class="bottom">
        <span>${product.code}</span>
        <span>${product.price}</span>
      </div>
    `;
    frag.appendChild(card);
  });
  catalog.appendChild(frag);
}

async function loadProducts() {
  // In a real app this would be gated server-side; here we just fetch.
  const res = await fetch('products.json');
  if (!res.ok) throw new Error('Failed to load products');
  const data = await res.json();
  return data.products || [];
}

async function initApp() {
  try {
    showApp();
    const products = await loadProducts();
    buildCatalog(products);
  } catch (e) {
    console.error(e);
    catalog.innerHTML = `<p>Could not load products.</p>`;
  }
}

// ---- Events ----
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loginError.textContent = '';

  const username = $('#username').value.trim();
  const password = $('#password').value;

  if (!USERS[username] || USERS[username] !== password) {
    loginError.textContent = 'Invalid username or password';
    return;
  }

  login(username);
  initApp();
});

printBtn.addEventListener('click', () => window.print());
logoutBtn.addEventListener('click', logout);

// Allow Enter-to-submit on inputs (already handled by form, but this helps UX)
['#username', '#password'].forEach(sel => {
  const el = $(sel);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginForm.requestSubmit();
  });
});

// ---- Boot ----
if (isLoggedIn()) {
  initApp();
} else {
  showLogin();
}
