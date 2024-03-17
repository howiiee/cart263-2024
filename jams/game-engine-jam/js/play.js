class play extends Phaser.Scene {

    constructor() {
        super({
            key: 'play'
        })
        this.lastDirection = 'idle_down';
    }

    create() {
        const waterGroup = this.add.group();
        const mapWidth = this.sys.game.config.width; // or a specific value in pixels
        const mapHeight = this.sys.game.config.height; // or a specific value in pixels
        const tileSize = 16; // Adjust based on your game's tile size
        const map = this.make.tilemap({key: 'map'});
        const tileset1 = map.addTilesetImage('Darker_Grass_Hill_Tiles_Slopes_v2', 'tiles1');
        const tileset2 = map.addTilesetImage('Darker_Grass_Hills_Tiles_v2', 'tiles2');
        const tileset3 = map.addTilesetImage('Darker_Grass_Tile_Layers', 'tiles3');
        const tileset4 = map.addTilesetImage('Grass_Hill_Tiles_Slopes v.2', 'tiles4');
        const tileset5 = map.addTilesetImage('Grass_Hill_Tiles_v2', 'tiles5');
        const tileset6 = map.addTilesetImage('Grass_Tile_Layers', 'tiles6');
        const tileset7 = map.addTilesetImage('Wood Bridge', 'tiles7');
        const tileset8 = map.addTilesetImage('Mushrooms, Flowers, Stones', 'tiles8');
        const tileset9 = map.addTilesetImage('Trees, stumps and bushes', 'tiles9');
        const tileset10 = map.addTilesetImage('Water Objects', 'tiles10');
        const water = map.addTilesetImage('Water_1', 'water1')
        const house = map.addTilesetImage('Wooden House', 'house');
        const well = map.addTilesetImage('Water well', 'well');
        const paths = map.addTilesetImage('Paths', 'paths');
        const furniture = map.addTilesetImage('Basic_Furniture', 'furniture');
        const piknickBasket = map.addTilesetImage('Piknik basket', 'piknick-basket');
        const piknickBlanket = map.addTilesetImage('Piknik blanket', 'piknick-blanket');
        const farming = map.addTilesetImage('Farming Plants', 'farming');
        const dirt = map.addTilesetImage('Tilled_Dirt', 'dirt');

        this.anims.create({
            key: 'waterAnim',
            frames: [
                {key: 'water1'},
                {key: 'water1'},
                {key: 'water2'},
                {key: 'water2'},
                {key: 'water3'},
                {key: 'water3'},
                {key: 'water4'},
                {key: 'water4'},
                {key: 'water3'},
                {key: 'water3'},
                {key: 'water2'},
                {key: 'water2'}
            ],
            frameRate: 4,
            repeat: -1
        });

        const waterLayer = map.createLayer('water', water, 0, 0);
        waterLayer.setCollisionByProperty({collides: true});

        waterLayer.forEachTile(tile => {
            if (tile.properties.collides) { // Check if the tile has the "collides" property
                const waterSprite = this.add.sprite(tile.getCenterX(), tile.getCenterY(), 'water1');
                waterSprite.play('waterAnim');
                waterSprite.setOrigin(0, 0); // Adjust if your sprites are not centered
            }
        });

        for (let x = 0; x < mapWidth; x += tileSize) {
            for (let y = 0; y < mapHeight; y += tileSize) {
                const waterSprite = this.add.sprite(x, y, 'water1').play('waterAnim');
                waterSprite.setOrigin(0, 0); // Adjust sprite origin if needed
                waterGroup.add(waterSprite);
            }
        }

        const botLayer = map.createLayer('bot', [tileset3, tileset5, tileset6], 0, 0);
        const dirtLayer = map.createLayer('dirt', [dirt], 0, 0);
        const farmingLayer = map.createLayer('farming', [farming], 0, 0);
        const piknickBlanketLayer = map.createLayer('piknick-blanket', [furniture, piknickBlanket], 0, 0);
        const piknickBasketLayer = map.createLayer('piknick-basket', [furniture, piknickBasket], 0, 0);
        const hillsLayer = map.createLayer('hills', [tileset1, tileset2, tileset3], 0, 0);
        const waterDecoLayer = map.createLayer('water-deco', [tileset10], 0, 0);
        const vegetationBehindLayer = map.createLayer('vegetation-behind', [tileset8, tileset9], 0, 0);
        const vegetationLayer = map.createLayer('vegetation', [tileset8, tileset9, well], 0, 0);
        const houseLayer = map.createLayer('house', [house], 0, 0);
        const pathsLayer = map.createLayer('paths', [paths], 0, 0);
        const bridgesLayer = map.createLayer('bridges', [tileset7], 0, 0);
        const furnitureBotLayer = map.createLayer('furniture-bottom', [furniture], 0, 0);
        const furnitureLayer = map.createLayer('furniture', [furniture], 0, 0);
        const furnitureTopLayer = map.createLayer('furniture-top', [furniture], 0, 0);

        botLayer.setCollisionByProperty({collides: true});
        hillsLayer.setCollisionByProperty({collides: true});
        waterDecoLayer.setCollisionByProperty({collides: true});
        vegetationBehindLayer.setCollisionByProperty({collides: true});
        vegetationLayer.setCollisionByProperty({collides: true});
        houseLayer.setCollisionByProperty({collides: true});
        pathsLayer.setCollisionByProperty({collides: true});
        bridgesLayer.setCollisionByProperty({collides: true});
        furnitureBotLayer.setCollisionByProperty({collides: true});
        furnitureTopLayer.setCollisionByProperty({collides: true});
        furnitureLayer.setCollisionByProperty({collides: true});
        piknickBasketLayer.setCollisionByProperty({collides: true});
        piknickBlanketLayer.setCollisionByProperty({collides: true});
        dirtLayer.setCollisionByProperty({collides: true});
        farmingLayer.setCollisionByProperty({collides: true});

        this.character = this.physics.add.sprite(325, 225, 'character');

        // Now adjust the size of the physics body
        const bodyWidth = 10;
        const bodyHeight = 10;
        this.character.body.setSize(bodyWidth, bodyHeight);

        // Optionally, you can also set the offset if you need to center the body within the sprite
        const offsetX = (this.character.width - bodyWidth) / 2;
        const offsetY = (this.character.height - bodyHeight) / 2;
        this.character.body.setOffset(offsetX, offsetY);

        // Create animations based on the sprite sheet frames
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('character', { start: 8, end: 11}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('character', { start: 12, end: 15}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('character', { start: 4, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 4}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle_left',
            frames: [{ key: 'character', frame: 8}],
            frameRate: 10,
        });

        this.anims.create({
            key: 'idle_right',
            frames: [{ key: 'character', frame: 12}],
            frameRate: 10,
        });

        this.anims.create({
            key: 'idle_up',
            frames: [{ key: 'character', frame: 4}],
            frameRate: 10,
        });

        this.anims.create({
            key: 'idle_down',
            frames: [{ key: 'character', frame: 0}],
            frameRate: 10,
        });

        // Enable cursor keys so we can create some controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.physics.add.collider(this.character, waterLayer);
        this.physics.add.collider(this.character, botLayer);
        this.physics.add.collider(this.character, furniture);
        this.physics.add.collider(this.character, furnitureBotLayer);
        this.physics.add.collider(this.character, furnitureTopLayer);
        this.physics.add.collider(this.character, waterDecoLayer);
        this.physics.add.collider(this.character, vegetationBehindLayer);
        this.physics.add.collider(this.character, vegetationLayer);
        this.physics.add.collider(this.character, pathsLayer);
        this.physics.add.collider(this.character, bridgesLayer);
        this.physics.add.collider(this.character, houseLayer);
        this.physics.add.collider(this.character, hillsLayer);
        this.physics.add.collider(this.character, farmingLayer);
        this.physics.add.collider(this.character, dirtLayer);
        this.physics.add.collider(this.character, piknickBasketLayer);
        this.physics.add.collider(this.character, piknickBlanketLayer);

        // Create the door animations
        this.anims.create({
            key: 'doorOpening',
            frames: this.anims.generateFrameNumbers('door', { start: 0, end: 5}),
            frameRate: 10,
            onComplete: () => {
                door.body.enable = false; // Disable the physics body so the character can pass through
            }
        });

        this.anims.create({
            key: 'doorClosing',
            frames: this.anims.generateFrameNumbers('door', { start: 5, end: 0 }),
            frameRate: 10,
            onComplete: () => {
                door.body.enable = true; // Re-enable the physics body once closed
            }
        });

        // Add the door sprite at the correct location
        const door = this.physics.add.sprite(616, 424, 'door', 5); // Frame 5 for closed door
        door.body.immovable = true;
        door.setInteractive(); // Make door interactive to detect pointer events if needed

        // Collider with character to trigger the door to open
        this.physics.add.overlap(this.character, door, () => {
            if (door.frame.name === 5 && !door.anims.isPlaying) { // Check if door is closed and not already animating
                door.play('doorClosing');
            }
        }, null, this);

        // Sensor zone for closing the door
        const closeSensor = this.add.zone(door.x, door.y).setSize(16, 16);
        this.physics.world.enable(closeSensor);
        closeSensor.body.setAllowGravity(false);
        closeSensor.body.moves = false;
        closeSensor.body.isSensor = true;

        // Overlap for closing the door once the character has passed through
        this.physics.add.overlap(this.character, closeSensor, () => {
            if (door.anims.currentAnim.key === 'doorClosing' && door.anims.getProgress() === 1) {
                door.play('doorOpening');
            }
        }, null, this);


        // // In your create method after creating the water layer
        // this.physics.world.createDebugGraphic();

        // // Visualize the physics bodies of the waterLayer tiles
        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // houseLayer.renderDebug(debugGraphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding faces
        // });

    }

    update() {
        // Reset the velocity
        this.character.setVelocity(0);

        // Check which cursor keys are pressed and update the character's velocity and animation
        if (this.cursors.left.isDown) {
            this.character.setVelocityX(-160);
            this.character.anims.play('left', true);
            this.lastDirection = 'idle_left';
        } else if (this.cursors.right.isDown) {
            this.character.setVelocityX(160);
            this.character.anims.play('right', true);
            this.lastDirection = 'idle_right';
        } else if (this.cursors.up.isDown) {
            this.character.setVelocityY(-160);
            this.character.anims.play('up', true);
            this.lastDirection = 'idle_up';
        } else if (this.cursors.down.isDown) {
            this.character.setVelocityY(160);
            this.character.anims.play('down', true);
            this.lastDirection = 'idle_down';
        }

        if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.character.anims.play(this.lastDirection, true);
        }
    }
}