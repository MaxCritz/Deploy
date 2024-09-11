import { Cart, Store, User } from './core functions.js'; // Import the necessary classes

// Use the globally initialized instances if available, otherwise initialize them
let cart;
let store;
let user;

try {
    store = window.globalStoreInstance || new Store(); // Initialize Store first
    cart = window.globalCartInstance || new Cart(store); // Pass store to Cart
    console.log('Cart initialized with store:', cart);
    console.log('Store items:', store.items); // Debugging: Check if store items are loaded
} catch (error) {
    console.error('Error initializing Cart or Store:', error);
}

try {
    // Optionally, initialize User if needed
    user = window.globalUserInstance || new User();
    if (!window.globalUserInstance) {
        window.globalUserInstance = user;
    }
} catch (error) {
    console.error('Error initializing User:', error);
}

// Save instances globally if not already done
if (!window.globalCartInstance) {
    window.globalCartInstance = cart;
}
if (!window.globalStoreInstance) {
    window.globalStoreInstance = store;
}

// Function to populate the cart items in the checkout page with images and prices
function populateCartItemsWithPrices() {
    try {
        const cartItemsList = document.getElementById('cart-items-list');
        
        if (!cartItemsList) {
            console.error('Cart items list element not found.');
            return;
        }
        
        cartItemsList.innerHTML = ''; // Clear previous items

        const cartItems = cart.getItems();

        if (cartItems.length === 0) {
            cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        cartItems.forEach(cartItem => {
            const storeItem = store.items.find(item => item.name === cartItem.name);

            if (storeItem) {
                const li = document.createElement('li');
                li.classList.add('cart-item');

                const img = document.createElement('img');
                img.src = storeItem.image;
                img.alt = storeItem.name;
                img.classList.add('item-image');

                const itemName = document.createElement('span');
                itemName.textContent = storeItem.name;
                itemName.classList.add('item-name');

                const itemPrice = document.createElement('span');
                itemPrice.textContent = `$${(storeItem.price * cartItem.quantity).toFixed(2)}`;
                itemPrice.classList.add('item-price');

                const itemQuantity = document.createElement('span');
                itemQuantity.textContent = `Quantity: ${cartItem.quantity}`;
                itemQuantity.classList.add('item-quantity');

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.classList.add('remove-item-btn');
                removeButton.setAttribute('data-item', storeItem.name);

                removeButton.addEventListener('click', (e) => {
                    const itemName = e.target.getAttribute('data-item');
                    cart.removeFromCart(itemName);
                    populateCartItemsWithPrices(); // Re-render cart items after removal
                    updateTotalPrice(); // Update total price after removing
                });

                li.appendChild(img);
                li.appendChild(itemName);
                li.appendChild(itemPrice);
                li.appendChild(itemQuantity);
                li.appendChild(removeButton);

                cartItemsList.appendChild(li);
            }
        });

        updateTotalPrice(); // Update total price after populating items
    } catch (error) {
        console.error('Error populating cart items:', error);
    }
}

function getItems() {
    return this.cartItems; // or whatever the internal array is
}

// Function to calculate and update the total price in real-time
function updateTotalPrice() {
    try {
        const totalPriceElement = document.getElementById('total-price');
        const totalPrice = cart.calculateTotalPrice();
        
        // Debugging: Check what total price is being calculated
        console.log('Calculated total price:', totalPrice);
        
        if (totalPriceElement) {
            totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
        } else {
            console.error('Total price element not found.');
        }

        console.log('Cart items:', cart.getItems());
    } catch (error) {
        console.error('Error updating total price:', error);
    }
}

// Event listener for DOMContentLoaded to populate cart items on page load
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM fully loaded and parsed');
        populateCartItemsWithPrices(); // Populate cart items with prices when the page loads
    } catch (error) {
        console.error('Error on DOMContentLoaded:', error);
    }
});

// Event listener for 'Finalize Checkout' button
try {
    const finalizeCheckoutBtn = document.getElementById('finalize-checkout-btn');
    if (finalizeCheckoutBtn) {
        // Add the click event listener first
        finalizeCheckoutBtn.addEventListener('click', () => {
            // Check if the user is logged in when the button is clicked
            if (user.loggedInUser) {
                const totalPrice = cart.calculateTotalPrice();
                alert(`The total price is $${totalPrice.toFixed(2)}`);
            } else {
                console.warn('User is not logged in. Please log in or sign up to proceed.');
                alert('Please log in or sign up to finalize the checkout.');
                // Optionally, show the login/signup form if it's hidden
                const authSection = document.getElementById('auth-section');
                if (authSection) {
                    authSection.style.display = 'block'; // Show the login/signup section
                }
            }
        });
    } else {
        console.error('Finalize checkout button not found.');
    }
} catch (error) {
    console.error('Error adding event listener for checkout button:', error);
}


// Event listener for 'Home' button to navigate back to the main page
try {
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            window.location.href = 'Shopping website.html';
        });
    } else {
        console.error('Home button not found.');
    }
} catch (error) {
    console.error('Error adding event listener for home button:', error);
}