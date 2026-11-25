const { spawn } = require('child_process');

const isWindows = process.platform === 'win32';
const npmCommand = 'npm';

const commands = [
  ['backend', ['--prefix', 'server', 'run', 'dev']],
  ['frontend', ['--prefix', 'client', 'run', 'dev']],
];

const children = commands.map(([name, args]) => {
  const child = spawn(npmCommand, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: isWindows,
  });

  child.on('exit', code => {
    if (code !== 0 && code !== null) {
      console.error(`${name} exited with code ${code}`);
      process.exitCode = code;
    }
  });

  return child;
});

const shutdown = () => {
  children.forEach(child => {
    if (!child.killed) child.kill();
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
