const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..');
const token = process.argv[2];
const repoUrl = 'https://github.com/virajjadhav578-web/Farm_AI_Assistant.git';

if (!token) {
  console.error('Error: Token is required');
  process.exit(1);
}

async function run() {
  console.log('Initializing git repository...');
  await git.init({ fs, dir, defaultBranch: 'main' });

  console.log('Scanning working directory with .gitignore rules...');
  const matrix = await git.statusMatrix({ fs, dir });

  let addedCount = 0;
  for (const [filepath, headStatus, workdirStatus, stageStatus] of matrix) {
    // Safety check: ensure .env.local is NEVER added
    if (filepath.includes('.env.local') || filepath.includes('node_modules') || filepath.includes('.next')) {
      console.warn('Skipping ignored file:', filepath);
      continue;
    }

    if (workdirStatus !== 0) {
      await git.add({ fs, dir, filepath });
      addedCount++;
    }
  }

  console.log(`Staged ${addedCount} files.`);

  console.log('Creating initial commit...');
  const sha = await git.commit({
    fs,
    dir,
    message: 'Initial commit: Farm AI Assistant production platform',
    author: {
      name: 'virajjadhav578-web',
      email: 'virajjadhav578@users.noreply.github.com',
    },
  });

  console.log(`Commit created successfully: ${sha}`);

  console.log('Configuring remote...');
  const remotes = await git.listRemotes({ fs, dir });
  if (!remotes.some(r => r.remote === 'origin')) {
    await git.addRemote({
      fs,
      dir,
      remote: 'origin',
      url: repoUrl,
    });
  }

  console.log(`Pushing to ${repoUrl} (main branch)...`);
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    force: true,
    onAuth: () => ({
      username: 'x-access-token',
      password: token,
    }),
    onProgress: (p) => {
      if (p.phase) {
        process.stdout.write(`\rProgress: ${p.phase} (${p.loaded}/${p.total || '?'})`);
      }
    },
  });

  console.log('\nPush completed successfully!');
  console.log('Result:', pushResult);
}

run().catch((err) => {
  console.error('\nGit operation failed:', err);
  process.exit(1);
});
