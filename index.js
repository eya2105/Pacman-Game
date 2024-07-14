//pacman version 1

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector('#scoreEl');

class Boundary {
    static width = 40;
    static height = 40;
    constructor({ position, image }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
    }
    draw() {
        //c.fillStyle = 'blue';
        //c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(this.image, this.position.x, this.position.y);
    }
};
class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.radians=0.75;
        this.openRate=0.12;
        this.rotation=0;
    }
    draw() {
        c.save();
        c.translate(this.position.w,this.position.y);
        c.rotate(this.rotation);
        c.translate(-this.position.w,-this.position.y);
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius,this.radians, Math.PI * 2-this.radians);
        c.lineTo(this.position.x,this.position.y);
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
        c.restore();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(this.radians<0 || this.radians> 0.75){
            this.openRate=-this.openRate;
            this.radians+=this.openRate;
        }
    }

};
class Ghost {
    static speed=2;
    constructor({ position, velocity, color = 'red' }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = color;
        this.prevcollisions = [];
        this.speed=2;
        this.scared=false;
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.scared ? 'blue' : this.color;
        c.fill();
        c.closePath();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

};
class Pellet {
    constructor({ position }) {
        this.position = position;
        this.radius = 3;
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
};

class PowerUp{
    constructor({ position }) {
        this.position = position;
        this.radius = 8;
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
};

const pellets = [];
const boundaries = [];
const powerUps = [];
const ghosts = [
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
    }),
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height * 3 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color : 'pink'

    })
];
const player = new Player({ position: { x: Boundary.width * 1.5, y: Boundary.height * 1.5 }, velocity: { x: 0, y: 0 } });
const key = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    s: {
        pressed: false
    }
}
let lastkey = ' ';
let score = -10;
const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
];
function createImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./img/pipeHorizontal.png')
                    })
                );
                break;
            case '|':
                boundaries.push(
                    new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./img/pipeVertical.png')
                    })
                );
                break;
            case '1':
                boundaries.push(
                    new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./img/pipeCorner1.png')
                    })
                );
                break;
            case '2':
                boundaries.push(
                    new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./img/pipeCorner2.png')
                    })
                );
                break;
            case '3':
                boundaries.push(
                    new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./img/pipeCorner3.png')
                    })
                );
                break;
            case '4':
                boundaries.push(
                    new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./img/pipeCorner4.png')
                    })
                );
                break;
            case 'b':
                boundaries.push(
                    new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./img/block.png')
                    })
                );
                break;
            case '[':
                boundaries.push(
                    new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        image: createImage('./img/capLeft.png')
                    })
                );
                break;
            case ']':
                boundaries.push(
                    new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        image: createImage('./img/capRight.png')
                    })
                );
                break;
            case '_':
                boundaries.push(
                    new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        image: createImage('./img/capBottom.png')
                    })
                );
                break;
            case '^':
                boundaries.push(
                    new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        image: createImage('./img/capTop.png')
                    })
                );
                break;
            case '+':
                boundaries.push(
                    new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        image: createImage('./img/pipeCross.png')
                    })
                );
                break;
            case '5':
                boundaries.push(
                    new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        color: 'blue',
                        image: createImage('./img/pipeConnectorTop.png')
                    })
                );
                break;
            case '6':
                boundaries.push(
                    new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        color: 'blue',
                        image: createImage('./img/pipeConnectorRight.png')
                    })
                );
                break;
            case '7':
                boundaries.push(
                    new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        color: 'blue',
                        image: createImage('./img/pipeConnectorBottom.png')
                    })
                );
                break;
            case '8':
                boundaries.push(
                    new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        image: createImage('./img/pipeConnectorLeft.png')
                    })
                );
                break;
            case '.':
                pellets.push(
                    new Pellet({
                        position: {
                            x: j * Boundary.width + Boundary.width / 2,
                            y: i * Boundary.height + Boundary.height / 2
                        }
                    })
                );
                break;
            case 'p':
                powerUps.push(
                    new PowerUp({
                        position: {
                            x: j * Boundary.width + Boundary.width / 2,
                            y: i * Boundary.height + Boundary.height / 2
                        }
                    })
                );
                break;    
        }
    });
});
function circlecollisionwithrectangle({ circle, rectangle }) {
    const padding=Boundary.width/2-circle.radius-1;
    return (
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height+padding &&
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x -padding &&
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding)
}
let animationId;
function animate() {
    animationId=requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    if (key.w.pressed && lastkey == 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circlecollisionwithrectangle({ circle: { ...player, velocity: { x: 0, y: -5 } }, rectangle: boundary })) {
                player.velocity.y = 0;
                break;
            }
            else {
                player.velocity.y = -5;
            }
        }
    }
    else if (key.a.pressed && lastkey == 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circlecollisionwithrectangle({ circle: { ...player, velocity: { x: -5, y: 0 } }, rectangle: boundary })) {
                player.velocity.x = 0;
                break;
            }
            else {
                player.velocity.x = -5;
            }
        }
    } else if (key.s.pressed && lastkey == 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circlecollisionwithrectangle({ circle: { ...player, velocity: { x: 0, y: 5 } }, rectangle: boundary })) {
                player.velocity.y = 0;
                break;
            }
            else {
                player.velocity.y = 5;
            }
        }
    } else if (key.d.pressed && lastkey == 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circlecollisionwithrectangle({ circle: { ...player, velocity: { x: 5, y: 0 } }, rectangle: boundary })) {
                player.velocity.x = 0;
                break;
            }
            else {
                player.velocity.x = 5;
            }
        }
    }
    //touch power
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp=powerUps[i];
        powerUp.draw();
        //player collides with a powerup
        if (Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y) < powerUp.radius + player.radius) {
            powerUps.splice(i, 1);
            //make ghost scared 
            ghosts.forEach(ghost=>{
                ghost.scared=true;

                setTimeout(()=>{
                    ghost.scared=false;
                },5000)
            });
        }


    }
    // detect collision between ghosts and player
    for (let i = ghosts.length - 1; i >= 0; i--) {
        ghost=ghosts[i];
        //ghost  touches player
        if (Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius ) {
            if  (ghost.scared){
                ghosts.splice(i,1);
            }
            else{
                cancelAnimationFrame(animationId);
                console.log("you lose");
            }
            
        }
    }

    //win condition
    if(pellets.length==0){
        console.log('you win');
        cancelAnimationFrame(animationId);
    }
    //touch  pellet
    for (let i = pellets.length - 1; i >= 0; i--) {
        const pellet = pellets[i];
        pellet.draw();
        if (Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius) {
            pellets.splice(i, 1);
            score += 10;
            scoreEl.innerHTML = score;
        }

    }


    boundaries.forEach((boundary) => {
        boundary.draw();
        if (circlecollisionwithrectangle({ circle: player, rectangle: boundary })) {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
    });

    player.update();
    const collisions = [];
    ghosts.forEach((ghost) => {
        ghost.update();

        boundaries.forEach(boundary => {
            if (
                !collisions.includes('right') &&
                circlecollisionwithrectangle({ circle: { ...ghost, velocity: { x: Ghost.speed, y: 0 } }, rectangle: boundary })) {
                collisions.push('right');
            }
            if (
                !collisions.includes('left') &&
                circlecollisionwithrectangle({ circle: { ...ghost, velocity: { x: -Ghost.speed, y: 0 } }, rectangle: boundary })) {
                collisions.push('left');
            }
            if (
                !collisions.includes('up') &&
                circlecollisionwithrectangle({ circle: { ...ghost, velocity: { x: 0, y: -Ghost.speed} }, rectangle: boundary })) {
                collisions.push('up');
            }
            if (
                !collisions.includes('down') &&
                circlecollisionwithrectangle({ circle: { ...ghost, velocity: { x: 0, y:Ghost.speed} }, rectangle: boundary })) {
                collisions.push('down');
            }
        });
        if (collisions.length > ghost.prevcollisions.length)
            ghost.prevcollisions = collisions;
        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevcollisions)) {
            if (ghost.velocity.x > 0)
                ghost.prevcollisions.push('right');
            else if (ghost.velocity.x < 0)
                ghost.prevcollisions.push('left');
            else if (ghost.velocity.y < 0)
                ghost.prevcollisions.push('up');
            else if (ghost.velocity.y > 0)
                ghost.prevcollisions.push('down');
            const pathways = ghost.prevcollisions.filter(collision => {
                return !collisions.includes(collision);
            });
            const direction = pathways[Math.floor(Math.random() * pathways.length)];
            switch (direction) {
                case 'down':
                    ghost.velocity.y = Ghost.speed;
                    ghost.velocity.x = 0;
                    break;
                case 'up':
                    ghost.velocity.y = -Ghost.speed;
                    ghost.velocity.x = 0;
                    break;
                case 'left':
                    ghost.velocity.y = 0;
                    ghost.velocity.x = -Ghost.speed;
                    break;
                case 'right':
                    ghost.velocity.y = 0;
                    ghost.velocity.x = Ghost.speed;
                    break;
            }
            ghost.prevcollisions = [];
        }
    });
    if(player.velocity.x>0) player.rotation=0;
    else if(player.velocity.x<0) player.rotation=Math.PI;
    else if(player.velocity.y<0) player.rotation=Math.PI*1.5;
    else if(player.velocity.x>0) player.rotation=Math.PI/2;
}






window.addEventListener('keydown', ({ key: keyPressed }) => {
    switch (keyPressed) {
        case 'w':
            key.w.pressed = true;
            lastkey = 'w';
            break;
        case 'a':
            key.a.pressed = true;
            lastkey = 'a';
            break;
        case 's':
            key.s.pressed = true;
            lastkey = 's';
            break;
        case 'd':
            key.d.pressed = true;
            lastkey = 'd';
            break;
    }
});

window.addEventListener('keyup', ({ key: keyReleased }) => {
    switch (keyReleased) {
        case 'w':
            key.w.pressed = false;
            break;
        case 'a':
            key.a.pressed = false;
            break;
        case 's':
            key.s.pressed = false;
            break;
        case 'd':
            key.d.pressed = false;
            break;
    }
    console.log(player.velocity);
});

animate();




