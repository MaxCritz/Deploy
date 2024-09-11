import { User, Cart, Store } from './core functions.js';

export function displayItemsWithPrices(store, containerId) {
    const itemsContainer = document.getElementById(containerId);
    if (itemsContainer) {
        itemsContainer.innerHTML = ''; // Clear any existing items

        store.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('store-item');

            // Create HTML structure for each item, including the price
            listItem.innerHTML = `
                <div class="store-item-inner">
                    <img src="${item.image}" alt="${item.name}" class="store-item-image">
                    <a href="#" class="store-item-name" data-item-id="${item.id}">${item.name}</a>
                    <p class="store-item-price">$${item.price.toFixed(2)}</p> 
                    <input type="number" value="1" min="1" class="quantity-input">
                    <button class="add-to-cart-btn" data-item-name="${item.name}">Add to Cart</button>
                </div>
            `;
            
            itemsContainer.appendChild(listItem);
        });

        // Add event listener for redirection
        itemsContainer.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('store-item-name')) {
                const itemId = event.target.getAttribute('data-item-id');
                window.location.href = `item-details.html?id=${itemId}`; // Redirect to item-details.html with item ID
            }

            // Handle Add to Cart button
            if (event.target && event.target.classList.contains('add-to-cart-btn')) {
                const itemName = event.target.getAttribute('data-item-name');
                const quantityInput = event.target.closest('.store-item-inner').querySelector('.quantity-input');
                const quantity = parseInt(quantityInput.value, 10);
                store.cart.addToCart(itemName, quantity); // Add item to cart
            }
        });
    }
}



class App {
    constructor() {
        this.user = new User(); // Create an instance of the User class
        this.cart = new Cart(); // Create an instance of the Cart class
        this.store = new Store(this.cart); // Create an instance of the Store class and pass the cart instance
        this.initEventListeners(); // Initialize all the event listeners
        displayItemsWithPrices(this.store, 'items'); // Display items with prices on the main page
    }

    // Function to initialize event listeners for various UI elements
    initEventListeners() {
        document.getElementById('login-btn').addEventListener('click', () => this.showLoginForm());
        document.getElementById('switch-to-signup').addEventListener('click', () => this.showSignupForm());
        document.getElementById('switch-to-login').addEventListener('click', () => this.showLoginForm());
        document.getElementById('login-submit-btn').addEventListener('click', () => {
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();
            const rememberMe = document.getElementById('remember-me').checked; // Get the value of the "Remember me?" checkbox
            this.user.login(username, password, rememberMe); // Trigger login process
        });
        document.getElementById('signup-submit-btn').addEventListener('click', () => {
            const username = document.getElementById('signup-username').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value.trim();
            const confirmPassword = document.getElementById('signup-confirm-password').value.trim();
            this.user.signUp(username, email, password, confirmPassword); // Trigger sign-up process
        });
      
        document.getElementById('cart-btn').addEventListener('click', () => {
            window.location.href = 'cart.html'; // Redirect to cart.html when the Cart button is clicked
        });
        
        document.getElementById('search-input').addEventListener('input', (event) => {
            const searchText = event.target.value;
            this.store.loadItems(searchText); // Filter items based on search input
        });
        document.getElementById('logout-btn').addEventListener('click', () => this.user.logout()); // Add listener for logout
    }

    // Function to show the login form
    showLoginForm() {
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('login-error').style.display = 'none';
    }

    // Function to show the signup form
    showSignupForm() {
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
        document.getElementById('signup-error').style.display = 'none';
    }
}

// Initialize the App when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new App(); // Create a new instance of the App class, which sets up everything
});
