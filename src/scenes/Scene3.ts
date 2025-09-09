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
  }
}
