import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let allMenuItems = [];
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const statusDiv = document.getElementById("status");
const adminContent = document.getElementById("adminContent");
const searchInput = document.getElementById("searchInput");
const loginSection =
  document.getElementById("loginSection");
const adminSection =
  document.getElementById("adminSection");
  adminSection.style.display = "none";

  loginBtn.addEventListener("click", async () => {

    try {
  
      await signInWithEmailAndPassword(
        auth,
        emailInput.value,
        passwordInput.value
      );
  
    } catch (error) {
  
      console.error(error);
  
      window.alert(
        "Incorrect email or password."
      );
  
    }
  
  });

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

});

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    loginSection.style.display = "block";
    adminSection.style.display = "none";
  
    adminContent.innerHTML = "";
  
    return;
  }

  statusDiv.textContent =
    `Logged in as ${user.email}`;
    loginSection.style.display = "none";
    adminSection.style.display = "block";

  loadMenuItems();

});

async function loadMenuItems() {

  adminContent.innerHTML = "";

  const snapshot =
    await getDocs(collection(db, "menuItems"));

  const items = [];

  snapshot.forEach(docSnap => {

    items.push({
      id: docSnap.id,
      ...docSnap.data()
    });

  });

  items.sort((a, b) => (a.order || 0) - (b.order || 0));
  allMenuItems = items;
  renderAdminItems(items);


}

function renderAdminItems(items) {

  adminContent.innerHTML = "";

  const categoryNames = {
    pizza: "🍕 پیتزا",
    fried: "🍗 سوخاری",
    sandwiches: "🌯 ساندویچ",
    burgers: "🍔 برگر",
    "traditional-food": "🍚 غذای ایرانی",
    desserts: "🍰 دسرها",
    platters: "🍽️ سینی ها"
  };

  const groupedItems = {};

  items.forEach(item => {

    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }

    groupedItems[item.category].push(item);

  });

  Object.entries(groupedItems).forEach(
    ([category, categoryItems]) => {

      const section =
        document.createElement("details");

      section.style.marginBottom = "15px";

      section.innerHTML = `
        <summary style="
          cursor:pointer;
          font-size:20px;
          font-weight:bold;
          padding:10px;
        ">
          ${categoryNames[category] || category}
          (${categoryItems.length})
        </summary>
      `;

      categoryItems.forEach(item => {

        const card = document.createElement("div");
      
      card.className =
        item.active === false
          ? "menu-item-admin hidden-item"
          : "menu-item-admin";

        let pricesHtml = "";

        item.prices.forEach((price, index) => {

          const labelHtml = price.label
          ? `
              <div class="price-label">
                ${price.label}
              </div>
            `
          : "";
        
          pricesHtml += `
            <div class="price-group">
          
              ${labelHtml}
          
              <input
                type="number"
                value="${price.price}"
                data-index="${index}"
                class="price-input"
              >
          
            </div>
          `;

        });

        card.innerHTML = `
          <h3>${item.name}</h3>

          <label>
            <input
              type="checkbox"
              class="active-checkbox"
              ${item.active === false ? "" : "checked"}
            >
            نمایش در منو
          </label>

          ${pricesHtml}

          <button class="save-btn">
            ذخیره
          </button>
        `;


        const activeCheckbox =
          card.querySelector(".active-checkbox");

        activeCheckbox.addEventListener("change", () => {

          if (activeCheckbox.checked) {
            card.classList.remove("hidden-item");
          } else {
            card.classList.add("hidden-item");
          }

        });

        const saveBtn =
          card.querySelector(".save-btn");

        saveBtn.addEventListener("click", async () => {

          const inputs =
            card.querySelectorAll(".price-input");


          const updatedPrices =
            item.prices.map((price, index) => ({
              ...price,
              price: Number(inputs[index].value)
            }));

          try {

            await updateDoc(
              doc(db, "menuItems", item.id),
              {
                prices: updatedPrices,
                active: activeCheckbox.checked
              }
            );

            saveBtn.textContent = "✓ ذخیره شد ";
            saveBtn.classList.add("saved");
            
            setTimeout(() => {
              saveBtn.textContent = "ذخیره";
              saveBtn.classList.remove("saved");
            }, 2000);

          } catch (error) {

            console.error(error);
          
            saveBtn.textContent = "Error";
          
          }

        });

        section.appendChild(card);

      });

      adminContent.appendChild(section);

    });

}

let searchTimeout;

searchInput.addEventListener("input", () => {

  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {

  const query =
    searchInput.value
      .trim()
      .toLowerCase();

  const filtered =
    allMenuItems.filter(item =>
      item.name
        .toLowerCase()
        .includes(query)
    );

  renderAdminItems(filtered);

}, 150);

});



