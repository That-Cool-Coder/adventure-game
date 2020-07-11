const layoutStyles = {
    verticalRow : 'verticalRow',
    horizontalRow : 'horizontalRow',
    fixedPosition : 'fixedPosition'
}

const alignments = {
    top : 'top',
    left : 'left',
    right : 'right',
    left : 'left'
}

class Widget {
    constructor(topLeftPos, size, text, textSize, scaleMult=1) {
        this.scaleMult = scaleMult;

        this.topLeftPos = topLeftPos.copy();
        this.size = size.copy();
        this.text = text;
        this.textSize = textSize;

        this.bgColor = null;
        this.textColor = [100, 100, 100];
        this.borderColor = null;
        this.borderWidth = 1;
        this.textOutlineColor = null;
        this.textOutlineWidth = 1;
    }

    setBgColor(color) {
        this.bgColor = [color[0], color[1], color[2]];
    }
    
    setText(text) {
        this.text = text;
    }

    setTextColor(color) {
        this.textColor = [color[0], color[1], color[2]];
    }

    setTextOutlineColor(color) {
        this.textOutlineColor = [color[0], color[1], color[2]];
    }

    setTextOutlineWidth(width) {
        this.textOutlineWidth = width;
    }

    setBorderColor(color) {
        this.borderColor = [color[0], color[1], color[2]];
    }

    setBorderWidth(width) {
        this.borderWidth = width;
    }
    
    mouseInRect(topLeftCorner, size) {
        if (mouseX > topLeftCorner.x &&
            mouseX < topLeftCorner.x + size.x &&
            mouseY > topLeftCorner.y && 
            mouseY < topLeftCorner.y + size.y) {
            
            return true;
        }
        else {
            return false;
        }
    }

    userClickingInRect(topLeftCorner, size) {
        if (mouseIsPressed && this.mouseInRect(topLeftCorner, size)) {
            return true;
        }
        else {
            return false;
        }
    }

    mouseHovering(translation=new p5.Vector(0, 0)) {
        var posScaledAndTranslated = {
            x : (this.topLeftPos.x + translation.x) * this.scaleMult,
            y : (this.topLeftPos.y + translation.y) * this.scaleMult
        };

        var sizeScaled = {
            x : this.size.x * this.scaleMult,
            y : this.size.y * this.scaleMult
        }
        return this.mouseInRect(posScaledAndTranslated, sizeScaled);
    }

    isBeingClicked(translation=new p5.Vector(0, 0)) {
        if (this.mouseHovering(translation) && mouseIsPressed) {
            return true;
        }
        else {
            return false;
        }
    }

    // Warning draw function in case an extending widget with no other draw is called
    draw() {
        console.warn('Warning: draw() called in a non-drawable widget');
        console.trace();
    }

    setupFill() {
        if (this.bgColor !== null) {
            fill(this.bgColor);
        }
        else {
            noFill();
        }
    }

    setupBorder() {
        if (this.borderColor !== null && this.borderWidth !== 0) {
            stroke(this.borderColor);
            strokeWeight(this.borderWidth);
        }
    }

    setupTextColor() {
        fill(this.textColor);
    }

    setupTextOutline() {
        if (this.textOutlineColor !== null && this.textOutlineWidth !== 0) {
            stroke(this.textOutlineColor);
            strokeWeight(this.textOutlineWidth);
        }
        else {
            noStroke();
        }
    }

    setupTextSize() {
        textSize(this.textSize);
    }
}