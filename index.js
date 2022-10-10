#!/usr/bin/env node
// Shebang: Tell the O.S to execute the code with nodejs version installed in the local machine

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import figlet from "figlet";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import moment from "moment-timezone";

let playerName = "";
let playerBirthdate = "";
let playerGift = "";
const gifts = {
    "Torta": `

        (^)(^)(^)(^)
        _i__i__i__i_
       (____________)
       |####|>o<|###|
       (____________)
        
    `,
    "Globos": `
         ,,,,,,,,,,,,,
    .;;;;;;;;;;;;;;;;;;;,.
  .;;;;;;;;;;;;;;;;;;;;;;;;,
.;;;;;;;;;;;;;;;;;;;;;;;;;;;;.
;;;;;@;;;;;;;;;;;;;;;;;;;;;;;;' .............
;;;;@@;;;;;;;;;;;;;;;;;;;;;;;;'.................
;;;;@@;;;;;;;;;;;;;;;;;;;;;;;;'...................
\`;;;;@;;;;;;;;;;;;;;;@;;;;;;;'.....................
 \`;;;;;;;;;;;;;;;;;;;@@;;;;;'..................;....
   \`;;;;;;;;;;;;;;;;@@;;;;'....................;;...
     \`;;;;;;;;;;;;;@;;;;'...;.................;;....
        \`;;;;;;;;;;;;'   ...;;...............;.....
           \`;;;;;;'        ...;;..................
              ;;              ..;...............
              \`                  ............
             \`                      ......
            \`                         ..
           \`                           '
          \`                           '
         \`                           '
        \`                           \`
        \`                           \`,
        \`

    `
}
const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
async function welcome(){
    const rainbowTitle = chalkAnimation.rainbow(
        'Holaa, esto va a estar bueno :)\n'
    );

    await sleep();
    rainbowTitle.stop();

    console.log(`
        ${chalk.green('Responde a unas preguntitas')}
    `);
}

await welcome()

async function askName() {
    const { name } = await inquirer.prompt({
        type: "input",
        name: "name",
        message: "Cuál es tu nombre?",
        default(){
            return "Pepe";
        }
    });
    playerName = name;
}

await askName();

async function askBirthdate() {
    const { birthdate } = await inquirer.prompt({
        type: "input",
        name: "birthdate",
        message: "Cuál es tu fecha de nacimiento ('DD/MM/YYYY')?"
    });
    if(!/\d\d\/\d\d\/\d\d\d\d/.test(birthdate)){
        console.log(`
            ${chalk.bgRed('Ingrese un formato de fecha correcto')}
        `);
        await askBirthdate();
    }
    playerBirthdate = birthdate;
}

await askBirthdate();

async function question1(){
    const { question_1 } = await inquirer.prompt({
        type: "list",
        name: "question_1",
        message: "Qué prefieres?\n",
        choices: ["Torta", "Globos", "Ninguno"]
    });
    playerGift = question_1;
    return handleAnswer(question_1 !== "Ninguno");
}

async function handleAnswer(isCorrect){
    const spinner = createSpinner("Checking answer...").start();
    await sleep();

    if(isCorrect){
        spinner.success({ text: `Excelente elección ${playerName}!` });
    }else{
        spinner.error({ text: `Intenta otra respuesta ${playerName}!` });
        await question1();
        // process.exit(1); // 0 means success, 1 means failure
    }
}

await question1();

function winner(){
    console.clear();
    const now  = moment().tz("America/asuncion");
    const month = now.month();
    const day = now.date();
    const birthdate = moment(playerBirthdate, "DD/MM/YYYY");
    const bMonth = birthdate.month();
    const bDay = birthdate.date();
    const bMsg = `Feliz cumpleaños ${playerName}!\n`;
    const isB = (bMonth == month && bDay == day);
    const msg = isB ? bMsg : `Aun no es tu cumpleaños lol`

    figlet(msg, (err, data) => {
        console.log(gradient.pastel.multiline(data));
        if(isB)
            console.log(`${chalk.magenta(gifts[playerGift])}\n`)
    });
}

winner();