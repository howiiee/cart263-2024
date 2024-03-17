class boot extends Phaser.Scene {

    constructor() {
        super({
            key: 'boot'
        })
    }

    preload() {
        this.load.image('tiles1', 'assets/images/Darker_Grass_Hill_Tiles_Slopes_v2.png');
        this.load.image('tiles2', 'assets/images/Darker_Grass_Hills_Tiles_v2.png');
        this.load.image('tiles3', 'assets/images/Darker_Grass_Tile_Layers.png');
        this.load.image('tiles4', 'assets/images/Grass_Hill_Tiles_Slopes v.2.png');
        this.load.image('tiles5', 'assets/images/Grass_Hill_Tiles_v2.png');
        this.load.image('tiles6', 'assets/images/Grass_Tile_Layers.png');
        this.load.image('tiles7', 'assets/images/Wood Bridge.png');
        this.load.image('water1', 'assets/images/Water_1.png');
        this.load.image('water2', 'assets/images/Water_2.png');
        this.load.image('water3', 'assets/images/Water_3.png');
        this.load.image('water4', 'assets/images/Water_4.png');
        this.load.image('tiles8', 'assets/images/Mushrooms, Flowers, Stones.png');
        this.load.image('tiles9', 'assets/images/Trees, stumps and bushes.png');
        this.load.image('house', 'assets/images/Wooden House.png');
        this.load.image('well', 'assets/images/Water well.png');
        this.load.image('paths', 'assets/images/Paths.png');
        this.load.image('furniture', 'assets/images/Basic_Furniture.png');
        this.load.image('tiles10', 'assets/images/Water Objects.png');
        this.load.spritesheet('character', 'assets/images/Basic Charakter Spritesheet.png', {
            frameWidth: 48,
            frameHeight: 48
        });
        this.load.spritesheet('door', 'assets/images/door animation sprites.png', {
            frameWidth: 16,
            frameHeight: 16, 
        });
        this.load.image('dirt', 'assets/images/Tilled_Dirt.png');
        this.load.image('farming', 'assets/images/Farming Plants.png');
        this.load.image('piknick-blanket', 'assets/images/Piknik blanket.png');
        this.load.image('piknick-basket', 'assets/images/Piknik basket.png');
        this.load.image('farming', 'assets/images/Farming Plants.png');
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');

    }

    create() {
        this.scene.start('play')
    }

    update() {

    }
}