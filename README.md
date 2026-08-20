# Mes Cartes — app de cartes de fidélité

Une petite app web pour stocker tes cartes de fidélité et afficher le code-barres en caisse. Aucun compte, aucun serveur, tout reste dans ton téléphone.

## Fonctionnalités

- Ajouter, modifier, supprimer des cartes (nom, numéro, emoji, couleur)
- Scan du code-barres avec la caméra (bouton dans le champ Numéro) — plus besoin de taper le numéro
- Génération automatique du code-barres (EAN-13, EAN-8, UPC, Code 128, Code 39, ITF-14)
- Affichage plein écran du code-barres scannable en caisse
- Données stockées localement dans le navigateur (rien n'est envoyé sur internet)
- Export / import JSON pour sauvegarde
- Installable en tant qu'app sur iPhone/Android (PWA)
- Fonctionne hors ligne une fois ouvert

## Utilisation

1. Ouvre l'app dans le navigateur.
2. Clique sur **+** en haut à droite pour ajouter une carte.
3. Tape un nom (ex : "Carrefour"), le numéro de fidélité, choisis une couleur et un emoji.
4. En caisse, clique sur la carte pour afficher le code-barres en grand.
5. La caissière scanne directement ton écran.

Astuce : pense à exporter tes cartes via le menu (⋯) régulièrement. Si tu changes de téléphone ou que tu vides le cache, tu pourras réimporter le fichier.

## Mettre en ligne sur GitHub Pages

C'est gratuit et permanent. Étapes :

1. Crée un compte sur [github.com](https://github.com) si tu n'en as pas.
2. Clique sur **New repository** (le bouton vert).
3. Donne-lui un nom, par exemple `mes-cartes`. Coche **Public**. Clique sur **Create repository**.
4. Sur la page du repo, clique sur **uploading an existing file** (lien sous "Quick setup").
5. Glisse-dépose tous les fichiers de ce dossier :
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `JsBarcode.all.min.js`
   - `zxing.min.js`
   - `icon.svg`
   - `icon-192.png`
   - `icon-512.png`
   - `apple-touch-icon.png`
6. En bas, clique sur **Commit changes**.
7. Va dans **Settings → Pages** (dans le menu de gauche).
8. Sous **Branch**, choisis `main` et `/ (root)`, puis **Save**.
9. Attends 1-2 minutes. Ton app sera dispo à l'adresse :
   `https://TON-USERNAME.github.io/mes-cartes/`

## Installation sur le téléphone

**iPhone (Safari) :**
1. Ouvre l'URL GitHub Pages dans Safari.
2. Touche le bouton "Partager" (carré avec flèche vers le haut).
3. Choisis **"Sur l'écran d'accueil"**.
4. L'app apparaît comme une vraie app sur ton écran.

**Android (Chrome) :**
1. Ouvre l'URL dans Chrome.
2. Menu (⋮) → **"Installer l'application"** ou **"Ajouter à l'écran d'accueil"**.

## Astuce caisse

Avant de présenter le code-barres, augmente la luminosité de ton écran à fond — ça améliore la lecture par le scanner. Sur iPhone tu peux activer cette montée de luminosité automatique avec un raccourci.

## Données

Tout est stocké dans le `localStorage` de ton navigateur. Format JSON :

```json
{
  "version": 1,
  "exportedAt": "2026-05-14T10:00:00.000Z",
  "cards": [
    {
      "id": "c_xxx",
      "name": "Carrefour",
      "number": "1234567890123",
      "type": "auto",
      "emoji": "🛒",
      "color": "#3b82f6",
      "created": 1730000000000
    }
  ]
}
```

## Technique

- HTML/CSS/JS pur, aucun framework
- [JsBarcode](https://github.com/lindell/JsBarcode) (embarqué en local, aucun CDN) pour la génération des codes-barres
- Scan caméra : API native `BarcodeDetector` quand disponible (Android/Chrome), sinon [ZXing](https://github.com/zxing-js/library) embarqué en local (iPhone/Safari). Nécessite HTTPS (GitHub Pages convient).
- Service Worker pour le mode hors-ligne
- Manifest PWA pour l'installation

## Confidentialité

Aucune donnée ne sort de ton appareil. Pas de compte, pas de tracking, pas de pub.
