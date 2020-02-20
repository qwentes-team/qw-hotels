const fs = require('fs');
const colors = require('colors');
const pkg = require('./../package');

exports.updatePackageJson = (version) => {
  console.log(colors.cyan('Update package.json'));
  const packageJsonData = {...pkg};
  packageJsonData.version = version;
  fs.writeFileSync(`${__dirname}/../package.json`, JSON.stringify(packageJsonData, null, 2));
  return packageJsonData;
};
