const colors = require('colors');
const path = require('path');
const Client = require('ssh2-sftp-client');
const sftp = new Client();

exports.uploadDirToServer = async (config) => {
  console.log('Server Config:');
  console.log(config);
  console.log();

  try {
    await sftp.connect(config.ssh);

    sftp.on('upload', info => {
      console.log(colors.gray(`Uploaded file ${info.source}`));
    });

    await sftp.put(path.join(__dirname, '..', 'package.json'), `${config.destinationPath}/package.json`);
    console.log(colors.gray(`Uploaded file package.json`));

    const result = await sftp.uploadDir(config.sourcePath, config.destinationPath);
    console.log(colors.green(result));
    return result;
  } catch (e) {
    console.log(e);
  } finally {
    await sftp.end();
  }
};
