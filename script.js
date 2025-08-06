function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const topHeader = document.querySelector('.top-header');
  const mainHeader = document.querySelector('.main-header');

  const topHeaderRect = topHeader.getBoundingClientRect();
  const topHeaderVisibleHeight = topHeaderRect.bottom > 0 ? topHeaderRect.height : 0;
  const mainHeaderHeight = mainHeader.getBoundingClientRect().height;

  const totalHeight = topHeaderVisibleHeight + mainHeaderHeight;

  if (menu.style.display === 'flex') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'flex';
    menu.style.top = totalHeight + 'px';
  }
}


// === CARROUSEL PUB (slider horizontal) ===
const pubSlider = document.querySelector('.slider');
const pubSlides = document.querySelectorAll('.slide');
const pubPrevBtn = document.querySelector('.left');
const pubNextBtn = document.querySelector('.right');

let pubIndex = 0;

function showPubSlide(i) {
  const offset = -i * 100;
  pubSlider.style.transform = `translateX(${offset}%)`;
}

pubNextBtn.addEventListener('click', () => {
  pubIndex = (pubIndex + 1) % pubSlides.length;
  showPubSlide(pubIndex);
});

pubPrevBtn.addEventListener('click', () => {
  pubIndex = (pubIndex - 1 + pubSlides.length) % pubSlides.length;
  showPubSlide(pubIndex);
});

// Auto slide pubs
setInterval(() => {
  pubIndex = (pubIndex + 1) % pubSlides.length;
  showPubSlide(pubIndex);
}, 2500);


// === HERO CAROUSEL (accueil) ===
  const slides = document.querySelectorAll('.carousel-slide');
  const nextBtn = document.querySelector('.carousel-nav.next');
  const prevBtn = document.querySelector('.carousel-nav.prev');
  let index = 0;

  function showSlide(i) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[i].classList.add('active');
  }

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    showSlide(index);
  });

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  });

  // Auto-slide (optionnel)
  setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 4000); // toutes les 7 secondes


document.querySelectorAll('.produit-box').forEach(box => {
  console.log('Produit box détecté:', box);
  const btnMoins = box.querySelector('.moins');
  const btnPlus = box.querySelector('.plus');
  const inputQuantite = box.querySelector('.quantite-input');
  const prixElement = box.querySelector('.produit-prix');
  const prixUnitaire = parseInt(prixElement.dataset.prix, 10);
  const commanderBtn = box.querySelector('.btn-commander');
  const nomProduit = box.querySelector('.produit-nom').innerText;

  function updatePrix() {
    let quantite = parseInt(inputQuantite.value, 10);
    if (isNaN(quantite) || quantite < 1) quantite = 1;
    inputQuantite.value = quantite;
    const prixTotal = prixUnitaire * quantite;
    prixElement.textContent = `Prix : ${prixTotal.toLocaleString()} FCFA`;
  }

  btnMoins.addEventListener('click', () => {
    console.log("clic moins");
    let quantite = parseInt(inputQuantite.value, 10);
    if (quantite > 1) {
      inputQuantite.value = quantite - 1;
      updatePrix();
    }
  });

  btnPlus.addEventListener('click', () => {
    console.log("clic plus");
    let quantite = parseInt(inputQuantite.value, 10);
    inputQuantite.value = quantite + 1;
    updatePrix();
  });

  inputQuantite.addEventListener('input', () => {
    updatePrix();
  });

  commanderBtn.addEventListener('click', () => {
    const quantite = parseInt(inputQuantite.value, 10);
    const total = prixUnitaire * quantite;
    const message = `Commande : ${nomProduit}\nQuantité : ${quantite}\nTotal : ${total.toLocaleString()} FCFA`;
   
  });

  updatePrix();
});




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



