import Phaser from 'phaser';
import GameScene from './gameScene.js';
import MenuScene from './menuScene.js';
import TutorialScene from './tutorialScene.js';
import { downloadCSVResults } from './downloadHelper.js';

const config = {
  type: Phaser.AUTO,
  dom: {
    createContainer: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'phaser-game-container',
    width: 1024,
    height: 768
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [MenuScene, TutorialScene, GameScene]
};

const game = new Phaser.Game(config);
