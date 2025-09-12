import { Scene } from "phaser";

export class Scene3 extends Scene {
  alien!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super({ key: "Scene3" });
  }

  preload() {
    this.load.spritesheet("alien", "assets/scene3/alien.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.alien = this.physics.add.sprite(225, 400, "alien", 30);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("alien", {
        start: 9,
        end: 17,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.alien.play("left");
  }

  update() {
    if (this.input.gamepad) {
      if (this.input.gamepad.total > 0) {
        const pad = this.input.gamepad.getPad(0);
        const axisH = pad.axes[0].getValue();
        const axisV = pad.axes[1].getValue();
        this.alien.setVelocity(axisH * 200, axisV * 200);
      } else {
        this.alien.setVelocity(0, 0);
      }
    }
  }
}
