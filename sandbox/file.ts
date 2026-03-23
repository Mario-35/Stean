const events = require('events');
import fs from 'fs';
const readline = require('readline');
(async function processLineByLine() {
  try {
    let indexFile = 1;
    let nbline = 0;
    let query = "";
    let queries = [""];
    const rl = readline.createInterface({
      input: fs.createReadStream('logs.sql'),
      crlfDelay: Infinity
    });
    rl.on('line', (line) => {
      if (line.includes("INSERT INTO public") && query !== "") {
        if (query.includes(", 'lora', ") || query.includes(", 'rennesmetro', ") || query.includes(", 'rennesmetropole',")) queries.push(query); 
        nbline += 1;
        query = line;
        if (queries.length > 10000) {            
            // rl.pause();   
            const filename = `temp${indexFile++}.sql`;
            fs.writeFile(filename, queries.join("\r\n"), function (err) {
              if (err) {
                console.error("Error: " + err);
                return;
              }
              console.log(`\x1b[32m split \x1b[36m write to ==> \x1b[35m "${filename}" \x1b[0m`);
            });
            queries = [];
            // rl.resume();                    
        }                  
    } else query += line;
    });
    await events.once(rl, 'close');
    const filename = `temp${indexFile++}.sql`;
    fs.writeFile(filename, queries.join("\r\n"), function (err) {
      if (err) {
        console.error("Error: " + err);
        return;
      }
      console.log(`\x1b[32m split \x1b[36m write to ==> \x1b[35m "${filename}" \x1b[0m`);
    });
    console.log('Reading file line by line with readline done.');
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
  } catch (err) {
    console.error(err);
  }
})();