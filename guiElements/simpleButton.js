class SimpleButton extends Widget {
    constructor(topLeftPos, size, text, textSize, scaleMult) {
        super(topLeftPos, size, text, textSize, scaleMult);
    }

    draw(translation=new p5.Vector(0, 0)) {
        push();

        scale(this.scaleMult);

        translate(translation);

        // Draw button body
        if (this.borderColor !== null && this.borderWidth !== 0) {
            stroke(this.borderColor);
            strokeWeight(this.borderWidth);
        }

        if (this.bgColor !== null) {
            fill(this.bgColor);
        }
        else {
            noFill();
        }

        rect(this.topLeftPos.x, this.topLeftPos.y, this.size.x, this.size.y);
        
        // Draw button text
        textSize(this.textSize);
        fill(this.textColor);
        if (this.textOutlineColor !== null && this.textOutlineWidth !== 0) {
            stroke(this.textOutlineColor);
            strokeWeight(this.textOutlineWidth);
        }
        else {
            noStroke();
        }

        var centerPosX = this.topLeftPos.x + this.size.x / 2;
        var centerPosY = this.topLeftPos.y + this.size.y / 2;
        text(this.text, centerPosX, centerPosY);

        pop();
    }
}