# 🌸 Fiori di Sandro – Sito Web Negozio di Fiori

Applicazione web full-stack moderna per il negozio di fiori **Fiori di Sandro**.  
Costruita con React + Vite + Tailwind CSS (frontend) e Node.js + Express + SQLite (backend).

---

## 📋 Indice

- [Funzionalità](#funzionalità)
- [Stack tecnologico](#stack-tecnologico)
- [Struttura del progetto](#struttura-del-progetto)
- [Installazione locale](#installazione-locale)
- [Avvio in sviluppo](#avvio-in-sviluppo)
- [Credenziali admin iniziali](#credenziali-admin-iniziali)
- [Configurazione WhatsApp](#configurazione-whatsapp)
- [Deploy gratuito](#deploy-gratuito)
- [Personalizzazione](#personalizzazione)

---

## ✨ Funzionalità

**Sito pubblico**
- Home con hero, prodotti in evidenza, recensioni e CTA WhatsApp
- Catalogo prodotti con filtri per categoria
- Pagina dettaglio prodotto con galleria e pulsante WhatsApp
- Chi Siamo con storia e mission del negozio
- Contatti con mappa, info e form WhatsApp integrato
- Design responsive (smartphone, tablet, desktop)
- Animazioni e transizioni moderne

**Area Admin**
- Login protetto con JWT
- Dashboard con statistiche
- CRUD completo prodotti (nome, descrizione, prezzo, categoria, immagine, disponibilità)
- Upload immagini con anteprima
- Gestione categorie
- Logout sicuro

**Tecnico**
- SEO: meta tag, Open Graph, robots.txt, sitemap.xml
- URL pulite con slug
- Sicurezza: bcrypt, JWT, helmet, rate limiting, validazione input, sanitizzazione
- Seed automatico con dati demo al primo avvio

---

## 🛠 Stack tecnologico

| Livello   | Tecnologia |
|-----------|-----------|
| Frontend  | React 18 + Vite 5 + Tailwind CSS 3 |
| Routing   | React Router v6 |
| Icone     | Lucide React |
| Notifiche | React Hot Toast |
| SEO       | React Helmet Async |
| HTTP      | Axios |
| Backend   | Node.js + Express 4 |
| Auth      | JWT (jsonwebtoken) + bcryptjs |
| Upload    | Multer |
| Sicurezza | Helmet + CORS + express-rate-limit + express-validator |

---

## 📁 Struttura del progetto

```
fiori-di-sandro/
├── .env.example              # Template variabili d'ambiente
├── .gitignore
├── package.json              # Script root (dev, build, install:all)
├── render.yaml               # Configurazione deploy Render.com
│
├── backend/
│   ├── package.json
│   ├── uploads/              # Immagini caricate (sviluppo)
│   ├── data/                 # File database SQLite (creato a runtime)
│   └── src/
│       ├── server.js         # Avvio server
│       ├── app.js            # Express app + middleware
│       ├── config/
│       │   ├── env.js        # Variabili d'ambiente
│       │   ├── db.js         # Inizializzazione SQLite
│       │   └── storage.js    # Multer + upload config
│       ├── models/
│       │   ├── productModel.js
│       │   └── categoryModel.js
│       ├── controllers/
│       │   ├── productsController.js
│       │   ├── categoriesController.js
│       │   └── authController.js
│       ├── middleware/
│       │   ├── auth.js       # JWT middleware
│       │   ├── validate.js   # express-validator rules
│       │   └── errorHandler.js
│       ├── routes/
│       │   ├── publicRoutes.js
│       │   └── adminRoutes.js
│       ├── services/
│       │   ├── productService.js
│       │   └── seedService.js  # Seed dati demo
│       └── utils/
│           ├── slugify.js
│           └── sanitize.js
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── public/
    │   ├── robots.txt
    │   └── sitemap.xml
    └── src/
        ├── main.jsx          # Bootstrap app
        ├── App.jsx           # Router + layout
        ├── index.css         # Stili globali + Tailwind
        ├── config.js         # Configurazione frontend
        ├── context/
        │   └── AuthContext.jsx
        ├── hooks/
        │   ├── useProducts.js
        │   └── useProduct.js
        ├── lib/
        │   ├── api.js        # Axios + interceptors
        │   └── whatsapp.js   # Builder URL WhatsApp
        ├── components/
        │   ├── layout/
        │   │   ├── SiteLayout.jsx
        │   │   ├── Header.jsx
        │   │   ├── Footer.jsx
        │   │   └── AdminLayout.jsx
        │   ├── products/
        │   │   ├── ProductCard.jsx
        │   │   └── ProductGrid.jsx
        │   ├── ui/
        │   │   ├── Button.jsx (componenti @layer)
        │   │   ├── LoadingSpinner.jsx
        │   │   └── WhatsAppButton.jsx
        │   └── seo/
        │       └── SEOHead.jsx
        └── pages/
            ├── Home.jsx
            ├── Catalogo.jsx
            ├── ProdottoDettaglio.jsx
            ├── ChiSiamo.jsx
            ├── Contatti.jsx
            ├── NotFound.jsx
            └── admin/
                ├── Login.jsx
                ├── Dashboard.jsx
                ├── ProdottiAdmin.jsx
                ├── ProdottoForm.jsx
                └── CategorieAdmin.jsx
```

---

## 🚀 Installazione locale

**Prerequisiti**: Node.js 20+ e npm

```bash
# 1. Clona o entra nella cartella
cd fiori-di-sandro

# 2. Installa tutte le dipendenze (root + backend + frontend)
npm run install:all

# 3. Crea il file .env del backend
cp .env.example backend/.env
```

Modifica `backend/.env` con i tuoi valori (almeno `JWT_SECRET` e `WHATSAPP_NUMBER`).

---

## ▶️ Avvio in sviluppo

```bash
# Avvia backend (porta 3001) e frontend (porta 5173) insieme
npm run dev
```

Oppure separatamente:

```bash
# Solo backend
npm run dev:backend

# Solo frontend
npm run dev:frontend
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Admin panel: http://localhost:5173/admin

---

## 🔐 Credenziali admin iniziali

Al primo avvio il seed crea automaticamente:

| Campo    | Valore              |
|----------|---------------------|
| Username | `admin`             |
| Password | `CambiamiSubito123!` |

> ⚠️ **Cambia subito la password** modificando `ADMIN_PASSWORD` in `backend/.env`  
> e cancellando il file database (`backend/data/fiori-di-sandro.db`) per forzare il re-seed.

---

## 📱 Configurazione WhatsApp

1. Apri `backend/.env`
2. Imposta `WHATSAPP_NUMBER` con il numero in formato internazionale **senza +**:
   ```
   WHATSAPP_NUMBER=393451234567
   ```
   (per il numero +39 345 123 4567)

Il frontend carica automaticamente il numero dall'API `/api/config`.

---

## 🌐 Deploy gratuito

### Frontend → Vercel

1. Crea un account su [vercel.com](https://vercel.com)
2. Importa la cartella `frontend/` come nuovo progetto
3. Imposta la variabile d'ambiente:
   ```
   VITE_API_URL=https://tuo-backend.onrender.com
   ```
4. Deploy automatico ad ogni push

### Backend → Render.com

1. Crea un account su [render.com](https://render.com)
2. **New → Web Service** → connetti il repository
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Aggiungi un **Disk** (1 GB, mount path `/data`) per persistenza SQLite
7. Configura le variabili d'ambiente:
   - `NODE_ENV=production`
   - `JWT_SECRET=<stringa-casuale-sicura-min-32-char>`
   - `ADMIN_PASSWORD=<tua-password-sicura>`
   - `WHATSAPP_NUMBER=<numero-internazionale>`
   - `FRONTEND_URL=https://tuo-frontend.vercel.app`
   - `DB_PATH=/data/fiori-di-sandro.db`
   - `UPLOAD_PATH=/data/uploads`

> Il deploy con Render free tier include 750 ore/mese e il server va in sleep dopo 15 min di inattività. Il primo accesso dopo il sleep impiega ~30 secondi.

---

## 🎨 Personalizzazione

### Dati del negozio

Modifica `frontend/src/config.js`:

```javascript
export const CONTACT = {
  telefono: '+39 02 1234567',
  email:    'info@tuonegozio.it',
  indirizzo: 'Via dei Fiori 12, 20100 Milano (MI)',
  orari:    'Lun–Sab: 08:00–19:30 | Dom: 09:00–13:00',
};
```

### Colori brand

Modifica `frontend/tailwind.config.js` → sezione `colors.brand` per il verde primario e `colors.petal` per l'accento rosa.

### Mappa Google

Nella pagina `Contatti.jsx`, sostituisci il valore `src` dell'iframe `<iframe>` con il link di incorporamento della tua vera posizione da [Google Maps](https://www.google.com/maps).

### robots.txt e sitemap.xml

Aggiorna `frontend/public/robots.txt` e `frontend/public/sitemap.xml` con il tuo dominio reale.

---

## 🔒 Note di sicurezza

- Il token JWT è salvato nel `localStorage` del browser (accettabile per un pannello admin con utenti fidati)
- Rate limiting attivo: 200 req/15min globali, 10 tentativi di login/15min
- Tutte le input sono validate lato server con `express-validator`
- Le stringhe utente sono sanitizzate prima del salvataggio
- L'header `helmet` aggiunge le protezioni HTTP standard (CSP, HSTS, ecc.)
- Le password sono hashate con bcrypt (10 rounds)

---

## 📄 Licenza

Progetto privato – uso commerciale riservato a Fiori di Sandro.
