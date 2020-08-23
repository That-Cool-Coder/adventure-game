function randint(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function setAlpha(rgbColor, alpha) {
    returnColor = [rgbColor[0], rgbColor[1], rgbColor[2]];
    returnColor.push(alpha);
    return returnColor;
}

function getViewportWidth() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}

function getViewportHeight() { 
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
}

function calcAccelerationDist(speedChange, acceleration) {
    speedChange = Math.abs(speedChange);
    acceleration = Math.abs(acceleration);
    var dist = 0;
    var speed = 0;
    while (speed <= speedChange) {
        speed += acceleration;
        dist += speed;
    }
    return dist;
}

function findSizeMultilplierToFitRectangle(origSize, availableSize) {
    // Find how much you have to multiply origSize to fit it into availableSize...
    // ...without changing the aspect ratio

    var origRatio = origSize.x / origSize.y;
    var availableRatio = availableSize.x / availableSize.y;

    // If the wanted size is wider than the usable one use the whole width
    if (origRatio >= availableRatio) {
        var sizeMult = availableSize.x / origSize.x;
    }
    // If the wanted size is taller than the usable one use the whole height
    else {
        var sizeMult = availableSize.y / origSize.y;
    }
    return sizeMult;
}

function scaleToFitRectangle(origSize, availableSize) {
    // Multiply origSize so that it fits into availableSize
    // ...without changing the aspect ratio

    var sizeMult = findSizeMultilplierToFitRectangle(origSize, availableSize);
    var size = new p5.Vector(origSize.x * sizeMult, origSize.y * sizeMult);
    return size;
}

function doNothing() {
    // Do nothing!
}