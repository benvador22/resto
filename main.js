const tab = document.querySelector(".tab");
const searchIcon = document.getElementById("searchIcon");
const searchModal = document.getElementById("searchModal");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const closeSearch = document.getElementById("closeSearch");

// Array des produits extraits du DOM
let products = [];

// Fonction pour charger les produits depuis le HTML
function loadProducts() {
  const cards = document.querySelectorAll(".animation-card");
  products = [];

  cards.forEach((card) => {
    const name = card.querySelector(".name").textContent;
    const price = card.querySelector(".price").textContent;
    const img = card.querySelector("img").getAttribute("src");

    products.push({
      name: name,
      price: price,
      img: img,
    });
  });
}

// Charger les produits au chargement de la page
loadProducts();

function getProductFromCard(card) {
  return {
    name: card.querySelector(".name")?.textContent.trim() || "",
    price: card.querySelector(".price")?.textContent.trim() || "",
    img: card.querySelector("img")?.getAttribute("src") || "",
  };
}

function openWhatsAppOrder(product) {
  const imageUrl = new URL(product.img, window.location.href).href;
  const message = `Bonjour, je voudrais commander:\n\nProduit: ${product.name}\nPrix: ${product.price}\nImage: ${imageUrl}`;
  const whatsappNumber = "243982164959";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

// Gestionnaire pour les liens "Order Now" des cartes
document.addEventListener("click", (e) => {
  const orderLink = e.target.closest(".animation-card .add a");

  if (!orderLink) {
    return;
  }

  e.preventDefault();
  const card = orderLink.closest(".animation-card");
  openWhatsAppOrder(getProductFromCard(card));
});
// Gestionnaire pour les boutons "Commander" de la recherche
document.addEventListener("click", (e) => {
  const orderButton = e.target.closest(".order-btn");

  if (!orderButton) {
    return;
  }

  openWhatsAppOrder({
    name: orderButton.dataset.product,
    price: orderButton.dataset.price,
    img: orderButton.dataset.image,
  });
});
// Ouvrir le modal de recherche
searchIcon.addEventListener("click", () => {
  searchModal.classList.add("active");
  searchInput.focus();
});

// Fermer le modal
closeSearch.addEventListener("click", () => {
  searchModal.classList.remove("active");
  searchInput.value = "";
  searchResults.innerHTML = "";
});

// Fermer le modal en cliquant sur le fond
searchModal.addEventListener("click", (e) => {
  if (e.target === searchModal) {
    searchModal.classList.remove("active");
    searchInput.value = "";
    searchResults.innerHTML = "";
  }
});

// Fonction de recherche
function searchProducts(query) {
  if (query.trim() === "") {
    searchResults.innerHTML = "";
    return;
  }

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()),
  );

  if (filtered.length === 0) {
    searchResults.innerHTML =
      '<div class="no-results">Aucun plat trouvé pour votre recherche</div>';
    return;
  }

  searchResults.innerHTML = filtered
    .map(
      (product) => `
    <div class="search-item">
      <img src="${product.img}" alt="${product.name}" />
      <div class="search-item-info">
        <div class="search-item-name">${product.name}</div>
        <div class="search-item-price">${product.price}</div>
      </div>
      <button class="order-btn" data-product="${product.name}" data-price="${product.price}" data-image="${product.img}" style="background: #353432; color: #fff; padding: 10px 15px; border-radius: 20px; text-decoration: none; font-size: 14px; font-weight: bold; border: none; cursor: pointer;">Commander</button>
    </div>
  `,
    )
    .join("");
}

// Écouteur pour la saisie
searchInput.addEventListener("input", (e) => {
  searchProducts(e.target.value);
});

window.addEventListener("scroll", (event) => {
  const top = window.scrollY;

  if (tab.offsetTop - top < 550) {
    tab.classList.add("active");
  } else {
    tab.classList.remove("active");
  }
});
