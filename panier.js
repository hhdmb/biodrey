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

  function showNotification(message) {
    if (!notification) return;
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3200);
  }

  function formatPrice(price) {
    return Number(price).toLocaleString("fr-FR") + " FCFA";
  }

  function updateBadge() {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQty = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
      document.querySelectorAll(".cart-count").forEach((badge) => {
        badge.textContent = totalQty;
        badge.style.display = totalQty > 0 ? "inline-block" : "none";
      });
    } catch (e) {
      console.error(e);
    }
  }

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartItemsTbody) cartItemsTbody.innerHTML = "";
    if (cartBoxesDiv) cartBoxesDiv.innerHTML = "";

    updateBadge();

    if (cart.length === 0) {
      if (cartItemsTbody) {
        cartItemsTbody.innerHTML =
          '<tr><td colspan="5" style="text-align:center; padding: 40px; color: #8c8882;">Votre panier est actuellement vide.</td></tr>';
      }
      if (cartBoxesDiv) {
        cartBoxesDiv.innerHTML =
          '<p style="text-align:center; padding: 30px; color: #8c8882;">Votre panier est actuellement vide.</p>';
      }
      if (cartTotalDiv) cartTotalDiv.textContent = "Total : 0 FCFA";
      if (clearCartBtn) clearCartBtn.disabled = true;
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (clearCartBtn) clearCartBtn.disabled = false;
    if (checkoutBtn) checkoutBtn.disabled = false;

    let total = 0;

    cart.forEach((item) => {
      const sousTotal = item.price * item.quantity;
      total += sousTotal;

      if (cartItemsTbody) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td data-label="Produit"><strong>${item.name}</strong></td>
          <td data-label="Prix unitaire">${formatPrice(item.price)}</td>
          <td data-label="Quantité">
            <input type="number" min="1" value="${item.quantity}" class="qty-input" data-id="${item.id}">
          </td>
          <td data-label="Sous-total"><strong style="color: #9e7d1e;">${formatPrice(sousTotal)}</strong></td>
          <td data-label="Actions">
            <button class="btn-remove" data-id="${item.id}" aria-label="Supprimer produit">&times;</button>
          </td>
        `;
        cartItemsTbody.appendChild(tr);
      }

      if (cartBoxesDiv) {
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
            <button class="btn-remove" data-id="${item.id}" aria-label="Supprimer produit">&times; Supprimer</button>
          </div>
        `;
        cartBoxesDiv.appendChild(box);
      }
    });

    if (cartTotalDiv) {
      cartTotalDiv.innerHTML = `Total : <span style="color: #fcedc2;">${formatPrice(total)}</span>`;
    }
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateBadge();
  }

  function updateQuantity(e) {
    if (!e.target.classList.contains("qty-input")) return;
    const id = e.target.dataset.id;
    let newQty = parseInt(e.target.value, 10);
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
    const target = e.target.closest(".btn-remove");
    if (!target) return;
    const id = target.dataset.id;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => item.id !== id);
    saveCart(cart);
    loadCart();
    showNotification("Article retiré du panier.");
  }

  if (cartItemsTbody) {
    cartItemsTbody.addEventListener("input", updateQuantity);
    cartItemsTbody.addEventListener("click", removeItem);
  }

  if (cartBoxesDiv) {
    cartBoxesDiv.addEventListener("input", updateQuantity);
    cartBoxesDiv.addEventListener("click", removeItem);
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      localStorage.removeItem("cart");
      loadCart();
      showNotification("Votre panier a été vidé.");
    });
  }

  // Ouvrir modal de confirmation
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        showNotification("Votre panier est vide.");
        return;
      }
      if (popupOverlay) popupOverlay.classList.remove("hidden");
    });
  }

  // Fermer modal
  if (closeBtn && popupOverlay) {
    closeBtn.addEventListener("click", () => {
      popupOverlay.classList.add("hidden");
    });
  }

  if (popupOverlay) {
    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) {
        popupOverlay.classList.add("hidden");
      }
    });
  }

  // Soumission WhatsApp
  if (orderForm) {
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        showNotification("Votre panier est vide.");
        if (popupOverlay) popupOverlay.classList.add("hidden");
        return;
      }

      const nom = document.getElementById("cust-name") ? document.getElementById("cust-name").value.trim() : "";
      const tel = document.getElementById("cust-contact") ? document.getElementById("cust-contact").value.trim() : "";
      const lieu = document.getElementById("cust-lieu") ? document.getElementById("cust-lieu").value.trim() : "";
      const dateLivraison = document.getElementById("cust-date") ? document.getElementById("cust-date").value.trim() : "";

      let message = `✨ *NOUVELLE COMMANDE BIO-DREY* ✨%0A%0A`;
      message += `👤 *Client :* ${encodeURIComponent(nom)}%0A`;
      message += `📞 *WhatsApp / Tél :* ${encodeURIComponent(tel)}%0A`;
      message += `📍 *Lieu de livraison :* ${encodeURIComponent(lieu)}%0A`;
      if (dateLivraison) {
        message += `📅 *Date souhaitée :* ${encodeURIComponent(dateLivraison)}%0A`;
      }
      message += `%0A🛍️ *ARTICLES COMMANDÉS :*%0A`;

      let total = 0;
      cart.forEach((item) => {
        const st = item.price * item.quantity;
        total += st;
        message += `• ${encodeURIComponent(item.name)} (x${item.quantity}) : ${formatPrice(st)}%0A`;
      });

      message += `%0A💰 *TOTAL À PAYER : ${formatPrice(total)}*%0A`;
      message += `💳 *Statut Dépôt :* Effectué sur le +225 0566429316`;

      const phoneNumber = "2250566429316";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

      window.open(whatsappUrl, "_blank");

      // Vider le panier
      localStorage.removeItem("cart");
      loadCart();
      if (popupOverlay) popupOverlay.classList.add("hidden");
      orderForm.reset();

      showNotification("Commande transmise avec succès sur WhatsApp !");
    });
  }

  loadCart();
});
