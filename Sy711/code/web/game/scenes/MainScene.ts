import Phaser from 'phaser';
import { GameEvents } from '../events';
import { Player } from '../objects/Player';

export class MainScene extends Phaser.Scene {
  private player?: Player;
  private score: number = 0;
  private gameWidth: number;
  private gameHeight: number;

  constructor() {
    super({ key: 'MainScene' });
    this.gameWidth = 800;  // 游戏宽度
    this.gameHeight = 600; // 游戏高度
  }

  preload() {
    // 加载游戏资源
    this.load.image('player', '/images/fud03.png');
    // 加载其他游戏资源...
  }

  create() {
    // // 设置游戏世界边界
    // this.physics.world.setBounds(0, 0, this.gameWidth, this.gameHeight);
    this.player =  new Player(this, 400, 300);
    // // 创建玩家
    // this.player = new Player(this, this.gameWidth / 2, this.gameHeight / 2);
    
    // // 设置相机跟随玩家
    // this.cameras.main.startFollow(this.player);
    // this.cameras.main.setZoom(1); // 设置缩放比例

    // // 初始化分数
    // this.score = 0;
    // this.events.emit(GameEvents.SCORE_CHANGE, this.score);

    // // 添加碰撞检测
    // if (this.player) {
    //   this.physics.add.collider(this.player, /* other game objects */);
    // }
  }

  update() {
    // 更新玩家状态
    if (this.player) {
      this.player.update();
    }

    // 检查游戏状态
    this.checkGameState();
  }

  // 检查游戏状态
  private checkGameState() {
    if (this.player && !this.player.active) {
      this.gameOver();
    }
  }

  // 游戏结束
  private gameOver() {
    this.events.emit(GameEvents.GAME_OVER, this.score);
    // 可以在这里添加游戏结束的逻辑
  }

  // 更新分数
  public updateScore(points: number) {
    this.score += points;
    this.events.emit(GameEvents.SCORE_CHANGE, this.score);
  }

  // 供 React 调用的公共方法
  public updateFromReact(data: unknown) {
    // 处理来自 React 的更新
    console.log('Received data from React:', data);
    // 根据需要处理数据...
  }

  // 重置游戏
  public resetGame() {
    this.score = 0;
    this.events.emit(GameEvents.SCORE_CHANGE, this.score);
    // 重置其他游戏状态...
  }
}
