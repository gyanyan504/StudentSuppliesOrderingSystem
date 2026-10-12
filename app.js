// Hard-coded product data matching the exam specification
const products = [
  { id: 1, name: "Ballpen", price: 12.00 },
  { id: 2, name: "Pencil", price: 10.00 },
  { id: 3, name: "Notebook", price: 35.00 },
  { id: 4, name: "Yellow Pad", price: 45.00 },
  { id: 5, name: "Eraser", price: 8.00 },
  { id: 6, name: "Ruler", price: 15.00 }
];

// Function to render the products into the Product List section
function renderProducts() {
  const productsContainer = document.getElementById("products-grid");
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

// Temporary test listener to verify button clicks
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();

  const productsContainer = document.getElementById("products-grid");
  productsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-add-cart")) {
      const productId = parseInt(event.target.getAttribute("data-id"));
      const selectedProduct = products.find((p) => p.id === productId);
      console.log(`Clicked Add to Cart for: ${selectedProduct.name} (₱${selectedProduct.price.toFixed(2)})`);
    }
  });
});