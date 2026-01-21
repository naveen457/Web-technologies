// Initial products array with name, price, category, quantity (in cart)
let cart = []; // each item: { name, price, category, quantity }

// Helpers
function findCartItem(name) {
  return cart.find(item => item.name === name);
}

function addToCart(product) {
  const existing = findCartItem(product.name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  renderCart();
}

function changeQuantity(name, delta) {
  const item = findCartItem(name);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(name);
  } else {
    renderCart();
  }
}

// Discount logic
function getBulkDiscount(subtotal, quantity) {
  // Example rule: if quantity >= 10 -> 10% off that line
  if (quantity >= 10) {
    return subtotal * 0.1;
  }
  return 0;
}

function getCategoryDiscount(category, subtotal) {
  // Example: grocery 5% off during day, fashion 15% at night
  const hour = new Date().getHours(); // 0–23
  let discount = 0;

  if (category === "grocery" && hour >= 8 && hour <= 20) {
    discount = subtotal * 0.05; // 5% day discount
  }

  if (category === "fashion" && (hour >= 18 || hour < 6)) {
    discount = subtotal * 0.15; // 15% night discount
  }

  return discount;
}

// Coupon parsing: examples
// BULK10   -> extra 10% on total if total qty >= 10
// CAT-FASHION-5 -> extra 5% off fashion items
function applyCouponDiscounts(baseTotal, perCategoryTotals) {
  const couponInput = document.getElementById("coupon").value.trim().toUpperCase();
  const messageEl = document.getElementById("couponMessage");
  let couponDiscount = 0;
  let msg = "";

  if (!couponInput) {
    messageEl.textContent = "";
    return { couponDiscount, msg };
  }

  if (couponInput.startsWith("BULK")) {
    // BULK10, BULK20 etc.
    const percStr = couponInput.slice(4); // "10"
    const perc = Number(percStr);
    if (!isNaN(perc)) {
      const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
      if (totalQty >= 10) {
        couponDiscount = (baseTotal * perc) / 100;
        msg = `Bulk coupon applied: ${perc}% off on total.`;
      } else {
        msg = "Bulk coupon requires at least 10 total items.";
      }
    } else {
      msg = "Invalid BULK coupon format.";
    }
  } else if (couponInput.startsWith("CAT-")) {
    // CAT-FASHION-5
    const parts = couponInput.split("-");
    // ["CAT", "FASHION", "5"]
    if (parts.length === 3) {
      const category = parts[1].toLowerCase();
      const perc = Number(parts[2]);
      if (!isNaN(perc) && perCategoryTotals[category]) {
        couponDiscount = (perCategoryTotals[category] * perc) / 100;
        msg = `Category coupon applied: ${perc}% off on ${category}.`;
      } else {
        msg = "Invalid category or percentage in coupon.";
      }
    } else {
      msg = "Invalid category coupon format.";
    }
  } else {
    msg = "Unknown coupon code.";
  }

  messageEl.textContent = msg;
  return { couponDiscount, msg };
}

// Recalculate and render
function renderCart() {
  const tbody = document.getElementById("cartBody");
  tbody.innerHTML = "";

  let baseTotal = 0;
  let discountFromRules = 0;
  const perCategoryTotals = {};

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    baseTotal += subtotal;

    // accumulate per category totals for coupon use
    if (!perCategoryTotals[item.category]) {
      perCategoryTotals[item.category] = 0;
    }
    perCategoryTotals[item.category] += subtotal;

    // rule-based discounts
    const bulkDisc = getBulkDiscount(subtotal, item.quantity);
    const catDisc = getCategoryDiscount(item.category, subtotal);
    discountFromRules += bulkDisc + catDisc;

    // row
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.price}</td>
      <td>
        <div class="qty-controls">
          <button class="qty-btn" data-name="${item.name}" data-delta="-1">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-name="${item.name}" data-delta="1">+</button>
        </div>
      </td>
      <td>${subtotal}</td>
      <td>
        <button class="remove-btn" data-name="${item.name}">Remove</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Coupon discounts
  const { couponDiscount } = applyCouponDiscounts(baseTotal - discountFromRules, perCategoryTotals);

  const totalDiscount = discountFromRules + couponDiscount;
  const finalTotal = Math.max(0, baseTotal - totalDiscount);

  document.getElementById("baseTotal").textContent = baseTotal.toFixed(2);
  document.getElementById("discountTotal").textContent = totalDiscount.toFixed(2);
  document.getElementById("finalTotal").textContent = finalTotal.toFixed(2);

  // Attach listeners to new buttons
  attachRowListeners();
}

function attachRowListeners() {
  document.querySelectorAll(".qty-btn").forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.name;
      const delta = Number(btn.dataset.delta);
      changeQuantity(name, delta);
    };
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.name;
      removeFromCart(name);
    };
  });
}

// Event listeners for product Add buttons
document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const parent = btn.closest(".product");
    const product = {
      name: parent.dataset.name,
      price: Number(parent.dataset.price),
      category: parent.dataset.category
    };
    addToCart(product);
  });
});

// Recalculate when coupon is applied or edited
document.getElementById("applyCouponBtn").addEventListener("click", () => {
  renderCart();
});

document.getElementById("coupon").addEventListener("input", () => {
  renderCart();
});

// Initial render
renderCart();
