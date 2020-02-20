const fs = require('fs');
const path = require('path');
const colors = require('colors');
const pkg = require('./../package');

exports.updatePackageJson = (version) => {
  console.log(colors.cyan('Update package.json'));
  const packageJsonData = {...pkg};
  packageJsonData.version = version;
  fs.writeFileSync(path.join(__dirname, '..', 'package.json'), JSON.stringify(packageJsonData, null, 2));
  return packageJsonData;
};
