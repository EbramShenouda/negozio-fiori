const app = require('./app');
const env = require('./config/env');
const { runSeed } = require('./services/seedService');

async function start() {
  // Seed del database (eseguito solo se il DB è vuoto)
  await runSeed();

  app.listen(env.port, () => {
    console.log(`\n🌸 Fiori di Sandro – Backend avviato`);
    console.log(`   Ambiente : ${env.nodeEnv}`);
    console.log(`   URL      : http://localhost:${env.port}`);
    console.log(`   API      : http://localhost:${env.port}/api`);
    console.log(`   Admin    : http://localhost:${env.port}/api/admin`);
    console.log('');
  });
}

start().catch((err) => {
  console.error('Errore avvio server:', err);
  process.exit(1);
});
