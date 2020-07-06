function saveGame(gameToSave) {
    var savedGame = JSON.stringify(gameToSave);
    localStorage.setItem(gameToSave.name, savedGame);
}

function loadGame(gameName) {
    var success = false;

    var stringifiedGame = localStorage.getItem(gameName);
    if (stringifiedGame !== null) {
        var gameData = JSON.parse(stringifiedGame);

        if (gameData.version >= oldestCompatibleVersion) {
            var blocks = loadBlocks(gameData);
            var character = loadCharacter(gameData);
            
            var newGame = new Game(gameData.name, gameData.bgImageName, character,
                gameData.exitFuncName, gameData.mainThemeColor, gameData.secondaryColor,
                gameData.version, blocks, gameData.timeIncrement, 
                    gameData.timeOfDay, gameData.autoSaveInterval);
            
            success = true;
            return newGame;
        }
    }
    if (! success) {
        return null;
    }
}

function loadBlocks(gameData) {
    var newBlocks = [];
    gameData.blocks.forEach(block => {
        var newBlock = new Block(block.positionCm, block.sizeCm, block.normImageName,
            block.excvImageName, block.strength, block.maxStrength, block.isExcavated);
        newBlocks.push(newBlock);
    });
    return newBlocks;
}

function loadCharacter(gameData) {
    var oldCharacter = gameData.character;
    var newCharacter = new Character(oldCharacter.name, oldCharacter.positionCm,
        oldCharacter.sizeCm, oldCharacter.moveSpeedCm, oldCharacter.imageName,
            oldCharacter.mainItem, oldCharacter.secondaryItem);
    return newCharacter;
}