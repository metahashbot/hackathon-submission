import Phaser from 'phaser';
import { GameEvents } from '../events';
import { Player } from '../objects/Player';
import { useGameStore } from '../store/gameStore';
import { AnimationManager, ANIMATION_CONFIG } from '../managers/AnimationManager';
import { AUDIO_CONFIG, AudioManager } from '../managers/AudioManager';

// Define a type for coin configuration
interface CoinConfig {
  type: string;
  x: number;
  y: number;
  speed: number;
}

export class MainScene extends Phaser.Scene {
  private player?: Player;
  private score: number = 0;
  private animationManager!: AnimationManager;
  private fudSprite!: Phaser.GameObjects.Sprite;
  private isPunching: boolean = false;
  private coin?: Phaser.GameObjects.Sprite;
  private coinQueue: CoinConfig[] = [];
  private coinType: string = 'default'; // Example coin type
  private lastClickTime: number = 0;
  private coo!: Phaser.GameObjects.Sprite;
  private audioManager!: AudioManager;
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Load game resources
    this.load.image('bg', '/images/mainbg.png');
    this.load.image('coin', '/images/sui.png');
    useGameStore.getState().setGameState('started');

    this.audioManager = new AudioManager(this);
    this.audioManager.preload();

    // Load the sprite atlas
    this.load.aseprite('fud',
      '/animations/FUD/fud.png',
      '/animations/FUD/fud.json'
    );
    this.load.aseprite('coo',
      '/animations/COO/COO.png',
      '/animations/COO/COO.json'
    );
  }

  create() {
    // Initialize background
    this.add.image(this.cameras.main.centerX,
      this.cameras.main.centerY, 'bg').setOrigin(0.5, 0.5).setScale(1);
    this.scoreText = this.add.text(
      this.cameras.main.centerX,
      50,
      '0',
      {
        fontSize: '64px',
        fontFamily: 'Arial',
        color: '#ffffff',
        align: 'center',
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '0xfff000',
          blur: 2,
          fill: true
        }
      }
    )
    .setOrigin(0.5)
    .setAlpha(1)
    .setDepth(1);
    // Create animations from Aseprite file
    this.anims.createFromAseprite('fud');
    this.anims.createFromAseprite('coo');
    // Initialize animation manager
    this.animationManager = new AnimationManager(this);
    this.audioManager.init();


    this.audioManager?.playMusic(AUDIO_CONFIG.MUSIC.MAIN_THEME.key, true, 0.5, 500);
    // Create sprite and make it interactive
    this.fudSprite = this.physics.add.staticSprite(
      this.cameras.main.centerX,
      600,
      'fud'
    ).setScale(2).setInteractive().setImmovable();

    this.coo = this.add.sprite(this.cameras.main.centerX,
      this.cameras.main.centerY,
      'coo'
    ).setScale(2).setAlpha(0);

    // Create animations
    this.animationManager.createAnimation(ANIMATION_CONFIG.FUD.IDLE);
    this.animationManager.createAnimation(ANIMATION_CONFIG.FUD.PUNCH);
    this.animationManager.createAnimation(ANIMATION_CONFIG.COO.IDLE);
    this.animationManager.createAnimation(ANIMATION_CONFIG.COO.ACTION);
    // Setup animation complete callback
    this.fudSprite.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
      console.log('Animation complete:', animation.key);
      if (animation.key === ANIMATION_CONFIG.FUD.PUNCH.key) {
        this.isPunching = false;
        this.fudSprite.stop();
        this.fudSprite.play(ANIMATION_CONFIG.FUD.IDLE.key);
      }
    });

    // Start with idle animation
    this.fudSprite.play(ANIMATION_CONFIG.FUD.IDLE.key);

    // Mock array of coins to spawn
    // this.coinQueue = Array.from({ length: 10 }, (_, index) => ({
    //   type: index % 3 === 0 ? 'gold' : index % 3 === 1 ? 'silver' : 'default',
    //   x: (index % 3) * 100 + 100,
    //   y: 100,
    //   speed: 100
    // })); 
    
    for(let i = 0; i < 50; i++) {
      this.coinQueue.push({
        type: Math.random() > 0.5 ? 'sui' : 'nosui',
        x: Math.floor(Math.random() * (300 - 100 + 1)) + 100,
        y: 250,
        speed: Math.floor(Math.random() * (100 - 50 + 1)) + 200
      });
    }

       // Spawn the first coin
    this.spawnNextCoin();
  }

  update() {
    // 更新玩家状态
    if (this.player) {
      this.player.update();
    }

    // Move the coin towards the fud if it exists
    if (this.coin && this.coin.body) {
      this.physics.moveToObject(this.coin, this.fudSprite, this.coinQueue[0].speed); // Adjust speed as needed
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
    // 发送游戏结束事件到 gameStore
    useGameStore.getState().setGameState('paused');
    useGameStore.getState().setScore(this.score);
    this.events.emit(GameEvents.GAME_OVER, this.score);
    console.log(useGameStore.getState().gameState);
    
    // 可以在这里添加游戏结束的逻辑
  }

  // 更新分数
  public updateScore(points: number) {
    this.score += points;
    this.events.emit(GameEvents.SCORE_CHANGE, this.score);
    
    // 更新分数显示
    if (this.scoreText) {
      this.scoreText.setText(this.score.toString());
      
      // 可选：添加一个缩放动画效果
      this.tweens.add({
        targets: this.scoreText,
        scale: 1.2,
        duration: 100,
        yoyo: true,
        ease: 'Power2'
      });
    }
}

  // 供 React 调用的公共方法
  public updateFromReact(data: unknown) {
    // 处理来自 React 的更新
    console.log('Received data from React:', data);
    const dataObj = data as { data: string };
    switch(dataObj.data) {
      case 'restart':
        this.resetGame();
        useGameStore.getState().setGameState('started');
        break;
    }
    // 根据需要处理数据...
  }

  // 重置游戏
  public resetGame() {
    this.score = 0;
    if (this.scoreText) {
      this.scoreText.setText('0');
    }
    this.events.emit(GameEvents.SCORE_CHANGE, this.score);
    useGameStore.getState().setScore(this.score);
    useGameStore.getState().setGameState('init');
    this.resetCoinQueue();
    this.spawnNextCoin();
    // 重置其他游戏态...
  }

  private resetCoinQueue() {
    this.coinQueue = [];
    for(let i = 0; i < 50; i++) {
      this.coinQueue.push({
        type: Math.random() > 0.5 ? 'sui' : 'nosui',
        x: Math.floor(Math.random() * (300 - 100 + 1)) + 100,
        y: 250,
        speed: Math.floor(Math.random() * (100 - 50 + 1)) + 200
      });
    }
  }

  // Spawn the next coin from the queue
  private spawnNextCoin() {
    if (this.coinQueue.length > 1) {
      const coinConfig = this.coinQueue.shift();
      
      if (coinConfig) {
        let isUserActionAllowed = false;
        this.coo.setAlpha(1);
        this.coo.play(ANIMATION_CONFIG.COO.ACTION.key);        
        this.coo.setPosition(coinConfig.x, coinConfig.y);
        this.coo.once('animationstart', () => {
          this.audioManager?.playSfx(AUDIO_CONFIG.SFX.SOU.key);
        });

        this.coo.once('animationcomplete', () => {
          console.log('Coo animation completed');
          this.time.delayedCall(500, () => { // 延迟 500ms 后允许用户操作
            isUserActionAllowed = true;
          });
        });
        this.coin = this.physics.add.sprite(coinConfig.x, coinConfig.y, 'coin')
          .setInteractive()
          .setScale(0.1).setTint(0x000000) // Set initial red tint

        // Add tween to fade out the red tint over time
        if(coinConfig.type === 'sui') {
          this.tweens.add({
            targets: this.coin,
            tint: 0xffffff, // Fade to normal color (white/no tint)
            duration: 500, // Duration in milliseconds
            ease: 'Linear'
          });
        }else{
          const colors = [0xff0000, 0xffff00, 0x00ff00]; // Red, Yellow, Green
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          this.tweens.add({
            targets: this.coin,
            tint: randomColor,
            duration: 500,
            ease: 'Linear'
          });
        }
        
        // Store the coin type for scoring
        this.coinType = coinConfig.type;

        // Destroy coin on click
        this.coin.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          const currentTime = this.time.now; // 当前时间
          const clickInterval = 200; // 间隔时间 500ms

          if (currentTime - this.lastClickTime >= clickInterval && !this.isPunching && isUserActionAllowed) {
            if(pointer.x < this.cameras.main.centerX) {
              this.fudSprite.setFlipX(false);
            }else{
              this.fudSprite.setFlipX(true);
            }
            console.log('Sprite clicked, isPunching:', this.isPunching);
            this.isPunching = true;
            this.lastClickTime = currentTime; // 更新上次点击时间
            this.fudSprite.play(ANIMATION_CONFIG.FUD.PUNCH.key);
            this.audioManager?.playSfx(AUDIO_CONFIG.SFX.NOPE.key, 2, 100);
            this.fudSprite.once('animationcomplete', () => {
              this.isPunching = false; // Reset punching state
            });
            
            this.coo.setAlpha(0);
            this.destroyCoin();
          }
        });

        // Add collision detection for the coin
        this.physics.add.overlap(this.fudSprite, this.coin, this.handleCoinCollision, undefined, this);
      }
    }
  }

  // Handle coin collision with fud
  private handleCoinCollision(
    fud: object,
    coin: object
  ) {
    console.log('Coin collision detected');
    if (coin instanceof Phaser.GameObjects.Sprite) {
      this.updateScoreBasedOnCoinType(this.coinType);
      this.destroyCoin();
    }
  }

  // Update score based on coin type
  private updateScoreBasedOnCoinType(coinType: string) {
    console.log('coinType:', coinType);
    let points = 0;
    switch (coinType) {
      case 'sui':
        points = 10;
        this.audioManager?.playSfx(AUDIO_CONFIG.SFX.GOOD.key);
        break;
      case 'nosui':
        points = -5;
        this.audioManager?.playSfx(AUDIO_CONFIG.SFX.BAD.key);
        break;
      default:
        points = 0;
    }
    this.updateScore(points);
  }

  // Destroy the current coin and spawn the next one
  private destroyCoin() {
    if (this.coin) {
      this.coin.destroy();
      this.coin = undefined;
      this.time.delayedCall(50, () => {
        this.spawnNextCoin(); // Spawn the next coin after destroying the current one
      });
    }
    if(this.coinQueue.length === 1) {
      this.gameOver();
    }
  }
}
