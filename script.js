// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if(hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if(navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
});

// Simple Countdown Timer (Mock implementation for aesthetics)
function updateCountdown() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minsElement = document.getElementById('mins');
    const secsElement = document.getElementById('secs');

    let days = parseInt(daysElement.innerText);
    let hours = parseInt(hoursElement.innerText);
    let mins = parseInt(minsElement.innerText);
    let secs = parseInt(secsElement.innerText);

    secs--;

    if (secs < 0) {
        secs = 59;
        mins--;
        if (mins < 0) {
            mins = 59;
            hours--;
            if (hours < 0) {
                hours = 23;
                days--;
                if (days < 0) {
                    // Reset or stop countdown
                    days = 0; hours = 0; mins = 0; secs = 0;
                }
            }
        }
    }

    daysElement.innerText = days.toString().padStart(2, '0');
    hoursElement.innerText = hours.toString().padStart(2, '0');
    minsElement.innerText = mins.toString().padStart(2, '0');
    secsElement.innerText = secs.toString().padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);

// Cart State
let cartItems = [];
let wishlistItems = [];

// Add to cart interaction
const addToCartBtns = document.querySelectorAll('.add-to-cart');
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Visual feedback
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Added';
        this.style.background = '#4caf50';
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.background = ''; // reset to CSS defined
        }, 2000);

        // Add to Cart Logic
        const card = this.closest('.sweet-card');
        const name = card.querySelector('h3').innerText;
        const priceText = card.querySelector('.price').innerText;
        
        // Extract number from price text (e.g., "₹200 / kg" -> 200)
        const priceVal = parseInt(priceText.replace(/[^0-9]/g, ''));

        cartItems.push({
            id: Date.now(),
            name: name,
            priceText: priceText,
            price: priceVal
        });

        updateCartUI();
    });
});

// Wishlist interaction
const wishlistIcons = document.querySelectorAll('.wishlist-icon');
wishlistIcons.forEach(icon => {
    icon.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const card = this.closest('.sweet-card');
        const name = card.querySelector('h3').innerText;
        const priceText = card.querySelector('.price').innerText;
        const imgSrc = card.querySelector('img').src;

        if (this.classList.contains('active')) {
            this.classList.remove('active');
            this.classList.replace('fas', 'far');
            wishlistItems = wishlistItems.filter(item => item.name !== name);
        } else {
            this.classList.add('active');
            this.classList.replace('far', 'fas');
            wishlistItems.push({
                name: name,
                priceText: priceText,
                imgSrc: imgSrc
            });
        }
        updateWishlistUI();
    });
});

// Order History Data (Dummy Data)
const orderHistory = [
    {
        id: "ORD-9823",
        date: "18 May 2026",
        time: "14:30 PM",
        name: "Alok Kumar",
        number: "+91 7322862141",
        location: "123 Sweet Lane, Food City Kolkata India",
        items: "1x Mixed Sweet Box, 1x Gulab Jamun",
        price: "₹450"
    },
    {
        id: "ORD-9102",
        date: "10 May 2026",
        time: "18:15 PM",
        name: "Alok Kumar",
        number: "+91 7322862141",
        location: "123 Sweet Lane, Food City Kolkata India",
        items: "2x Kaju Katli (500g)",
        price: "₹1600"
    }
];

// Modal Logic
const orderModal = document.getElementById("orderModal");
const myOrderBtn = document.getElementById("myOrderBtn");
const closeModalBtn = document.getElementById("closeModal");
const orderListContainer = document.getElementById("orderList");

// Render Orders
function renderOrders() {
    if (!orderListContainer) return;
    
    orderListContainer.innerHTML = '';
    if (orderHistory.length === 0) {
        orderListContainer.innerHTML = '<p>No past orders found.</p>';
        return;
    }

    orderHistory.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item';
        orderDiv.innerHTML = `
            <div class="order-header">
                <span>Order ID: ${order.id}</span>
                <span>${order.date} | ${order.time}</span>
            </div>
            <div class="order-details">
                <p><strong>Name:</strong> ${order.name}</p>
                <p><strong>Phone:</strong> ${order.number}</p>
                <p><strong>Location:</strong> ${order.location}</p>
                <p><strong>Items:</strong> ${order.items}</p>
            </div>
            <div class="order-price">
                Total: ${order.price}
            </div>
        `;
        orderListContainer.appendChild(orderDiv);
    });
}

// Open Modal
if(myOrderBtn) {
    myOrderBtn.addEventListener('click', () => {
        renderOrders();
        orderModal.classList.add('show');
    });
}

// Close Modal
if(closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        orderModal.classList.remove('show');
    });
}

// Close Modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === orderModal) {
        orderModal.classList.remove('show');
    }
});

// Cart Modal Logic
const mainCartBtn = document.getElementById("mainCartBtn");
const cartModal = document.getElementById("cartModal");
const closeCartModal = document.getElementById("closeCartModal");
const cartList = document.getElementById("cartList");
const billDetails = document.getElementById("billDetails");
const emptyCartTotal = document.getElementById("emptyCartTotal");
const billSubtotal = document.getElementById("billSubtotal");
const billDelivery = document.getElementById("billDelivery");
const billTotal = document.getElementById("billTotal");
const cartBadge = document.getElementById("cartBadge");

function updateCartUI() {
    if(!cartBadge) return;
    cartBadge.innerText = `(${cartItems.length})`;
    
    // Render Cart
    if(cartItems.length === 0) {
        cartList.innerHTML = '<p>Your cart is empty.</p>';
        if(billDetails) billDetails.style.display = 'none';
        if(emptyCartTotal) emptyCartTotal.style.display = 'block';
        return;
    }

    cartList.innerHTML = '';
    let subtotal = 0;
    cartItems.forEach((item, index) => {
        subtotal += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.priceText}</p>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartList.appendChild(div);
    });

    if(billDetails) billDetails.style.display = 'block';
    if(emptyCartTotal) emptyCartTotal.style.display = 'none';
    
    let deliveryFee = 50;
    if(billSubtotal) billSubtotal.innerText = `₹${subtotal}`;
    if(billDelivery) billDelivery.innerText = `₹${deliveryFee}`;
    if(billTotal) billTotal.innerText = `₹${subtotal + deliveryFee}`;
}

// Global function to remove item
window.removeFromCart = function(index) {
    cartItems.splice(index, 1);
    updateCartUI();
};

if(mainCartBtn) {
    mainCartBtn.addEventListener('click', () => {
        updateCartUI();
        cartModal.classList.add('show');
    });
}

if(closeCartModal) {
    closeCartModal.addEventListener('click', () => {
        cartModal.classList.remove('show');
    });
}

window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.classList.remove('show');
    }
});

const checkoutBtn = document.getElementById("checkoutBtn");
const paymentModal = document.getElementById("paymentModal");
const closePaymentModal = document.getElementById("closePaymentModal");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");

if(checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if(cartItems.length > 0) {
            cartModal.classList.remove('show');
            if(paymentModal) paymentModal.classList.add('show');
        } else {
            alert("Please add some sweets to your cart first!");
        }
    });
}

if(closePaymentModal) {
    closePaymentModal.addEventListener('click', () => {
        paymentModal.classList.remove('show');
    });
}

if(confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener('click', () => {
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        const paymentMethod = selectedPayment ? selectedPayment.parentElement.innerText.trim() : "Unknown";
        
        alert(`Order Confirmed successfully!\nPayment Method: ${paymentMethod}\nThank you for choosing Brother Sweets!`);
        
        // Empty cart after successful order
        cartItems = [];
        updateCartUI();
        paymentModal.classList.remove('show');
    });
}

window.addEventListener('click', (event) => {
    if (event.target === orderModal) orderModal.classList.remove('show');
    if (event.target === cartModal) cartModal.classList.remove('show');
    if (event.target === paymentModal) paymentModal.classList.remove('show');
    if (event.target === loginModal) loginModal.classList.remove('show');
    if (typeof wishlistModal !== 'undefined' && event.target === wishlistModal) wishlistModal.classList.remove('show');
    if (typeof chatModal !== 'undefined' && event.target === chatModal) chatModal.classList.remove('show');
});

// Login Modal Logic
const loginBtn = document.querySelector('.login-btn');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginContinueBtn = document.getElementById('loginContinueBtn');
const mobileNumberInput = document.getElementById('mobileNumber');
const userProfile = document.getElementById('userProfile');
const logoutBtn = document.getElementById('logoutBtn');

if(loginBtn && loginModal) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent navigating to #login
        loginModal.classList.add('show');
        if(mobileNumberInput) mobileNumberInput.focus();
    });
}

if(closeLoginModal) {
    closeLoginModal.addEventListener('click', () => {
        loginModal.classList.remove('show');
    });
}

if(loginContinueBtn) {
    loginContinueBtn.addEventListener('click', () => {
        const number = mobileNumberInput ? mobileNumberInput.value : '';
        if(number.length === 10 && !isNaN(number)) {
            alert('Login successfully');
            loginModal.classList.remove('show');
            // Hide login button, show user profile
            if(loginBtn) loginBtn.style.display = 'none';
            if(userProfile) userProfile.style.display = 'flex';
        } else {
            alert('Please enter a valid 10-digit mobile number.');
        }
    });
}

if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        alert('Logged out successfully!');
        if(userProfile) userProfile.style.display = 'none';
        if(loginBtn) loginBtn.style.display = 'inline-block';
        if(mobileNumberInput) mobileNumberInput.value = '';
    });
}

// Dropdown Menu Features Logic
const wishlistBtn = document.getElementById("wishlistBtn");
const helpBtn = document.getElementById("helpBtn");
const darkModeToggle = document.getElementById("darkModeToggle");
const notificationToggle = document.getElementById("notificationToggle");

const wishlistModal = document.getElementById("wishlistModal");
const closeWishlistModal = document.getElementById("closeWishlistModal");
const wishlistList = document.getElementById("wishlistList");
const emptyWishlistText = document.getElementById("emptyWishlistText");

function updateWishlistUI() {
    if(!wishlistList) return;
    
    if(wishlistItems.length === 0) {
        wishlistList.innerHTML = '';
        if(emptyWishlistText) emptyWishlistText.style.display = 'block';
        return;
    }

    wishlistList.innerHTML = '';
    wishlistItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div style="display: flex; gap: 15px; align-items: center;">
                <img src="${item.imgSrc}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
                <div class="cart-item-info">
                    <h4 style="margin: 0; font-size: 1rem;">${item.name}</h4>
                    <p style="margin: 0; color: var(--primary-color);">${item.priceText}</p>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromWishlist(${index})">Remove</button>
        `;
        wishlistList.appendChild(div);
    });

    if(emptyWishlistText) emptyWishlistText.style.display = 'none';
}

window.removeFromWishlist = function(index) {
    const itemToRemove = wishlistItems[index];
    wishlistItems.splice(index, 1);
    
    const cards = document.querySelectorAll('.sweet-card');
    cards.forEach(card => {
        if(card.querySelector('h3').innerText === itemToRemove.name) {
            const icon = card.querySelector('.wishlist-icon');
            if(icon) {
                icon.classList.remove('active');
                icon.classList.replace('fas', 'far');
            }
        }
    });
    
    updateWishlistUI();
};

if(wishlistBtn && wishlistModal) {
    wishlistBtn.addEventListener('click', () => {
        updateWishlistUI();
        wishlistModal.classList.add('show');
    });
}

if(closeWishlistModal) {
    closeWishlistModal.addEventListener('click', () => {
        wishlistModal.classList.remove('show');
    });
}

if(wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
        alert("Your Wishlist is currently empty. Start adding some sweet treats!");
    });
}

const chatModal = document.getElementById("chatModal");
const closeChatModal = document.getElementById("closeChatModal");
const sendChatBtn = document.getElementById("sendChatBtn");
const chatInput = document.getElementById("chatInput");
const chatBox = document.getElementById("chatBox");

if(helpBtn && chatModal) {
    helpBtn.addEventListener('click', () => {
        chatModal.classList.add('show');
    });
}

if(closeChatModal) {
    closeChatModal.addEventListener('click', () => {
        chatModal.classList.remove('show');
    });
}

if(sendChatBtn && chatInput && chatBox) {
    sendChatBtn.addEventListener('click', () => {
        const msg = chatInput.value.trim();
        if(msg) {
            const userDiv = document.createElement('div');
            userDiv.style.cssText = "align-self: flex-end; background: var(--primary-color); color: white; padding: 10px 15px; border-radius: 15px; border-bottom-right-radius: 0; box-shadow: var(--shadow-light); max-width: 80%;";
            userDiv.innerHTML = `<p style="margin: 0; font-size: 0.95rem;">${msg}</p>`;
            chatBox.appendChild(userDiv);
            chatInput.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;
            
            setTimeout(() => {
                const botDiv = document.createElement('div');
                botDiv.style.cssText = "align-self: flex-start; background: white; padding: 10px 15px; border-radius: 15px; border-bottom-left-radius: 0; box-shadow: var(--shadow-light); max-width: 80%;";
                botDiv.innerHTML = `<p style="margin: 0; font-size: 0.95rem; color: #333;">Thanks for reaching out! A support agent will reply to you shortly.</p>`;
                chatBox.appendChild(botDiv);
                chatBox.scrollTop = chatBox.scrollHeight;
            }, 1000);
        }
    });
    
    chatInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') sendChatBtn.click();
    });
}

if(darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
        if(e.target.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
}

if(notificationToggle) {
    notificationToggle.addEventListener('change', (e) => {
        if(e.target.checked) {
            alert("Notifications turned ON.");
        } else {
            alert("Notifications turned OFF.");
        }
    });
}
