import fs from 'fs';

const log = (data: any, file: string = '/app/logs/app.txt') => {
  const logFileDirectory = `${process.cwd()}${file}`;
  const dataString = JSON.stringify(data);
  const now = new Date();

  const logString = `
---
Date: ${now.toISOString()}
Error: ${dataString}
---
`;
  
  fs.appendFile(logFileDirectory, logString, 'utf8', err => {
    if (err) {
      console.error('Error writing to file:', err);
    }
  });
}

export {
  log
}