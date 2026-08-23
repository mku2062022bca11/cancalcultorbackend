const { execSync } = require('child_process');
const dotenv = require('dotenv');

dotenv.config();

const pushEnv = (key, value) => {
  if (!value) return;
  console.log(`Pushing ${key}...`);
  try {
    execSync(`npx --yes vercel env add ${key} production`, {
      input: value,
      stdio: ['pipe', 'pipe', 'pipe'] // This prevents the CLI from opening a TTY prompt
    });
    console.log(`Successfully pushed ${key}`);
  } catch (err) {
    console.error(`Error pushing ${key}:`, err.message);
  }
};

pushEnv('MONGODB_URI', process.env.MONGODB_URI);
pushEnv('JWT_SECRET', process.env.JWT_SECRET || 'fallback_secret_key_123');
pushEnv('FRONTEND_URL', process.env.FRONTEND_URL || 'https://cancalculatorfrontend.vercel.app');

