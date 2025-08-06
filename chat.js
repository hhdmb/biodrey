const chatBox = document.getElementById('chat-box');
const chatOptions = document.querySelector('.chat-options');

const questions = {
  "Commander": [
    ["Comment commander ?", "Pour commander, choisissez l'article, ajoutez-le au panier, validez, faites le dépôt sur le numéro indiqué puis remplissez le formulaire de commande."],
   
  ],
  "Paiement": [
    ["Comment faire le paiement ?", "Faites le dépôt sur le numéro affiché lors de la commande."]
  ],
  "Livraison": [
    ["Quel est le délai de livraison ?", "Après la commande, notre service client vous contactera pour plus d’informations."]
  ],
  "Utilisation des produits": [
    ["Comment utiliser le spray Bio-Drey?", "Le Spray Bio-Drey est un soin sans rinçage (125 ml) qui nourrit et hydrate intensément vos cheveux. Il referme les cuticules, limite la casse et stimule la pousse rapide. Intégrez-le à votre routine capillaire pour retrouver éclat, souplesse et vitalité."],
    ["Comment utiliser la pommade de cheveux Bio-Drey ?", "La Pommade Bio-Drey (200 ml) est un soin sans rinçage qui hydrate et protège durablement vos cheveux. Elle réduit la casse, prévient la décoloration et renforce la fibre capillaire, tout en gardant vos cheveux doux et éclatants."],
    ["Comment utiliser le sérum d’huile Bio-Drey ?", "Le Sérum d’huile Bio-Drey (60 ml) mélange 3 huiles végétales et 5 plantes pour favoriser la pousse, donner du volume et traiter les problèmes comme l’alopécie, les démangeaisons ou pellicules. Appliquez-le sur les zones concernées pour des résultats visibles."],
    ["Comment utiliser le shampoing démêlant Bio-Drey ?", "Le shampoing démêlant Bio-Drey est un soin 2 en 1 qui nettoie en profondeur le cuir chevelu, élimine pellicules, teignes, boutons et poux, tout en démêlant vos cheveux. Utilisez-le comme un shampoing classique, puis rincez abondamment."]
  ]
};

function addMessage(text, sender = 'bot') {
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function clearOptions() {
  chatOptions.innerHTML = '';
}

function addOptions(options, callback) {
  clearOptions();
  options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'option-button';
    btn.textContent = option;
    btn.onclick = () => {
      addMessage(option, 'user');
      clearOptions();
      setTimeout(() => callback(option), 300);
    };
    chatOptions.appendChild(btn);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function askCategory() {
  addOptions(Object.keys(questions), selected => {
    addMessage(`Voici les questions pour : ${selected}`);
    askQuestion(selected);
  });
}

function askQuestion(category) {
  addOptions(questions[category].map(q => q[0]), question => {
    const answer = questions[category].find(item => item[0] === question)[1];
    addMessage(answer);
    setTimeout(() => {
      addMessage("Souhaitez-vous une autre question ?");
      addOptions(["Oui", "Non"], response => {
        if (response === "Oui") {
          askCategory();
        } else {
          addMessage("Merci de votre visite chez Bio-Drey !");
          clearOptions();
        }
      });
    }, 500);
  });
}

// Démarrage
addMessage("Bonjour et bienvenue chez Bio-Drey ! Comment puis-je vous aider ?");
askCategory();
