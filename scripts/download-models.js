import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create models directory if it doesn't exist
const modelsDir = join(__dirname, '../fish-speech/models');
if (!existsSync(modelsDir)) {
  mkdirSync(modelsDir, { recursive: true });
}

// Download models
console.log('Downloading Fish Speech models...');
try {
  execSync('python -m fish_speech.cli.download_models', {
    cwd: join(__dirname, '../fish-speech'),
    stdio: 'inherit'
  });
  console.log('Models downloaded successfully!');
} catch (error) {
  console.error('Error downloading models:', error);
  process.exit(1);
} 