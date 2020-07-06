const widthCm = 800;
const heightCm = 500;

const fps = 60; // frames per second

// what fraction of the viewport is taken up by the game window in both width and height
const viewportSizeTaken = 0.95;

function findScaleMult() {
    var crntRatio = widthCm / heightCm;

    var usableWidth = getViewportWidth() * viewportSizeTaken;
    var usableHeight = getViewportHeight() * viewportSizeTaken ;
    var usableRatio = usableWidth / usableHeight;

    // If the wanted size is wider than the usable one use the whole width
    if (crntRatio >= usableRatio) {
        var scaleMult = usableWidth / widthCm;
    }
    // If the wanted size is taller than the usable one use the whole height
    else {
        var scaleMult = usableHeight / heightCm;
    }
    
    return scaleMult;
}