class SimpleButton extends Widget {
    constructor(topLeftPos, size, text, textSize, scaleMult) {
        super(topLeftPos, size, text, textSize, scaleMult);
    }

    draw(translation=new p5.Vector(0, 0)) {
        push();

        scale(this.scaleMult);

        translate(translation);

        this.setupBorder();
        this.setupFill();

        rect(this.topLeftPos.x, this.topLeftPos.y, this.size.x, this.size.y);

        var centerPosX = this.topLeftPos.x + this.size.x / 2;
        var centerPosY = this.topLeftPos.y + this.size.y / 2;

        this.setupTextSize();
        this.setupTextColor();
        this.setupTextOutline();

        text(this.text, centerPosX, centerPosY);
        

        pop();
    }
}