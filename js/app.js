// =======================================================
// FICHIER CENTRAL DE LOGIQUE : CATALOGUE & PANIER GLOBAL
// =======================================================

// --- 1. Définition des Produits ---
const products = [
    { id: 1, name: "T-shirt Confort", price: 49.99, image: "https://via.placeholder.com/300x200?text=T-shirt+Confort", description: "Un t-shirt en coton bio ultra-doux, parfait pour le quotidien. Choix de couleurs disponible.", category: "Vêtements" },
    { id: 2, name: "Pull Laine Mérinos", price: 79.99, image: "https://via.placeholder.com/300x200?text=Pull+Laine", description: "Un pull chaud, léger et élégant, idéal pour les saisons froides. Coupe ajustée.", category: "Vêtements" },
    { id: 3, name: "Casque Audio Pro", price: 199.99, image: "https://via.placeholder.com/300x200?text=Casque+Pro", description: "Casque à réduction de bruit active, pour une immersion totale. Batterie longue durée.", category: "Accessoires" },
    { id: 4, name: "Sac à Dos Urbain", price: 89.50, image: "https://via.placeholder.com/300x200?text=Sac+Urbain", description: "Design minimaliste et compartiment rembourré pour ordinateur portable 15 pouces. Tissu imperméable.", category: "Accessoires" }
];
window.products = products;

// --- 2. Formatage des prix ---
function formatPrice(amount) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

// --- 3. Panier ---
let cart = JSON.parse(localStorage.getItem('ecommerceCart')) || [];

function saveCart() {
    localStorage.setItem('ecommerceCart', JSON.stringify(cart));
    updateCartCount();
}

function addToCartWithQty(productId, quantity) {
    const productToAdd = products.find(p => p.id === productId);
    if (!productToAdd) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...productToAdd, quantity });
    }

    saveCart();
    showNotification(`${quantity} x ${productToAdd.name} ajouté(s) au panier !`);
}

// Fonction par défaut pour boutons "Ajouter au panier" (qty=1)
function addToCart(productId) {
    addToCartWithQty(productId, 1);
}
window.addToCartWithQty = addToCartWithQty;

// --- 4. Mise à jour compteur du panier ---
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartLink = document.getElementById('cart-link');
    if (cartLink) cartLink.textContent = `Panier (${totalItems})`;
}

// --- 5. Notifications visuelles ---
function showNotification(message) {
    let notif = document.createElement('div');
    notif.className = 'cart-notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// --- 6. Rendu des produits ---
function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="Image de ${product.name}">
            <div class="card-content">
                <h3>${product.name}</h3>
                <p class="price">${formatPrice(product.price)}</p>
                <a href="product-detail.html?id=${product.id}" class="btn">Voir Détails</a>
                <button class="btn btn-add-cart" data-product-id="${product.id}">Ajouter au panier</button>
            </div>
        `;
        productGrid.appendChild(card);
    });

    setupCartListeners();
}

// --- 7. Écouteurs boutons "Ajouter au panier" ---
function setupCartListeners() {
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.removeEventListener('click', handleAddToCart); // éviter double binding
        btn.addEventListener('click', handleAddToCart);
    });
}

function handleAddToCart(e) {
    const productId = parseInt(e.target.dataset.productId);
    addToCart(productId);
}

// --- 8. Initialisation ---
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-grid')) renderProducts();
    updateCartCount();
});
