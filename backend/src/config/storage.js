const path = require('path');
const fs = require('fs');
const multer = require('multer');
const env = require('./env');

// Crea la directory uploads se non esiste
const uploadDir = path.resolve(env.uploadPath);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Tipi di file immagine accettati
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Configurazione storage locale (sviluppo e produzione self-hosted)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    // Nome file sicuro: timestamp + estensione originale
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, safeName);
  },
});

// Filtro tipo file – accetta solo immagini
const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato file non supportato. Usa JPEG, PNG o WebP.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxFileSize },
});

/**
 * Restituisce l'URL pubblico di un'immagine.
 * Se il path inizia con http, è un URL esterno (demo data).
 * Altrimenti è un path locale nel filesystem.
 */
function getImageUrl(req, imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const filename = path.basename(imagePath);
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${filename}`;
}

module.exports = { upload, getImageUrl, uploadDir };
