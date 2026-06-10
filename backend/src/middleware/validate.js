const { body, validationResult } = require('express-validator');

/**
 * Esegue la validazione e restituisce 422 se ci sono errori.
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Dati non validi.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  return next();
}

// ──────────────────────────────────────────────────────────
// Regole di validazione
// ──────────────────────────────────────────────────────────

const validateLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username obbligatorio.')
    .isLength({ max: 64 }).withMessage('Username troppo lungo.'),
  body('password')
    .notEmpty().withMessage('Password obbligatoria.')
    .isLength({ max: 128 }).withMessage('Password troppo lunga.'),
  handleValidation,
];

const validateProduct = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Il nome del prodotto è obbligatorio.')
    .isLength({ max: 255 }).withMessage('Nome massimo 255 caratteri.'),
  body('prezzo')
    .notEmpty().withMessage('Il prezzo è obbligatorio.')
    .isFloat({ min: 0 }).withMessage('Il prezzo deve essere un numero positivo.'),
  body('descrizione')
    .optional()
    .isLength({ max: 2000 }).withMessage('Descrizione massimo 2000 caratteri.'),
  body('categoria_id')
    .optional({ nullable: true })
    .isString(),
  body('disponibile')
    .optional(),
  handleValidation,
];

const validateCategory = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Il nome della categoria è obbligatorio.')
    .isLength({ max: 100 }).withMessage('Nome massimo 100 caratteri.'),
  body('descrizione')
    .optional()
    .isLength({ max: 500 }).withMessage('Descrizione massimo 500 caratteri.'),
  handleValidation,
];

module.exports = { validateLogin, validateProduct, validateCategory };
