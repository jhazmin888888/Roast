// Helper function for currency formatting (Philippine Peso)
const formatCurrency = (amount) => {
    return `₱ ${parseFloat(amount).toFixed(2)}`;
};

// --- Mobile Navigation ---
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (!burger || !nav) return; // Exit if elements are not found

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        burger.classList.toggle('toggle');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) { // Only close if nav is open
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(item => {
                    item.style.animation = '';
                });
            }
        });
    });
};

// --- Navigation Active Class (for single-page sections) ---
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('.nav-links li a'); // All nav links

const updateActiveNavLink = () => {
    let current = '';
    // Only apply active class logic for the homepage (index.html) sections
    if (document.body.classList.contains('homepage')) { // Add 'homepage' class to body of index.html
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
    } else if (document.body.classList.contains('shop-page')) { // For shop.html
        current = 'shop'; // Manually set 'shop' as active
    } else if (document.body.classList.contains('checkout-page')) { // For checkout.html
        current = 'checkout'; // Manually set 'checkout' as active
    }

    navLi.forEach(a => {
        a.classList.remove('active');
        // Check if the link href contains the current section ID or the specific page identifier
        if (a.href.includes(current) || (a.href.includes('shop.html') && current === 'shop') || (a.href.includes('checkout.html') && current === 'checkout')) {
            a.classList.add('active');
        }
    });
};

// Add classes to body for page identification (Add these to your HTML <body> tags)
// On index.html: <body class="homepage">
// On shop.html: <body class="shop-page">
// On checkout.html: <body class="checkout-page">


// --- Sign In/Up Modal Functionality ---
const signinModal = document.getElementById('signin-modal');
const closeBtns = document.querySelectorAll('.modal .close-btn'); // Get all close buttons
const signinForm = signinModal ? signinModal.querySelector('.signin-form') : null;
const signupForm = signinModal ? signinModal.querySelector('.signup-form') : null;
const signupLink = signinModal ? document.getElementById('signup-link') : null;
const signinLink = signinModal ? document.getElementById('signin-link') : null;

// NEW: Store user info (email)
let userIsSignedIn = localStorage.getItem('userSignedIn') === 'true'; // Check initial state
let signedInUserEmail = localStorage.getItem('signedInUserEmail') || ''; // Store email

function updateSignInButton() {
    const signinButtonContainer = document.querySelector('.auth-links');
    if (!signinButtonContainer) return;

    if (userIsSignedIn) {
        signinButtonContainer.innerHTML = `
            <a href="#" id="signed-in-user-link"><i class="fas fa-user"></i> ${signedInUserEmail.split('@')[0]}</a>
            <a href="#" id="signout-btn" class="signout-btn"><i class="fas fa-sign-out-alt"></i> Sign Out</a>
        `;
        // Add event listener for sign out
        document.getElementById('signout-btn')?.addEventListener('click', signOutUser);
    } else {
        signinButtonContainer.innerHTML = `
            <a href="#" id="signin-btn-all"><i class="fas fa-user"></i> Sign In/Up</a>
        `;
        // Add event listener for sign in/up
        document.getElementById('signin-btn-all')?.addEventListener('click', openSignInModal);
    }
}

function openSignInModal(e) {
    e.preventDefault();
    if (signinModal) {
        signinModal.classList.add('active');
        if (signinForm) signinForm.style.display = 'block';
        if (signupForm) signupForm.style.display = 'none';
    }
}

// NEW: Sign Out function
function signOutUser(e) {
    e.preventDefault();
    userIsSignedIn = false;
    signedInUserEmail = '';
    localStorage.removeItem('userSignedIn');
    localStorage.removeItem('signedInUserEmail');
    localStorage.removeItem('breweryCart'); // Clear cart on sign out for security/privacy
    cart = []; // Reset cart array
    updateCartCount();
    updateSignInButton(); // Update UI
    if (document.body.classList.contains('checkout-page')) {
        updateCartDisplay(); // Re-render cart on checkout if signed out
    }
    alert('You have been signed out.');
    // Optionally redirect to homepage or refresh
    // window.location.href = 'index.html';
}


// Attach close functionality to all close buttons
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').classList.remove('active');
    });
});


if (signinModal) {
    window.addEventListener('click', (e) => {
        if (e.target == signinModal) {
            signinModal.classList.remove('active');
        }
    });
}

if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (signinForm) signinForm.style.display = 'none';
        if (signupForm) signupForm.style.display = 'block';
    });
}

if (signinLink) {
    signinLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (signupForm) signupForm.style.display = 'none';
        if (signinForm) signinForm.style.display = 'block';
    });
}

if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value;
        // In a real app, you'd send username/password to a backend
        // For simulation, just store the username as email
        signedInUserEmail = usernameInput; // Assuming username is email for display
        alert(`Signed In as ${signedInUserEmail.split('@')[0]} (Frontend simulated) - Backend needed for actual login.`);
        userIsSignedIn = true;
        localStorage.setItem('userSignedIn', 'true'); // Persist sign-in state
        localStorage.setItem('signedInUserEmail', signedInUserEmail); // Persist email
        updateSignInButton();
        signinModal.classList.remove('active');
        // If on checkout page, ensure cart buttons are enabled or reviewed
        if (document.body.classList.contains('checkout-page')) {
            updateCartDisplay(); // Re-render cart if quantities were restricted
        }
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUsernameInput = document.getElementById('new-username').value;
        const newPasswordInput = document.getElementById('new-password').value;
        const confirmPasswordInput = document.getElementById('confirm-password').value;

        if (newPasswordInput !== confirmPasswordInput) {
            alert('Passwords do not match!');
            return;
        }

        // In a real app, you'd send newUsernameInput/newPasswordInput to a backend
        // For simulation, just store the username as email
        signedInUserEmail = newUsernameInput; // Assuming username is email for display
        alert(`Signed Up and In as ${signedInUserEmail.split('@')[0]} (Frontend simulated) - Backend needed for actual registration.`);
        userIsSignedIn = true; // Assume successful signup means signed in
        localStorage.setItem('userSignedIn', 'true');
        localStorage.setItem('signedInUserEmail', signedInUserEmail); // Persist email
        updateSignInButton();
        signinModal.classList.remove('active');
        if (document.body.classList.contains('checkout-page')) {
            updateCartDisplay();
        }
    });
}

// --- Cart Functionality (using localStorage for persistence) ---
let cart = JSON.parse(localStorage.getItem('breweryCart')) || []; // Load cart from local storage

function saveCart() {
    localStorage.setItem('breweryCart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('[id^="cart-count"]').forEach(span => {
        span.textContent = totalItems;
    });
}

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartSubtotalSpan = document.getElementById('cart-subtotal');
    const cartShippingSpan = document.getElementById('cart-shipping');
    const cartTotalSpan = document.getElementById('cart-total');
    const proceedToPaymentBtn = document.getElementById('proceed-to-payment-btn');


    if (!cartItemsDiv) return; // Only run if on checkout page

    cartItemsDiv.innerHTML = ''; // Clear current cart display
    let subtotal = 0;
    const shippingCost = 50.00; // Fixed shipping cost

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        if (cartSubtotalSpan) cartSubtotalSpan.textContent = formatCurrency(0);
        if (cartShippingSpan) cartShippingSpan.textContent = formatCurrency(0); // No shipping if cart is empty
        if (cartTotalSpan) cartTotalSpan.textContent = formatCurrency(0);
        if (proceedToPaymentBtn) proceedToPaymentBtn.disabled = true; // Disable if cart is empty
        updateCartCount();
        return;
    }

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.img}" alt="${item.name}" loading="lazy">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>${formatCurrency(item.price)} x ${item.quantity}</span>
                </div>
            </div>
            <div class="cart-item-actions">
                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
                <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        cartItemsDiv.appendChild(itemElement);
        subtotal += item.price * item.quantity;
    });

    const total = subtotal + shippingCost;

    if (cartSubtotalSpan) cartSubtotalSpan.textContent = formatCurrency(subtotal);
    if (cartShippingSpan) cartShippingSpan.textContent = formatCurrency(shippingCost);
    if (cartTotalSpan) cartTotalSpan.textContent = formatCurrency(total);
    if (proceedToPaymentBtn) proceedToPaymentBtn.disabled = false; // Enable if cart has items
    updateCartCount();

    // Add event listeners for quantity changes and remove buttons
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const itemId = parseInt(e.target.dataset.id);
            const newQuantity = parseInt(e.target.value);
            const item = cart.find(i => i.id === itemId);
            if (item && newQuantity > 0) {
                item.quantity = newQuantity;
            } else if (newQuantity <= 0) {
                cart = cart.filter(i => i.id !== itemId);
            }
            saveCart();
            updateCartDisplay(); // Re-render cart and update totals
        });
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.currentTarget.dataset.id);
            cart = cart.filter(item => item.id !== itemId);
            saveCart();
            updateCartDisplay();
        });
    });
}

// Add to Cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (!userIsSignedIn) {
            alert('Please sign in or sign up to add items to your cart.');
            // Find the appropriate sign-in button for the current page
            // This now targets the unified ID 'signin-btn-all'
            const currentSigninBtn = document.getElementById('signin-btn-all');
            if (currentSigninBtn) {
                currentSigninBtn.click(); // Programmatically click the sign-in button
            }
            return;
        }

        const itemName = e.target.dataset.name;
        const itemPrice = parseFloat(e.target.dataset.price);
        const itemImg = e.target.dataset.img;
        const itemId = Date.now(); // Simple unique ID

        const existingItem = cart.find(item => item.name === itemName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: itemId, name: itemName, price: itemPrice, img: itemImg, quantity: 1 });
        }
        saveCart();
        updateCartCount(); // Only update count, full display only on checkout page
        alert(`${itemName} added to cart!`);
    });
});

// --- Payment Modal Logic ---
const paymentModal = document.getElementById('payment-modal');
const proceedToPaymentBtn = document.getElementById('proceed-to-payment-btn');
const paymentForm = document.getElementById('payment-form');
const modalOrderTotalSpan = document.getElementById('modal-order-total');
const orderConfirmationMessage = document.querySelector('.order-confirmation-message');
const downloadReceiptBtn = document.getElementById('download-receipt-btn');

if (proceedToPaymentBtn) {
    proceedToPaymentBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!userIsSignedIn) {
            alert('Please sign in or sign up before proceeding to payment.');
            const currentSigninBtn = document.getElementById('signin-btn-all');
            if (currentSigninBtn) {
                currentSigninBtn.click();
            }
            return;
        }
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before proceeding to payment.');
            return;
        }

        // Calculate total for the payment modal
        let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingCost = 50.00;
        const total = subtotal + shippingCost;
        if (modalOrderTotalSpan) modalOrderTotalSpan.textContent = formatCurrency(total);

        // Store cart items temporarily for receipt generation before clearing
        localStorage.setItem('lastOrderItemsForReceipt', JSON.stringify(cart));

        // Show the payment modal
        if (paymentModal) paymentModal.classList.add('active');
        if (paymentForm) paymentForm.style.display = 'flex'; // Show the form
        if (orderConfirmationMessage) orderConfirmationMessage.style.display = 'none'; // Hide confirmation message
    });
}

if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic form validation (ensure all required fields are filled)
        const requiredInputs = paymentForm.querySelectorAll('[required]');
        let allFieldsFilled = true;
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                allFieldsFilled = false;
                input.style.borderColor = 'red'; // Highlight empty fields
            } else {
                input.style.borderColor = ''; // Reset border color
            }
        });

        // Validate radio buttons for payment method
        const paymentMethodSelected = paymentForm.querySelector('input[name="payment-method"]:checked');
        if (!paymentMethodSelected) {
            allFieldsFilled = false;
            alert('Please select a payment method.');
        }

        if (!allFieldsFilled) {
            alert('Please fill in all required shipping information and select a payment method.');
            return;
        }

        // Simulate order confirmation
        alert('Order Confirmed! (Frontend simulated)');
        // In a real application, you'd send this data to a backend for processing payment and order fulfillment.

        // After successful "order placement":
        if (paymentForm) paymentForm.style.display = 'none'; // Hide the form
        if (orderConfirmationMessage) orderConfirmationMessage.style.display = 'block'; // Show confirmation message and receipt button

        // Clear the cart after a successful order (optional, depends on UX)
        cart = [];
        saveCart();
        updateCartCount();
        if (document.body.classList.contains('checkout-page')) {
            updateCartDisplay(); // Update cart on checkout page to show it's empty
        }
    });
}

if (downloadReceiptBtn) {
    downloadReceiptBtn.addEventListener('click', () => {
        // Simulate receipt generation and download
        // Recalculate totals for receipt as cart might be cleared
        let subtotal = 0;
        let shippingCost = 0;
        
        // Retrieve stored order details for the receipt
        const itemsForReceipt = JSON.parse(localStorage.getItem('lastOrderItemsForReceipt')) || [];
        // Only clear this after receipt download if you want it to be a one-time download
        // localStorage.removeItem('lastOrderItemsForReceipt'); // Clear after use if desired

        // Calculate totals from itemsForReceipt if available, otherwise from existing spans (which might be 0 if cart was cleared)
        if (itemsForReceipt.length > 0) {
            subtotal = itemsForReceipt.reduce((sum, item) => sum + item.price * item.quantity, 0);
            shippingCost = 50.00; // Assuming fixed shipping
        } else {
            // Fallback if somehow itemsForReceipt is empty, use current span values (which will be 0 if cart cleared)
            subtotal = parseFloat(document.getElementById('cart-subtotal')?.textContent.replace('₱ ', '') || '0');
            shippingCost = parseFloat(document.getElementById('cart-shipping')?.textContent.replace('₱ ', '') || '0');
        }
        const total = subtotal + shippingCost;


        const receiptContent = `
            Your Brewery - Official Receipt
            --------------------------------
            Order Date: ${new Date().toLocaleDateString()}
            Order Time: ${new Date().toLocaleTimeString()}

            --- Items ---
            ${itemsForReceipt.length > 0 ? itemsForReceipt.map(item => `${item.name} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}`).join('\n') : 'No items in this order'}
            --------------------------------
            Subtotal: ${formatCurrency(subtotal)}
            Shipping: ${formatCurrency(shippingCost)}
            Total: ${formatCurrency(total)}

            Payment Method: ${document.querySelector('input[name="payment-method"]:checked')?.value || 'Cash on Delivery'}

            Shipping Address:
            ${document.getElementById('p-full-name')?.value || 'N/A'}
            ${document.getElementById('p-address-line1')?.value || 'N/A'}
            ${document.getElementById('p-address-line2')?.value ? document.getElementById('p-address-line2').value + '\n' : ''}
            ${document.getElementById('p-city')?.value || 'N/A'}, ${document.getElementById('p-state')?.value || 'N/A'} ${document.getElementById('p-zip')?.value || 'N/A'}
            ${document.getElementById('p-country')?.value || 'N/A'}

            Thank you for your purchase!
            --------------------------------
        `;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'brewery_receipt.txt'; // You could make this a PDF with a library
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Receipt downloaded!');
        if (paymentModal) paymentModal.classList.remove('active'); // Close modal after download
        localStorage.removeItem('lastOrderItemsForReceipt'); // Clear the temporary storage after download
    });
}


// --- Age Gate Modal ---
const ageGateModal = document.getElementById('age-gate-modal');
const ageConfirmBtn = document.getElementById('age-confirm-btn');
const ageDenyBtn = document.getElementById('age-deny-btn');

const AGE_VERIFIED_KEY = 'breweryAgeVerified';
const AGE_VERIFIED_EXPIRY_KEY = 'breweryAgeVerifiedExpiry';
const VERIFICATION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function checkAgeVerification() {
    // Only proceed if the age gate modal actually exists on the page
    if (!ageGateModal) {
        // console.warn('Age gate modal element not found!'); // Removed console warn for clean output
        return;
    }

    const isVerified = localStorage.getItem(AGE_VERIFIED_KEY) === 'true';
    const expiryTime = localStorage.getItem(AGE_VERIFIED_EXPIRY_KEY);
    const currentTime = new Date().getTime();

    if (isVerified && expiryTime && currentTime < parseInt(expiryTime)) {
        // Age is verified and hasn't expired
        ageGateModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Allow scrolling
    } else {
        // Not verified or expired, show modal
        ageGateModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

if (ageConfirmBtn) {
    ageConfirmBtn.addEventListener('click', () => {
        localStorage.setItem(AGE_VERIFIED_KEY, 'true');
        localStorage.setItem(AGE_VERIFIED_EXPIRY_KEY, new Date().getTime() + VERIFICATION_DURATION_MS);
        if (ageGateModal) ageGateModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Allow scrolling
    });
}

if (ageDenyBtn) {
    ageDenyBtn.addEventListener('click', () => {
        alert('You must be of legal drinking age to access this site. Redirecting...');
        // Redirect or show a message, e.g., to a generic search engine or close tab
        window.location.href = 'https://www.google.com';
        // Or window.close() - though browsers often prevent this without user interaction
    });
}


// --- Initialize all functionality ---
document.addEventListener('DOMContentLoaded', () => {
    // Check age verification as the very first thing
    checkAgeVerification();

    navSlide();
    updateSignInButton(); // Set initial state of sign-in button
    updateCartCount(); // Set initial cart count

    // Specific logic for checkout page
    if (document.getElementById('checkout-details')) {
        updateCartDisplay(); // Populate cart on checkout page
    }

    // Scroll event listener for active nav link (only for homepage)
    if (document.body.classList.contains('homepage')) {
        window.addEventListener('scroll', updateActiveNavLink);
    }
    // Also call it once on load for correct initial state
    updateActiveNavLink();
});