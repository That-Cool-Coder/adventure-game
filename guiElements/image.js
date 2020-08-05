class SimpleImage extends Widget {
    constructor(topLeftPos, size, name, scaleMult) {
        super(topLeftPos, size, '', 0, scaleMult);
        this.name = name;
    }

    draw(translation=new p5.Vector(0, 0)) {
        push();

        scale(this.scaleMult);

        translate(translation);

        translate(this.topLeftPos.x, this.topLeftPos.y);

        var imageToDraw = images[this.name];
        image(imageToDraw, 0, 0, this.size.x, this.size.y);

        pop();
    }
}