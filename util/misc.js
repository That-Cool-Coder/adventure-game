function randint(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function setAlpha(rgbColor, alpha) {
    returnColor = [rgbColor[0], rgbColor[1], rgbColor[2]];
    returnColor.push(alpha);
    return returnColor;
}

function getViewportHeight() { 
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
}