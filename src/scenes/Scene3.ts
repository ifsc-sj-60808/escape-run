import { Scene } from "phaser";

export class Scene3 extends Scene {
  private map!: Phaser.Tilemaps.Tilemap;
  private allTiles!: Phaser.Tilemaps.TilemapLayer;
  private player!: Phaser.GameObjects.Image;
  tileset!: Phaser.Tilemaps.Tileset;

  private playerTileX = 0;
  private playerTileY = 0;
  private tileSize = 32;

  constructor() {
    super({ key: "Scene3" });
  }

  preload() {
    //this.load.image('player', 'static/assets/scene3/sprite-piloto-personagem-cena3.png');
    //this.load.image('room', 'static/assets/scene3/map-test01.png');
    //this.load.image('player', 'static/assets/scene3/sprite-piloto-personagem-cena3.png');

    this.load.tilemapTiledJSON("scene3", "static/assets/scene3/tilemap.json"); //JSON, arrangement of tiles
    this.load.image("tiles", "static/assets/scene3/TileMapLayerPiloto.png"); // loading the floor and wall tiles, first 32x32px are the floor tiles, second 32x32px are the wall tiles
    this.load.image("player", "static/assets/scene3/c"); // loading the player sprite
  }

  create() {
    // --- MAP & LAYERS ---
    this.map = this.make.tilemap({ key: "scene3" });
    this.tileset = this.map.addTilesetImage("mapTemplate", "tiles");
    if (this.tileset)
      this.allTiles = this.map.createLayer("Ground", this.tileset, 0, 0);

    // Walls are tile index 2
    this.allTiles.setCollision(2);

    // codenames
    //this.map = map;
    //this.allTiles = allTiles;
    //this.tileSize = map.tileWidth;

    // iniciar mais ou menos centralizado
    const startTileX = 5;
    const startTileY = 4;
    const startX = this.map.tileToWorldX(startTileX) - this.tileSize / 2;
    const startY = this.map.tileToWorldY(startTileY) - this.tileSize / 2;

    this.player = this.add.image(startX, startY, "player").setOrigin(0.5);
    this.playerTileX = startTileX;
    this.playerTileY = startTileY;

    // Camera/bounds
    //this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }
}
