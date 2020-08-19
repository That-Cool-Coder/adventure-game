const coalChunkReplacer = '<c>';
const coalChunkToReplace = /\{"name":"coal","weight":2.5,"imageSizeCm":\{"x":20,"y":20,"z":0\},"imageName":"coal","classNames":\["Item","Resource"\]\}/g;

function saveGame(gameToSave) {
    var savedGame = efficientlyStringifyGame(gameToSave);
    localforage.setItem(gameToSave.name, savedGame);
}

async function loadGame(gameName) {
    var status = errorDict.nonExistingGameLoaded;

    var promise = await localforage.getItem(gameName).then(stringifiedGame => {
        var newGame = null;
        // If a game was found with that name
        if (stringifiedGame !== null) {
            var gameData = JSON.parse(stringifiedGame);

            // Check if the version is compatible
            if (gameData.version >= oldestCompatibleVersion) {
                // Load the game and set the error to no error
                newGame = parseJsonGame(stringifiedGame);
                status = errorDict.noError;
            }
            // If the version isn't compatible, say that error message
            else {
                status = errorDict.incompatibleGameVersion;
            }
        }
        // If the game didn't exist, say that error message
        else {
            status = status.nonExistingGameLoaded;
        }

        // Return the status and game
        return {game : newGame, status : status};
    });
    return promise;
}

function efficientlyStringifyGame(gameToStringify) {
    // Only stringify the bits that are required (not menu data) and swap out some regular
    // but long commonly used expressions for shorter things.
    // For instance, the long thing for a coal block becomes <c>
    // (This is currently not in action)
    var largeStringifiedGame = JSON.stringify(gameToStringify);
    var gameData = JSON.parse(largeStringifiedGame);
    var smallGameToStringify = {
        name : gameData.name,
        bgImageName : gameData.bgImageName,
        character : gameData.character,
        exitFunc : gameData.exitFunc,
        mainThemeColor : gameData.mainThemeColor,
        secondaryColor : gameData.secondaryColor,
        version : gameData.version,
        blocks : gameData.blocks,
        mapSectionXRanges : gameData.mapSectionXRanges,
        wildAnimals : gameData.wildAnimals,
        timeIncrement : gameData.timeIncrement,
        timeOfDay : gameData.timeOfDay,
        autoSaveInterval : gameData.autoSaveInterval
    }
    
    var stringifiedGame = JSON.stringify(smallGameToStringify);

    return stringifiedGame;
}

function shortenStringifiedGame(stringifiedGame) {
    // swap out some regular but long commonly used expressions for shorter things.
    // For instance, the long thing for a coal block becomes <c>
    stringifiedGame = stringifiedGame.replace(coalChunkToReplace, '<c>');
    return stringifiedGame;
}

function deshortenStringifiedGame(stringifiedGame) {
    // Swap the <c>'s for the whole coal chunk info, etc
    stringifiedGame = stringifiedGame.replace(/<c>/g, '{"name":"coal","weight":2.5,"imageSizeCm":{"x":20,"y":20,"z":0},"imageName":"coal","classNames":["Item","Resource"]}');
    return stringifiedGame;
}

function parseJsonGame(stringifiedGame) {
    // Turn a stringified game into a game object

    var gameData = JSON.parse(stringifiedGame);
    loadBlocks(gameData);
    loadWildAnimals(gameData);
    loadCharacter(gameData);
    
    // Don't use Object.setPrototypeOf() on game as it has a bunch of highly nested menus
    // that aren't saved in the JSON and would be a pain to reprototype
    var newGame = new Game(gameData.name, gameData.bgImageName, gameData.character,
        gameData.exitFunc, gameData.mainThemeColor, gameData.secondaryColor,
        gameData.version, gameData.blocks, gameData.mapSectionXRanges,
        gameData.wildAnimals, gameData.timeIncrement, 
        gameData.timeOfDay, gameData.autoSaveInterval);
    return newGame;
}

function loadBlocks(gameData) {
    // Give the blocks prototype
    gameData.blocks.forEach(block => {
        Object.setPrototypeOf(block, Block.prototype);
    });
}

function loadWildAnimals(gameData) {
    // Give the wild animals prototype
    
    gameData.wildAnimals.forEach(animal => {
        Object.setPrototypeOf(animal, WildAnimal.prototype);
        animal.onDieFunc = wildAnimalOnDieFuncs[animal.species];
    });
}

function loadCharacter(gameData) {
    // Give the character prototype

    var character = gameData.character;
    var inventory = loadInventory(gameData);
    Object.setPrototypeOf(character, Character.prototype);
    character.onDieFunc = characterOnDie; // add this method that was removed by JSON.stringify

    // Reset counters on these items so that they can be used
    character.equipMain(character.mainItem);
    character.equipSecondary(character.secondaryItem);
}

function loadInventory(gameData) {
    // Give the inventory a prototype

    var oldInventory = gameData.character.inventory;
    return Object.setPrototypeOf(oldInventory, Inventory.prototype);
}