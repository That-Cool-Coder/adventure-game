class Label extends Widget {
    constructor(centerPos, text, textSize, scaleMult=1, size=new p5.Vector(0, 0)) {
        var topLeftPos = p5.Vector.sub(centerPos, p5.Vector.div(size, 2));
        super(topLeftPos, size, text, textSize, scaleMult);
    }

    draw(translation=new p5.Vector(0, 0)) {
        push();

        scale(this.scaleMult);
        translate(translation);

        this.setupTextSize();
        this.setupTextColor();
        this.setupTextOutline();

        text(this.text, this.topLeftPos.x + this.size.x / 2,
            this.topLeftPos.y + this.size.y / 2);

        pop();
    }
}