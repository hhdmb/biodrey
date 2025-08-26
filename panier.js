document.addEventListener("DOMContentLoaded", () => {
  const cartItemsTbody = document.getElementById("cart-items");
  const cartBoxesDiv = document.getElementById("cart-boxes");
  const cartTotalDiv = document.getElementById("cart-total");
  const clearCartBtn = document.getElementById("clear-cart-btn");
  const checkoutBtn = document.getElementById("checkout-btn");
  const notification = document.getElementById("notification");

  const popupOverlay = document.getElementById("popup-overlay");
  const closeBtn = document.getElementById("close-popup");
  const orderForm = document.getElementById("order-form");
  const cartSummaryItems = document.getElementById("cart-summary-items");

  function showNotification(message) {
    if (!notification) return;
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }

  function formatPrice(price) {
    return price.toLocaleString() + " FCFA";
  }

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsTbody.innerHTML = "";
    cartBoxesDiv.innerHTML = "";

    if (cart.length === 0) {
      cartItemsTbody.innerHTML =
        '<tr><td colspan="5" style="text-align:center;">Votre panier est vide.</td></tr>';
      cartTotalDiv.textContent = "Total : 0 FCFA";
      clearCartBtn.disabled = true;
      checkoutBtn.disabled = true;
      return;
    }

    clearCartBtn.disabled = false;
    checkoutBtn.disabled = false;

    let total = 0;

    cart.forEach((item) => {
      const sousTotal = item.price * item.quantity;
      total += sousTotal;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td data-label="Produit">${item.name}</td>
        <td data-label="Prix unitaire">${formatPrice(item.price)}</td>
        <td data-label="Quantité">
          <input type="number" min="1" value="${item.quantity}" class="qty-input" data-id="${item.id}">
        </td>
        <td data-label="Sous-total">${formatPrice(sousTotal)}</td>
        <td data-label="Actions">
          <button class="btn-remove" data-id="${item.id}" aria-label="Supprimer produit">&times;</button>
        </td>
      `;
      cartItemsTbody.appendChild(tr);

      const box = document.createElement("div");
      box.className = "cart-box";
      box.innerHTML = `
        <div class="produit-nom">${item.name}</div>
        <div class="produit-prix">Prix unitaire : ${formatPrice(item.price)}</div>
        <div class="produit-quantity">
          Quantité: <input type="number" min="1" value="${item.quantity}" class="qty-input" data-id="${item.id}">
        </div>
        <div class="produit-subtotal">Sous-total : ${formatPrice(sousTotal)}</div>
        <div class="actions">
          <button class="btn-remove" data-id="${item.id}" aria-label="Supprimer produit">Supprimer</button>
        </div>
      `;
      cartBoxesDiv.appendChild(box);
    });

    cartTotalDiv.textContent = `Total : ${formatPrice(total)}`;
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateQuantity(e) {
    if (!e.target.classList.contains("qty-input")) return;
    const id = e.target.dataset.id;
    let newQty = parseInt(e.target.value);
    if (isNaN(newQty) || newQty < 1) newQty = 1;
    e.target.value = newQty;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    saveCart(cart);
    loadCart();
  }

  function removeItem(e) {
    if (!e.target.classList.contains("btn-remove")) return;
    const id = e.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => item.id !== id);
    saveCart(cart);
    loadCart();
    showNotification("Produit supprimé.");
  }

  cartItemsTbody.addEventListener("input", updateQuantity);
  cartBoxesDiv.addEventListener("input", updateQuantity);

  cartItemsTbody.addEventListener("click", removeItem);
  cartBoxesDiv.addEventListener("click", removeItem);

  clearCartBtn.addEventListener("click", () => {
    localStorage.removeItem("cart");
    loadCart();
    showNotification("Panier vidé avec succès !");
  });

  // ----------- MODIFICATION ICI ------------------

  // Ouvrir popup au clic valider commande sans vider panier
  checkoutBtn.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      showNotification("Votre panier est vide.");
      return;
    }

    // Injection résumé panier dans popup
    cartSummaryItems.innerHTML = "";
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}`;
      cartSummaryItems.appendChild(li);
    });

    popupOverlay.classList.remove("hidden");
  });

  // Fermer popup
  closeBtn.addEventListener("click", () => {
    popupOverlay.classList.add("hidden");
  });

  popupOverlay.addEventListener("click", e => {
    if (e.target === popupOverlay) {
      popupOverlay.classList.add("hidden");
    }
  });

  // Soumettre formulaire de commande dans popup
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      showNotification("Votre panier est vide.");
      popupOverlay.classList.add("hidden");
      return;
    }

    const formData = new FormData(orderForm);
    const prenom = formData.get("prenom").trim();
    const nom = formData.get("nom").trim();
    const numero = formData.get("numero").trim();
    const number = formData.get("num").trim();
    const pays = formData.get("pays").trim();
    const ville = formData.get("ville").trim();
    const commune = formData.get("commune").trim();

    let message = `Salut, j’ai commandé depuis le site BioDrey. Voici mes coordonnées :%0A`;
    message += `Prénom : ${prenom}%0ANom : ${nom}%0ANuméro pour la livraison:${number}%0AVoici la date a laquelle je serai disponible pour la livraison : ${numero}%0A%0A`;
    message += `Articles commandés :%0A`;

    let total = 0;
    cart.forEach(item => {
      const st = item.price * item.quantity;
      total += st;
      message += `- ${item.name} x ${item.quantity} = ${formatPrice(st)}%0A`;
    });
    message += `%0ATotal : ${formatPrice(total)}%0A%0A`;

    message += `Adresse : ${commune}, ${ville}, ${pays}`;

    const phoneNumber = "2250566429316"; // remplace par ton numéro

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");

    // Vider le panier après ouverture WhatsApp
    localStorage.removeItem("cart");
    loadCart();
    popupOverlay.classList.add("hidden");
    orderForm.reset();

    showNotification("Commande envoyée !");
  });

  // Chargement initial
  loadCart();
});


