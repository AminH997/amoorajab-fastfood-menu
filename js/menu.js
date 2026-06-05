import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

function toPersianDigits(num) {
  return num.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}

async function renderCategory(categoryName, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container not found: ${containerId}`);
        return;
    }
    container.innerHTML = "";

    const snapshot = await getDocs(collection(db, "menuItems"));

    const items = [];

    snapshot.forEach(doc => {
    items.push(doc.data());
    });

    items.sort((a, b) => a.order - b.order);

    items.forEach(item => {
      if (item.category !== categoryName) return;
      if (item.active === false) return;
    
      let pricesHTML = "";

      if (item.prices.length === 0) {
      
        pricesHTML = `
          <div class="price-entry">
            <span class="price-value">
              تماس بگیرید
            </span>
          </div>
        `;
      
      } else {
      
        item.prices.forEach(price => {
      
          pricesHTML += `
            <div class="price-entry">
              <span class="price-size">${price.label}</span>
              <span class="price-value">
                ${toPersianDigits(price.price)} ت
              </span>
            </div>
          `;
      
        });
      
      }

      const hasDescription =
      item.description &&
      item.description.trim() !== "";
    
    const buttonClass = hasDescription
      ? "menu-item flip-trigger"
      : "menu-item";
    
    const backHTML = hasDescription
      ? `
          <div class="card-face card-back">
            <p>${item.description}</p>
          </div>
        `
      : "";
    
    container.innerHTML += `
      <div class="menu-block">
        <div class="menu-item-card">
          <button
            class="${buttonClass}"
            type="button"
          >
    
            <div class="card-face card-front">
              <span class="item-title">${item.name}</span>
    
              <div class="prices">
                ${pricesHTML}
              </div>
            </div>
    
            ${backHTML}
    
          </button>
        </div>
      </div>
    `;
  });
}
function initializeFlipCards() {

  const triggers =
    document.querySelectorAll(".flip-trigger");

  triggers.forEach(btn => {

    btn.addEventListener("click", () => {

      triggers.forEach(other => {

        if (other !== btn) {
          other.classList.remove("flipped");
        }

      });

      btn.classList.toggle("flipped");

    });

  });

}

async function initializeMenu() {

  await renderCategory("pizza", "pizza-items");
  await renderCategory("fried", "fried-items");
  await renderCategory("sandwiches", "sandwiches-items");
  await renderCategory("burgers", "burgers-items");
  await renderCategory("traditional-food", "traditional-food-items");
  await renderCategory("desserts", "desserts-items");
  await renderCategory("platters", "platters-items");

  initializeFlipCards();

}

initializeMenu();