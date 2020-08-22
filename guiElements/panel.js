class Panel extends Widget {
    constructor(topLeftPos, size, layoutStyle, scaleMult=1) {
        super(topLeftPos, size, '', 0, scaleMult);

        this.layoutStyle = layoutStyle;

        this.children = [];
    }

    addChild(child, padding=0) {
        if (this.layoutStyle == layoutStyles.fixedPosition) {
            this.children.push(child);
        }
        if (this.layoutStyle == layoutStyles.relativePosition) {
            child.topLeftPos.x += this.topLeftPos.x;
            child.topLeftPos.y += this.topLeftPos.y;
            this.children.push(child);
        }
        else if (this.layoutStyle == layoutStyles.verticalRow) {
            var thisCenterX = this.topLeftPos.x + this.size.x / 2;

            if (this.children.length > 0) {
                var lastChild = this.children[this.children.length - 1];
            }
            else {
                // create a dummy child element
                var lastChild = new Padding(new p5.Vector(0, this.topLeftPos.y),
                    new p5.Vector(0, 0), this.scaleMult);
            }

            // Move to correct height
            var lastChildBottom = lastChild.topLeftPos.y + lastChild.size.y;
            child.topLeftPos.y = lastChildBottom + padding;

            // Center on panel
            child.topLeftPos.x = thisCenterX - child.size.x / 2;

            this.children.push(child);
        }
        else if (this.layoutStyle == layoutStyles.horizontalRow) {
            var lastChild = this.children[this.children.length - 1];
            var lastChildSide = lastChild.topLeftPos.x + lastChild.size.x;
            child.topLeftPos.x = lastChildSide + padding;
            this.children.push(child);
        }
        else {
            console.warn('Warning: Panel does not have a valid layout style');
            console.trace();
        }
    }

    removeChildren() {
        this.children = [];
    }

    removeChild(child) {
        var idx = this.children.indexOf(child);
        if (idx !== -1) this.children.splice(idx, 1);
    }

    linkChild(child, name) {
        this[name] = child;
    }

    draw(translation=new p5.Vector(0, 0)) {
        push();

        scale(this.scaleMult);

        translate(translation);
        
        if (this.borderColor !== null && this.borderWidth !== 0) {
            stroke(this.borderColor);
            strokeWeight(this.borderWidth);
        }
        else {
            noStroke();
        }

        if (this.bgColor !== null) {
            fill(this.bgColor);
        }
        else {
            noFill();
        }

        rect(this.topLeftPos.x, this.topLeftPos.y, this.size.x, this.size.y);

        pop();

        this.children.forEach(child => child.draw(translation));
    }
}