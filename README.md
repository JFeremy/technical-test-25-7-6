# Technical Test - Mower Simulation API

API construite avec NestJS pour simuler des déplacements de tondeuses sur une pelouse à partir d'instructions textuelles.

## 🚀 Fonctionnalités

- Upload de fichier `.txt` contenant les instructions.
- Traitement des positions et mouvements des tondeuses.
- Retour des positions finales.
- Documentation Swagger auto-générée.

## 🛠️ Installation

```bash
pnpm install
```

## ▶️ Démarrage

```bash
# Lancer le projet en mode développement
pnpm run start:dev
```

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests end-to-end
pnpm test:e2e
```

## 📂 Exemple de fichier .txt attendu

```
5 5
1 2 N
LFLFLFLFF
3 3 E
MMRMMRMRRM
```

## 📤 Endpoint

```
POST /mowers-instructions
Content-Type: multipart/form-data
Body: { file: <fichier.txt> }
```

Réponse (text/plain) :

```
1 3 N
5 1 E
```

## 📘 Documentation Swagger

Disponible à : [http://localhost:3000/api](http://localhost:3000/api)

## 📄 Licence

Projet sous licence UNLICENSED
