// web/game/managers/AudioManager.ts
// 音频配置
export const AUDIO_CONFIG = {
  MUSIC: {
    MAIN_THEME: {
      key: 'main-theme',
      path: '/music/main-theme.mp3',
      volume: 0.7,
      loop: true
    },
    BATTLE: {
      key: 'battle',
      path: '/music/battle.mp3',
      volume: 0.7,
      loop: true,
      rate: 0.5,
      detune: 100
    }
  },
  SFX: {
    CLICK: {
      key: 'click',
      path: '/sfx/click.mp3',
      volume: 1
    },
    SOU: {
      key: 'sou',
      path: '/sfx/sou.mp3',
      volume: 1
    },
    BAD:{
      key: 'bad',
      path: '/sfx/bad.mp3',
      volume: 1
    },
    GOOD:{
      key: 'good',
      path: '/sfx/good.mp3',
      volume: 1
    },
    NOPE:{
      key: 'nope',
      path: '/sfx/nope.mp3',
      volume: 1,
      rate: 2,
      detune: 10
    }
  }
} as const;

export class AudioManager {
  private scene: Phaser.Scene;
  private music: Map<string, Phaser.Sound.BaseSound>;
  private sfx: Map<string, Phaser.Sound.BaseSound>;
  private musicVolume: number;
  private sfxVolume: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.music = new Map();
    this.sfx = new Map();
    this.musicVolume = 0.7;
    this.sfxVolume = 1;
  }

  // 预加载所有音频资源
  preload() {
    // 加载音乐
    Object.values(AUDIO_CONFIG.MUSIC).forEach(config => {
      this.scene.load.audio(config.key, config.path);
    });

    // 加载音效
    Object.values(AUDIO_CONFIG.SFX).forEach(config => {
      this.scene.load.audio(config.key, config.path);
    });
  }

  // 初始化音频
  init() {
    // 初始化音乐
    Object.values(AUDIO_CONFIG.MUSIC).forEach(config => {
      const sound = this.scene.sound.add(config.key, {
        volume: (config.volume || 1) * this.musicVolume,
        loop: config.loop
      });
      this.music.set(config.key, sound);
    });

    // 初始化音效
    Object.values(AUDIO_CONFIG.SFX).forEach(config => {
      const sound = this.scene.sound.add(config.key, {
        volume: (config.volume || 1) * this.sfxVolume
      });
      this.sfx.set(config.key, sound);
    });
  }

  // 播放背景音乐
  playMusic(key: string, fadeIn: boolean = false, rate: number = 1, detune: number = 0) {
    const music = this.music.get(key);
    if (!music) return;

    // 停止当前播放的所有音乐
    this.stopAllMusic();

    if (fadeIn) {
      music.play({rate, detune});
      this.scene.tweens.add({
        targets: music,
        volume: this.musicVolume,
        duration: 1000
      });
    } else {
      music.play({rate, detune});
    }
  }

  // 播放音效
  playSfx(key: string, rate: number = 1, detune: number = 0) {
    const sfx = this.sfx.get(key);
    sfx?.play({rate, detune});
  }

  // 停止所有音乐
  stopAllMusic() {
    this.music.forEach(music => {
      music.stop();
    });
  }

  // 设置音乐音量
  setMusicVolume(volume: number) {
    this.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
    this.music.forEach(music => {
      (music as Phaser.Sound.WebAudioSound).setVolume(this.musicVolume);
    });
  }

  // 设置音效音量
  setSfxVolume(volume: number) {
    this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
    this.sfx.forEach(sfx => {
      (sfx as Phaser.Sound.WebAudioSound).setVolume(this.sfxVolume);
    });
  }

  // 静音/取消静音
  toggleMute() {
    this.scene.sound.mute = !this.scene.sound.mute;
  }
}