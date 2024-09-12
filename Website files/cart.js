import { Cart, Store } from './core functions.js'; // Import the necessary classes

// Use the globally initialized instances if available, otherwise initialize them
const cart = window.globalCartInstance || new Cart();
const store = window.globalStoreInstance || new Store(cart);

// Save the instances to the global window object if not already saved
if (!window.globalCartInstance) {
    window.globalCartInstance = cart;
}
if (!window.globalStoreInstance) {
    window.globalStoreInstance = store;
}


// Function to populate the cart items in the cart page with images
function cartItemList() {
    const cartItemsList = document.getElementById('cart-items-list');

    if (cartItemsList) {
        cartItemsList.innerHTML = ''; // Clear any existing items

        if (cart.cartItems.length === 0) {
            cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
        } else {
            cart.cartItems.forEach(item => {
                // Fetch the item details from the Store class
                const storeItem = store.items.find(storeItem => storeItem.name === item.name);
                if (storeItem) {
                    const li = document.createElement('li');
                    li.classList.add('cart-item');
                    li.innerHTML = `
                        <div class="cart-item-inner">
                            <img src="${storeItem.image}" alt="${storeItem.name}" class="cart-item-image">
                            <span class="item-name">${item.name}</span>
                            <span class="item-quantity">x${item.quantity}</span>
                            <button class="remove-item-btn" data-item="${item.name}">Remove</button>
                        </div>
                    `;
                    cartItemsList.appendChild(li);
                }
            });

            cartItemsList.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const itemName = e.target.getAttribute('data-item');
                    cart.removeFromCart(itemName);
                    cartItemList(); // Re-render the cart items after removal
                });
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const newCheckoutBtn = document.getElementById('checkout-button');
    if (newCheckoutBtn) {
        newCheckoutBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    const newBackBtn = document.getElementById('home-btn');
    if (newBackBtn) {
        newBackBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});


// Call the function to populate the cart items when the page loads
document.addEventListener('DOMContentLoaded', cartItemList);
