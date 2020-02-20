const path = require('path');
const {argv} = require('yargs');
const semver = require('semver');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const {runCommand, commandModel, yesOrNoQuestion} = require('./command');
const {updatePackageJson} = require('./package');
const {uploadDirToServer} = require('./sftp');
const pkg = require('./../package');

const version = argv.v || semver.inc(pkg.version, 'patch');

const config = {
  ssh: {
    host: process.env.SFTP_SERVER,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASSWORD,
    port: process.env.SFTP_PORT,
  },
  sourcePath: path.join(__dirname, '..', './dist'),
  destinationPath: process.env.SFTP_DESTINATION_PATH,
};

const buildCommand = commandModel('npm', ['run', 'build']);

return yesOrNoQuestion(`
  Are you sure do you want to release the package with a version of ${version}?` + '\n[ YES ] to continue, [ NO ] to abort: '
)
  .then(() => updatePackageJson(version))
  .then(() => runCommand(buildCommand))
  .then(() => uploadDirToServer(config))
  .catch(e => console.log(e));
