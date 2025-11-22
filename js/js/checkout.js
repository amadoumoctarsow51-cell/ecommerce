const SHIPPING_COST = 0.00; // Frais de port gratuits

// Formatage de prix en euros
function formatPrice(amount) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

// Affiche le résumé de commande
function renderCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem('ecommerceCart')) || [];
    const summaryContainer = document.getElementById('cart-items-summary');
    const subtotalElement = document.getElementById('subtotal');
    const finalTotalElement = document.getElementById('final-total');
    const shippingElement = document.getElementById('shipping');

    if (!summaryContainer || !subtotalElement || !finalTotalElement || !shippingElement) return;

    summaryContainer.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        summaryContainer.innerHTML = '<p style="padding:10px; text-align:center;">Votre panier est vide.</p>';
        subtotalElement.textContent = formatPrice(0);
        finalTotalElement.textContent = formatPrice(0);
        shippingElement.textContent = formatPrice(0);
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('summary-item');
        itemDiv.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>${formatPrice(itemTotal)}</span>
        `;
        summaryContainer.appendChild(itemDiv);
    });

    const finalTotal = subtotal + SHIPPING_COST;

    subtotalElement.textContent = formatPrice(subtotal);
    shippingElement.textContent = SHIPPING_COST > 0 ? formatPrice(SHIPPING_COST) : 'Gratuit';
    finalTotalElement.textContent = formatPrice(finalTotal);

    setupFormSubmission();
}

// Validation simple des champs
function validateForm(form) {
    const email = form.querySelector('#email').value.trim();
    const address = form.querySelector('#address').value.trim();
    const city = form.querySelector('#city').value.trim();
    const zip = form.querySelector('#zip').value.trim();
    const cardNumber = form.querySelector('#card-number').value.trim();
    const cardName = form.querySelector('#card-name').value.trim();
    const expiry = form.querySelector('#expiry').value.trim();
    const cvv = form.querySelector('#cvv').value.trim();

    if (!email || !address || !city || !zip || !cardNumber || !cardName || !expiry || !cvv) {
        alert('Veuillez remplir tous les champs.');
        return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Email invalide.');
        return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Format de date d\'expiration invalide (MM/AA).');
        return false;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
        alert('CVV invalide.');
        return false;
    }
    return true;
}

// Gestion du formulaire
function setupFormSubmission() {
    const form = document.getElementById('checkout-form');
    const payButton = document.querySelector('.btn-pay');

    if (!form || !payButton) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!validateForm(form)) return;

        payButton.disabled = true;
        payButton.textContent = 'Paiement en cours...';

        // Simulation de paiement
        setTimeout(() => {
            alert('Paiement réussi ! Votre commande a été confirmée.');
            localStorage.removeItem('ecommerceCart');
            window.location.href = 'index.html';
        }, 1500);
    });
}

document.addEventListener('DOMContentLoaded', renderCheckoutSummary);
