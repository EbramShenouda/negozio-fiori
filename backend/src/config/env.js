// Carica e valida le variabili d'ambiente
require('dotenv').config();

const env = {
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-CAMBIA-IN-PRODUZIONE-minimo-32-caratteri',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // Credenziali admin iniziali (seed al primo avvio)
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'CambiamiSubito123!',

  // Numero WhatsApp (formato internazionale senza +)
  whatsappNumber: process.env.WHATSAPP_NUMBER || '393451234567',

  // Percorso database SQLite
  dbPath: process.env.DB_PATH || './data/fiori-di-sandro.db',

  // Upload immagini
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 5 MB

  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// Blocco critico: JWT secret non configurato in produzione
if (env.isProduction && env.jwtSecret.includes('CAMBIA')) {
  console.error('ERRORE CRITICO: JWT_SECRET non è configurato correttamente per la produzione!');
  process.exit(1);
}

module.exports = env;
