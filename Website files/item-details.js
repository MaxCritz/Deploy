import { Store, Cart, User } from './core functions.js'; 

// Initialize cart, store, and user
const cart = new Cart();
const store = new Store(cart);
const user = new User(); // User class to handle login/logout

// Make the store and user globally accessible
window.globalStoreInstance = store;
window.globalUserInstance = user;

// ItemDetail class definition
class ItemDetail {
    constructor() {
        this.items = [
            { id: '1', name: 'Gacha', image: 'https://tinyurl.com/mr4r7eux', price: 10.99, averageRating: 0 },
            { id: '2', name: 'Cards', image: 'https://tinyurl.com/53a5ek42', price: 5.49, averageRating: 0 },
            { id: '3', name: 'Five Stars', image: 'https://tinyurl.com/2s39hxwa', price: 12.99, averageRating: 0 },
            { id: '4', name: 'Collections', image: 'https://tinyurl.com/yzjb2asx', price: 42.99, averageRating: 0 }
        ];

        this.reviews = {
            '1': [
                { username: 'User1', comment: 'Great item!', rating: 5 },
                { username: 'User2', comment: 'Loved it!', rating: 4 }
            ],
            '2': [
                { username: 'User3', comment: 'Good quality.', rating: 4 },
                { username: 'User4', comment: 'Very satisfied.', rating: 5 }
            ],
            '3': [
                { username: 'yummy', comment: 'Hmmmmmmm', rating: 4 },
                { username: 'mariokek', comment: 'Win 50/50.', rating: 5 }
            ],
            '4': [
                { username: 'RealGamer', comment: 'Could be better.', rating: 3 },
                { username: 'NotBot', comment: 'Satisfied.', rating: 4 },
                { username: 'scriptedMonkey', comment: 'Uhhmmm.', rating: 3 }
            ]
        };
    }

    // Method to retrieve an item by its ID
    getItemById(id) {
        return this.items.find(item => item.id === id);
    }

    // Method to retrieve reviews by item ID
    getReviewsById(id) {
        return this.reviews[id] || [];
    }

    // Method to add a review to an item
    addReview(itemId, review) {
        if (!this.reviews[itemId]) {
            this.reviews[itemId] = [];
        }
        this.reviews[itemId].push(review);
        // Optionally, update the average rating after adding a review
    }

    // Method to load and display item details
    loadItemDetails(itemId) {
        const item = this.getItemById(itemId);

        if (!item) {
            console.error('Item not found.');
            return;
        }

        // Populate item details in the DOM
        document.getElementById('item-name').textContent = item.name;
        document.getElementById('item-price').textContent = `Price: $${item.price.toFixed(2)}`;
        document.getElementById('item-image').src = item.image;
        document.getElementById('item-image').alt = item.name;
        document.getElementById('item-description').textContent = getItemDescription(itemId);

        // Add to cart functionality
        document.getElementById('add-to-cart-button').addEventListener('click', () => {
            cart.addItem(item); // Adds the item to the cart
            alert(`${item.name} has been added to your cart.`);
        });

        // Load and display reviews
        this.loadReviews(itemId);
    }

    // Method to load and display reviews
    loadReviews(itemId) {
        const reviewsContainer = document.getElementById('reviews-list');
        reviewsContainer.innerHTML = ''; // Clear existing reviews

        const reviews = this.getReviewsById(itemId);

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>No reviews yet.</p>';
            return;
        }

        reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.classList.add('review');
            reviewDiv.innerHTML = `
                <strong>${review.username}</strong>
                <p>${review.comment}</p>
            `;
            reviewsContainer.appendChild(reviewDiv);
        });
    }

    // Method to handle adding a new review with login check
    handleAddReview(itemId) {
        const submitBtn = document.getElementById('submit-review-button');
        const reviewText = document.getElementById('review-text');

        submitBtn.addEventListener('click', () => {
            if (!user.loggedInUser) {
                alert('You must be logged in to submit a review.');
                return;
            }

            const comment = reviewText.value.trim();
            if (comment === '') {
                alert('Please enter a review.');
                return;
            }

            const review = {
                username: user.loggedInUser, // Use the logged-in user's name
                comment,
                rating: 5 // Default rating, can be made dynamic
            };

            this.addReview(itemId, review); // Add the review to the reviews list
            this.loadReviews(itemId); // Reload reviews to display the new one
            reviewText.value = ''; // Clear the review textarea
        });
    }
}

// Function to retrieve query parameters from the URL
function getQueryParams() {
    return new URLSearchParams(window.location.search);
}

// Function to get a mock description for an item
function getItemDescription(itemId) {
    const descriptions = {
        '1': 'Gacha is a fun and addictive game mechanic...',
        '2': 'Cards are essential for building your deck...',
        '3': '5* items are rare and highly sought after...',
        '4': 'Collections allow you to gather and showcase your achievements...'
    };
    return descriptions[itemId] || 'No description available for this item.';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const itemDetail = new ItemDetail();
    const params = getQueryParams();
    const itemId = params.get('id'); // Get the 'id' from the URL

    if (itemId) {
        itemDetail.loadItemDetails(itemId);
        itemDetail.handleAddReview(itemId);
    } else {
        console.error('Item ID not found in the URL.');
    }
});

document.getElementById('cart-btn').addEventListener('click', () => {
    window.location.href = 'cart.html'; // Redirect to cart.html when the Cart button is clicked
});