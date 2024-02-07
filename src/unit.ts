// En unit.ts
export type status = {
    divineShield: boolean,
    divineShieldCounter: number,
    rejuvenate: boolean,
    rejuvenateCounter: number,
    entanglingRoots: boolean,
    entanglingRootsCounter: number,
    weaken: boolean,
    weakenCounter: number,
    weakenAttackReduction: number,
    weakenRangedAttackReduction: number,
    weakenSpeedReduction: number,
};

// crear y exportar el tipo de dato unit
export type unit = {
    hp: number, // hp actual
    total_hp: number, // total de hp (util para curaciones)
    mana: number,
    total_mana: number,
    mana_regen: number,
    mele_attack: number,
    mele_attack_total: number,
    ranged_attack: number,
    ranged_attack_total: number,
    speed: number, // orden de movimiento
    speed_total: number,
    defend: number, // defensas restantes
    defend_total: number, // defensas totales base
    bonus_attack_total: number, // suma de todos los bonus
    bonus_militia: number, // suma de bonus para milicia
    reduction_attack_total: number,
    name: string,
    team: string, // identificador de color interno
    unit: string, // identificador de unidad interno
    basic_attack: (target: unit) => void
    special_skill?: (target: unit) => void; // Habilidad especial opcional
    special_skill1?: (target: unit) => void;
    summon_skill?: (summonIn: unit[], name: string, team: string) => void;

    status: status,
};

import { blue_battalion, red_battalion, allUnits } from "./main";
import { switchRemove, meleToSwordsman, meleToNormal, meleToShield, rangedToSwordsman, 
        rangedToNormal, rangedToShield, SummonStats } from "./functions";

// Función fábrica para Swordsman
export function createSwordsman(name: string, team: string): unit {
    return {
        hp: 100,
        total_hp: 100,
        mana: 0,
        total_mana: 0,
        mana_regen: 0,
        mele_attack: 5,
        mele_attack_total: 5,
        ranged_attack: 0,
        ranged_attack_total: 0,
        speed: 1,
        speed_total: 1,
        defend: 1,
        defend_total: 1,
        bonus_attack_total: 0,
        bonus_militia: 0,
        reduction_attack_total: 0,
        name: name,
        team: team,
        unit: "swordsman",
        basic_attack: function(target: unit) { 
            let removed = false; // permite saber si target murio
            let result: [string, number];
            if (target.status.divineShield === true) { // checkear escudo divino
                result = meleToShield(this, target, " strikes with his sword at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            else if (target.unit === "swordsman") { // checkear si es swordsman, que puede bloquear
                result = meleToSwordsman(this, target, " strikes with his sword at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            } else { // ataque normal
                result = meleToNormal(this, target, " strikes with his sword at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            if (removed === false && target.status.weaken === true && result[1] > 0) { // target tiene weaken activo, no murio y no tiene escudo divino
                let extraDamage = Math.round(50 * result[1] / 100); // 50% de daño extra por el weaken
                target.hp -= extraDamage;
                console.log(target.name + " recives " + extraDamage + " extra damage due to Weaken effect!\n" + target.name + " - HP: " + target.hp);
                if (target.hp < 1) {
                    console.log(target.name + " dies!");
                    switchRemove(result[0], allUnits, blue_battalion, red_battalion);
                }
            }    
        },
        status: {
            divineShield: false,
            divineShieldCounter: -1,
            rejuvenate: false,
            rejuvenateCounter: -1,
            entanglingRoots: false,
            entanglingRootsCounter: -1,
            weaken: false,
            weakenCounter: -1,
            weakenAttackReduction: 0,
            weakenRangedAttackReduction: 0,
            weakenSpeedReduction: 0,
        }
    };                     
}              
// Función fábrica para Crossbowman
export function createCrossbowman(name: string, team: string): unit {
    return {
        hp: 80,
        total_hp: 80,
        mana: 0,
        total_mana: 0,
        mana_regen: 0,
        mele_attack: 3,
        mele_attack_total: 3,
        ranged_attack: 6,
        ranged_attack_total: 6,
        speed: 2,
        speed_total: 2,
        defend: 1,
        defend_total: 1,
        bonus_attack_total: 0,
        bonus_militia: 0,
        reduction_attack_total: 0,
        name: name,
        team: team,
        unit: "crossbowman",
        // es necesario crear funcion rangedToSwordsman y rangedToNormal para los basicos de unidades ranged como el ballestero
        basic_attack: function(target: unit) { 
            let removed = false; // permite saber si target murio
            let result: [string, number];
            if (target.status.divineShield === true) {
                result = rangedToShield(this, target, " shoots an arrow at "); // no hay muertes
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
            }
            else if (target.unit === "swordsman") { // checkear si es swordsman por su habilidad de bloquear ataques basicos
                result = rangedToSwordsman(this, target, " shoots an arrow at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            } else { // si no es swordsman
                result = rangedToNormal(this, target, " shoots an arrow at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            if (removed === false && target.status.weaken === true && result[1] > 0) { // target tiene weaken activo, no murio y no tiene escudo divino
                let extraDamage = Math.round(50 * result[1] / 100); // 50% de daño extra por el weaken
                target.hp -= extraDamage;
                console.log(target.name + " recives " + extraDamage + " extra damage due to Weaken effect!\n" + target.name + " - HP: " + target.hp);
                if (target.hp < 1) {
                    console.log(target.name + " dies!");
                    switchRemove(result[0], allUnits, blue_battalion, red_battalion);
                }
            }     
        },
        status: {
            divineShield: false,
            divineShieldCounter: -1,
            rejuvenate: false,
            rejuvenateCounter: -1,
            entanglingRoots: false,
            entanglingRootsCounter: -1,
            weaken: false,
            weakenCounter: -1,
            weakenAttackReduction: 0,
            weakenRangedAttackReduction: 0,
            weakenSpeedReduction: 0,
        },
    };
}

export function createMilita(name: string, team: string): unit {
    return {
        hp: 75,
        total_hp: 75,
        mana: 0,
        total_mana: 0,
        mana_regen: 0,
        mele_attack: 4,
        mele_attack_total: 4,
        ranged_attack: 0,
        ranged_attack_total: 0,
        speed: 2,
        speed_total: 2,
        defend: 1,
        defend_total: 1,
        bonus_attack_total: 0,
        bonus_militia: 0,
        reduction_attack_total: 0,
        name: name,
        team: team,
        unit: "militia",
        basic_attack: function(target: unit) { 
            let removed = false; // permite saber si target murio
            let result: [string, number];
            if (target.status.divineShield === true) { // checkear escudo divino
                result = meleToShield(this, target, " strikes with his axe at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            else if (target.unit === "swordsman") { // checkear si es swordsman, que puede bloquear
                result = meleToSwordsman(this, target, " strikes with his axe at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            } else { // ataque normal
                result = meleToNormal(this, target, " strikes with his axe at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            if (removed === false && target.status.weaken === true && result[1] > 0) { // target tiene weaken activo, no murio y no tiene escudo divino
                let extraDamage = Math.round(50 * result[1] / 100); // 50% de daño extra por el weaken
                target.hp -= extraDamage;
                console.log(target.name + " recives " + extraDamage + " extra damage due to Weaken effect!\n" + target.name + " - HP: " + target.hp);
                if (target.hp < 1) {
                    console.log(target.name + " dies!");
                    switchRemove(result[0], allUnits, blue_battalion, red_battalion);
                }
            }    
        },
        status: {
            divineShield: false,
            divineShieldCounter: -1,
            rejuvenate: false,
            rejuvenateCounter: -1,
            entanglingRoots: false,
            entanglingRootsCounter: -1,
            weaken: false,
            weakenCounter: -1,
            weakenAttackReduction: 0,
            weakenRangedAttackReduction: 0,
            weakenSpeedReduction: 0,
        },
    };
}

export function createPaladin(name: string, team: string): unit {
    return {
        hp: 90,
        total_hp: 90,
        mana: 100,
        total_mana: 100,
        mana_regen: 2,
        mele_attack: 4,
        mele_attack_total: 4,
        ranged_attack: 0,
        ranged_attack_total: 0,
        speed: 1,
        speed_total: 1,
        defend: 1,
        defend_total: 1,
        bonus_attack_total: 0,
        bonus_militia: 0,
        reduction_attack_total: 0,
        name: name,
        team: team,
        unit: "paladin",
        basic_attack: function(target: unit) { 
            let removed = false; // permite saber si target murio
            let result: [string, number];
            if (target.status.divineShield === true) { // checkear escudo divino
                result = meleToShield(this, target, " strikes with his hammer at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            else if (target.unit === "swordsman") { // checkear si es swordsman, que puede bloquear
                result = meleToSwordsman(this, target, " strikes with his hammer at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            } else { // ataque normal
                result = meleToNormal(this, target, " strikes with his hammer at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            if (removed === false && target.status.weaken === true && result[1] > 0) { // target tiene weaken activo, no murio y no tiene escudo divino
                let extraDamage = Math.round(50 * result[1] / 100); // 50% de daño extra por el weaken
                target.hp -= extraDamage;
                console.log(target.name + " recives " + extraDamage + " extra damage due to Weaken effect!\n" + target.name + " - HP: " + target.hp);
                if (target.hp < 1) {
                    switchRemove(result[0], allUnits, blue_battalion, red_battalion);
                }
            }               
        },
        special_skill: function(target: unit) { // luz sagrada
            console.log(this.name + " casts Holy Light at " + target.name);
            target.hp += 80;
            this.mana -= 20; // la comprobacion de mana para castear la hace en funcion "unitAction"
            if (target.hp > target.total_hp) { // si la curacion excede hp maximo, lo ajusta
                target.hp = target.total_hp;
            }
            console.log("-> " + target.name + " HP: " + target.hp + " - " + this.name + " MANA: " + this.mana);
        },
        special_skill1: function(target: unit) { // escudo divino
            console.log(this.name + " casts Divine Shield at " + target.name);
            this.mana -= 12;
            console.log("-> " + target.name + " HP: " + target.hp + " - " + this.name + " MANA: " + this.mana);
            target.status.divineShield = true;
            target.status.divineShieldCounter = 1; // en -1 se acaba (es decir, dura el turno actual y el turno que sigue)
            // escudo divino remueve afectaciones negativas de la unidad
            if (target.status.entanglingRoots === true) {
                target.status.entanglingRoots = false;
                target.status.entanglingRootsCounter = -1;
                console.log("Divine Shield removes Entangling Roots from " + target.name);
            }
            if (target.status.weaken === true) {
                target.status.weaken = false;
                target.status.weakenCounter = -1;
                target.status.weakenAttackReduction = 0;
                target.status.weakenRangedAttackReduction = 0;
                target.status.weakenSpeedReduction = 0;
                console.log("Divine Shield removes Weaken from " + target.name);
            }
            
        },
        status: {
            divineShield: false,
            divineShieldCounter: -1,
            rejuvenate: false,
            rejuvenateCounter: -1,
            entanglingRoots: false,
            entanglingRootsCounter: -1,
            weaken: false,
            weakenCounter: -1,
            weakenAttackReduction: 0,
            weakenRangedAttackReduction: 0,
            weakenSpeedReduction: 0,
        },
    };
}

export function createDruid(name: string, team: string): unit {
    return {
        hp: 50,
        total_hp: 50,
        mana: 150,
        mana_regen: 3,
        total_mana: 150,
        mele_attack: 1,
        mele_attack_total: 1,
        ranged_attack: 0,
        ranged_attack_total: 0,
        speed: 1,
        speed_total: 1,
        defend: 1,
        defend_total: 1,
        bonus_attack_total: 0,
        bonus_militia: 0,
        reduction_attack_total: 0,
        name: name,
        team: team,
        unit: "druid",
        basic_attack: function(target: unit) { 
            let removed = false; // permite saber si target murio
            let result: [string, number];
            if (target.status.divineShield === true) { // checkear escudo divino
                result = meleToShield(this, target, " strikes with his staff at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            else if (target.unit === "swordsman") { // checkear si es swordsman, que puede bloquear
                result = meleToSwordsman(this, target, " strikes with his staff at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            } else { // ataque normal
                result = meleToNormal(this, target, " strikes with his staff at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            if (removed === false && target.status.weaken === true && result[1] > 0) { // target tiene weaken activo, no murio y no tiene escudo divino
                let extraDamage = Math.round(50 * result[1] / 100); // 50% de daño extra por el weaken
                target.hp -= extraDamage;
                console.log(target.name + " recives " + extraDamage + " extra damage due to Weaken effect!\n" + target.name + " - HP: " + target.hp);
                if (target.hp < 1) {
                    console.log(target.name + " dies!");
                    switchRemove(result[0], allUnits, blue_battalion, red_battalion);
                }

            }               
        },
        special_skill: function(target: unit) { // rejuvenate
            console.log(this.name + " casts Rejuvenate at " + target.name);
            target.hp += 20; // cura 60 distribuido en 3 turnos (al invocar la funcion cura 20 y luego la unidad afectada se curara 20 en los dos turnos que siguen)
            this.mana -= 15; // la comprobacion de mana para castear la hace en funcion "unitAction"
            if (target.hp > target.total_hp) { // si la curacion excede hp maximo, lo ajusta
                target.hp = target.total_hp;
            }
            console.log("-> " + target.name + " HP: " + target.hp + " - " + this.name + " MANA: " + this.mana);
            target.status.rejuvenate = true;
            target.status.rejuvenateCounter = 2; //es decir, cura el turno actual, y los 2 turnos que siguen
        },
        special_skill1: function(target: unit) { // entangling roots
            console.log(this.name + " casts Entangling Roots at " + target.name);
            this.mana -= 20;
            if (target.status.divineShield === true) { // evitar que castee raices a target con escudo divino
                console.log(target.name + " Is protected by Divine Shield!");
                console.log("-> " + target.name + " HP: " + target.hp + " - " + this.name + " MANA: " + this.mana);
            }
            else {
                target.status.entanglingRoots = true;
                target.status.entanglingRootsCounter = 1; // en -1 se acaba (es decir, dura el turno actual y el turno que sigue)
                target.hp -= 3; // las raices causan un daño leve
                target.defend = 0; // evita que la unidad se pueda defender
                if (target.status.weaken === true) {
                    let extraDamage = Math.round(50 * 3 / 100); // 50% de daño extra por el weaken
                    target.hp -= extraDamage;
                    console.log(target.name + " recives " + extraDamage + " extra damage due to Weaken effect!");
                }
                console.log("-> " + target.name + " HP: " + target.hp + " - " + this.name + " MANA: " + this.mana);
                if (target.hp < 1) {
                    console.log(target.name + " Dies!");
                    if (target.team === "blue") {
                        switchRemove("blue", allUnits, blue_battalion, red_battalion);
                    }
                    else {
                        switchRemove("red", allUnits, blue_battalion, red_battalion);
                    }
                }
            }
            // IMPORTANTE: en unit action es donde se evita que la unidad afectada ejecute una accion
        },
        summon_skill: function(summonIn: unit[], name: string, team: string) {
            console.log(this.name + " casts Power of Nature and summons a Treant!");
            this.mana -= 40;
            summonIn.push(createTreant(name, team)); // crear nueva unidad en el array de equipo correspondiente
            console.log("Summoned: -> " + summonIn[summonIn.length - 1].name + " - HP: " + summonIn[summonIn.length - 1].hp + " - Mele Damage: " + summonIn[summonIn.length - 1].mele_attack + " - " + this.name + " MANA: " + this.mana);
        },
        status: {
            divineShield: false,
            divineShieldCounter: -1,
            rejuvenate: false,
            rejuvenateCounter: -1,
            entanglingRoots: false,
            entanglingRootsCounter: -1,
            weaken: false,
            weakenCounter: -1,
            weakenAttackReduction: 0,
            weakenRangedAttackReduction: 0,
            weakenSpeedReduction: 0,
        },
    };
}

function createTreant(name: string, team: string): unit {
    return {
        hp: 125,
        total_hp: 125,
        mana: 0,
        total_mana: 0,
        mana_regen: 0,
        mele_attack: 2,
        mele_attack_total: 2,
        ranged_attack: 0,
        ranged_attack_total: 0,
        speed: 0,
        speed_total: 0,
        defend: 1,
        defend_total: 1,
        bonus_attack_total: 0,
        bonus_militia: 0,
        reduction_attack_total: 0,
        name: name,
        team: team,
        unit: "treant",
        basic_attack: function(target: unit) { 
            let removed = false; // permite saber si target murio
            let result: [string, number];
            if (target.status.divineShield === true) { // checkear escudo divino
                result = meleToShield(this, target, " strikes with his branch at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            else if (target.unit === "swordsman") { // checkear si es swordsman, que puede bloquear
                result = meleToSwordsman(this, target, " strikes with his branch at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            } else { // ataque normal
                result = meleToNormal(this, target, " strikes with his branch at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            if (removed === false && target.status.weaken === true && result[1] > 0) { // target tiene weaken activo, no murio y no tiene escudo divino
                let extraDamage = Math.round(50 * result[1] / 100); // 50% de daño extra por el weaken
                target.hp -= extraDamage;
                console.log(target.name + " recives " + extraDamage + " extra damage due to Weaken effect!\n" + target.name + " - HP: " + target.hp);
                if (target.hp < 1) {
                    console.log(target.name + " dies!");
                    switchRemove(result[0], allUnits, blue_battalion, red_battalion);
                }
            }    
        },
        status: {
            divineShield: false,
            divineShieldCounter: -1,
            rejuvenate: false,
            rejuvenateCounter: -1,
            entanglingRoots: false,
            entanglingRootsCounter: -1,
            weaken: false,
            weakenCounter: -1,
            weakenAttackReduction: 0,
            weakenRangedAttackReduction: 0,
            weakenSpeedReduction: 0,
        },
    };
}

export function createPrayer(name: string, team: string): unit {
    return {
        hp: 30,
        total_hp: 30,
        mana: 0,
        total_mana: 0,
        mana_regen: 0,
        mele_attack: 0,
        mele_attack_total: 0,
        ranged_attack: 0,
        ranged_attack_total: 0,
        speed: 1,
        speed_total: 1,
        defend: 0,
        defend_total: 0,
        bonus_attack_total: 0,
        bonus_militia: 0,
        reduction_attack_total: 0,
        name: name,
        team: team,
        unit: "prayer",
        basic_attack: function(target: unit) { 
            let removed = false; // permite saber si target murio
            let result: [string, number];
            if (target.status.divineShield === true) { // checkear escudo divino
                result = meleToShield(this, target, " strikes with his staff at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            else if (target.unit === "swordsman") { // checkear si es swordsman, que puede bloquear
                result = meleToSwordsman(this, target, " strikes with his staff at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            } else { // ataque normal
                result = meleToNormal(this, target, " strikes with his staff at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            if (removed === false && target.status.weaken === true && result[1] > 0) { // target tiene weaken activo, no murio y no tiene escudo divino
                let extraDamage = Math.round(50 * result[1] / 100); // 50% de daño extra por el weaken
                target.hp -= extraDamage;
                console.log(target.name + " recives " + extraDamage + " extra damage due to Weaken effect!\n" + target.name + " - HP: " + target.hp);
                if (target.hp < 1) {
                    console.log(target.name + " dies!");
                    switchRemove(result[0], allUnits, blue_battalion, red_battalion);
                }
            }    
        },
        // tampoco tendrá special skills incorporadas y su logica la voy a manejar directamente en "functions.ts" 
        // ya que todos los turnos "reza" y hay una pequeña chance de que "jesus escuche". dicha funcion no la activa el prayer especificamente
        status: {
            divineShield: false,
            divineShieldCounter: -1,
            rejuvenate: false,
            rejuvenateCounter: -1,
            entanglingRoots: false,
            entanglingRootsCounter: -1,
            weaken: false,
            weakenCounter: -1,
            weakenAttackReduction: 0,
            weakenRangedAttackReduction: 0,
            weakenSpeedReduction: 0,
        },
    };
}

export function createNecromancer(name: string, team: string): unit {
    return {
        hp: 40,
        total_hp: 40,
        mana: 135,
        mana_regen: 2,
        total_mana: 135,
        mele_attack: 1,
        mele_attack_total: 1,
        ranged_attack: 0,
        ranged_attack_total: 0,
        speed: 1,
        speed_total: 1,
        defend: 1,
        defend_total: 1,
        bonus_attack_total: 0,
        bonus_militia: 0,
        reduction_attack_total: 0,
        name: name,
        team: team,
        unit: "necromancer",
        basic_attack: function(target: unit) { 
            let removed = false; // permite saber si target murio
            let result: [string, number];
            if (target.status.divineShield === true) { // checkear escudo divino
                result = meleToShield(this, target, " strikes with his staff at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            else if (target.unit === "swordsman") { // checkear si es swordsman, que puede bloquear
                result = meleToSwordsman(this, target, " strikes with his staff at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            } else { // ataque normal
                result = meleToNormal(this, target, " strikes with his staff at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            if (removed === false && target.status.weaken === true && result[1] > 0) { // target tiene weaken activo, no murio y no tiene escudo divino
                let extraDamage = Math.round(50 * result[1] / 100); // 50% de daño extra por el weaken
                target.hp -= extraDamage;
                console.log(target.name + " recives " + extraDamage + " extra damage due to Weaken effect!\n" + target.name + " - HP: " + target.hp);
                if (target.hp < 1) {
                    console.log(target.name + " dies!");
                    switchRemove(result[0], allUnits, blue_battalion, red_battalion);
                }
            }               
        },
        special_skill1: function(target: unit) { // Weaken
            // aclaracion. Con respecto a debilitar, el nigromante debe en su funcion de desicion, elegir un target valido, es decir:
            // que al menos tenga 1 de ataque
            console.log(this.name + " casts Weaken at " + target.name);
            this.mana -= 30;
            if (target.status.divineShield === true) { // evitar que castee weaken a target con escudo divino
                console.log(target.name + " Is protected by Divine Shield!");
                console.log("-> " + this.name + " MANA: " + this.mana);
            }
            else {
                target.status.weaken = true;
                target.status.weakenCounter = 2; // en -1 se acaba (es decir, dura el turno actual y los 2 turnos que siguen)
                console.log("-> " + this.name + " MANA: " + this.mana);
                // calcular reduccion
                target.status.weakenAttackReduction = Math.round(66 * target.mele_attack / 100); // calcular reduccion inicial (66% de reduccion de daño)
                if (target.ranged_attack_total > 0) { // si la unidad tiene ataque ranged, modificar la reduccion del mismo tambien
                    target.status.weakenRangedAttackReduction = Math.round(66 * target.ranged_attack / 100);
                }
                target.status.weakenSpeedReduction = Math.round(50 * target.speed / 100); 
                // cambios se aplican a traves de addAllBonuses, que se llama antes de que se mueva la siguiente unidad
            }
        },
        summon_skill: function(summonIn: unit[], name: string, team: string) {
            console.log(this.name + " casts Raise the Dead and summons a Skeleton!");
            this.mana -= 15;
            summonIn.push(createSkeleton(name, team)); // crear nueva unidad en el array de equipo correspondiente
            console.log("Summoned: -> " + summonIn[summonIn.length - 1].name + " - HP: " + summonIn[summonIn.length - 1].hp + " - Mele Damage: " + summonIn[summonIn.length - 1].mele_attack + " - " + this.name + " - MANA: " + this.mana);
            SummonStats.deadCounter--; // utilizar cadaver
        },
        status: {
            divineShield: false,
            divineShieldCounter: -1,
            rejuvenate: false,
            rejuvenateCounter: -1,
            entanglingRoots: false,
            entanglingRootsCounter: -1,
            weaken: false,
            weakenCounter: -1,
            weakenAttackReduction: 0,
            weakenRangedAttackReduction: 0,
            weakenSpeedReduction: 0,
        },
    };
}

function createSkeleton(name: string, team: string): unit {
    return {
        hp: 45,
        total_hp: 45,
        mana: 0,
        total_mana: 0,
        mana_regen: 0,
        mele_attack: 4,
        mele_attack_total: 4,
        ranged_attack: 0,
        ranged_attack_total: 0,
        speed: 1,
        speed_total: 0,
        defend: 1,
        defend_total: 1,
        bonus_attack_total: 0,
        bonus_militia: 0,
        reduction_attack_total: 0,
        name: name,
        team: team,
        unit: "skeleton",
        basic_attack: function(target: unit) { 
            let removed = false; // permite saber si target murio
            let result: [string, number];
            if (target.status.divineShield === true) { // checkear escudo divino
                result = meleToShield(this, target, " strikes with his weapon at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            else if (target.unit === "swordsman") { // checkear si es swordsman, que puede bloquear
                result = meleToSwordsman(this, target, " strikes with his weapon at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            } else { // ataque normal
                result = meleToNormal(this, target, " strikes with his weapon at ");
                console.log("-> " + this.name + " HP: " + this.hp + " - " + target.name + " HP: " + target.hp);
                removed = switchRemove(result[0], allUnits, blue_battalion, red_battalion);
            }
            if (removed === false && target.status.weaken === true && result[1] > 0) { // target tiene weaken activo, no murio y no tiene escudo divino
                let extraDamage = Math.round(50 * result[1] / 100); // 50% de daño extra por el weaken
                target.hp -= extraDamage;
                console.log(target.name + " recives " + extraDamage + " extra damage due to Weaken effect!\n" + target.name + " - HP: " + target.hp);
                if (target.hp < 1) {
                    console.log(target.name + " dies!");
                    switchRemove(result[0], allUnits, blue_battalion, red_battalion);
                }
            }    
        },
        status: {
            divineShield: false,
            divineShieldCounter: -1,
            rejuvenate: false,
            rejuvenateCounter: -1,
            entanglingRoots: false,
            entanglingRootsCounter: -1,
            weaken: false,
            weakenCounter: -1,
            weakenAttackReduction: 0,
            weakenRangedAttackReduction: 0,
            weakenSpeedReduction: 0,
        },
    };
}
