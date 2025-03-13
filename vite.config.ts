import { defineConfig } from 'vite';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// Функция для безопасного выполнения Git-команд
const getGitInfo = () => {
  try {
    if (!existsSync('.git')) {
      throw new Error('Not a git repository');
    }

    return {
      commitHash: execSync('git rev-parse --short HEAD').toString().trim(),
      branch: execSync('git rev-parse --abbrev-ref HEAD').toString().trim(),
      commitTime: execSync('git log -1 --format=%cd').toString().trim(),
      author: execSync('git log -1 --format=%an').toString().trim(),
      email: execSync('git log -1 --format=%ae').toString().trim(),
      remoteUrl: execSync('git config --get remote.origin.url').toString().trim(),
      repoName: 'medieage/bolt.diy',
    };
  } catch {
    return {
      commitHash: 'unknown',
      branch: 'unknown',
      commitTime: 'unknown',
      author: 'unknown',
      email: 'unknown',
      remoteUrl: 'https://github.com/medieage/bolt.diy.git',
      repoName: 'medieage/bolt.diy',
    };
  }
};

// Получение информации из package.json
const getPackageJson = () => {
  try {
    const pkgPath = join(process.cwd(), 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

    return {
      name: pkg.name,
      description: pkg.description,
      license: pkg.license,
      dependencies: pkg.dependencies || {},
      devDependencies: pkg.devDependencies || {},
      peerDependencies: pkg.peerDependencies || {},
      optionalDependencies: pkg.optionalDependencies || {},
    };
  } catch {
    return {
      name: 'bolt.diy',
      description: 'A DIY LLM interface',
      license: 'MIT',
      dependencies: {},
      devDependencies: {},
      peerDependencies: {},
      optionalDependencies: {},
    };
  }
};

const pkg = getPackageJson();
const gitInfo = getGitInfo();

console.log(`📍 Current Git Commit: ${gitInfo.commitHash}`);
console.log(`📍 Current Branch: ${gitInfo.branch}`);

export default defineConfig({
  define: {
    __COMMIT_HASH: JSON.stringify(gitInfo.commitHash),
    __GIT_BRANCH: JSON.stringify(gitInfo.branch),
    __GIT_COMMIT_TIME: JSON.stringify(gitInfo.commitTime),
    __GIT_AUTHOR: JSON.stringify(gitInfo.author),
    __GIT_EMAIL: JSON.stringify(gitInfo.email),
    __GIT_REMOTE_URL: JSON.stringify(gitInfo.remoteUrl),
    __GIT_REPO_NAME: JSON.stringify(gitInfo.repoName),
    __APP_VERSION: JSON.stringify(process.env.npm_package_version),
    __PKG_NAME: JSON.stringify(pkg.name),
    __PKG_DESCRIPTION: JSON.stringify(pkg.description),
    __PKG_LICENSE: JSON.stringify(pkg.license),
  }
}); // 🔴 Здесь была ошибка, теперь скобка закрыта правильно