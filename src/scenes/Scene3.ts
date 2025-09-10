import { Scene } from "phaser";

export class Scene3 extends Scene {
  map!: Phaser.Tilemaps.Tilemap;
  allTiles: Phaser.Tilemaps.TilemapLayer | any;
  tileset: Phaser.Tilemaps.Tileset | any;

  constructor() {
    super({ key: "Scene3" });
  }

  preload() {
    this.load.tilemapTiledJSON("scene3", "assets/scene3/tilemap.json");
    this.load.image(
      "TileMapLayerPiloto",
      "assets/scene3/TileMapLayerPiloto.png"
    );
  }

  create() {
    this.map = this.make.tilemap({ key: "scene3" });
    this.tileset = this.map.addTilesetImage("TileMapLayerPiloto");
    if (this.tileset)
      this.allTiles = this.map.createLayer("layer1", this.tileset, 0, 0);

    this.input.gamepad.once("connected", (pad: Phaser.Input.Gamepad.Gamepad) => {
      console.log("Gamepad connected!");
      
      pad.on("down", (button: Phaser.Input.Gamepad.Button, value: number) => {
        console.log("Button down:", button, "Value:", value);
      });
    });
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
