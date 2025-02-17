import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const REPO_URL = 'https://github.com/fishaudio/fish-speech.git';
const FISH_SPEECH_DIR = join(__dirname, '../fish-speech');
const VENV_DIR = join(FISH_SPEECH_DIR, 'venv');
const MODELS_DIR = join(FISH_SPEECH_DIR, 'models');

// Helper function to run commands
function runCommand(command, options = {}) {
try {
    execSync(command, { stdio: 'inherit', ...options });
} catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error);
    process.exit(1);
}
}

// Main setup function
async function setup() {
console.log('Setting up Fish Speech...');

// Clone repository if it doesn't exist
if (!existsSync(FISH_SPEECH_DIR)) {
    console.log('\nCloning Fish Speech repository...');
    runCommand(`git clone ${REPO_URL} "${FISH_SPEECH_DIR}"`);
} else {
    console.log('\nFish Speech repository already exists. Pulling latest changes...');
    runCommand('git pull', { cwd: FISH_SPEECH_DIR });
}

// Create virtual environment
console.log('\nCreating Python virtual environment...');
if (!existsSync(VENV_DIR)) {
    runCommand('python -m venv venv', { cwd: FISH_SPEECH_DIR });
}

// Install the package in development mode
try {
  console.log('Installing Fish Speech package...');
  execSync('pip install -e .', { 
    cwd: './fish-speech',
    stdio: 'inherit'
  });

  console.log('Downloading Fish Speech models...');
  // Add error handling and verification
  try {
    execSync('python -c "from fish_speech.cli import download_models"', {
      cwd: './fish-speech',
      stdio: 'inherit'
    });
    
    execSync('python -m fish_speech.cli.download_models', {
      cwd: './fish-speech', 
      stdio: 'inherit'
    });
  } catch (err) {
    console.warn('Warning: Could not download models automatically.');
    console.log('Please run: cd fish-speech && python -m fish_speech.cli.download_models');
  }
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}

// Create models directory
if (!existsSync(MODELS_DIR)) {
    mkdirSync(MODELS_DIR, { recursive: true });
}

console.log('\nSetup completed successfully!');
console.log('\nNext steps:');
console.log('1. Make sure you have a CUDA-compatible GPU (or use CPU mode)');
console.log('2. Update your .env file with the correct paths:');
console.log(`   VITE_FISH_SPEECH_PYTHON_PATH=${join(VENV_DIR, process.platform === 'win32' ? 'Scripts\\python.exe' : 'bin/python')}`);
console.log(`   VITE_FISH_SPEECH_MODEL_PATH=${MODELS_DIR}`);
console.log('3. Start your application with: npm run dev');
}

// Run setup
setup().catch(error => {
console.error('Setup failed:', error);
process.exit(1);
}); 