function saveGame(gameToSave) {
    var savedGame = JSON.stringify(gameToSave);
    localforage.setItem(gameToSave.name, savedGame);
}

async function loadGame(gameName) {
    var success = false;

    var promise = await localforage.getItem(gameName).then(stringifiedGame => {
        if (stringifiedGame !== null) {
            var gameData = JSON.parse(stringifiedGame);

            if (gameData.version >= oldestCompatibleVersion) {
                var blocks = loadBlocks(gameData);
                var character = loadCharacter(gameData);
                
                var newGame = new Game(gameData.name, gameData.bgImageName, character,
                    gameData.exitFunc, gameData.mainThemeColor, gameData.secondaryColor,
                    gameData.version, blocks, gameData.timeIncrement, 
                        gameData.timeOfDay, gameData.autoSaveInterval);
                
                success = true;
                return newGame;
            }
        }
        if (! success) {
            return null;
        }
    });
    return promise;
}

function loadBlocks(gameData) {
    var newBlocks = [];
    gameData.blocks.forEach(block => {
        var newBlock = new Block(block.positionCm, block.sizeCm, block.normImageName,
            block.excvImageName, block.resourceContent, block.strength, block.maxStrength,
            block.isIndestructible, -block.isExcavated);
        newBlocks.push(newBlock);
    });
    return newBlocks;
}

function loadCharacter(gameData) {
    var oldCharacter = gameData.character;
    var inventory = loadInventory(gameData);

    var newCharacter = new Character(oldCharacter.name, oldCharacter.positionCm,
        oldCharacter.sizeCm, oldCharacter.moveSpeedCm, oldCharacter.imageName,
            oldCharacter.mainItem, oldCharacter.secondaryItem, inventory);
    return newCharacter;
}

function loadInventory(gameData) {
    var oldInventory = gameData.character.inventory;
    var newInventory = new Inventory(oldInventory.maxWeight, oldInventory.items);
    return newInventory;
}