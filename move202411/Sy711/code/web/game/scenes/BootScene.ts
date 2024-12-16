import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // 这里可以加载一些必要的资源，比如加载条的图片
  }

  create() {
    // 启动 PreloadScene
    this.scene.start('PreloadScene');
  }
}
