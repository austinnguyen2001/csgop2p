const readline = require('readline');
const fs = require('fs');
const { spawn } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const editConfigAndRun = () => {
    const replace = `
    module.exports = {
        maxTimeToExchangeItems: 10 * 60 * 1000, // Ten minutes
        steamApiKey: '4FAFD5833B0123FDBE5F20E5C0BFA680',
        bitskinsApiKey: '4ec1ead0-e4dd-4c31-bc07-60677c042c41',
        bitskinsTwoFactor: 'XPGGI4GOJ2I2BH76',
        mongoDbPath: 'test'
    }
    `
    fs.writeFile("confdig.js", replace, (err) => {
        if(err) {
            return console.log(err);
        }
        console.log("Config saved successfully! Starting bot.....");
        spawn('npm start' ,(err, stdout, stderr) => {  
            if (err) {  
                return console.error(err);   
            }  
            console.log(stdout);  
        });  
    });
}

const questions = [
    'What is your steam api key?',
    'What is your bitskins api key?',
    'What is your bitskins two factor key?',
    'What do you want your mongodb path to be?',
    'How long do you want to keep polling trades (1000 = 1s)',
    'Would you like to update prices every load? (Yes/No)'
];

const questionIterator = questions[Symbol.iterator]();
let questionreponses = [];

// Init first question
console.log(questionIterator.next().value);

rl.on('line', (input) => {
    const nextQuestion = questionIterator.next();
    questionreponses.push(input);
    if(nextQuestion.done === false)
        console.log(nextQuestion.value);
    else {
        rl.close();
        editConfigAndRun();
    }
});
