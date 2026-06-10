const path = require('path');
const multer = require('multer');
const db = require('./db');         // Supabase client
const env = require('./env');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Multer con memoria RAM (nessun file locale).
 * Il buffer verrà poi caricato su Supabase Storage.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato file non supportato. Usa JPEG, PNG o WebP.'), false);
    }
  },
  limits: { fileSize: env.maxFileSize },
});

/**
 * Carica un file (da multer memoryStorage) su Supabase Storage.
 * Restituisce l'URL pubblico dell'immagine.
 *
 * @param {Express.Multer.File} file
 * @returns {Promise<string>} URL pubblico
 */
async function uploadToSupabase(file) {
  const ext      = path.extname(file.originalname).toLowerCase() || '.jpg';
  const fileName = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const bucket   = env.supabaseStorageBucket;

  const { error: uploadError } = await db.storage
    .from(bucket)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload Supabase Storage fallito: ${uploadError.message}`);
  }

  // Recupera URL pubblico
  const { data } = db.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Rimuove un'immagine da Supabase Storage dato il suo URL pubblico.
 * Ignora in silenzio se l'URL non è del nostro bucket o è nullo.
 *
 * @param {string|null} imageUrl
 */
async function deleteFromSupabase(imageUrl) {
  if (!imageUrl) return;
  const bucket = env.supabaseStorageBucket;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx    = imageUrl.indexOf(marker);
  if (idx === -1) return;                 // immagine esterna (es. demo Unsplash)
  const filePath = imageUrl.slice(idx + marker.length);
  await db.storage.from(bucket).remove([filePath]);
}

module.exports = { upload, uploadToSupabase, deleteFromSupabase };
