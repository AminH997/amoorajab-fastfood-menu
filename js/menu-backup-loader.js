function toPersianDigits(num) {
  return num.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}

async function loadBackupMenu() {

  const response =
    await fetch("./js/menu-backup.json");

  const items =
    await response.json();

  const categories = {
    pizza: "pizza-items",
    fried: "fried-items",
    sandwiches: "sandwiches-items",
    burgers: "burgers-items",
    "traditional-food": "traditional-food-items",
    desserts: "desserts-items",
    platters: "platters-items"
  };

  Object.values(categories).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });

  items.forEach(item => {

    if (item.active === false) return;

    const container =
      document.getElementById(
        categories[item.category]
      );

    if (!container) return;

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

    const buttonClass =
      hasDescription
        ? "menu-item flip-trigger"
        : "menu-item";

    const backHTML =
      hasDescription
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
              <span class="item-title">
                ${item.name}
              </span>

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
