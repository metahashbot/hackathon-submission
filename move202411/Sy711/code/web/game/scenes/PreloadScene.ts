import Phaser from 'phaser';
import { useGameStore } from '../store/gameStore';

export interface PageInfo {
  page: number;
  total: number;
}

export class PreloadScene extends Phaser.Scene {
  private currentImageIndex = 0;
  private readonly imageKeys = ['fud00', 'fud01', 'fud02', 'fud03'];
  private currentImage?: Phaser.GameObjects.Image;
  private bgMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  init() {
    this.load.on('complete', () => {
      console.log('Scene assets loaded completely');
      this.startAudio();
    });
  }

  private updatePageInfo() {
    useGameStore.getState().setPageInfo({
      page: this.currentImageIndex + 1,
      total: this.imageKeys.length
    });
  }

  preload() {
    this.load.audio('preloadscene', '/music/preloadscene.mp3');
    
    this.load.image('fud00', '/images/fud00.jpg');
    this.load.image('fud01', '/images/fud01.jpg'); 
    this.load.image('fud02', '/images/fud02.jpg');
    this.load.image('fud03', '/images/fud03.jpg');
  }

  private startAudio() {
    try {
      this.bgMusic = this.sound.add('preloadscene', {
        loop: true,
        volume: 1
      });

      if (this.sound.locked) {
        console.log('Audio system is locked, waiting for unlock');
        this.sound.once('unlocked', () => {
          console.log('Audio system unlocked');
          this.bgMusic?.play();
        });
      } else {
        console.log('Playing audio');
        this.bgMusic.play();
      }
    } catch (error) {
      console.error('Error starting audio:', error);
    }
  }

  create() {
    this.showCurrentImage();
    this.updatePageInfo();
  }

  // 供 React 调用的公共方法
  public updateFromReact(data: unknown) {

    const dataObj = data as { data: string };
    if (dataObj.data === 'next') {
      this.showNextImage();
    } else if (dataObj.data === 'prev') {
      this.showPreviousImage();
    } else {
      console.warn('Unknown command:', data);
    }
  }

  private showCurrentImage() {
    if (this.currentImage) {
      this.currentImage.destroy();
    }

    this.currentImage = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.imageKeys[this.currentImageIndex]
    )
      .setOrigin(0.5, 0.5)
      .setScale(0.5);
  }

  private showNextImage() {
    if (this.currentImageIndex < this.imageKeys.length - 1) {
      this.currentImageIndex++;
      this.showCurrentImage();
      this.updatePageInfo();
    }
  }

  private showPreviousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.showCurrentImage();
      this.updatePageInfo();
    }
  }
}