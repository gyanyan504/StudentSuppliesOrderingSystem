// 1. Hard-coded Product Catalog
const products = [
  { id: 1, name: "Ballpen", price: 12.00 },
  { id: 2, name: "Pencil", price: 10.00 },
  { id: 3, name: "Notebook", price: 35.00 },
  { id: 4, name: "Yellow Pad", price: 45.00 },
  { id: 5, name: "Eraser", price: 8.00 },
  { id: 6, name: "Ruler", price: 15.00 }
];

// Shopping cart state
let cart = [];

// Helper: Calculate grand total from items currently in cart
function calculateGrandTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// 2. Render Product Catalog
function renderProducts() {
  const productsContainer = document.getElementById("products-grid");
  if (!productsContainer) return;
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div>
        <h3>${product.name}</h3>
        <p class="price">₱${product.price.toFixed(2)}</p>
      </div>
      <button class="btn-add-cart" data-id="${product.id}">Add to Cart</button>
    `;

    productsContainer.appendChild(card);
  });
}

// 3. Cart Logic Functions
function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  updateCartUI();
}

function updateQuantity(productId, delta) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartUI();
}

// 4. Update UI (Cart List & Order Summary)
function updateCartUI() {
  const cartContainer = document.getElementById("cart-items");
  const summaryCount = document.getElementById("summary-items-count");
  const summaryTotal = document.getElementById("summary-total");
  const amountPaidInput = document.getElementById("amount-paid") || document.getElementById("cash-input");
  const confirmBtn = document.getElementById("confirm-payment-btn") || document.getElementById("pay-btn");

  hideError();

  if (cart.length === 0) {
    if (cartContainer) cartContainer.innerHTML = `<p class="empty-text">Your cart is currently empty.</p>`;
    if (summaryCount) summaryCount.textContent = "0";
    if (summaryTotal) summaryTotal.textContent = "₱0.00";
    if (amountPaidInput) {
      amountPaidInput.disabled = true;
      amountPaidInput.value = "";
    }
    if (confirmBtn) confirmBtn.disabled = true;
    return;
  }

  if (cartContainer) {
    cartContainer.innerHTML = "";
    let totalItemsCount = 0;

    cart.forEach((item) => {
      const subtotal = item.price * item.quantity;
      totalItemsCount += item.quantity;

      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div class="cart-item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-price">₱${item.price.toFixed(2)} each</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
          <span class="item-qty">${item.quantity}</span>
          <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
        </div>
        <div class="cart-item-subtotal">₱${subtotal.toFixed(2)}</div>
        <button class="btn-remove" data-action="remove" data-id="${item.id}">Remove</button>
      `;

      cartContainer.appendChild(row);
    });

    const grandTotal = calculateGrandTotal();
    if (summaryCount) summaryCount.textContent = totalItemsCount;
    if (summaryTotal) summaryTotal.textContent = `₱${grandTotal.toFixed(2)}`;
  }

  if (amountPaidInput) amountPaidInput.disabled = false;
  if (confirmBtn) confirmBtn.disabled = false;
}

// 5. Validation and Payment Handling
function showError(message) {
  const errorEl = document.getElementById("payment-error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }
}

function hideError() {
  const errorEl = document.getElementById("payment-error");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.style.display = "none";
  }
}

function resetReceipt() {
  const receiptContainer = document.getElementById("receipt-content");
  if (receiptContainer) {
    receiptContainer.innerHTML = `<p class="empty-text">Receipt will appear here after successful payment.</p>`;
  }
}

function handlePayment() {
  hideError();

  if (cart.length === 0) {
    showError("Cannot process payment: Cart is empty.");
    return;
  }

  const amountPaidInput = document.getElementById("amount-paid") || document.getElementById("cash-input");
  const rawInput = amountPaidInput ? amountPaidInput.value.trim() : "";

  if (rawInput === "") {
    showError("Error: Amount Paid field cannot be empty.");
    return;
  }

  const amountPaid = parseFloat(rawInput);

  if (isNaN(amountPaid)) {
    showError("Error: Please enter a valid numerical amount.");
    return;
  }

  if (amountPaid < 0) {
    showError("Error: Payment amount cannot be negative.");
    return;
  }

  const totalAmount = calculateGrandTotal();

  if (amountPaid < totalAmount) {
    const shortage = (totalAmount - amountPaid).toFixed(2);
    showError(`Error: Insufficient payment. Amount paid is short by ₱${shortage}.`);
    return;
  }

  const change = amountPaid - totalAmount;

  // Lock payment inputs
  if (amountPaidInput) amountPaidInput.disabled = true;
  const confirmBtn = document.getElementById("confirm-payment-btn") || document.getElementById("pay-btn");
  if (confirmBtn) confirmBtn.disabled = true;

  generateReceipt(amountPaid, totalAmount, change);
}

// 6. Generate Digital Receipt (with inline onclick backup)
function generateReceipt(amountPaid, totalAmount, change) {
  const receiptContainer = document.getElementById("receipt-content");
  if (!receiptContainer) return;

  const refNumber = `TXN-${Date.now()}`;
  const transactionDate = new Date().toLocaleString();

  let itemsHtml = "";
  cart.forEach((item) => {
    const subtotal = (item.price * item.quantity).toFixed(2);
    itemsHtml += `
      <div class="receipt-item-detail">
        <span>${item.name} (x${item.quantity} @ ₱${item.price.toFixed(2)})</span>
        <span>₱${subtotal}</span>
      </div>
    `;
  });

  receiptContainer.innerHTML = `
    <div class="payment-success-badge">Payment Successful! Thank you for your purchase.</div>
    <div class="receipt-box">
      <h3>OFFICIAL RECEIPT</h3>
      <div class="receipt-meta">
        <div><strong>Ref No:</strong> ${refNumber}</div>
        <div><strong>Date & Time:</strong> ${transactionDate}</div>
      </div>
      <div class="receipt-divider"></div>
      ${itemsHtml}
      <div class="receipt-divider"></div>
      <div class="receipt-item-line">
        <strong>Total Amount:</strong>
        <strong>₱${totalAmount.toFixed(2)}</strong>
      </div>
      <div class="receipt-item-line">
        <span>Amount Paid:</span>
        <span>₱${amountPaid.toFixed(2)}</span>
      </div>
      <div class="receipt-item-line">
        <strong>Change:</strong>
        <strong>₱${change.toFixed(2)}</strong>
      </div>
    </div>
    <button id="new-transaction-btn" class="btn-new-transaction" onclick="startNewTransaction()">New Transaction</button>
  `;
}

// 7. Reset System for a New Transaction
function startNewTransaction() {
  cart = [];

  const amountPaidInput = document.getElementById("amount-paid") || document.getElementById("cash-input");
  if (amountPaidInput) {
    amountPaidInput.value = "";
    amountPaidInput.disabled = true;
  }

  const confirmBtn = document.getElementById("confirm-payment-btn") || document.getElementById("pay-btn");
  if (confirmBtn) {
    confirmBtn.disabled = true;
  }

  hideError();
  resetReceipt();
  updateCartUI();
}

// Expose startNewTransaction globally so HTML onclick works seamlessly
window.startNewTransaction = startNewTransaction;

// 8. Event Listeners Setup
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();

  // Add to cart delegation
  const productsContainer = document.getElementById("products-grid");
  if (productsContainer) {
    productsContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("btn-add-cart")) {
        const productId = parseInt(event.target.getAttribute("data-id"));
        addToCart(productId);
      }
    });
  }

  // Cart quantity / remove delegation
  const cartContainer = document.getElementById("cart-items");
  if (cartContainer) {
    cartContainer.addEventListener("click", (event) => {
      const action = event.target.getAttribute("data-action");
      const productId = parseInt(event.target.getAttribute("data-id"));

      if (!action || !productId) return;

      if (action === "increase") {
        updateQuantity(productId, 1);
      } else if (action === "decrease") {
        updateQuantity(productId, -1);
      } else if (action === "remove") {
        removeFromCart(productId);
      }
    });
  }

  // Confirm payment trigger
  const confirmBtn = document.getElementById("confirm-payment-btn") || document.getElementById("pay-btn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", handlePayment);
  }

  // Document-level delegation for New Transaction button
  document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "new-transaction-btn") {
      startNewTransaction();
    }
  });
});