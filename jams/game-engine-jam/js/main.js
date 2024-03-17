"use strict";

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 512,
    physics: {
        default: 'arcade'
    },
    scene: [boot, play]
};

let game = new Phaser.Game(config);