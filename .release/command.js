const colors = require('colors');
const {spawn} = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

exports.commandModel = (name, params) => ({name, params});

exports.runCommand = commandArgs => {
  return new Promise((resolve) => {
    const command = spawn(commandArgs.name, commandArgs.params);
    const commandString = command.spawnargs.join(' ');
    console.log(colors.cyan(commandString));
    command.stdout.on('data', data => console.log(colors.gray(data.toString('utf8').trim())));
    command.stderr.on('data', data => console.log(colors.gray(data.toString('utf8').trim())));
    command.on('close', code => {
      console.log(colors.green(`Finished command "${commandString}". Child process exited with code ${code} \n`));
      resolve();
    });
  });
};

exports.yesOrNoQuestion = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      if (answer.toLowerCase() === 'yes') {
        console.log('Your answer is yes, continue.');
        resolve();
      } else {
        console.log(`Your answer is ${answer}, exit.`);
        reject('Exit from the process');
      }
      rl.close();
    });
  });
};
