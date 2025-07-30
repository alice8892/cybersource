#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

// Extract arguments passed to this script
const args = process.argv.slice(2);

// Parse Jest-style coverage flags
let useCoverage = false;
let coverageReporters = ['text'];
let collectCoverageFrom = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--coverage') {
    useCoverage = true;
  } else if (args[i] === '--coverageReporters') {
    coverageReporters = args[i + 1].split(',');
    i++;
  } else if (args[i].startsWith('--coverageReporters=')) {
    coverageReporters = args[i].split('=')[1].split(',');
  } else if (args[i] === '--collectCoverageFrom') {
    collectCoverageFrom = args[i + 1].split(',');
    i++;
  } else if (args[i].startsWith('--collectCoverageFrom=')) {
    collectCoverageFrom = args[i].split('=')[1].split(',');
  }
}

// Build first
console.log('Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed');
  process.exit(1);
}

// Run linting
console.log('Running linting...');
try {
  execSync('npm run test:lint', { stdio: 'inherit' });
} catch (error) {
  console.error('Linting failed');
  process.exit(1);
}

// Run unit tests with coverage
console.log('Running unit tests with coverage...');
const nycReporters = coverageReporters.join(' ');
const testCommand = `npx nyc --reporter=${nycReporters} ava`;
try {
  execSync(testCommand, { stdio: 'inherit' });
} catch (error) {
  console.error('Tests failed');
  process.exit(1);
}

console.log('All tests completed successfully!');
