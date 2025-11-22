// --- Produits ---
const products = [
    { id:1, name:"T-shirt Confort", price:49.99, image:"https://via.placeholder.com/300x200?text=T-shirt+Confort", description:"T-shirt coton bio ultra-doux.", category:"Vêtements" },
    { id:2, name:"Pull Laine Mérinos", price:79.99, image:"https://via.placeholder.com/300x200?text=Pull+Laine", description:"Pull chaud et élégant.", category:"Vêtements" },
    { id:3, name:"Casque Audio Pro", price:199.99, image:"https://via.placeholder.com/300x200?text=Casque+Pro", description:"Casque réduction de bruit.", category:"Accessoires" },
    { id:4, name:"Sac à Dos Urbain", price:89.50, image:"https://via.placeholder.com/300x200?text=Sac+Urbain", description:"Sac minimaliste imperméable.", category:"Accessoires" }
];
window.products = products;

// --- Panier ---
let cart = JSON.parse(localStorage.getItem('ecommerceCart')) || [];

function saveCart() {
    localStorage.setItem('ecommerceCart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId, quantity=1){
    const product = products.find(p => p.id == productId);
    if(!product) return;
    const existing = cart.find(item=>item.id==productId);
    if(existing) existing.quantity += quantity;
    else cart.push({...product, quantity});
    saveCart();
}

window.addToCart = addToCart;

function updateCartCount(){
    const cartLink = document.getElementById('cart-link');
    if(cartLink){
        const total = cart.reduce((sum,item)=>sum+item.quantity,0);
        cartLink.textContent = `Panier (${total})`;
    }
}

// --- Affichage produits ---
function renderProducts(){
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    grid.innerHTML = '';
    products.forEach(p=>{
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.image}" alt="Image de ${p.name}">
            <div class="card-content">
                <h3>${p.name}</h3>
                <p class="price">${p.price.toFixed(2).replace('.',',')} €</p>
                <a href="product-detail.html?id=${p.id}" class="btn">Voir Détails</a>
                <button class="btn btn-add-cart" data-id="${p.id}">Ajouter au panier</button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Boutons ajout panier
    document.querySelectorAll('.btn-add-cart').forEach(btn=>{
        btn.addEventListener('click', ()=>addToCart(parseInt(btn.dataset.id)));
    });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', ()=>{
    renderProducts();
    updateCartCount();
});
