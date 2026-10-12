# Student Supplies Ordering System

**IT415 Midterm Practical Examination - Student Supplies Ordering System**

A functional, desktop-friendly, browser-based ordering system designed for student supplies. Built without external dependencies or databases, prioritizing straightforward design, data validation, and core transaction functionality.

---

## Features

- **Product Catalog:** Displays 6 supplies with fixed pricing:
  - Ballpen — ₱12.00
  - Pencil — ₱10.00
  - Notebook — ₱35.00
  - Yellow Pad — ₱45.00
  - Eraser — ₱8.00
  - Ruler — ₱15.00
- **Shopping Cart Management:** Add items, adjust item quantities (`+` / `-`), remove items, and view individual subtotal amounts.
- **Order Summary:** Real-time calculation of total item count and grand total.
- **Payment & Validation:**
  - Rejects empty payment input.
  - Rejects invalid numeric values (`NaN`).
  - Rejects negative amounts.
  - Rejects amounts lower than total due (displays exact shortage).
  - Calculates change accurately: `Change = Amount Paid - Total Amount`.
- **Digital Receipt:** Generates an official receipt upon successful payment containing:
  - Unique transaction reference number (`TXN-...`)
  - Date and time timestamp
  - Itemized list (product name, quantity, unit price, subtotal)
  - Total amount, amount paid, and change
- **New Transaction:** Resets cart, summary, payment fields, and receipt state for a fresh transaction.

---

## Technologies Used

- **HTML5:** Semantic document structure and layout sections.
- **CSS3:** Modern styling with Grid and Flexbox layout.
- **JavaScript (ES6):** State handling, DOM manipulation, input validation, and business calculations.

---

## Instructions for Running the Application

1. Clone or download the repository to your local computer:
   ```bash
   git clone [https://github.com/gyanyan504/StudentSuppliesOrderingSystem.git](https://github.com/gyanyan504/StudentSuppliesOrderingSystem.git)
