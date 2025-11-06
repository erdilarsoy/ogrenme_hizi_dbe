import { SYMBOLS, DIGIT_MAPPING } from './constants.js';

export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
    this.attempts = 0;
    this.required = 10;
    this.symbols = SYMBOLS;
    this.symbolToDigit = DIGIT_MAPPING;
  }

  init(data) {
    this.playerInfo = {
      name: data && data.playerName ? data.playerName : '',
      company: data && data.companyName ? data.companyName : ''
    };
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor('#ffffff');

    // Mapping fixed via constants

    // Title & instructions (TR)
    const welcome = `... DBE Oyunlaştırılmış Değerlendirme Uygulamasına Hoşgeldin, ${this.playerInfo.name || ''}`;
    this.add.text(512, 90, welcome, {
      fontSize: '20px',
      fill: '#222222'
    }).setOrigin(0.5);

    this.add.text(512, 120, 'Kısa Alıştırma', {
      fontSize: '36px',
      fontWeight: 'bold',
      fill: '#990014'
    }).setOrigin(0.5);

    const text = 'Amaç: Ekrandaki sembolün hangi sayıya karşılık geldiğini hızlıca seçmek.\nAşağıdaki 10 sembolü doğru sayıyla eşleştirerek alıştırmayı tamamla.';
    this.add.text(512, 180, text, {
      fontSize: '18px',
      fill: '#222222',
      align: 'center',
      wordWrap: { width: 800 },
      lineSpacing: 6
    }).setOrigin(0.5);

    // Reference strip (white) - same size/pos as GameScene
    const keyBg = this.add.graphics();
    keyBg.fillStyle(0xffffff, 1);
    keyBg.fillRoundedRect(80, 30, 864, 120, 10);

    this.add.text(512, 225, 'Referans Anahtarı', {
      fontSize: '18px',
      fontWeight: 'bold',
      fill: '#990014'
    }).setOrigin(0.5);

    const spacing = 98;
    const visibleCount = 8;
    const totalWidth = (visibleCount - 1) * spacing;
    const startX = 512 - totalWidth / 2;
    const symbolY = 85;
    const digitY = 115;
    for (let i = 0; i < visibleCount; i++) {
      const sym = this.symbols[i];
      const dig = this.symbolToDigit[sym];
      const x = startX + i * spacing;
      this.add.text(x, symbolY, sym, { fontSize: '32px', fontWeight: 'bold', fill: '#990014' }).setOrigin(0.5);
      this.add.text(x, digitY, String(dig), { fontSize: '28px', fontWeight: 'bold', fill: '#333333' }).setOrigin(0.5);
    }

    // Practice area
    const areaBg = this.add.graphics();
    areaBg.fillStyle(0xffffff, 1);
    areaBg.fillRoundedRect(80, 180, 864, 400, 15);

    this.progressText = this.add.text(512, 260, `İlerleme: 0/${this.required}`, {
      fontSize: '20px',
      fill: '#222222'
    }).setOrigin(0.5);

    // Target symbol same pos/size as GameScene
    this.currentSymbolText = this.add.text(512, 350, '', {
      fontSize: '80px',
      fontWeight: 'bold',
      fill: '#990014'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown', (event) => {
      const key = event.key;
      if (key >= '0' && key <= '9') {
        const digit = parseInt(key);
        this.handleInput(digit);
      }
    });

    // Clickable digit buttons (1-9,0)
    this.createDigitButtons();

    this.showNextSymbol();
  }

  showNextSymbol() {
    const idx = Phaser.Math.Between(0, 7);
    this.currentSymbol = this.symbols[idx];
    this.currentSymbolText.setText(this.currentSymbol);
  }

  handleInput(digit) {
    const expected = this.symbolToDigit[this.currentSymbol];
    const correct = digit === expected;
    this.showFeedback(correct);
    if (correct) {
      this.attempts++;
      this.progressText.setText(`İlerleme: ${this.attempts}/${this.required}`);
      if (this.attempts >= this.required) {
        this.time.delayedCall(300, () => {
          this.scene.start('GameScene', { playerName: this.playerInfo.name, companyName: this.playerInfo.company });
        });
        return;
      }
      this.showNextSymbol();
    }
  }

  createDigitButtons() {
    const buttonY = 600;
    const buttonSpacing = 55;
    const digits = [1,2,3,4,5,6,7,8,9,0];
    const totalWidth = (digits.length - 1) * buttonSpacing;
    const startX = 512 - totalWidth / 2;
    digits.forEach((d, i) => {
      const x = startX + i * buttonSpacing;
      const button = this.add.graphics();
      button.fillStyle(0x2a2a2a, 0.8);
      button.fillRoundedRect(x - 20, buttonY - 15, 40, 30, 5);
      button.lineStyle(2, 0x555555, 0.8);
      button.strokeRoundedRect(x - 20, buttonY - 15, 40, 30, 5);

      const txt = this.add.text(x, buttonY, String(d), { fontSize: '20px', fontWeight: 'bold', fill: '#ffffff' }).setOrigin(0.5);

      const hitArea = new Phaser.Geom.Rectangle(x - 20, buttonY - 15, 40, 30);
      button.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
      button.on('pointerdown', () => this.handleInput(d));
    });
  }

  showFeedback(correct) {
    const text = correct ? 'Doğru' : 'Yanlış';
    const color = correct ? '#00ff00' : '#ff0000';
    const popup = this.add.text(this.currentSymbolText.x, this.currentSymbolText.y + 60, text, {
      fontSize: '22px',
      fontWeight: 'bold',
      fill: color
    }).setOrigin(0.5);
    this.time.delayedCall(1000, () => popup.destroy());
  }
}


