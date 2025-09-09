import { Scene } from "phaser";

export class Scene3 extends Scene {
  private map!: Phaser.Tilemaps.Tilemap;
  private allTiles!: Phaser.Tilemaps.TilemapLayer | null;
  private tileset!: Phaser.Tilemaps.Tileset | null;
  
  private tileSize = 32;
  
  private player!: Phaser.GameObjects.Image;
  private playerTileX = 0;
  private playerTileY = 0;

  constructor() {
    super({ key: "Scene3" });
  }

  preload() {
    //this.load.image('player', 'static/assets/scene3/sprite-piloto-personagem-cena3.png');
    //this.load.image('room', 'static/assets/scene3/map-test01.png');
    //this.load.image('player', 'static/assets/scene3/sprite-piloto-personagem-cena3.png');

    //Loads tilemap.json to Scene 3 with codename "scene3"
    this.load.tilemapTiledJSON(
      "scene3",
      "static/assets/scene3/tilemap.json"
    );

    //Load the tileset image to use in the tilemap with codename "tiles"
    //first 32x32px are the floor tiles, second 32x32px are the wall tiles
    this.load.image(
      "tiles",
      "static/assets/scene3/TileMapLayerPiloto.png"
    );

    // Load the player sprite with codename "player"
    this.load.image(
      "player",
      "static/assets/scene3/sprite-piloto-personagem-cena3.png"
    );
  }

  create() {
    // --- MAP & LAYERS ---
    this.map = this.make.tilemap({ key: "scene3" });

    this.tileset = this.map.addTilesetImage("TileMapLayerPiloto", "tiles");

    if (this.tileset)
      this.allTiles = this.map.createLayer(
        "BlockLayer1",
        this.tileset,
        0,
        0
      );

    // Walls are tile index 2
    this.allTiles.setCollision(2);

    // codenames
    //this.map = map;
    //this.allTiles = allTiles;
    //this.tileSize = map.tileWidth;

    //Cache tile size (from map)
    this.tileSize = this.map.tileWidth;

    // iniciar mais ou menos centralizado, utilizando uma física baseada em tiles
    //const startTileX = 5
    //const startTileY = 4
    const startX = this.map.tileToWorldX(5) + this.tileSize / 2;
    const startY = this.map.tileToWorldY(4) + this.tileSize / 2;
    //
    //this.player = this.add.image(startX, startY, "player").setOrigin(0.5);
    //this.playerTileX = startTileX;
    //this.playerTileY = startTileY;

    //Places the player at the correct spawn location
    this.player = this.physics.add
      .image(startX, startY, "player")
      .setOrigin(0.5, 0.5);

    
    
    
    
    
    
    
    
    // sets drag and max velocity of player
    // testar valores depois
    this.player.setDrag(1000, 1000); // smooth stop
    this.player.setMaxVelocity(250, 250);

    // Enable collisions between the physics body and the colliding tiles
    this.physics.add.collider(this.player, this.layer);

    // INPUT (arrows + WASD), usar pra teste
    this.cursors = this.input.keyboard.createCursorKeys();
    const { W, A, S, D } = this.input.keyboard.addKeys("W,A,S,D") as Record<
      "W" | "A" | "S" | "D",
      Phaser.Input.Keyboard.Key
    >;
    this.keys = { W, A, S, D };

    // Camera/bounds
    //this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }
}
