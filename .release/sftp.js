const colors = require('colors');
const Client = require('ssh2-sftp-client');
const sftp = new Client();

exports.uploadDirToServer = async (config) => {
  console.log('Server Config:');
  console.log(config + '\n');

  try {
    await sftp.connect(config.ssh);

    sftp.on('upload', info => {
      console.log(colors.gray(`Uploaded file ${info.source}`));
    });

    const result = await sftp.uploadDir(config.sourcePath, config.destinationPath);
    console.log(colors.green(result));
    return result;
  } catch (e) {
    console.log(e);
  } finally {
    await sftp.end();
  }
};
