var config = {
    width: 800,
    height: 800,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var type = "circle"; // or "square"

var points = [{
    name: "blue",
    color: 0x0000FF,
    x: 100,
    y: 700,
    width: 15

}, {
    name: "green",
    color: 0x669900,
    x: 700,
    y: 700,
    width: 15
}, {
    name: "yellow",
    color: 0xFFCC33,
    x: 700,
    y: 100,
    width: 15
}, {
    name: "red",
        color: 0xC70039,
    x: 100,
    y: 100,
    width: 15
}];

const createCircleFilled = (currentPoint, scene) => {
    
    const graphicsDefinition = {
        lineStyle: {
            width: currentPoint,
            color: currentPoint.color,
            // alpha: //stroke alpha

        },
        fillStyle: {
            color: currentPoint.color//,
            //alpha: //stroke alpha
        }
    };
    
    var graphics = scene.add.graphics(graphicsDefinition);

    graphics.fillCircleShape(new Phaser.Geom.Circle(currentPoint.x, currentPoint.y, currentPoint.width));
}

const createCircleHollow = (currentPoint, scene) => {

    var graphics = scene.add.graphics({ lineStyle: { width: 2, color: currentPoint.color } });
    
    graphics.strokeCircleShape(new Phaser.Geom.Circle(currentPoint.x - 40, currentPoint.y, currentPoint.width));
}   

function createSquareFilled(currentPoint, scene) {
    
    var graphics = scene.add.graphics({ fillStyle: { color: currentPoint.color } });
    
    graphics.fillPointShape(new Phaser.Geom.Point(currentPoint.x+40, currentPoint.y), currentPoint.width);
}

function createSquareHollow(currentPoint, scene) {

    var graphics = scene.add.graphics({ lineStyle: { width: 2, color: currentPoint.color } });

    graphics.strokeRectShape(new Phaser.Geom.Rectangle(currentPoint.x + 60, currentPoint.y, currentPoint.x + 80, currentPoint.y + 20));
}
const createCircleWithInnerCircle = (center, scene)=>{
    createCircleHollow(center, this);
}

function create() {
    
    points.map(x => {
        createSquareFilled(x, this);
        createSquareHollow(x, this);
        createCircleHollow(x, this);
        createCircleFilled(x, this);
        //createCircleWithInnerCircle({x:400, y:400}, this)
    });
    
    
}
window.onload = function () {
    
    game = new Phaser.Game(config);
    window.focus();
}