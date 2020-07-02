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

    isBeingClicked() {
        var posScaled = {
            x : this.topLeftPos.x * this.scaleMult,
            y : this.topLeftPos.y * this.scaleMult
        };

        var sizeScaled = {
            x : this.size.x * this.scaleMult,
            y : this.size.y * this.scaleMult
        }
        if (this.userClickingInRect(posScaled, sizeScaled)) {
            return true;
        }
        else {
            return false;
        }
    }

    // Warning draw function in case a extending widget with no other draw is called
    draw() {
        console.warn('Warning: draw() called in a non-drawable widget');
        console.trace();
    }
}