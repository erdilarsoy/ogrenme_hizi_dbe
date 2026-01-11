import { SYMBOLS, DIGIT_MAPPING } from './constants.js';

export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
    this.attempts = 0;
    this.required = 10;
    this.symbols = SYMBOLS;
    this.symbolToDigit = DIGIT_MAPPING;
    this.lastSymbol = null; // Track last symbol to avoid consecutive same symbols
  }

  init(data) {
    this.playerInfo = {
      name: data && data.playerName ? data.playerName : '',
      company: data && data.companyName ? data.companyName : ''
    };
  }

  preload() { }

  create() {
    // Background and Static UI
    this.add.image(512, 384, 'background').setDepth(-10);
    this.add.image(512, 50, 'header').setDepth(1);
    this.add.image(512, 720, 'footer').setDepth(1);

    // Title & instructions moved below buttons
    // Will be added after buttons are created

    // Position Reference Key directly below header (same as GameScene)
    const keyY = 150;
    this.add.image(512, keyY, 'refKey').setScale(0.9).setDepth(1);

    // Overlays removed per user request (Reference Key image contains instructions now)

    // Practice area - moved up by 50 pixels to match GameScene
    const layoutY = 320;
    // Layout image removed per user request
    // const layout = this.add.image(512, layoutY, 'layout').setScale(1.0);

    this.progressText = this.add.text(512, layoutY - 100, `İlerleme: 0/${this.required}`, {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2);

    // Target symbol
    this.currentSymbolImage = this.add.image(512, layoutY, 'SEMBOL1');
    this.currentSymbolImage.setScale(1.2).setDepth(2);

    this.input.keyboard.on('keydown', (event) => {
      const key = event.key;
      if (key >= '1' && key <= '7') {
        const digit = parseInt(key);
        this.handleInput(digit);
      }
    });

    // Clickable digit buttons (1-7)
    this.createDigitButtons();

    // Title & instructions - positioned below buttons
    const welcome = `... DBE Oyunlaştırılmış Değerlendirme Uygulamasına Hoşgeldin, ${this.playerInfo.name || ''}`;
    this.add.text(512, 50, welcome, {
      fontSize: '20px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Tutorial explanation moved to InfoScene

    this.showNextSymbol();
  }

  showNextSymbol() {
    // Get random symbol but avoid same as last symbol
    let symbol;
    do {
      const idx = Phaser.Math.Between(0, 6);
      symbol = this.symbols[idx];
    } while (symbol === this.lastSymbol && this.symbols.length > 1);

    this.lastSymbol = symbol;
    this.currentSymbol = symbol;
    this.currentSymbolImage.setTexture(this.currentSymbol);
  }

  handleInput(digit) {
    const expected = this.symbolToDigit[this.currentSymbol];
    const correct = digit === expected;
    this.showFeedback(correct);
    if (correct) {
      this.attempts++;
      this.progressText.setText(`İlerleme: ${this.attempts}/${this.required}`);
      if (this.attempts >= this.required) {
        // Tutorial complete - pass tutorial completion time to GameScene
        const tutorialEndTime = Date.now();
        this.time.delayedCall(300, () => {
          this.scene.start('GameScene', {
            playerName: this.playerInfo.name,
            companyName: this.playerInfo.company,
            tutorialEndTime: tutorialEndTime
          });
        });
        return;
      }
      this.showNextSymbol();
    }
  }

  createDigitButtons() {
    const buttonY = 470; // Moved up to match GameScene
    const buttonSpacing = 120; // Spread evenly (was 60)
    const digits = [1, 2, 3, 4, 5, 6, 7];
    const totalWidth = (digits.length - 1) * buttonSpacing;
    const startX = 512 - totalWidth / 2;
    digits.forEach((d, i) => {
      const x = startX + i * buttonSpacing;

      // Use digit image as button with interactive features
      const btn = this.add.image(x, buttonY, `digit${d}`).setInteractive({ useHandCursor: true });
      btn.setScale(0.8); // Slightly smaller

      // Hover effects - same as GameScene
      btn.on('pointerover', () => {
        btn.setTint(0xcccccc); // Darken slightly on hover
        btn.setScale(0.9);
        this.input.setDefaultCursor('pointer');
      });

      btn.on('pointerout', () => {
        btn.clearTint();
        btn.setScale(0.8);
        this.input.setDefaultCursor('default');
      });

      btn.on('pointerdown', () => {
        this.handleInput(d);

        // Button press animation - same as GameScene
        this.tweens.add({
          targets: btn,
          scaleX: 0.7,
          scaleY: 0.7,
          duration: 100,
          yoyo: true
        });
      });
    });
  }

  showFeedback(correct) {
    const text = correct ? 'Doğru' : 'Yanlış';
    const color = correct ? '#00ff00' : '#ff0000';
    const popup = this.add.text(512, 505, text, { // Moved down by 5 pixels
      fontSize: '28px',
      fontWeight: 'bold',
      fill: color
    }).setOrigin(0.5).setDepth(5);
    this.time.delayedCall(800, () => popup.destroy());
  }
}
