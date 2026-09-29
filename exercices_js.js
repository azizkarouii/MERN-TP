
const produits = [
    { nom: "Clavier", prix: 45 },
    { nom: "Écran", prix: 320 },
    { nom: "Souris", prix: 25 }
];

const { nom, prix } = produits[0];
console.log(nom, prix);

const produit_souris = produits.find(p => p.nom === "Souris");
console.log(produit_souris.prix);

const produits_moins100 = produits.filter(p => p.prix < 100);
console.log(produits_moins100);

const avecRemise = prix => prix - (prix * 10 / 100);
console.log(avecRemise(produits[1].prix));
