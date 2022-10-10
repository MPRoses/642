const fs = require('fs');
const readline = require('readline');

let wordListPath = 'wordList.txt';
let outputFilePath = 'uitvoer.txt'
let trainFilePath = 'train.txt';
let enter = '\r\n';

// outputFile leegmaken
fs.writeFile(outputFilePath, '', function() { });

// https://stackoverflow.com/questions/33418777/write-a-line-into-a-txt-file-with-node-js
let logger = fs.createWriteStream(outputFilePath, {
  flags: 'a' // 'a' means appending (old data will be preserved)
});

// https://stackoverflow.com/questions/6831918/node-js-read-a-text-file-into-an-array-each-line-an-item-in-the-array
// https://stackoverflow.com/questions/21518381/proper-way-to-wait-for-one-function-to-finish-before-continuing
async function getTrainData(trainFilePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(trainFilePath, function(err, data) {
      if (err) throw err;
      let dataArr = data.toString().split('\n');
      resolve(dataArr);
    });
  });
}

// nodig om aantal uniek gekraakte wachtwoorden te tellen
// https://stackoverflow.com/questions/4833651/javascript-array-sort-and-unique
function sortUnique(arr) {
  if (arr.length === 0) return arr;
  arr = arr.sort(function(a, b) { return a * 1 - b * 1; });
  let ret = [arr[0]];
  for (let i = 1; i < arr.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
    if (arr[i - 1] !== arr[i]) {
      ret.push(arr[i]);
    }
  }
  return ret;
}

async function bruteBot() {
  let gekraakt = []; // voor bijhouden score

  let trainData = await getTrainData(trainFilePath)

  // https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input as a single line break.
  const wordListStream = fs.createReadStream(wordListPath);

  const wordListLines = readline.createInterface({
    input: wordListStream,
    crlfDelay: Infinity
  });

  for await (const word of wordListLines) {
    for (i = 0; i < trainData.length; i++) {
      if (trainData[i] === word) {
        logger.write(`${i + 1}: ${word + enter}`);
        gekraakt.push(i + 1);
      }
    }
  }

  aantalGekraakt = sortUnique(gekraakt).length;
  let score = (aantalGekraakt / 10000) * 100;
  console.log(`${score.toFixed(2)}% gekraakt!`);
}

bruteBot();