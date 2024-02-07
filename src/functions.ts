
export namespace SummonStats {
    export let treantsBlue: number = 0;
    export let treantsRed: number = 0;
    export let skeletonsBlue: number = 0;
    export let skeletonsRed: number = 0;
    export let deadCounter: number = 0;
}

export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min); // Asegurar que min es un entero
    max = Math.floor(max); // Asegurar que max es un entero
    return Math.floor(Math.random() * (max - min + 1)) + min; // El máximo es inclusivo y el mínimo es inclusivo
}

import { red_battalion, blue_battalion } from "./main";
import { createSwordsman, createCrossbowman, createMilita, createPaladin, unit, createDruid, createPrayer, createNecromancer } from "./unit";

export function createBattalion(blue_battalion: unit[], red_battalion: unit[]){
    for (let i = 0; i < 10; i++) {
        let randomNum = getRandomInt(1, 13); // ATENCION: numeros provisorios por motivos de debug
        if ([1, 2, 3, 4].includes(randomNum)) {
            blue_battalion.push(createMilita("Blue Militia " + (i + 1), "blue"));
        } 
        else if ([5, 6, 7].includes(randomNum)) {
            blue_battalion.push(createSwordsman("Blue Swordsman " + (i + 1), "blue"));
        } 
        else if ([8, 9].includes(randomNum)){ 
            blue_battalion.push(createCrossbowman("Blue Crossbowman " + (i + 1), "blue"));
        } 
        else if (randomNum === 10) {
            blue_battalion.push(createPrayer("Blue Prayer " + (i + 1), "blue"));
        } 
        else if (randomNum === 11) {
            blue_battalion.push(createPaladin("Blue Paladin " + (i + 1), "blue"));
        } 
        else if (randomNum === 12) {
            blue_battalion.push(createDruid("Blue Druid " + (i + 1), "blue"));
        }
        else if (randomNum === 13) { 
            blue_battalion.push(createNecromancer("Blue Necromancer " + (i + 1), "blue"));
        } 

        randomNum = getRandomInt(1, 13); // ATENCION: numeros provisorios por motivos de debug
        if ([1, 2, 3, 4].includes(randomNum)) {
            red_battalion.push(createMilita("Red Militia " + (i + 1), "red"));
        } 
        else if ([5, 6, 7].includes(randomNum)) {
            red_battalion.push(createSwordsman("Red Swordsman " + (i + 1), "red"));
        } 
        else if ([8, 9].includes(randomNum)){ 
            red_battalion.push(createCrossbowman("Red Crossbowman " + (i + 1), "red"));
        }
        else if (randomNum === 10) {
            red_battalion.push(createPrayer("Red Prayer " + (i + 1), "red"));
        } 
        else if (randomNum === 11) {
            red_battalion.push(createPaladin("Red Paladin " + (i + 1), "red"));
        } 
        else if (randomNum === 12) {
            red_battalion.push(createDruid("Red Druid " + (i + 1), "red"));
        }
        else if (randomNum === 13) { 
            red_battalion.push(createNecromancer("Red Necromancer " + (i + 1), "red"));
        }
    }
}

// Una función que elimina unidades muertas del batallón
export function removeDeadUnits(battalion: unit[]): boolean {
    for (let i = battalion.length - 1; i >= 0; i--) {
        if (battalion[i].hp <= 0) {
            battalion.splice(i, 1);  // Elimina 1 elemento en el índice i
            return true;
        }
    }
    return false;
}

/* OBSOLETO (checkSpeed)
// verifica que batallon suma mayor velocidad para determinar cual tendra el primer movimiento
export function checkSpeed(blue_battalion: unit[], red_battalion: unit[]): number {
    let blue_speed = 0;
    let red_speed = 0;
    for (let i = blue_battalion.length - 1; i >= 0; i--) {
        blue_speed += blue_battalion[i].speed;
    }
    for (let i = red_battalion.length - 1; i >= 0; i--) {
        red_speed += red_battalion[i].speed;
    }
    if (blue_speed > red_speed) {
        return 1;
    }
    else if (red_speed > blue_speed) {
        return 2;
    } 
    else {
        return getRandomInt(1, 2);
    }
}*/

// ordena array general por velocidad
// cuando la velocidad es la misma en una comparacion, decide de manera random cual queda como la mas rapida
export function sortBySpeed (allUnits: unit[]) {
    for (let i = 0; i < allUnits.length; i++) { // i es el indice del primer no ordenado
        // valores de base
        let biggestIndex = -1;
        let biggestSpeed = -1; 
        for (let j = i; j < allUnits.length; j++) { // buscar entre los no ordenados
            if (allUnits[j].speed > biggestSpeed) {
                biggestIndex = j;
                biggestSpeed = allUnits[j].speed;
            }
            else if (allUnits[j].speed === biggestSpeed) { // si ambos elementos tienen la misma speed
                let random = getRandomInt(1, 2); // se decide de manera aleatoria
                if (random === 1) { // si sale, el elemento actual pasa a ser el mas alto
                    biggestIndex = j;
                    biggestSpeed = allUnits[j].speed;
                }
            }
        }
        // una vez que obtengo al de mayor indice, hacer el swap
        let temp: unit;
        temp = allUnits[i];
        allUnits[i] = allUnits[biggestIndex];
        allUnits[biggestIndex] = temp;
    }
}

// acciones de unidad
// algunas unidades accionan de manera personalizada
export function unitAction(allUnits: unit[], blue_battalion: unit[], red_battalion: unit[]) {
    let i = 0;
    while (i < allUnits.length) {
        checkMilitia(blue_battalion, red_battalion); // antes de cada movimiento se debe checkear a las milicias por su pasiva
        addAllBonuses(allUnits); // tambien se actualiza los bonus
        let actualUnit = allUnits[i].name; // para la comprobacion
        if (allUnits[i].status.entanglingRoots === true) { // raices evita que la unidad haga una accion
            console.log(allUnits[i].name + " Is affected by Entangling Roots and cant move!");
        }
        else if (["swordsman", "crossbowman", "militia", "treant", "skeleton"].includes(allUnits[i].unit)) { // unidades que solo tienen ataque basico
            actionToEnemy("", i, allUnits, blue_battalion, red_battalion, allUnits[i].basic_attack.bind(allUnits[i]));
        }
        else if (allUnits[i].unit === "paladin") {
            paladinDecides(i, allUnits, blue_battalion, red_battalion);
        }
        else if (allUnits[i].unit === "druid") {
            druidDecides(i, allUnits, blue_battalion, red_battalion);
        }
        else if (allUnits[i].unit === "prayer") {
            prayerPrays(i, allUnits, blue_battalion, red_battalion);
        }
        else if (allUnits[i].unit === "necromancer") {
            necromancerDecides(i, allUnits, blue_battalion, red_battalion)
        }
        if (i < allUnits.length && actualUnit === allUnits[i].name) { // comprobar que la unidad que se acaba de mover sigue viva
            i++; // en ese caso aumenta el contador. Esto es para evitar saltearse a la unidad siguiente en caso de que la unidad actual muere en su propio turno
        }// ademas tiene que comprobar que i es mayor que la longitud, para evitar casos donde la unidad actual, que murio en su turno, era ademas la ultima
    }
}

function necromancerDecides(i: number, allUnits: unit[], blue_battalion: unit[], red_battalion: unit[]) {
    
    if (allUnits[i].mana < 15) { // si druida no tiene mana para castear, espera. Solamente hará un ataque basico si es el ultimo en pie (lo cual es muy improbable)
        druidWaits(i, blue_battalion, red_battalion, allUnits); // usa la misma funcion de espera de regeneracion de mana que el druida
    }
    else { // si el druida tiene suficiente mana, evalua que habilidad conviene castear
        necromancerChecks(i, allUnits, blue_battalion, red_battalion);
    }
}

function necromancerChecks (i: number, allUnits: unit[], blue_battalion: unit[], red_battalion: unit[]) {
    if (allUnits[i].team === "blue") {
        if (allUnits[i].mana > 29 && SummonStats.deadCounter < 1) { // alcanza para weaken y no hay muertos
            let valid = actionToEnemy("weaken", i, allUnits, blue_battalion, red_battalion, target => allUnits[i].special_skill1!.bind(allUnits[i])(target)); 
            if (valid === false) {
                druidWaits(i, blue_battalion, red_battalion, allUnits);
            }      
        }
        else if (SummonStats.deadCounter > 0) { // hay muertos
            SummonStats.skeletonsBlue++;
            summonUnit(i, allUnits, blue_battalion, red_battalion, "Blue Skeleton " + (SummonStats.skeletonsBlue), (summonIn, name, team) => allUnits[i].summon_skill!.bind(allUnits[i])(summonIn, name, team))
        }
        else { // no hay muertos, no alcanza mana para weaken
            druidWaits(i, blue_battalion, red_battalion, allUnits); // no puede hacer nada y espera
        }
    }
    else { // si es rojo
        if (allUnits[i].mana > 29 && SummonStats.deadCounter < 1) { // alcanza para weaken y no hay muertos
            let valid = actionToEnemy("weaken", i, allUnits, blue_battalion, red_battalion, target => allUnits[i].special_skill1!.bind(allUnits[i])(target)); 
            if (valid === false) {
                druidWaits(i, blue_battalion, red_battalion, allUnits);
            }      
        }
        else if (SummonStats.deadCounter > 0) { // hay muertos
            SummonStats.skeletonsRed++;
            summonUnit(i, allUnits, blue_battalion, red_battalion, "Red Skeleton " + (SummonStats.skeletonsRed), (summonIn, name, team) => allUnits[i].summon_skill!.bind(allUnits[i])(summonIn, name, team))
        }
        else { // no hay muertos, no alcanza mana para weaken
            druidWaits(i, blue_battalion, red_battalion, allUnits); // no puede hacer nada y espera
        }
    } 
}

function prayerPrays(i: number, allUnits: unit[], blue_battalion: unit[], red_battalion: unit[]) {
    console.log(allUnits[i].name + " Prays!");
    let random = getRandomInt(1,10);
    if (random === 1) { // jesus escucha
        let random2 = getRandomInt(1,2);
        if (random2 === 1) { // jesus cura
            jesusHeals(i, allUnits, blue_battalion, red_battalion);
        }
        else { // jesus daña
            jesusDestroys(i, allUnits, blue_battalion, red_battalion);
        }
    }
    else {
        console.log("Jesus ignores");
    }
}

function jesusHeals(i: number, allUnits: unit[], blue_battalion: unit[], red_battalion: unit[]) {
    if (allUnits[i].team === "blue") { // jesus azul cura
        console.log("Blue Jesus heals 40 HP to all units in blue team!");
        for (let i = 0; i < blue_battalion.length; i++) {
            blue_battalion[i].hp += 40;
            if (blue_battalion[i].hp > blue_battalion[i].total_hp) {
                blue_battalion[i].hp = blue_battalion[i].total_hp;
            }
            console.log(blue_battalion[i].name + " HP: " + blue_battalion[i].hp);
        }
    }
    else { // jesus rojo cura
        console.log("Red Jesus heals 40 HP to all units in red team!");
        for (let i = 0; i < red_battalion.length; i++) {
            red_battalion[i].hp += 40;
            if (red_battalion[i].hp > red_battalion[i].total_hp) {
                red_battalion[i].hp = red_battalion[i].total_hp;
            }
            console.log(red_battalion[i].name + " HP: " + red_battalion[i].hp);
        }
    }
}

function jesusDestroys(i: number, allUnits: unit[], blue_battalion: unit[], red_battalion: unit[]) {
    let unitsToRemove = [];
    if (allUnits[i].team === "blue") { //jesus azul daña
        console.log("Blue Jesus deals 40 damage to all units in red team!");
        for (let j = 0; j < red_battalion.length; j++) {
            if (red_battalion[j].status.divineShield === true) {
                console.log(red_battalion[j].name + " is protected by Divine Shield!");
            } else {
                let totalDamage = 40;
                if (red_battalion[j].status.weaken === true) {
                    let extraDamage = Math.round(50 * 40 / 100); // 50% de daño extra por el weaken
                    totalDamage += extraDamage;
                    console.log(red_battalion[j].name + " recives " + extraDamage + " extra damage due to Weaken effect!");
                }
                red_battalion[j].hp -= totalDamage;
                console.log(red_battalion[j].name + " HP: " + red_battalion[j].hp);
                if (red_battalion[j].hp < 1) {
                    console.log(red_battalion[j].name + " Dies!");
                    unitsToRemove.push(red_battalion[j]);
                }
            }
        } 
    } 
    else { // jesus rojo daña
        console.log("Red Jesus deals 40 damage to all units in blue team!");
        for (let j = 0; j < blue_battalion.length; j++) {
            if (blue_battalion[j].status.divineShield === true) {
                console.log(blue_battalion[j].name + " is protected by Divine Shield!");
            } else {
                let totalDamage = 40;
                if (blue_battalion[j].status.weaken === true) {
                    let extraDamage = Math.round(50 * 40 / 100); // 50% de daño extra por el weaken
                    totalDamage += extraDamage;
                    console.log(blue_battalion[j].name + " recives " + extraDamage + " extra damage due to Weaken effect!");
                }
                blue_battalion[j].hp -= totalDamage;
                console.log(blue_battalion[j].name + " HP: " + blue_battalion[j].hp);
                if (blue_battalion[j].hp < 1) {
                    console.log(blue_battalion[j].name + " Dies!");
                    unitsToRemove.push(blue_battalion[j]);
                }
            }
        }
    }
    // remover unidades eliminadas por algun jesus
    unitsToRemove.forEach(unit => {
        switchRemove(unit.team, allUnits, blue_battalion, red_battalion);
    });
}

function druidDecides(i: number, allUnits: unit[], blue_battalion: unit[], red_battalion: unit[]) {
    if (allUnits[i].mana < 15) { // si druida no tiene mana para castear, espera. Solamente hará un ataque basico si es el ultimo en pie (lo cual es muy improbable)
        druidWaits(i, blue_battalion, red_battalion, allUnits);
    }
    else { // si el druida tiene suficiente mana, evalua que habilidad conviene castear
        druidChecks (i, allUnits, blue_battalion, red_battalion);
    }
}

// accionar del druida o nigromante cuando se queda sin mana
function druidWaits (i: number, blue_battalion: unit[], red_battalion: unit[], allUnits: unit[]) {
    if (allUnits[i].team === "blue") {
        if (blue_battalion.length === 1) { // es decir solo esta el druida
            actionToEnemy("", i, allUnits, blue_battalion, red_battalion, allUnits[i].basic_attack.bind(allUnits[i]));
        } 
        else { //normalmente si el druida se queda sin mana, basicamente espera a que se le regenere y poder castear de nuevo
            console.log(allUnits[i].name + " Waits for mana regeneration");
        }
    }
    else {
        if (red_battalion.length === 1) { 
            actionToEnemy("", i, allUnits, blue_battalion, red_battalion, allUnits[i].basic_attack.bind(allUnits[i]));
        }
        else { //normalmente si el druida se queda sin mana, basicamente espera a que se le regenere y poder castear de nuevo
            console.log(allUnits[i].name + " Waits for mana regeneration");
        }
    }
}

function druidChecks (i: number, allUnits: unit[], blue_battalion: unit[], red_battalion: unit[]) {
    let biggestHP = compareHP(blue_battalion, red_battalion); // comprobar cual es el equipo con mayor hp
    if (allUnits[i].team === "blue") {
        if (biggestHP === "red") { // si equipo enemigo tiene mas hp
            // si su equipo esta en desventaja de hp y de cantidad de unidades, si le alcanza el mana, el treant sera su primer opcion
            if (allUnits[i].mana > 39 && blue_battalion.length < red_battalion.length) {
                SummonStats.treantsBlue++; // sumar treant al contador
                summonUnit(i, allUnits, blue_battalion, red_battalion, "Blue Treant " + (SummonStats.treantsBlue), (summonIn, name, team) => allUnits[i].summon_skill!.bind(allUnits[i])(summonIn, name, team));
            }
            // si su equipo esta en desventaja de hp, pero no en cantidad de unidades, y le alcanza el mana: 66% rejuvenecer 33% treant
            else if (allUnits[i].mana > 39){ 
                let random = getRandomInt(1, 3);
                if (random === 1) { // 1 chance en 3 que invoque un treant
                    SummonStats.treantsBlue++; 
                    summonUnit(i, allUnits, blue_battalion, red_battalion, "Blue Treant " + (SummonStats.treantsBlue), (summonIn, name, team) => allUnits[i].summon_skill!.bind(allUnits[i])(summonIn, name, team));
                }
                else { // 2 chances en 3 de que lance rejuvenecer 
                    druidHeals(i, allUnits, blue_battalion, red_battalion);
                }
            }
            else { // en el caso final no tiene mana para otro conjuro que no sea rejuvenecer y por ende lanza rejuvenecer
                druidHeals(i, allUnits, blue_battalion, red_battalion);
            }            
        }
        else { // si su equipo es el que tiene "biggestHP" optará por jugar ofensivo: descarta rejuvecer, y priorizará raices ante el treant
            if (allUnits[i].mana > 39) {
                let random = getRandomInt(1, 5);
                if (random === 1) { // 1 chance en 5 que invoque un treant
                    SummonStats.treantsBlue++;
                    summonUnit(i, allUnits, blue_battalion, red_battalion, "Blue Treant " + (SummonStats.treantsBlue), (summonIn, name, team) => allUnits[i].summon_skill!.bind(allUnits[i])(summonIn, name, team));
                }
                else { // 4 chances en 5 de que lance raices
                    let valid = actionToEnemy("roots", i, allUnits, blue_battalion, red_battalion, target => allUnits[i].special_skill1!.bind(allUnits[i])(target));
                    if (valid === false) {
                        druidHeals(i, allUnits, blue_battalion, red_battalion);
                    }
                }
            }
            else if (allUnits[i].mana < 39 && allUnits[i].mana > 19) { // si no le alcanza para el treant, directamente lanza raices
                let valid = actionToEnemy("roots", i, allUnits, blue_battalion, red_battalion, target => allUnits[i].special_skill1!.bind(allUnits[i])(target));
                if (valid === false) {
                    druidHeals(i, allUnits, blue_battalion, red_battalion);
                }
            }
            else { // el caso final es que a pesar de querer jugar ofensivo, no le alcanza mana para otra cosa que no sea rejuvenecer
                druidHeals(i, allUnits, blue_battalion, red_battalion); // es decir tiene menos de 19 de mana, pero ya se sabe de base que tiene mas de 14
                // ya que eso se comprueba antes de llamarse a esta funcion
            }
        }
    }       
    else { // caso de ser rojo
        if (allUnits[i].team === "red") {
            if (biggestHP === "blue") { // si equipo enemigo tiene mas hp
                // si su equipo esta en desventaja de hp y de cantidad de unidades, si le alcanza el mana, el treant sera su primer opcion
                if (allUnits[i].mana > 39 && red_battalion.length < blue_battalion.length) {
                    SummonStats.treantsRed++; 
                    summonUnit(i, allUnits, blue_battalion, red_battalion, "Red Treant " + (SummonStats.treantsRed), (summonIn, name, team) => allUnits[i].summon_skill!.bind(allUnits[i])(summonIn, name, team));
                }
                // si su equipo esta en desventaja de hp, pero no en cantidad de unidades, y le alcanza el mana: 66% rejuvenecer 33% treant
                else if (allUnits[i].mana > 39){ 
                    let random = getRandomInt(1, 3);
                    if (random === 1) { // 1 chance en 3 que invoque un treant 
                        SummonStats.treantsRed++;
                        summonUnit(i, allUnits, blue_battalion, red_battalion, "Red Treant " + (SummonStats.treantsRed), (summonIn, name, team) => allUnits[i].summon_skill!.bind(allUnits[i])(summonIn, name, team));
                    }
                    else { // 2 chances en 3 de que lance rejuvenecer 
                        druidHeals(i, allUnits, blue_battalion, red_battalion);
                    }
                }
                else { // en el caso final no tiene mana para otro conjuro que no sea rejuvenecer y por ende lanza rejuvenecer
                    druidHeals(i, allUnits, blue_battalion, red_battalion);
                }            
            }
            else { // si su equipo es el que tiene "biggestHP" optará por jugar ofensivo: descarta rejuvecer, y priorizará raices ante el treant
                if (allUnits[i].mana > 39) {
                    let random = getRandomInt(1, 5);
                    if (random === 1) { // 1 chance en 5 que invoque un treant
                        SummonStats.treantsRed++; 
                        summonUnit(i, allUnits, blue_battalion, red_battalion, "Red Treant " + (SummonStats.treantsRed), (summonIn, name, team) => allUnits[i].summon_skill!.bind(allUnits[i])(summonIn, name, team));
                    }
                    else { // 4 chances en 5 de que lance raices
                        let valid = actionToEnemy("roots", i, allUnits, blue_battalion, red_battalion, target => allUnits[i].special_skill1!.bind(allUnits[i])(target));
                        if (valid === false) {
                            druidHeals(i, allUnits, blue_battalion, red_battalion);
                        }
                    }
                }
                else if (allUnits[i].mana < 39 && allUnits[i].mana > 19) { // si no le alcanza para el treant, directamente lanza raices
                    let valid = actionToEnemy("roots", i, allUnits, blue_battalion, red_battalion, target => allUnits[i].special_skill1!.bind(allUnits[i])(target));
                    if (valid === false) {
                        druidHeals(i, allUnits, blue_battalion, red_battalion);
                    }
                }
                else { // el caso final es que a pesar de querer jugar ofensivo, no le alcanza mana para otra cosa que no sea rejuvenecer
                    druidHeals(i, allUnits, blue_battalion, red_battalion); // es decir tiene menos de 19 de mana, pero ya se sabe de base que tiene mas de 14
                    // ya que eso se comprueba antes de llamarse a esta funcion
                }
            }    
        }
    }
}

function summonUnit(i: number, allUnits: unit[], blue_battalion: unit[], red_battalion: unit[], unitName: string, summon: (summonIn: unit[], summonName: string, team: string) => void) {
    if (allUnits[i].team === "blue") {
        summon(blue_battalion, unitName, "blue")
        allUnits.push(blue_battalion[blue_battalion.length - 1]) // añadir unidad invocada al array general
    }
    else {
        summon(red_battalion, unitName, "red")
        allUnits.push(red_battalion[red_battalion.length - 1]) // añadir unidad invocada al array general
    }
}

function druidHeals(i: number, allUnits: unit[], blue_battalion: unit[], red_battalion: unit[]) {
    let excludedIndex = [-1]; //caso en el que haya que volver a elegir target
    let repeat = false;
    let debugCounter = 0;
    if (allUnits[i].team === "blue") {
        do {
            repeat = false;
            let woundIndex = searchWounded(excludedIndex, "blue", blue_battalion, red_battalion); // devuelve indice de unidad que sufrio mayor daño
                if (blue_battalion[woundIndex].status.rejuvenateCounter === 2) {//si ya le tiraron rejuvenate en turno actual, busca otro
                    excludedIndex.push(woundIndex); //excluir target actual en proxima busqueda
                    repeat = true; // buscar otro target
                    debugCounter++;
                    if (debugCounter === 10) { // para evitar bucles infinitos, lanza habilidad de daño
                        repeat = false; 
                        if (allUnits[i].mana > 19) { // si tiene mana para daño
                            let valid = actionToEnemy("roots", i, allUnits, blue_battalion, red_battalion, target => allUnits[i].special_skill1!.bind(allUnits[i])(target));
                            if (valid === false) {
                               console.log(allUnits[i].name + " Waits for mana regeneration");
                            }
                        }
                        else { // si no hay objetivo valido para rejuvenate y no hay mana para daño, espera
                            console.log(allUnits[i].name + " Waits for mana regeneration");
                        }
                    }
                }
                else { // si la unidad no recibio rejuvenecer en turno actual, lanzar
                // tener en cuenta que si le lanzaron rejuvenecer el turno pasado (es decir .status.divineShieldCounter === 1) se lo renueva
                // a su vez, tener el rejuvenecer en el tiempo no se stackea
// si unidad con rejuvenecer recibe otro rejuvenecer, tendra la curacion inicial del segundo rejuvenecer, pero al proximo turno igualmente se curara 20
                    allUnits[i].special_skill?.(blue_battalion[woundIndex]); // llamar a rejuvenate
                } 
            } while (repeat === true);
        }     
    else { // si es rojo
        do {
            repeat = false;
            let woundIndex = searchWounded(excludedIndex, "red", blue_battalion, red_battalion); // devuelve indice de unidad que sufrio mayor daño
                if (red_battalion[woundIndex].status.rejuvenateCounter === 2) {//si ya le tiraron rejuvenate en turno actual, busca otro
                    excludedIndex.push(woundIndex); //excluir target actual en proxima busqueda
                    repeat = true; // buscar otro target
                    debugCounter++;
                    if (debugCounter === 10) { // para evitar bucles infinitos, lanza habilidad de daño
                        repeat = false; 
                        if (allUnits[i].mana > 19) { // si tiene mana para daño
                            let valid = actionToEnemy("roots", i, allUnits, blue_battalion, red_battalion, target => allUnits[i].special_skill1!.bind(allUnits[i])(target));
                            if (valid === false) {
                                console.log(allUnits[i].name + " Waits for mana regeneration");
                            }
                        }
                        else { // si no hay objetivo valido para rejuvenate y no hay mana para daño, espera
                            console.log(allUnits[i].name + " Waits for mana regeneration");
                        }
                        
                    }
                }
                else { 
                    allUnits[i].special_skill?.(red_battalion[woundIndex]); // llamar a rejuvenate
                } 
        } while (repeat === true);
    }
}

// funcion que determina que equipo tiene mas hp
function compareHP(blue_battalion: unit[], red_battalion: unit[]): string {
    let blueHP = 0;
    for (let j = 0; j < blue_battalion.length; j++) {
        blueHP += blue_battalion[j].hp;
    }
    let redHP = 0;
    for (let j = 0; j < red_battalion.length; j++) {
        redHP += red_battalion[j].hp;
    }
    console.log("redHP: " + redHP + " - blueHP: " + blueHP);
    if (blueHP === redHP) { // si sufrieron el mismo daño, decide de manera aleatoria el retorno
        let random = getRandomInt(1,2);
        if (random === 1) {
            return "blue";
        }
        else {
            return "red";
        }
    }
    else if (blueHP > redHP) {
        return "blue";
    }
    else {
        return "red";
    }
}

// determina si el paladin efectua un ataque basico o castea una habilidad
function paladinDecides(i: number, allUnits: unit[], blue_battalion: unit[], red_battalion: unit[]) {
    if (allUnits[i].mana < 12) { // si el mana del paladin no alcanza para luz sagrada ni escudo divino, hace ataque basico
        actionToEnemy("", i, allUnits, blue_battalion, red_battalion, allUnits[i].basic_attack.bind(allUnits[i]));
    }
    else { // si tiene suficiente mana, entonces paladin evalua que habilidad conviene castear
        paladinChecks(i, allUnits, blue_battalion, red_battalion);
    }
}

// checkea estado de unidades aliadas y decide si lanzar luz sagrada o escudo divino
function paladinChecks(i: number, allUnits: unit[], blue_battalion: unit[], red_battalion: unit[]) {
    let excludedIndex = [-1]; //caso en el que haya que volver a elegir target
    let repeat = false;
    let debugCounter = 0;
    if (allUnits[i].team === "blue") {
        do {
            repeat = false;
            let woundIndex = searchWounded(excludedIndex, "blue", blue_battalion, red_battalion); // devuelve indice de unidad que sufrio mayor daño
            if (blue_battalion[woundIndex].total_hp - blue_battalion[woundIndex].hp > 29 //tambien evita lanzar luz sagrada a esqueletos
            && allUnits[i].mana > 19 && blue_battalion[woundIndex].unit !== "skeleton") { // calcular daño y checkear si alcanza mana para luz sagrada
            // si la unidad sufrio mas de 29 de daño, entonces justifica usar la luz sagrada (el paladin evita superar el 62.5% de overheal)
                allUnits[i].special_skill?.(blue_battalion[woundIndex]); // llamar funcion opcional de "luz sagrada"
            }
            else { // si no se cumplen condiciones para luz sagrada, castea el escudo divino, que cuesta menos mana
                if (blue_battalion[woundIndex].status.divineShield === true) {//si ya le tiraron escudo divino 
                    excludedIndex.push(woundIndex); //excluir target actual en proxima busqueda
                    repeat = true; // buscar otro target
                    debugCounter++;
                    if (debugCounter === 10) { // para evitar bucles infinitos, si es imposible encontrar target
                        repeat = false;
                        actionToEnemy("", i, allUnits, blue_battalion, red_battalion, allUnits[i].basic_attack.bind(allUnits[i])); // efectuar ataque basico
                    }
                }
                else { // si la unidad no recibio escudo divino, lanzar escudo divino
                    allUnits[i].special_skill1?.(blue_battalion[woundIndex]); // llamar funcion opcional de "escudo divino"
                } 
            }
        } while (repeat === true);    
    }
    else {
        do {
            repeat = false;
            let woundIndex = searchWounded(excludedIndex, "red", blue_battalion, red_battalion); // devuelve indice de unidad que sufrio mayor daño
            if (red_battalion[woundIndex].total_hp - red_battalion[woundIndex].hp > 29 //tambien evita lanzar luz sagrada a esqueletos
            && allUnits[i].mana > 19 && red_battalion[woundIndex].unit !== "skeleton") { // calcular daño y checkear si alcanza mana para luz sagrada
            // si la unidad sufrio mas de 29 de daño, entonces justifica usar la luz sagrada (el paladin evita superar el 62.5% de overheal)
                allUnits[i].special_skill?.(red_battalion[woundIndex]); // llamar funcion opcional de "luz sagrada"
            }
            else { // si no se cumplen condiciones para luz sagrada, castea el escudo divino, que cuesta menos mana
                if (red_battalion[woundIndex].status.divineShield === true) {//si ya le tiraron escudo divino 
                    excludedIndex.push(woundIndex); //excluir target actual en proxima busqueda
                    repeat = true; // buscar otro target
                    debugCounter++;
                    if (debugCounter === 10) {
                        repeat = false;
                        actionToEnemy("", i, allUnits, blue_battalion, red_battalion, allUnits[i].basic_attack.bind(allUnits[i])); // efectuar ataque basico
                    }
                }
                else { // si la unidad no recibio escudo divino en turno actual, lanzar escudo divino
                // tener en cuenta que si le lanzaron escudo el turno pasado (es decir .status.divineShieldCounter === 0) se lo renueva
                    allUnits[i].special_skill1?.(red_battalion[woundIndex]); // llamar funcion opcional de "escudo divino"
                } 
            }
        } while (repeat === true);
    }
}

// busca al indice de unidad que mas daño sufrió y lo devuelve
function searchWounded (excludedIndex: number[], color: string, blue_battalion: unit[], red_battalion: unit[]):number {
    let biggestIndex = -1;
    let mostInjured = -1;
    if (color === "blue") {
        for (let i = 0; i < blue_battalion.length; i++) { // busca a la unidad que mas daño sufrio, asi prioriza a los de mayor hp
            if (!excludedIndex.includes(i)) {
                let wound = blue_battalion[i].total_hp - blue_battalion[i].hp;
                if (wound > mostInjured) {
                    biggestIndex = i;
                    mostInjured = wound;
                }
                else if (wound === mostInjured) { // si ambos elementos tienen la misma "herida"
                    let random = getRandomInt(1, 2); // se decide de manera aleatoria
                    if (random === 1) { // si sale 1, el elemento actual pasa a ser el mas alto
                        biggestIndex = i;
                        mostInjured = wound;
                    }
                }
            }  
        }
        return biggestIndex; // devuelve el indice de la unidad que sufrio mas daño
    }
    else {
        for (let i = 0; i < red_battalion.length; i++) {
            if (!excludedIndex.includes(i)) {
                let wound = red_battalion[i].total_hp - red_battalion[i].hp;
                if (wound > mostInjured) {
                    biggestIndex = i;
                    mostInjured = wound;
                }
                else if (wound === mostInjured) { // si ambos elementos tienen la misma "herida"
                    let random = getRandomInt(1, 2); // se decide de manera aleatoria
                    if (random === 1) { // si sale 1, el elemento actual pasa a ser el mas alto
                        biggestIndex = i;
                        mostInjured = wound;
                    }
                }
            }
        }    
        return biggestIndex; 
    }
}
// CONTINUAR ACA: tema funcion como argumento y que sea posible usar misma funcion para ataque basico y habilidades de daño
// funcion que checkea el color del origen y efectua el ataque basico a un target valido
export function actionToEnemy(hability: string, i: number, allUnits: unit[], blue_battalion: unit[], red_battalion: unit[], targetEnemy: (target: unit) => void): boolean {
    // en caso de ser un ataque basico, el argumento de hability es ""
    let repeat = false;
    let random: number;
    let counter = 0;
    if (allUnits[i].team === "blue") { // ataque basico si origen es azul
        do {
            repeat = false; 
            if (red_battalion.length > 0) {
                random = getRandomInt(0, red_battalion.length - 1); // obtener numero random para indice
                if (hability === "roots" && red_battalion[random].status.entanglingRoots === true) { // si se castea root e indice tiene roots
                    do {
                        random = getRandomInt(0, red_battalion.length - 1);
                        counter++;
                        if (counter === 20) { // evitar bucles infinitos
                            return false;
                        }
                    } while (red_battalion[random].status.entanglingRoots === true); // buscar otro que no tenga roots
                }
                else if (hability === "weaken" && red_battalion[random].status.weaken === true) { // si se castea weaken  e indice tiene weaken
                    do {
                        random = getRandomInt(0, red_battalion.length - 1);
                        counter++;
                        if (counter === 20) {
                            return false;
                        }
                    } while (red_battalion[random].status.weaken === true); // buscar otro que no tenga weaken
                }
                
                if (["druid", "crossbowman", "necromancer", "prayer",].includes(red_battalion[random].unit)) { // las unidades ranged tienen un 50% menos de chances de ser atacadas
                    let random2 = getRandomInt(1,2);
                    if (random2 === 1) {
                        repeat = true;
                    }
                    else {
                        targetEnemy(red_battalion[random]);
                    }
                }
                else {
                    targetEnemy(red_battalion[random]);
                }  
            }    
        } while (repeat === true); 
    }
    else { // ataque basico si origen es rojo
        do {
            repeat = false; 
            if (blue_battalion.length > 0) {
                random = getRandomInt(0, blue_battalion.length - 1); // obtener numero random para indice
                // checkear en caso de que se lance una habilidad en la que el target no tenga que estar afectado
                if (hability === "roots" && blue_battalion[random].status.entanglingRoots === true) { // si se castea root e indice tiene roots
                    do {
                        random = getRandomInt(0, blue_battalion.length - 1); // buscar otro target que sea valido
                        counter++;
                        if (counter === 20) { // evitar bucles infinitos
                            return false;
                        }
                    } while (blue_battalion[random].status.entanglingRoots === true); // buscar otro que no tenga roots
                }
                else if (hability === "weaken" && blue_battalion[random].status.weaken === true) { // si se castea weaken  e indice tiene weaken
                    do {
                        random = getRandomInt(0, blue_battalion.length - 1);
                        counter++;
                        if (counter === 20) {
                            return false;
                        }
                    } while (blue_battalion[random].status.weaken === true); // buscar otro que no tenga weaken
                }
                // checkear si el target valido es un ranged, lo cual tiene un 50% de generar que se busque otro target. 
                // el bucle infinito en teoria seria evitado, ya que si solo quedase  de valido alguno de estos, lo intentará hasta lograrlo
                if (["druid", "crossbowman", "necromancer", "prayer",].includes(blue_battalion[random].unit)) { // las unidades ranged tienen un 50% menos de chances de ser atacadas
                    let random2 = getRandomInt(1,2);
                    if (random2 === 1) {
                        repeat = true;
                    }
                    else {
                        targetEnemy(blue_battalion[random]);
                    }
                }
                else {
                    targetEnemy(blue_battalion[random]);
                }  
            }    
        } while (repeat === true); 
    }
    return true;
}

// checkea la longitud de los arrays de equipo para buscar un perdedor (el array con 0 elementos) y declarar ganador
export function checkWinner(blue_battalion: unit[], red_battalion: unit[]) {
    if (blue_battalion.length === 0) {
        console.log("Red Team Won!");
        return 1;
    }
    else if (red_battalion.length === 0) {
        console.log("Blue Team Won!");
        return 1;
    }
    return 0;
}

// resetear las defensas de la unidad a su valor base al inicio del turno
export function resetDefense(allUnits: unit[]) {
    for (let i = 0; i < allUnits.length; i++) {
        allUnits[i].defend = allUnits[i].defend_total;
    }
}

// restar 1 a todos los counter de status y pasarlos a falso de ser necesario
export function substract_StatusCounter(allUnits: unit[]) {
    for (let i = 0; i < allUnits.length; i++) {
        if (allUnits[i].status.divineShield === true) { // escudo divino
            allUnits[i].status.divineShieldCounter--;
            if (allUnits[i].status.divineShieldCounter === -1) { // chechear si escudo divino sigue activo
                allUnits[i].status.divineShield = false;
                console.log("Divine Shield on " + allUnits[i].name + " expires!");
            }
            else {
                console.log(allUnits[i].name + " Has Divine Shield active! ");
            }
        }
        if (allUnits[i].status.rejuvenate === true) { // rejuvenecer
            allUnits[i].status.rejuvenateCounter--;
            if (allUnits[i].status.rejuvenateCounter === -1) { // checkear si rejuvenecer sigue activo
                allUnits[i].status.rejuvenate = false;
                console.log("Rejuvenate on " + allUnits[i].name + " expires!");
            }
            else { // rejuvenecer cura 20 hp por turno
                console.log(allUnits[i].name + " Has Rejuvenate active and heals 20 HP!");
                allUnits[i].hp += 20;
                if (allUnits[i].hp > allUnits[i].total_hp) { // si la curacion excede hp maximo, lo ajusta
                    allUnits[i].hp = allUnits[i].total_hp;
                }
            }
        }
        if (allUnits[i].status.entanglingRoots === true) { // raices
            allUnits[i].status.entanglingRootsCounter--;
            if (allUnits[i].status.entanglingRootsCounter === -1) { // checkear si raices sigue activo
                allUnits[i].status.entanglingRoots = false;
                console.log("Entangling Roots on " + allUnits[i].name + " expires!");
            }
            else { // raices causa 3 de daño e inmoviliza a la unidad
                console.log(allUnits[i].name + " Has Entangling Roots active, recibes 3 damage and cant move!");
                allUnits[i].hp -= 3;
                allUnits[i].defend = 0; // evita que la unidad se pueda defender
                if (allUnits[i].status.weaken === true) {
                    let extraDamage = Math.round(50 * 3 / 100); // 50% de daño extra por el weaken
                    allUnits[i].hp -= extraDamage;
                    console.log(allUnits[i].name + " recives " + extraDamage + " extra damage due to Weaken effect!");
                }
                if (allUnits[i].hp < 1) {
                    console.log(allUnits[i].name + " Dies!"); // es importante avisar ya que en switch remove no hay aviso
                    if (allUnits[i].team === "blue") {
                        switchRemove("blue", allUnits, blue_battalion, red_battalion);
                    }
                    else {
                        switchRemove("red", allUnits, blue_battalion, red_battalion);
                    }
                }    
            }    
        }
        if (allUnits[i].status.weaken === true) { // weaken
            if (allUnits[i].status.weaken === true) { 
                allUnits[i].status.weakenCounter--;
                if (allUnits[i].status.weakenCounter === -1) { // chechear si weaken sigue activo
                    allUnits[i].status.weaken = false;
                    console.log("Weaken on " + allUnits[i].name + " expires!");
                    allUnits[i].status.weakenAttackReduction = 0; // quitar la reduccion de daño 
                    allUnits[i].status.weakenRangedAttackReduction = 0;
                    allUnits[i].status.weakenSpeedReduction = 0;
                }
                else {
                    console.log(allUnits[i].name + " Has Weaken active! ");
                }
            }
        }
    }
}

// checkea cuantas milicias hay en cada equipo para activar su bonus
export function checkMilitia(blue_battalion: unit[], red_battalion: unit[]) {
    let blueMilitiaCounter = -1; // base negativa para que no se tenga en cuenta a si mismo
    for (let i = 0; i < blue_battalion.length; i++) { // checkear milicias
        if (blue_battalion[i].unit === "militia") {
            blueMilitiaCounter++;
        }
    }
    for (let i = 0; i < blue_battalion.length; i++) { // sumar daño al bonus de milicias
        if (blue_battalion[i].unit === "militia") {
            blue_battalion[i].bonus_militia = blueMilitiaCounter;
        }
    }
    let redMilitiaCounter = -1;
    for (let i = 0; i < red_battalion.length; i++) { // checkear milicias
        if (red_battalion[i].unit === "militia") {
            redMilitiaCounter++;
        }
    }
    for (let i = 0; i < red_battalion.length; i++) { // sumar daño al bonus de milicias
        if (red_battalion[i].unit === "militia") {
            red_battalion[i].bonus_militia = redMilitiaCounter;
        }
    }
}
// proximamente sumar propiedad "extra_bonus"? (quizas sirva para una posible "aura del capitan")
// sumar los bonus de ataque y aplicarlos
export function addAllBonuses(allUnits: unit[]) {
    for (let i = 0; i < allUnits.length; i++) {
        if (allUnits[i].ranged_attack_total === 0) { // la unidad es mele
            allUnits[i].speed = allUnits[i].speed_total; // resetear speed
            allUnits[i].mele_attack = allUnits[i].mele_attack_total; // resetear ataque
            allUnits[i].bonus_attack_total += allUnits[i].bonus_militia - allUnits[i].bonus_attack_total; // actualizar bonuses
            allUnits[i].mele_attack += allUnits[i].bonus_attack_total; // aplicar bonuses
            if (allUnits[i].status.weaken === true) {
                allUnits[i].status.weakenAttackReduction = Math.round(66 * allUnits[i].mele_attack / 100); // actualizar debilitar en base a daño actualizado
                allUnits[i].speed -= allUnits[i].status.weakenSpeedReduction;
            }
            allUnits[i].reduction_attack_total += allUnits[i].status.weakenAttackReduction - allUnits[i].reduction_attack_total; // actualizar reducciones
            allUnits[i].mele_attack -= allUnits[i].reduction_attack_total; // aplicar reducciones
        }
        else { // la unidad es rango y hay que tener en cuenta su daño de rango tambien, 
            // se aplica primero los cambios en mele y luego en rango, para que la impresion de los bonus sean en base al rango
            allUnits[i].speed = allUnits[i].speed_total; // resetear speed
            allUnits[i].mele_attack = allUnits[i].mele_attack_total; // resetear ataque
            allUnits[i].bonus_attack_total += allUnits[i].bonus_militia - allUnits[i].bonus_attack_total; // actualizar bonuses
            allUnits[i].mele_attack += allUnits[i].bonus_attack_total; // aplicar bonuses
            if (allUnits[i].status.weaken === true) {
                allUnits[i].status.weakenAttackReduction = Math.round(66 * allUnits[i].mele_attack / 100); // actualizar debilitar en base a daño actualizado
                allUnits[i].speed -= allUnits[i].status.weakenSpeedReduction; // solo aplicamos una vez 
            }
            allUnits[i].reduction_attack_total += allUnits[i].status.weakenAttackReduction - allUnits[i].reduction_attack_total; // actualizar reducciones
            allUnits[i].mele_attack -= allUnits[i].reduction_attack_total; // aplicar reducciones

            allUnits[i].ranged_attack = allUnits[i].ranged_attack_total; // resetear ataque
            allUnits[i].bonus_attack_total += allUnits[i].bonus_militia - allUnits[i].bonus_attack_total; // actualizar bonuses
            allUnits[i].ranged_attack += allUnits[i].bonus_attack_total; // aplicar bonuses
            if (allUnits[i].status.weaken === true) {
                allUnits[i].status.weakenRangedAttackReduction = Math.round(66 * allUnits[i].ranged_attack / 100); // actualizar debilitar en base a daño actualizado
            }
            allUnits[i].reduction_attack_total += allUnits[i].status.weakenRangedAttackReduction - allUnits[i].reduction_attack_total; // actualizar reducciones
            allUnits[i].ranged_attack -= allUnits[i].reduction_attack_total; // aplicar reducciones
        }
    }
}
/*allUnits[i].mele_attack = allUnits[i].bonus_attack_total; // obtener ataque base
allUnits[i].ranged_attack -= allUnits[i].bonus_attack_total;
allUnits[i].bonus_attack_total = allUnits[i].bonus_militia; // sumar bonuses a "bonus_attack_total"
allUnits[i].mele_attack += allUnits[i].bonus_attack_total; // añadir daño
allUnits[i].ranged_attack += allUnits[i].bonus_attack_total;*/

// regeneracion de mana al principio del turno
export function manaRegen(allUnits: unit[]) {
    for (let i = 0; i < allUnits.length; i++) {
        if (allUnits[i].total_mana > 0) {
            allUnits[i].mana += allUnits[i].mana_regen;
            if (allUnits[i].mana > allUnits[i].total_mana) { // caso extremo donde si la regeneracion excede mana maximo, lo ajusta
                allUnits[i].mana = allUnits[i].total_mana;
            }
        }
    }
}

// funcion de ataque de un mele a un swordsman (que puede bloquear)
export function meleToSwordsman(origin: unit, target: unit, attackText: string): [string, number] {
    let damageNotDone = false; // controlar caso en el que target bloquee y origen no muera atacando
    // tiene que devolver 0
    let random = getRandomInt(1, 10);
        if (random < 3) { // 2 chances en 10 de que bloquee
            if (target.defend > 0) { // si puede defender, bloquea y defiende
                console.log(origin.name + attackText + target.name);
                console.log(target.name + " Blocks with his shield and strikes back!");
                damageNotDone = true;
                if (origin.status.divineShield === false) { //si origen no tiene escudo divino
                    origin.hp -= target.mele_attack;
                    target.defend--; 
                    if (origin.hp < 1) {
                        console.log(origin.name + " dies attacking " + target.name);
                    // eliminar atacante (this) si murio por la defensa del target
                    // caso atacante murio y target no recibio daño
                        if (origin.team === "blue") {
                            return ["blue", 0];
                        } else { 
                            return ["red", 0];
                        }   
                    }
                    else { // caso en el que target se puede defender, origen sobrevive y tiene weaken activo
                        if (origin.status.weaken === true) {
                            let extraDamage = Math.round(50 * target.mele_attack / 100);
                            origin.hp -= extraDamage;
                            console.log(origin.name + " recives " + extraDamage + " extra damage due to Weaken effect!\n" + origin.name + " - HP: " + origin.hp);
                        }
                    }
                }
                else { // si origen tiene escudo divino, caso origen tiene escudo divino y bloquea daño de defensa
                    target.defend--;
                    console.log(origin.name + " is protected by Divine Shield!");
                }    
            }
            else if (target.defend < 1) { // si no puede defender, solamente bloquea y basicamente no sucede nada
                console.log(origin.name + attackText + target.name);
                console.log(target.name + " Blocks with his shield!");
                damageNotDone = true;
            }
        } else { // si no bloquea es un ataque normal
            console.log(origin.name + attackText + target.name);
            target.hp -= origin.mele_attack;
            if (target.hp < 1) {
                console.log(target.name + " dies!");
                // caso donde el target muere, devuelve 0 porque es irrelevante si el daño base ya lo mató
                if (target.team === "blue") {
                    return ["blue", 0];
                } else { 
                    return ["red", 0];
                }        
            }         
            else if (target.defend > 0) {
                console.log(target.name + " defends and strikes back!" );
                if (origin.status.divineShield === false) {
                    origin.hp -= target.mele_attack;
                    target.defend--; 
                    if (origin.hp < 1) {
                        // caso origen muere por la defensa del target
                        console.log(origin.name + " dies attacking " + target.name);
                        // eliminar atacante (this) si murio por la defensa del target
                        if (origin.team === "blue") { // en este caso hay que devolver el daño causado al target
                            return ["blue", origin.mele_attack];
                        } else {
                            return ["red", origin.mele_attack];
                        }
                    }
                    else { // caso en el que target se puede defender, origen sobrevive y tiene weaken activo
                        if (origin.status.weaken === true) {
                            let extraDamage = Math.round(50 * target.mele_attack / 100);
                            origin.hp -= extraDamage;
                            console.log(origin.name + " recives " + extraDamage + " extra damage due to Weaken effect!\n" + origin.name + " - HP: " + origin.hp);
                        }
                    }
                }
                else { // si origen tiene escudo divino
                    target.defend--;
                    console.log(origin.name + " is protected by Divine Shield!");
                }       
            }     
        }
        if (damageNotDone === false) {
            return ["", origin.mele_attack]; // caso no muere nadie y target recibio daño
        }
        else {
            return ["", 0]; // caso no muere nadie y target no recibio daño
        }
    
}

// funcion de ataque de un mele a una unidad con defensa normal 
export function meleToNormal(origin: unit, target: unit, attackText: string): [string, number] {
    // no hay boolean porque en meleToNormal siempre recibe daño el target
    console.log(origin.name + attackText + target.name);
                target.hp -= origin.mele_attack;
                if (target.hp < 1) {
                    console.log(target.name + " dies!");
                    // eliminar target si murio
                    if (target.team === "blue") {  // caso donde muere el target
                        return ["blue", 0];
                    } else {
                        return ["red", 0];
                    }        
                }         
                else if (target.defend > 0) {
                    console.log(target.name + " defends and strikes back!" );
                    if (origin.status.divineShield === false) {
                        origin.hp -= target.mele_attack;
                        target.defend--; 
                        if (origin.hp < 1) { // caso origen muere y target recibio daño
                            console.log(origin.name + " dies attacking " + target.name);
                            // eliminar atacante (this) si murio por la defensa del target
                            if (origin.team === "blue") {
                                return ["blue", origin.mele_attack];
                            } else {
                                return ["red", origin.mele_attack];
                            }
                        }
                        else { // caso en el que target se puede defender, origen sobrevive y tiene weaken activo
                            if (origin.status.weaken === true) {
                                let extraDamage = Math.round(50 * target.mele_attack / 100);
                                origin.hp -= extraDamage;
                                console.log(origin.name + " recives " + extraDamage + " extra damage due to Weaken effect!\n" + origin.name + " - HP: " + origin.hp);
                            }
                        }
                    }
                    else { // si origen tiene escudo divino
                        target.defend--;
                        console.log(origin.name + " is protected by Divine Shield!");
                    }    
                }
    return ["", origin.mele_attack]; // no muere nadie
}

// switch para remover unidades en base al retorno de funciones de daño           
export function switchRemove(result: string | null, allUnits: unit[], blue_battalion: unit[], red_battalion: unit[]): boolean {
    let removed = false;
    switch (result) {
        case "blue":
            removed = removeDeadUnits(blue_battalion);
            removed = removeDeadUnits(allUnits);
            break; 
        case "red":
            removed = removeDeadUnits(red_battalion);
            removed = removeDeadUnits(allUnits);
            break;
        case "":
            break;
    }
    if (removed === true) {
        SummonStats.deadCounter++; // para contar cadaveres que el nigromante puede usar
    }
    return removed;
}

// funcion de ataque de mele a unidad con escudo divino (target no recibe daño y se puede defender)
export function meleToShield (origin: unit, target: unit, attackText: string): [string, number] {    
    console.log(origin.name + attackText + target.name);
    console.log(target.name + " is protected by Divine Shield!");
    if (target.defend > 0) { // si target se defiende
        if (origin.status.divineShield === false) {
            console.log(target.name + " defends and strikes back!" );
            origin.hp -= target.mele_attack;
            target.defend--; 
            if (origin.hp < 1) {
                console.log(origin.name + " dies attacking " + target.name);
                if (origin.team === "blue") {
                    return ["blue", 0];
                } else {
                    return ["red", 0];
                }
            }
            else { // caso en el que target se puede defender, origen sobrevive y tiene weaken activo
                if (origin.status.weaken === true) {
                    let extraDamage = Math.round(50 * target.mele_attack / 100);
                    origin.hp -= extraDamage;
                    console.log(origin.name + " recives " + extraDamage + " extra damage due to Weaken effect!\n" + origin.name + " - HP: " + origin.hp);
                }
            }
        }
        else { // si origen tiene escudo divino
            target.defend--;
            console.log(origin.name + " is protected by Divine Shield!");
        }    
    }
    return ["", 0]; // nadie muere
}

// funcion de ataque de ranged a swordsman
export function rangedToSwordsman(origin: unit, target: unit, attackText: string): [string, number] {
    let random = getRandomInt(1, 10);
    if (random < 3) { // 2 chances en 10 de que bloquee
        console.log(origin.name + attackText + target.name);
        console.log(target.name + " Blocks with his shield!");
        return ["", 0]; 
    } else { // si no bloquea, el ataque es normal
        console.log(origin.name + attackText + target.name);
        target.hp -= origin.ranged_attack;
        if (target.hp < 1) {
            console.log(target.name + " dies!");
            if (target.team === "blue") { 
                return ["blue", 0];
            } else {
                return ["red", 0]; 
            }
        }
    }
    return ["", origin.ranged_attack];   
}

// funcion de ataque de ranged a unidad con defensa normal
export function rangedToNormal(origin: unit, target: unit, attackText: string): [string, number] {
    console.log(origin.name + attackText + target.name);
    target.hp -= origin.ranged_attack;
    if (target.hp < 1) {
        console.log(target.name + " dies!");
        if (target.team === "blue") { 
            return ["blue", 0];
        } else {
            return ["red", 0]; 
        }
    }
    return ["", origin.ranged_attack];
}

// funcion de ataque de ranged a unidad con escudo divino (no sucede nada)
export function rangedToShield (origin: unit, target: unit, attackText: string): [string, number] {    
    console.log(origin.name + attackText + target.name);
    console.log(target.name + " is protected by Divine Shield!");
    return ["", 0];
}


