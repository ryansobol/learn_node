'use strict';

const exec = require('child_process').exec;

const cat_wc = exec('cat *.js bad_file | wc -l', (err, stdout, stderr) => {
  if (err) {
    throw err;
  }

  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
