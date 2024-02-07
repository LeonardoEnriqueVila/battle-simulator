// Importar la biblioteca 'readline' de Node.js. 
// Esta biblioteca proporciona una interfaz para leer datos de la consola (stdin) y escribir en ella (stdout).
// Se utiliza para interactuar con el usuario mediante la consola, como obtener inputs y mostrar mensajes.
import * as readline from 'readline'; 

// Crear una interfaz de readline para manejar la entrada y salida de consola.
const rl = readline.createInterface({ 
    input: process.stdin,
    output: process.stdout
  });

// Función que realiza una pregunta y espera una respuesta. Retorna una promesa con la respuesta del usuario.
function askQuestion(question: string): Promise<string> { 
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function howBattallion(): Promise<boolean> {
    let answer: string;
    do {
        answer = await askQuestion("Do you want to generate battalions manually? ");
        if (!["yes", "no"].includes(answer)) {
            console.log("Answer 'yes' or 'no'");
        }
    } while (!["yes", "no"].includes(answer))
    if (answer === "yes") {
        return true;
    }
    return false;
}

async function creation() {
    let answer = await howBattallion();
    if (answer === false) {
        createBattalion(blue_battalion, red_battalion);
    }
    else {
        console.log("Create Blue Batallion: ");
        await manualCreateBatallion(blue_battalion, "Blue ", "blue");
        console.log("Create Red Batallion: ");
        await manualCreateBatallion(red_battalion, "Red ", "red");
    }
    // imprimir batallones
    console.log("");
    for (let i = 0; i < blue_battalion.length; i++) {
        console.log(blue_battalion[i].name);
    }
    console.log("");
    for (let i = 0; i < red_battalion.length; i++) {
        console.log(red_battalion[i].name);
    }
    console.log("");
    allUnits = [...blue_battalion, ...red_battalion]; // fusionar arrays mediante "Spread Operator"
    await main(); // Ejecutar la función principal.
}

import { createMilita, createSwordsman, createCrossbowman, createPaladin, createDruid, createNecromancer, createPrayer } from "./unit";

async function manualCreateBatallion(battalion: unit[], colorInName: string, colorID: string) {
    let answer: string;
    let number: number;
    let unitCounter = 0; // seguir aca, logica: conteo de unidad mientras se agregan. Recordar que el batallon debe ser de 10 unit
    console.log("Options\n1 -> Milita\n2 -> Swordsman\n3 -> Crossbowman\n4 -> Paladin\n5 -> Druid\n6 -> Necromancer\n7 -> Prayer");
    do {
        do {
            answer = await askQuestion("Select unit to add: ");
            number = Number(answer);
        } while (isNaN(number) || number > 7 || number < 1);
        switch(number) {
            case 1:
                do {
                    answer = await askQuestion("Militia to add: ");
                    number = Number(answer);
                } while (isNaN(number) || number < 1 || number > 10 || (unitCounter + number) > 10);
                for (let i = 0; i < number; i++) {
                    battalion.push(createMilita(colorInName + "Militia " + (i + 1), colorID));
                }
                unitCounter += number;
                break;
            case 2: 
                do {
                    answer = await askQuestion("Swordsman to add: ");
                    number = Number(answer);
                } while (isNaN(number) || number < 1 || number > 10 || (unitCounter + number) > 10);
                for (let i = 0; i < number; i++) {
                    battalion.push(createSwordsman(colorInName + "Swordsman " + (i + 1), colorID));
                }
                unitCounter += number;
                break;
            case 3: 
                do {
                    answer = await askQuestion("Crossbowman to add: ");
                    number = Number(answer);
                } while (isNaN(number) || number < 1 || number > 10 || (unitCounter + number) > 10);
                for (let i = 0; i < number; i++) {
                    battalion.push(createCrossbowman(colorInName + "Crossbowman " + (i + 1), colorID));
                }
                unitCounter += number;
                break;
            case 4: 
                do {
                    answer = await askQuestion("Paladin to add: ");
                    number = Number(answer);
                } while (isNaN(number) || number < 1 || number > 10 || (unitCounter + number) > 10);
                for (let i = 0; i < number; i++) {
                    battalion.push(createPaladin(colorInName + "Paladin " + (i + 1), colorID));
                }
                unitCounter += number;
                break;
            case 5: 
                do {
                    answer = await askQuestion("Druid to add: ");
                    number = Number(answer);
                } while (isNaN(number) || number < 1 || number > 10 || (unitCounter + number) > 10);
                for (let i = 0; i < number; i++) {
                    battalion.push(createDruid(colorInName + "Druid " + (i + 1), colorID));
                }
                unitCounter += number;
                break;
            case 6: 
                do {
                    answer = await askQuestion("Necromancer to add: ");
                    number = Number(answer);
                } while (isNaN(number) || number < 1 || number > 10 || (unitCounter + number) > 10);
                for (let i = 0; i < number; i++) {
                    battalion.push(createNecromancer(colorInName + "Necromancer " + (i + 1), colorID));
                }
                unitCounter += number;
                break;
            case 7: 
                do {
                    answer = await askQuestion("Prayer to add: ");
                    number = Number(answer);
                } while (isNaN(number) || number < 1 || number > 10 || (unitCounter + number) > 10);
                for (let i = 0; i < number; i++) {
                    battalion.push(createPrayer(colorInName + "Prayer " + (i + 1), colorID));
                }
                unitCounter += number;
                break;
        }
    } while (unitCounter < 10);  
}

// importar los datos creados en "unit.ts"
import { unit } from "./unit";

// Creando un array para batallones de tipo 'unit'
export let blue_battalion: unit[] = [];
export let red_battalion: unit[] = [];

import { createBattalion } from "./functions";

export let allUnits: unit[];
import { sortBySpeed, unitAction, checkWinner, resetDefense, checkMilitia, addAllBonuses, substract_StatusCounter, manaRegen, SummonStats } from "./functions";

// Función principal asíncrona para manejar el flujo de la simulación de batalla.
async function main() {
    let turn = 1;
    let finish = 0;
    // Bucle principal de la batalla que se ejecuta en cada turno.
    while(finish === 0) {
        console.log("Turn " + turn);
        // Lógica de la batalla: resetear defensas, regenerar mana, etc.
        resetDefense(allUnits); // resetear defensa
        manaRegen(allUnits); // regeneracion de mana
        substract_StatusCounter(allUnits); // restar statuscounters de afectaciones
        checkMilitia(blue_battalion, red_battalion);
        addAllBonuses(allUnits);
        sortBySpeed(allUnits); // ordenar por speed
        console.log("Total units before loop: " + allUnits.length);
        console.log("Blue units before loop: " + blue_battalion.length);
        console.log("Red units before loop: " + red_battalion.length);
        console.log("Dead Counter: " + SummonStats.deadCounter);
        // Imprimir el estado actual de todas las unidades.
        for (let i = 0; i < allUnits.length; i++) { // imprimir unidades vivas
            console.log(allUnits[i].name + " - HP: " + allUnits[i].hp + " - Mele Damage: " + allUnits[i].mele_attack + " - Ranged Damage: " 
            + allUnits[i].ranged_attack + " - Bonus Damage: " + allUnits[i].bonus_attack_total + " - Mana: " + allUnits[i].mana
            + " - Damage Reduction: " + allUnits[i].reduction_attack_total + " - Speed: " + allUnits[i].speed); 
        }
        console.log("");
        // Ejecutar acciones de las unidades y verificar si hay un ganador.
        unitAction(allUnits, blue_battalion, red_battalion); // acciones de unidades
        finish = checkWinner(blue_battalion, red_battalion); // checkeo de ganador
        turn++;
        console.log("");
        // Si la batalla aún no termina, esperar el input del usuario para continuar al siguiente turno.
        if (finish === 0) {
            const answer = await askQuestion('Press enter to continue...');
            if (answer) {
                continue;
            }
        }  
    }
    // evitar que el programa se cierre automaticamente al finalizar
    let answer: string;
    do {
        answer = await askQuestion('Enter "exit" as input to finish...');
    } while (answer !== "exit");
    rl.close(); // Cerrar la interfaz de readline al finalizar la simulación.
}

creation(); // creation ejecuta la obtencion inicial de input para saber si el ejercito se crea manual o automatico y main "espera" dentro de dicha funcion




