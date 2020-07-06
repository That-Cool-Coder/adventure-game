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