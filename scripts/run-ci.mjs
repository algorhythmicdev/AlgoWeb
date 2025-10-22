#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const packageJsonPath = new URL('../package.json', import.meta.url);
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
const scripts = packageJson.scripts ?? {};

const steps = [
  { label: 'Lint', script: 'lint' },
  { label: 'Typecheck', script: 'typecheck' },
  { label: 'Test', script: 'test' },
  { label: 'Build', script: 'build' }
];

for (const step of steps) {
  if (!(step.script in scripts)) {
    console.log(`Skipping ${step.label}: no \`${step.script}\` script defined.`);
    continue;
  }

  console.log(`\n▶ Running ${step.label} (${step.script})`);

  await new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', step.script], {
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${step.label} failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

console.log('\n✅ All CI checks finished successfully.');
