import { Scene } from "phaser";

export class Scene3 extends Scene {
  map!: Phaser.Tilemaps.Tilemap;
  allTiles: Phaser.Tilemaps.TilemapLayer | any;
  tileset: Phaser.Tilemaps.Tileset | any;
  player: Phaser.Physics.Arcade.Sprite | any;
  constructor() {
    super({ key: "Scene3" });
  }

  preload() {
    this.load.tilemapTiledJSON("scene3", "assets/scene3/tilemap.json");
    this.load.image(
      "TileMapLayerPiloto",
      "assets/scene3/TileMapLayerPiloto.png"
    );
    this.load.image(
      "player",
      "static/assets/scene3/sprite-piloto-personagem-cena3.png"
    );
  }

  create() {

    //gamepad config
    this.input.gamepad.once(
      "connected",
      (pad: Phaser.Input.Gamepad.Gamepad) => {
        console.log("Gamepad connected!");

        pad.on(
          "down",
          (button: Phaser.Input.Gamepad.Button, value: number) => {
            console.log("Button down:", button, "Value:", value);
          }
        );
      }
    ); 
   
    // --- MAP ---
    this.map = this.make.tilemap({ key: "scene3" });
    this.tileset = this.map.addTilesetImage("TileMapLayerPiloto");
    if (this.tileset)
      this.allTiles = this.map.createLayer("layer1", this.tileset, 0, 0);

    // --- PLAYER ---
    this.player = this.physics.add.sprite(400, 450, "player");
    this.player.setCollideWorldBounds(true);

    //player animations
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });


    // --- WORLD SIZE (tilemap dimensions) ---
    const worldW = this.map.widthInPixels;
    const worldH = this.map.heightInPixels;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // --- CAMERA ---
    const cam = this.cameras.main;

    // crop viewport: 450×600, centered inside 450×800 canvas
    const VIEW_W = 450;
    const VIEW_H = 600;
    const offsetX = 0;
    const offsetY = (800 - VIEW_H) / 2; // = 100
    cam.setViewport(offsetX, offsetY, VIEW_W, VIEW_H);

    //cam.setBounds(0, 0, worldW, worldH);
    cam.startFollow(this.player, true, 0.1, 0.1); // smooth follow
    cam.setBackgroundColor("#000"); // black bars outside viewport
  }

  update() {
    if (this.input.gamepad) {
      if (this.input.gamepad.total > 0) {
        const pad = this.input.gamepad.getPad(0);
        const axisH = pad.axes[0].getValue();
        const axisV = pad.axes[1].getValue();
        console.log(axisH, axisV);
      }
    }
  }
}
