// This file is full of stuff that the program needs to know to make a new game

// World (terrain, time, etc)
const blockSizeCm = 50;
const mapCols = 150;

const minTerrainHeight = 20;
const maxTerrainHeight = 27;
const startTerrainHeight = 24;

const startStoneDepth = 11;
const maxStoneDepth = 18;
const minStoneDepth = 4;

const hillyness = 0.3;

const dirtBlockStrength = 15;
const stoneBlockStrength = 30;

const coalChance = 1/10;
const boarChance = 1/15;

const gameTimeIncrement = 1/18000;
const gameBgImageNames = 'bgImage';

// Character
const characterName = 'Pete';
const characterStartPos = new p5.Vector(0, -startTerrainHeight * blockSizeCm);
const characterSizeCm = new p5.Vector(30, 50);
const characterSpeed = 3;
const characterMaxHealth = 100;
const characterMaxStamina = 100;
const characterImageNames = {left : 'characterIdle',
    right : 'characterIdle',
    up : 'characterIdle',
    down : 'characterIdle'};

const oldestCompatibleVersion = 17;
const crntVersion = 17;

// Boars
const boarName = 'Boar';
const boarImageNames = {left : 'boarLeft',
    right : 'boarRight',
    up : 'characterIdle',
    down : 'characterIdle'};
const boarSizeCm = new p5.Vector(blockSizeCm, blockSizeCm);
const boarMoveSpeedCm = 5;
const boarMaxHealth = 50;
const boarMaxStamina = 10;
const boarStaminaToAttack = 10;
const boarStaminaRechargeRate = 0.1;
const boarCharacterDetectDist = 250
const boarAttackDamage = 20;

const mapSectionWidthCm = 500;
const mapSectionOverlapCm = 100;
const mapSectionXRanges = [new Range(-1000, 0)];
// Generate a bunch of overlapping map sections for collision checking
for (var i = 0; i < mapCols * blockSizeCm / mapSectionWidthCm; i ++) {
    mapSectionXRanges.push(new Range(i * mapSectionWidthCm - mapSectionOverlapCm, 
        (i + 1) * mapSectionWidthCm));
}

function startNewGame() {
    var blocks = makeTerrain();
    var animals = makeWildAnimals();
    var tool = new Tool('Pickaxe', 10, new p5.Vector(30, 30),
        'pickaxe', 0.5, new p5.Vector(30, 10));
    var inventory = new Inventory(100, 50);

    var character = new Character(characterName, characterStartPos, 
        characterSizeCm, characterSpeed, characterImageNames, characterMaxHealth,
        characterMaxStamina, tool, tool, inventory);

    game = new Game(gameSaveName, gameBgImageNames, character, 
        'exitGame()', themeColors.mainBrown, themeColors.secondBrown,
        crntVersion, blocks, mapSectionXRanges, animals, gameTimeIncrement);
    saveGame(game);
    startGame(game);
}