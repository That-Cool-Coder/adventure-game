// This file is full of stuff that the program needs to know to make a new game

// World (terrain, time, etc)
const blockSizeCm = 50;
const mapCols = 150;

const minTerrainHeight = 20;
const maxTerrainHeight = 25;
const startTerrainHeight = 23;

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
const characterStartPos = new p5.Vector(0, -23 * blockSizeCm);
const characterSizeCm = new p5.Vector(30, 50);
const characterSpeed = 3;
const characterImageNames = 'characterIdle';

const oldestCompatibleVersion = 16;
const crntVersion = 16;

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
        characterSizeCm, characterSpeed, characterImageNames,
        tool, tool, inventory);

    game = new Game(gameSaveName, gameBgImageNames, character, 
        'exitGame()', themeColors.mainBrown, themeColors.secondBrown,
        crntVersion, blocks, mapSectionXRanges, animals, gameTimeIncrement);
    saveGame(game);
    startGame(game);
}