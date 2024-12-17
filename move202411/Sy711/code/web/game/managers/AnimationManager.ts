interface AnimationConfig {
    key: string; // 动画的唯一标识
    frameRate?: number; // 动画帧率
    repeat?: number; // 动画重复次数，-1 表示无限循环
    frames: {
      key: string; // 关联的纹理或图集的键
      frames: number[] | { start: number; end: number }; // 帧序列或起止帧范围
    };
    duration?: number; // 每帧的持续时间
  }
  
  export const ANIMATION_CONFIG = {
    FUD: {
      IDLE: {
        key: 'fud-idle',
        frameRate: 8,
        duration: 150,
        frames: {
          key: 'fud',
          frames: { start: 0, end: 2 }
        },
        repeat: -1
      },
      PUNCH: {
        key: 'fud-punch',
        frameRate: 8,
        duration: 100,
        frames: {
          key: 'fud',
          frames: { start: 3, end: 4 }
        },
        repeat: 0
      }
    },
    COO: {
      IDLE: {
        key: 'coo-idle',
        frameRate: 8,
        duration: 100,
        frames: {
          key: 'coo',
          frames: { start: 0, end: 1 }
        },
        repeat: -1
      },
      ACTION: {
        key: 'coo-action',
        frameRate: 8,
        duration: 50,
        frames: {
          key: 'coo',
          frames: { start: 1, end: 5 }
        },
        repeat: 0
      }
    }
  } as const;
  
  export class AnimationManager {
    private scene: Phaser.Scene;
  
    constructor(scene: Phaser.Scene) {
      this.scene = scene;
    }
  
    /**
     * 创建一个动画
     * @param config 动画配置
     */
    createAnimation(config: AnimationConfig) {
      const { key, frames, frameRate = 10, repeat = -1, duration = 100 } = config;
  
      // 如果动画已存在，则跳过创建
      if (this.scene.anims.exists(key)) return;
  
      // 生成帧配置，支持数组和起止帧范围
      const frameConfig = Array.isArray(frames.frames)
        ? frames.frames.map(frame => ({
            key: frames.key,
            frame,
            duration // 为每帧添加自定义持续时间
          }))
        : this.scene.anims
            .generateFrameNumbers(frames.key, {
              start: frames.frames.start,
              end: frames.frames.end
            })
            .map(frame => ({
              key: frames.key,
              frame: frame.frame,
              duration // 为每帧添加自定义持续时间
            }));
  
      // 创建动画
      this.scene.anims.create({
        key,
        frames: frameConfig,
        frameRate,
        repeat
      });
    }
  
    /**
     * 创建所有动画
     */
    createAnimations() {
      Object.values(ANIMATION_CONFIG).forEach(category => {
        Object.values(category).forEach(config => {
          this.createAnimation(config);
        });
      });
    }
  
    /**
     * 播放动画
     * @param sprite 目标精灵对象
     * @param key 动画键
     * @param ignoreIfPlaying 是否在已播放时忽略
     */
    play(sprite: Phaser.GameObjects.Sprite, key: string, ignoreIfPlaying: boolean = true) {
      sprite.play(key, ignoreIfPlaying);
    }
  
    /**
     * 检查动画是否存在
     * @param key 动画键
     * @returns 是否存在
     */
    exists(key: string): boolean {
      return this.scene.anims.exists(key);
    }
  }
  