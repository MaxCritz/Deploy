export class User {
    constructor() {
        this.loggedInUser = null; // Stores the current logged-in user's username
        this.checkForLoggedInUser(); // Check if a user is already logged in via cookies
        this.initAuthEventListeners();
    }

    initAuthEventListeners() {
        const loginBtn = this.getElementByIdWithLog('login-btn');
        const logoutBtn = this.getElementByIdWithLog('logout-btn');
        const switchToSignupBtn = this.getElementByIdWithLog('switch-to-signup');
        const switchToLoginBtn = this.getElementByIdWithLog('switch-to-login');
        const loginSubmitBtn = this.getElementByIdWithLog('login-submit-btn');
        const signupSubmitBtn = this.getElementByIdWithLog('signup-submit-btn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                const authSection = this.getElementByIdWithLog('auth-section');
                const loginForm = this.getElementByIdWithLog('login-form');
                const signupForm = this.getElementByIdWithLog('signup-form');
                if (authSection) authSection.style.display = 'block';
                if (loginForm) loginForm.style.display = 'block';
                if (signupForm) signupForm.style.display = 'none';
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        if (switchToSignupBtn) {
            switchToSignupBtn.addEventListener('click', () => {
                const loginForm = this.getElementByIdWithLog('login-form');
                const signupForm = this.getElementByIdWithLog('signup-form');
                if (loginForm) loginForm.style.display = 'none';
                if (signupForm) signupForm.style.display = 'block';
            });
        }

        if (switchToLoginBtn) {
            switchToLoginBtn.addEventListener('click', () => {
                const signupForm = this.getElementByIdWithLog('signup-form');
                const loginForm = this.getElementByIdWithLog('login-form');
                if (signupForm) signupForm.style.display = 'none';
                if (loginForm) loginForm.style.display = 'block';
            });
        }

        if (loginSubmitBtn) {
            loginSubmitBtn.addEventListener('click', () => {
                const username = this.getElementByIdWithLog('login-username')?.value;
                const password = this.getElementByIdWithLog('login-password')?.value;
                const rememberMe = this.getElementByIdWithLog('login-remember-me')?.checked;
                this.login(username, password, rememberMe);
            });
        }

        if (signupSubmitBtn) {
            signupSubmitBtn.addEventListener('click', () => {
                const username = this.getElementByIdWithLog('signup-username')?.value;
                const email = this.getElementByIdWithLog('signup-email')?.value;
                const password = this.getElementByIdWithLog('signup-password')?.value;
                const confirmPassword = this.getElementByIdWithLog('signup-confirm-password')?.value;
                this.signUp(username, email, password, confirmPassword);
            });
        }
    }

    // Function to log in the user
    login(username, password, rememberMe) {
        if (!username || !password) {
            this.displayError('Both username and password are required.');
            return;
        }

        this.loggedInUser = username; // Set the logged-in user
        const expiryDate = new Date();
        if (rememberMe) {
            expiryDate.setDate(expiryDate.getDate() + 365); // Set cookie to expire in 1 year
        } else {
            expiryDate.setDate(expiryDate.getDate() + 7); // Set cookie to expire in 7 days
        }

        document.cookie = `username=${username}; expires=${expiryDate.toUTCString()}; path=/`; // Save the username in cookies

        this.updateUIOnLogin(); // Update the UI after a successful login
    }

    // Function to log out the user
    logout() {
        this.loggedInUser = null; // Clear the logged-in user
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Delete the cookie

        this.updateUIOnLogout(); // Update the UI after logout
    }

    // Function to check if a user is already logged in (using cookies)
    checkForLoggedInUser() {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});

        if (cookies.username) {
            this.loggedInUser = cookies.username;

            // Automatically renew the cookie's expiration date
            const expiryDate = new Date();
            const rememberMe = true; // Assuming we always renew for 1 year if user is logged in

            if (rememberMe) {
                expiryDate.setDate(expiryDate.getDate() + 365); // Renew for another year
            } else {
                expiryDate.setDate(expiryDate.getDate() + 7); // Renew for another 7 days
            }

            document.cookie = `username=${this.loggedInUser}; expires=${expiryDate.toUTCString()}; path=/`;

            this.updateUIOnLogin(true); // Update the UI for returning users
        }
    }

    // Function to display an error message
    displayError(message) {
        const errorElement = this.getElementByIdWithLog('login-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // Function to update the UI after login
    updateUIOnLogin(isReturningUser = false) {
        console.log('Updating UI on login');
        const authSection = this.getElementByIdWithLog('auth-section');
        const loginBtn = this.getElementByIdWithLog('login-btn');
        const welcomeMessage = this.getElementByIdWithLog('welcome-message');
        const userInfo = this.getElementByIdWithLog('user-info');
        const logoutBtn = this.getElementByIdWithLog('logout-btn');

        if (authSection) authSection.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'none';
        if (welcomeMessage) {
            welcomeMessage.textContent = isReturningUser 
                ? `Welcome back, ${this.loggedInUser}!` 
                : `Welcome, ${this.loggedInUser}!`;
            welcomeMessage.style.display = 'block';
        }
        if (userInfo) userInfo.style.display = 'block'; // Show the user-info section
        if (logoutBtn) logoutBtn.style.display = 'block'; // Show the logout button
    }

    // Function to update the UI after logout
    updateUIOnLogout() {
        const authSection = this.getElementByIdWithLog('auth-section');
        const loginBtn = this.getElementByIdWithLog('login-btn');
        const welcomeMessage = this.getElementByIdWithLog('welcome-message');
        const logoutBtn = this.getElementByIdWithLog('logout-btn');

        if (authSection) authSection.style.display = 'block';
        if (loginBtn) loginBtn.style.display = 'block';
        if (welcomeMessage) welcomeMessage.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none'; // Hide logout button
    }

    // Function to sign up the user
    signUp(username, email, password, confirmPassword) {
        if (!username || !email || !password || !confirmPassword) {
            alert("All fields are required.");
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Password does not match");
            return;
        }

        // Email validation logic
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email address. Only Gmail, Yahoo, and Outlook are allowed.");
            return;
        }

        // Password validation logic
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            alert("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return;
        }

        // Proceed with the sign-up logic
        alert("Email verification sent");

        // Reset sign-up form fields
        this.getElementByIdWithLog('signup-username').value = '';
        this.getElementByIdWithLog('signup-email').value = '';
        this.getElementByIdWithLog('signup-password').value = '';
        this.getElementByIdWithLog('signup-confirm-password').value = '';

        // Display the login form and hide the signup form
        const loginForm = this.getElementByIdWithLog('login-form');
        const signupForm = this.getElementByIdWithLog('signup-form');
        const authSection = this.getElementByIdWithLog('auth-section');
        if (loginForm) loginForm.style.display = 'block';
        if (signupForm) signupForm.style.display = 'none';
        if (authSection) authSection.style.display = 'block';
    }

    getElementByIdWithLog(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id "${id}" is missing or blocked.`);
        }
        return element;
    }
}


export class Cart {
    constructor(store) {  // Accept store in the constructor
        this.store = store;  // Save store reference
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.cleanInvalidItems();  // Clean invalid items upon initialization
        this.updateCartCount();
        this.updateCartPreview();
    }

    addToCart(itemName, quantity) {
        if (!itemName || itemName === 'null') {
            console.warn('Invalid item name. Item not added to cart.');
            return;
        }

        const existingItem = this.cartItems.find(cartItem => cartItem.name === itemName);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cartItems.push({ name: itemName, quantity });
        }

        this.cleanInvalidItems();  // Clean invalid items after adding
        this.updateCartCount();
        this.saveCart();
        this.updateCartPreview();
        alert(`${itemName} added to cart.`);
    }

    removeFromCart(itemName) {
        const itemIndex = this.cartItems.findIndex(cartItem => cartItem.name === itemName);
        if (itemIndex !== -1) {
            const item = this.cartItems[itemIndex];
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                this.cartItems.splice(itemIndex, 1);
                alert(`${itemName} removed from cart.`);
            }
            this.updateCartCount();
            this.saveCart();
            this.updateCartPreview();
        }
    }

    updateCartCount() {
        const cartBtn = this.getElementByIdWithLog('cart-btn');
        if (cartBtn) {
            const cartCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
            cartBtn.textContent = `Cart (${cartCount})`;
        }
    }

    updateCartPreview() {
        const cartPreviewContainer = this.getElementByIdWithLog('cart-preview');
        if (cartPreviewContainer) {
            cartPreviewContainer.innerHTML = '';

            if (this.cartItems.length === 0) {
                cartPreviewContainer.innerHTML = '<p>Your cart is empty.</p>';
            } else {
                const previewItemsList = this.cartItems.map(item => 
                    `<div class="cart-preview-item">
                        <span>${item.name} (x${item.quantity})</span>
                    </div>`
                ).join('');
                cartPreviewContainer.innerHTML = previewItemsList;
            }
        }
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    checkout() {
        if (this.cartItems.length === 0) {
            alert('Your cart is empty.');
        } else {
            this.saveCart();
            window.location.href = 'checkout.html';
        }
    }

    getItems() {
        return this.cartItems;
    }    

    updateCartPage() {
        const cartItemsList = this.getElementByIdWithLog('cart-items-list');
        if (cartItemsList) {
            cartItemsList.innerHTML = '';
    
            if (this.cartItems.length === 0) {
                cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
            } else {
                this.cartItems.forEach(item => {
                    const storeItem = this.getStoreItem(item.name);
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
                        this.removeFromCart(itemName);
                        this.updateCartPage();
                    });
                });
            }
        }
    }

    getStoreItem(itemName) {
        return this.store.items.find(storeItem => storeItem.name === itemName);
    }

    cleanInvalidItems() {
        this.cartItems = this.cartItems.filter(item => item.name && item.name !== 'null');
        this.saveCart();  // Save the cleaned cart
    }

    getElementByIdWithLog(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id "${id}" is missing or blocked.`);
        }
        return element;
    }

    calculateTotalPrice() {
        return this.cartItems.reduce((total, item) => {
            const storeItem = this.getStoreItem(item.name);
            if (storeItem && storeItem.price) {
                return total + (storeItem.price * item.quantity);
            }
            return total;
        }, 0);
    }
}


// core-functions.js

export class Store {
    constructor(cart) {
        this.items = [
            { id: '1', name: 'Gacha', image: 'https://tinyurl.com/mr4r7eux', price: 10.99 },
            { id: '2', name: 'Cards', image: 'https://tinyurl.com/53a5ek42', price: 5.49 },
            { id: '3', name: '5*', image: 'https://tinyurl.com/2s39hxwa', price: 12.99 },
            { id: '4', name: 'Collections', image: 'https://tinyurl.com/yzjb2asx', price: 42.99 }
        ];
        this.cart = cart;
        this.loadItems();
    }

    /**
     * Loads and displays items in the DOM.
     * @param {string} filterText - Text to filter items by name.
     */
    loadItems(filterText = '') {
        try {
            const itemsContainer = this.getElementByIdWithLog('items');
            if (itemsContainer) {
                itemsContainer.innerHTML = '';  // Clear previous items to avoid duplication
    
                const filteredItems = this.items.filter(item => 
                    item.name.toLowerCase().includes(filterText.toLowerCase())
                );
    
                filteredItems.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('store-item');
                    listItem.innerHTML = `
                        <div class="store-item-inner">
                            <img src="${item.image}" alt="${item.name}" class="store-item-image">
                            <a href="item-details.html?id=${item.id}" class="store-item-name">${item.name}</a>
                            <input type="number" value="1" min="1" class="quantity-input">
                            <button class="add-to-cart-btn">Add to Cart</button>
                        </div>
                    `;
                    
                    listItem.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                        const quantity = parseInt(listItem.querySelector('.quantity-input').value, 10);
                        this.cart.addToCart(item.name, quantity);
                    });
                
                    itemsContainer.appendChild(listItem);
                });
                
            }
        } catch (error) {
            console.error('Error loading items:', error);
        }
    }
    

    /**
     * Retrieves an element by its ID and logs a warning if not found.
     * @param {string} id - The ID of the element.
     * @returns {HTMLElement|null} The DOM element or null if not found.
     */
    getElementByIdWithLog(id) {
        try {
            const element = document.getElementById(id);
            if (!element) {
                console.warn(`Element with id "${id}" is missing or blocked.`);
            }
            return element;
        } catch (error) {
            console.error(`Error retrieving element with id "${id}":`, error);
            return null;
        }
    }

    /**
     * Retrieves all items in the store.
     * @returns {Array} Array of all items.
     */
    getItems() {
        try {
            return this.items;
        } catch (error) {
            console.error('Error retrieving items:', error);
            return [];
        }
    }

    /**
     * Retrieves a single item by its ID.
     * @param {string} id - The ID of the item.
     * @returns {Object|null} The item object or null if not found.
     */
    getItemById(id) {
        try {
            const item = this.items.find(item => item.id === id);
            if (!item) {
                console.warn(`Item with id "${id}" not found.`);
                return null;
            }
            return item;
        } catch (error) {
            console.error('Error retrieving item by ID:', error);
            return null;
        }
    }
}


export class GlobalEventListeners {
    constructor(cart, user, store) {
        this.store = store;
        this.cart = cart;
        this.user = user;
        this.initGlobalEventListeners();
    }

    // Any global event listeners section
    initGlobalEventListeners() {
        // Checkout Button Event Listener
        const checkoutBtn = this.getElementByIdWithLog('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                window.location.href = 'checkout.html';
            });
        }
        
        const backBtn = this.getElementByIdWithLog('back-to-items-button');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'Shopping website.html';
            });
        }
        
    }
    
    getElementByIdWithLog(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id "${id}" is missing or blocked.`);
        }
        return element;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.globalCartInstance) {
        window.globalCartInstance = new Cart();
    }
    if (!window.globalStoreInstance) {
        window.globalStoreInstance = new Store(window.globalCartInstance);
    }
    const user = new User();
    // Initialize global event listeners with global instances
    new GlobalEventListeners(window.globalCartInstance, user, window.globalStoreInstance);
});
