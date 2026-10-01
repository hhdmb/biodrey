// === MENU MOBILE TOGGLE ===
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  const topHeader = document.querySelector('.top-header');
  const mainHeader = document.querySelector('.main-header');

  const topHeaderHeight = topHeader ? (topHeader.getBoundingClientRect().bottom > 0 ? topHeader.getBoundingClientRect().height : 0) : 0;
  const mainHeaderHeight = mainHeader ? mainHeader.getBoundingClientRect().height : 0;
  const totalHeight = topHeaderHeight + mainHeaderHeight;

  if (menu.classList.contains('active') || menu.style.display === 'flex') {
    menu.classList.remove('active');
    menu.style.display = 'none';
  } else {
    menu.classList.add('active');
    menu.style.display = 'flex';
    menu.style.top = totalHeight + 'px';
  }
}

// === NOTIFICATION TOAST ===
function showNotification(msg) {
  let notif = document.getElementById('notification-popup');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'notification-popup';
    notif.className = 'popup-notif';
    notif.innerHTML = '<p id="notification-message"></p>';
    document.body.appendChild(notif);
  }
  const notifMsg = document.getElementById('notification-message');
  if (notifMsg) notifMsg.textContent = msg;
  notif.classList.add('show');
  setTimeout(() => {
    notif.classList.remove('show');
  }, 3200);
}

// === UPDATE CART BADGE COUNT ===
function updateCartBadge() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-count').forEach(badge => {
      badge.textContent = totalQty;
      badge.style.display = totalQty > 0 ? 'inline-block' : 'none';
    });
  } catch (e) {
    console.error(e);
  }
}

// === INITIALIZE SCRIPTS ON DOM LOAD ===
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();

  // === CARROUSEL PUB (barre promo en haut) ===
  const pubSlider = document.querySelector('.slider');
  const pubSlides = document.querySelectorAll('.slide');
  const pubPrevBtn = document.querySelector('.nav-arrow.left');
  const pubNextBtn = document.querySelector('.nav-arrow.right');

  if (pubSlider && pubSlides.length > 0) {
    let pubIndex = 0;
    function showPubSlide(i) {
      const offset = -i * 100;
      pubSlider.style.transform = `translateX(${offset}%)`;
    }

    if (pubNextBtn) {
      pubNextBtn.addEventListener('click', () => {
        pubIndex = (pubIndex + 1) % pubSlides.length;
        showPubSlide(pubIndex);
      });
    }

    if (pubPrevBtn) {
      pubPrevBtn.addEventListener('click', () => {
        pubIndex = (pubIndex - 1 + pubSlides.length) % pubSlides.length;
        showPubSlide(pubIndex);
      });
    }

    setInterval(() => {
      pubIndex = (pubIndex + 1) % pubSlides.length;
      showPubSlide(pubIndex);
    }, 3000);
  }

  // === HERO CAROUSEL (page d'accueil) ===
  const heroSlides = document.querySelectorAll('.carousel-slide');
  const heroNextBtn = document.querySelector('.carousel-nav.next');
  const heroPrevBtn = document.querySelector('.carousel-nav.prev');

  if (heroSlides.length > 0) {
    let heroIndex = 0;
    function showHeroSlide(i) {
      heroSlides.forEach(s => s.classList.remove('active'));
      heroSlides[i].classList.add('active');
    }

    if (heroNextBtn) {
      heroNextBtn.addEventListener('click', () => {
        heroIndex = (heroIndex + 1) % heroSlides.length;
        showHeroSlide(heroIndex);
      });
    }

    if (heroPrevBtn) {
      heroPrevBtn.addEventListener('click', () => {
        heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
        showHeroSlide(heroIndex);
      });
    }

    setInterval(() => {
      heroIndex = (heroIndex + 1) % heroSlides.length;
      showHeroSlide(heroIndex);
    }, 4500);
  }

  // === GESTION DES CARTES PRODUITS & PANIER ===
  document.querySelectorAll('.produit-box').forEach(box => {
    const btnMoins = box.querySelector('.moins');
    const btnPlus = box.querySelector('.plus');
    const inputQuantite = box.querySelector('.quantite-input');
    const prixElement = box.querySelector('.produit-prix');
    const commanderBtn = box.querySelector('.btn-commander');
    const nomElement = box.querySelector('.produit-nom');

    if (!prixElement || !commanderBtn || !nomElement) return;

    const rawPrix = prixElement.dataset.prix || prixElement.textContent.replace(/[^0-9]/g, '');
    const prixUnitaire = parseInt(rawPrix, 10) || 0;
    const nomProduit = nomElement.innerText.trim();
    const prodId = box.dataset.id || nomProduit.toLowerCase().replace(/\s+/g, '-');

    function updatePrix() {
      if (!inputQuantite) return;
      let quantite = parseInt(inputQuantite.value, 10);
      if (isNaN(quantite) || quantite < 1) quantite = 1;
      inputQuantite.value = quantite;
      const prixTotal = prixUnitaire * quantite;
      prixElement.textContent = `Prix : ${prixTotal.toLocaleString()} FCFA`;
    }

    if (btnMoins && inputQuantite) {
      btnMoins.addEventListener('click', (e) => {
        e.preventDefault();
        let quantite = parseInt(inputQuantite.value, 10);
        if (quantite > 1) {
          inputQuantite.value = quantite - 1;
          updatePrix();
        }
      });
    }

    if (btnPlus && inputQuantite) {
      btnPlus.addEventListener('click', (e) => {
        e.preventDefault();
        let quantite = parseInt(inputQuantite.value, 10);
        inputQuantite.value = quantite + 1;
        updatePrix();
      });
    }

    if (inputQuantite) {
      inputQuantite.addEventListener('input', updatePrix);
    }

    // Gestion du bouton commander -> Ajout au panier
    commanderBtn.addEventListener('click', (e) => {
      // Si c'est déjà un lien sur la page d'accueil vers nos_produits, ne pas bloquer
      if (commanderBtn.parentElement && commanderBtn.parentElement.tagName === 'A') {
        return;
      }

      e.preventDefault();
      const quantite = inputQuantite ? parseInt(inputQuantite.value, 10) || 1 : 1;
      
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(item => item.id === prodId || item.name === nomProduit);

      if (existing) {
        existing.quantity += quantite;
      } else {
        cart.push({
          id: prodId,
          name: nomProduit,
          price: prixUnitaire,
          quantity: quantite
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
      showNotification(`✓ ${quantite}x ${nomProduit} ajouté au panier !`);
    });

    updatePrix();
  });

  // === FAQ ACCORDION ===
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const currentlyActive = document.querySelector('.accordion-item.active');
      if (currentlyActive && currentlyActive !== item) {
        currentlyActive.classList.remove('active');
      }
      item.classList.toggle('active');
    });
  });
});
