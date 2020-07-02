function makeTerrain(rows, cols, levelColsAtStart=3, maxTerrainHeight=4) {
    var rows = 15;
    var cols = 150;

    var blockSizeVector = new p5.Vector(blockSizeCm, blockSizeCm);

    var blocks = makeBaseBlocks(blockSizeVector, cols, rows);

    var terrainHeight = 1;
    for (var col = levelColsAtStart; col < cols; col ++) {
        terrainHeight += randint(-1.5, 2.5);
        terrainHeight = constrain(terrainHeight, 0, maxTerrainHeight);
        
        for (var row = 0; row < terrainHeight + 1; row ++) {
            if (row != terrainHeight) {
                var block = new Block(
                    new p5.Vector(col * blockSizeCm, (row + 1) * -blockSizeCm), 
                    blockSizeVector, 'dirtBlockNorm', 'dirtBlockExcv');
            }
            else {
                var block = new Block(
                    new p5.Vector(col * blockSizeCm, (row + 1) * -blockSizeCm), 
                    blockSizeVector, 'grassBlockNorm', 'grassBlockExcv');
            }
            
            blocks.push(block);
        }
    }
    
    return blocks;
}

function makeBaseBlocks(blockSizeVector, cols, rows) {
    var blocks = [];
    for (var col = 0; col < cols; col ++) {
        for (var row = 0; row < rows; row ++) {
            var block = new Block(
                new p5.Vector(col * blockSizeCm, row * blockSizeCm + 1), 
                blockSizeVector, 'dirtBlockNorm', 'dirtBlockExcv');
            blocks.push(block);
        }
    }
    return blocks;
}