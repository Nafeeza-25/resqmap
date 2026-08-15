import { spawn } from 'node:child_process';

const commands = [
  ['backend', ['--prefix', 'backend', 'run', 'serve']],
  ['frontend', ['--prefix', 'frontend', 'run', 'dev']]
];

const children = commands.map(([name, args]) => {
  const child = spawn('npm', args, { stdio: 'inherit', shell: process.platform === 'win32' });
  child.on('error', error => console.error(`[${name}] ${error.message}`));
  return child;
});

let shuttingDown = false;
function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) if (!child.killed) child.kill('SIGTERM');
  setTimeout(() => process.exit(code), 100).unref();
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
for (const child of children) child.on('exit', code => {
  if (!shuttingDown && code !== 0) shutdown(code ?? 1);
});
