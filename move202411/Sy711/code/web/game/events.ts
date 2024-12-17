// 游戏事件枚举
export const GameEvents = {
    // 游戏状态相关
    GAME_INIT: 'GAME_INIT',
    GAME_START: 'GAME_START',
    GAME_PAUSE: 'GAME_PAUSE',
    GAME_RESUME: 'GAME_RESUME',
    GAME_OVER: 'GAME_OVER',
    GAME_RESET: 'GAME_RESET',
  
    // 玩家相关
    PLAYER_SPAWN: 'PLAYER_SPAWN',
    PLAYER_DEATH: 'PLAYER_DEATH',
    PLAYER_DAMAGE: 'PLAYER_DAMAGE',
    PLAYER_HEAL: 'PLAYER_HEAL',
    PLAYER_LEVEL_UP: 'PLAYER_LEVEL_UP',
    PLAYER_UPDATE: 'PLAYER_UPDATE',
  
    // 分数相关
    SCORE_CHANGE: 'SCORE_CHANGE',
    HIGH_SCORE_UPDATE: 'HIGH_SCORE_UPDATE',
  
    // 游戏进度相关
    LEVEL_START: 'LEVEL_START',
    LEVEL_COMPLETE: 'LEVEL_COMPLETE',
    CHECKPOINT_REACH: 'CHECKPOINT_REACH',
  
    // 道具和收集品相关
    ITEM_COLLECT: 'ITEM_COLLECT',
    POWER_UP_COLLECT: 'POWER_UP_COLLECT',
    POWER_UP_END: 'POWER_UP_END',
  
    // UI 相关
    UI_UPDATE: 'UI_UPDATE',
    DIALOG_OPEN: 'DIALOG_OPEN',
    DIALOG_CLOSE: 'DIALOG_CLOSE',
  
    // 音频相关
    MUSIC_PLAY: 'MUSIC_PLAY',
    MUSIC_STOP: 'MUSIC_STOP',
    SOUND_PLAY: 'SOUND_PLAY',
  
    // 存档相关
    GAME_SAVE: 'GAME_SAVE',
    GAME_LOAD: 'GAME_LOAD',
  
    // React 交互相关
    REACT_UPDATE: 'REACT_UPDATE',
    PHASER_UPDATE: 'PHASER_UPDATE'
  } as const;
  
  // 事件数据类型定义
  export interface GameEventData {
    // 游戏状态相关
    [GameEvents.GAME_INIT]: undefined;
    [GameEvents.GAME_START]: undefined;
    [GameEvents.GAME_PAUSE]: undefined;
    [GameEvents.GAME_RESUME]: undefined;
    [GameEvents.GAME_OVER]: { finalScore: number };
    [GameEvents.GAME_RESET]: undefined;
  
    // 玩家相关
    [GameEvents.PLAYER_SPAWN]: { x: number; y: number };
    [GameEvents.PLAYER_DEATH]: undefined;
    [GameEvents.PLAYER_DAMAGE]: { amount: number };
    [GameEvents.PLAYER_HEAL]: { amount: number };
    [GameEvents.PLAYER_LEVEL_UP]: { level: number };
    [GameEvents.PLAYER_UPDATE]: { 
      health: number;
      position: { x: number; y: number };
      score: number;
    };
  
    // 分数相关
    [GameEvents.SCORE_CHANGE]: { score: number };
    [GameEvents.HIGH_SCORE_UPDATE]: { highScore: number };
  
    // 游戏进度相关
    [GameEvents.LEVEL_START]: { level: number };
    [GameEvents.LEVEL_COMPLETE]: { level: number };
    [GameEvents.CHECKPOINT_REACH]: { checkpoint: number };
  
    // 道具相关
    [GameEvents.ITEM_COLLECT]: { 
      itemId: string;
      value: number;
    };
    [GameEvents.POWER_UP_COLLECT]: { 
      type: string;
      duration: number;
    };
    [GameEvents.POWER_UP_END]: { type: string };
  
    // UI 相关
    [GameEvents.UI_UPDATE]: { 
      type: string;
      data: unknown;
    };
    [GameEvents.DIALOG_OPEN]: { 
      dialogId: string;
      content: string;
    };
    [GameEvents.DIALOG_CLOSE]: { dialogId: string };
  
    // 音频相关
    [GameEvents.MUSIC_PLAY]: { trackId: string };
    [GameEvents.MUSIC_STOP]: undefined;
    [GameEvents.SOUND_PLAY]: { soundId: string };
  
    // 存档相关
    [GameEvents.GAME_SAVE]: { saveData: unknown };
    [GameEvents.GAME_LOAD]: { saveData: unknown };
  
    // React 交互相关
    [GameEvents.REACT_UPDATE]: { type: string; data: unknown };
    [GameEvents.PHASER_UPDATE]: { type: string; data: unknown };
  }
  
  // 事件发送器类型
  export type GameEventEmitter = {
    emit<K extends keyof GameEventData>(
      event: K,
      data: GameEventData[K]
    ): void;
  };
  
  // 事件监听器类型
  export type GameEventListener = {
    on<K extends keyof GameEventData>(
      event: K,
      fn: (data: GameEventData[K]) => void
    ): void;
  };
  
  // 用于类型检查的辅助函数
  export function emitGameEvent<K extends keyof GameEventData>(
    emitter: GameEventEmitter,
    event: K,
    data: GameEventData[K]
  ): void {
    emitter.emit(event, data);
  }