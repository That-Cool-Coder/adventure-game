// This file is full of stuff that the program needs to know to make a new game

// World (terrain, time, etc)
const blockSizeCm = 50;
const mapCols = 150;

const dirtBlockSoundNames = {
    onExcavate : 'gravel'
}

const stoneBlockSoundNames = dirtBlockSoundNames;

const bedrockSoundNames = {};
const seaSoundNames = {};

const minTerrainHeight = 20;
const maxTerrainHeight = 27;
const startTerrainHeight = 24;

const startStoneDepth = 11;
const maxStoneDepth = 18;
const minStoneDepth = 4;

const hillyness = 0.3;

const dirtBlockStrength = 15;
const stoneBlockStrength = 30;
const dirtBlockStrengthRechargeRate = 0.1;
const stoneBlockStrengthRechargeRate = 0.1;

const coalChance = 1/10;
const boarChance = 1/15;

const gameTimeIncrement = 1/18000;
const gameBgImageNames = 'bgImage';

const gravityStrength = 0.5;

// Character
const characterName = 'Pete';
const characterStartPos = new p5.Vector(0, -startTerrainHeight * blockSizeCm);
const characterSizeCm = new p5.Vector(30, 50);
const characterSpeed = 3;
const characterJumpStrength = 7;
const characterMaxHealth = 100;
const characterHealRate = 0.02;
const characterMaxStamina = 100;
const characterOnDie = () => {
    noLoop();
    document.write('<h1>R.I.P. You died!');
}
const characterImageNames = {
    left : 'characterIdle',
    right : 'characterIdle',
    up : 'characterIdle',
    down : 'characterIdle'};
const characterSoundNames = {
    onDamageTaken : 'characterDamageTaken',
    onDie : 'sadTrombone'
}

// Wild animals
const wildAnimalSpawnChances = {
    'boar' : 1 / (60 * 30)
};

const createWildAnimalFunctions = {
    'boar' : pos => new Boar(pos, gravityStrength)
};

const maxWildAnimalAmounts = {
    'boar' : 25
}

const wildAnimalOnDieFuncs = {
    'boar' : () => {}
}

const oldestCompatibleVersion = 25;
const crntVersion = 25;

const mapSectionWidthCm = 500;
const mapSectionOverlapCm = 100;
const mapSectionXRanges = [];

// Make lower bound
mapSectionXRanges.push(new Range(-10000, 0));

// Generate a bunch of overlapping map sections for collision checking
for (var i = 0; i < mapCols * blockSizeCm / mapSectionWidthCm; i ++) {
    mapSectionXRanges.push(new Range(i * mapSectionWidthCm - mapSectionOverlapCm, 
        (i + 1) * mapSectionWidthCm));
}
// Make upper bound
mapSectionXRanges.push(new Range(i * mapSectionWidthCm - mapSectionOverlapCm, 
    10000));

function startNewGame() {
    var blocks = makeTerrain();
    var animals = makeWildAnimals();
    var tool = new Tool('Pickaxe', 10, new p5.Vector(30, 30),
        'pickaxe', 10, new p5.Vector(30, 10), 30);
    var inventory = new Inventory(100, 50);

    var character = new Character(characterName, characterStartPos, 
        characterSizeCm, characterSpeed, characterJumpStrength, gravityStrength, characterImageNames,
        characterMaxHealth, characterHealRate, characterMaxStamina, 0,
        true, characterOnDie, tool, tool, inventory, characterSoundNames);

    game = new Game(gameSaveName, gameBgImageNames, character,
        'exitGame()', themeColors.mainBrown, themeColors.secondBrown,
        crntVersion, blocks, mapSectionXRanges,
        animals, new Range(0, mapCols * blockSizeCm), wildAnimalSpawnChances, createWildAnimalFunctions,
        maxWildAnimalAmounts, 
        gameTimeIncrement);

    saveGame(game);
    startGame(game);
}