function makeTerrain() {
    // The blocks made by this thing start off with the corner at pos 0, 0...
    // ...and go upwards on the screen, so their Y pos is decreasing

    // Make a little flat section for the character to start on
    var blocks = makeFlatSection_(3, startTerrainHeight, startStoneDepth);
    blocks = blocks.concat(makeMainTerrain(3, startTerrainHeight, startStoneDepth));

    blocks.push(makeBedrock());
    blocks = blocks.concat(makeSeaBlocks());

    return blocks;
}

function makeFlatSection_(width, terrainHeight, stoneDepth) {
    // Make a little flat section for the character to start on

    var blocks = [];
    for (var col = 0; col < width; col ++) {
        var column = makeColumn(col, terrainHeight, stoneDepth);
        blocks.push(...column);
    }
    return blocks;
}

function makeMainTerrain(startCol, startTerrainHeight, startStoneDepth) {
    var crntTerrainHeight = startTerrainHeight;
    var crntStoneDepth = startStoneDepth;
    var blocks = [];

    for (var col = startCol; col < mapCols; col ++) {
        crntTerrainHeight += randint(-hillyness, 1 + hillyness);
        crntTerrainHeight = constrain(crntTerrainHeight,
            minTerrainHeight, maxTerrainHeight);
        
        crntStoneDepth += randint(-hillyness, 1 + hillyness);
        crntStoneDepth = constrain(crntStoneDepth,
            minStoneDepth, maxStoneDepth);
        
        blocks = blocks.concat(makeColumn(col, crntTerrainHeight, crntStoneDepth));
    }
    return blocks;
}

function makeColumn(col, terrainHeight, stoneDepth) {
    var blocks = [];

    // Make the stone rows deep underground
    for (var stoneRow = 0; stoneRow < stoneDepth; stoneRow ++) {
        var block = new Block(
            new p5.Vector(col * blockSizeCm, stoneRow * -blockSizeCm), // pos
            new p5.Vector(blockSizeCm, blockSizeCm), // size
            'stoneBlockNorm', 'stoneBlockExcv', // images
            makeRandomResourceContent(), stoneBlockStrength); // other
        blocks.push(block);
    }

    // Make the dirt blocks near the surface
    for (var dirtRow = stoneDepth; dirtRow < terrainHeight; dirtRow ++) {
        var block = new Block(
            new p5.Vector(col * blockSizeCm, dirtRow * -blockSizeCm), // pos
            new p5.Vector(blockSizeCm, blockSizeCm),  // size
            'dirtBlockNorm', 'dirtBlockExcv', // images
            [], dirtBlockStrength); // other
        blocks.push(block);
    }
    // Make the top block in each column be a grass block by appearance
    blocks[blocks.length - 1].normImageName = 'grassBlockNorm';
    blocks[blocks.length - 1].excvImageName = 'grassBlockExcv';

    return blocks;
}

function makeRandomResourceContent() {
    var resourceContent = [];
    if (Math.random() < coalChance) {
        resourceContent.push(resources.coal);
    }
    return resourceContent;
}

function makeBedrock() {
    var bedrock = new Block(
        new p5.Vector(0, blockSizeCm), // pos
        new p5.Vector(blockSizeCm * mapCols, heightCm), // size
        'grey20Pixel', 'grey20Pixel', [], 0, 0, true
    );
    return bedrock;
}

function makeSeaBlocks() {
    var leftSideBlock = new Block(
        new p5.Vector(-widthCm, -(startTerrainHeight - 2) * blockSizeCm), // pos
        new p5.Vector(widthCm, startTerrainHeight * blockSizeCm + heightCm), // size
        'seaBluePixel', 'seaBluePixel', [], 0, 0, true
    );

    var rightSideBlock = new Block(
        new p5.Vector(mapCols * blockSizeCm, -(startTerrainHeight - 2) * blockSizeCm), // pos
        new p5.Vector(widthCm, startTerrainHeight * blockSizeCm + heightCm), // size
        'seaBluePixel', 'seaBluePixel', [], 0, 0, true
    );

    return [leftSideBlock, rightSideBlock];
}

function makeWildAnimals() {
    var wildAnimals = [];
    for (var col = 0; col < mapCols; col ++) {
        if (Math.random() < boarChance) {
            var boar = new Boar(new p5.Vector(blockSizeCm * col, -1500));
            wildAnimals.push(boar);
        }
    }
    return wildAnimals;
}

function makeWildAnimalTool() {
    var tool = new Tool('dat boar', 1, new p5.Vector(0, 0), 'grey20Pixel',
        boarAttackDamage,
        new p5.Vector(boarSizeCm.x / 1.9, boarSizeCm.y / 2),
        boarStaminaToAttack);
    return tool;
}