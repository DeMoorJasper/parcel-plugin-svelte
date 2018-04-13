const assert = require('assert');
const rimraf = require('rimraf');
const path = require('path');
const ncp = require('./ncp');
const spawn = require('cross-spawn');

const INPUT_FOLDER = path.join(__dirname, './input');

describe('Svelte', () => {
  beforeEach(() => {
    rimraf.sync(INPUT_FOLDER);
  });

  it('Should run basic example without any errors', async () => {
    // Copy all data
    const sourceFolder = path.join(__dirname, './integration/basic');
    await ncp(sourceFolder, INPUT_FOLDER);

    // Install all deps
    const yarnInstall = spawn('yarn', ['install'], {
      cwd: INPUT_FOLDER
    });
    yarnInstall.stdout.pipe(process.stdout);
    yarnInstall.stderr.pipe(process.stderr);
    await new Promise(resolve => yarnInstall.once('close', resolve));

    // Run build command
    const yarnBuild = spawn('yarn', ['build'], {
      cwd: INPUT_FOLDER
    });
    yarnBuild.stdout.pipe(process.stdout);
    yarnBuild.stderr.on('data', (data) => {
      throw new Error(data);
    });
    await new Promise(resolve => yarnBuild.once('close', resolve));
  });

  it('Should run basic example with config without any errors', async () => {
    // Copy all data
    const sourceFolder = path.join(__dirname, './integration/config');
    await ncp(sourceFolder, INPUT_FOLDER);

    // Install all deps
    const yarnInstall = spawn('yarn', ['install'], {
      cwd: INPUT_FOLDER
    });
    yarnInstall.stdout.pipe(process.stdout);
    yarnInstall.stderr.pipe(process.stderr);
    await new Promise(resolve => yarnInstall.once('close', resolve));

    // Run build command
    const yarnBuild = spawn('yarn', ['build'], {
      cwd: INPUT_FOLDER
    });
    yarnBuild.stdout.pipe(process.stdout);
    yarnBuild.stderr.on('data', (data) => {
      throw new Error(data);
    });
    await new Promise(resolve => yarnBuild.once('close', resolve));
  });
});