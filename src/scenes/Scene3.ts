import { Scene } from "phaser";

export class Scene3 extends Scene {
  constructor() {
    super({ key: "Scene3" });
  }

  preload() {
    //this.load.image('player', 'static/assets/scene3/sprite-piloto-personagem-cena3.png'); 
    //this.load.image('room', 'static/assets/scene3/MapTest01.png'); //gabriel: fix sprite name

  }

  create() {
    //this.add.image(0,0, 'room')
    //this.physics.add.image(0,0, 'player');
    //player.body.setCollideWorldBounds(true); //player collides with the room's bounds
  }
}
