import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {

  }

  create() {
    // 启动 PreloadScene
    this.scene.start('PreloadScene');

  }
}
