export default class InfoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InfoScene' });
  }

  init(data) {
    this.playerInfo = {
      name: data && data.playerName ? data.playerName : '',
      company: data && data.companyName ? data.companyName : ''
    };
  }

  create() {
    // Background
    this.add.image(512, 384, 'background').setDepth(-10);
    this.add.image(512, 50, 'header').setDepth(1);
    this.add.image(512, 720, 'footer').setDepth(1);

    // Info panel with explanation - enlarged
    const panelWidth = 900;
    const panelHeight = 450;
    const panelX = 512;
    const panelY = 384;

    // Panel background
    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x000000, 0.7);
    panelBg.fillRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight, 15);
    panelBg.lineStyle(3, 0xffffff, 0.8);
    panelBg.strokeRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight, 15);
    panelBg.setDepth(2);

    // Explanation text
    const explanationText = 'Amaç: Ekrandaki sembolün hangi sayıya karşılık geldiğini hızlıca seçmek.\n\nAşağıdaki 7 sembolü doğru sayıyla eşleştirerek oyunu tamamla.\n\nÜstteki referans anahtarına bakarak sembolleri sayılarla eşleştirebilirsin.';
    this.add.text(panelX, panelY - 50, explanationText, {
      fontSize: '24px',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 850 },
      lineSpacing: 14
    }).setOrigin(0.5).setDepth(3);

    // Start button - moved down
    const buttonX = panelX;
    const buttonY = panelY + 130;
    const buttonWidth = 200;
    const buttonHeight = 60;

    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x990014, 1);
    buttonBg.fillRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 10);
    buttonBg.lineStyle(2, 0xffffff, 1);
    buttonBg.strokeRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 10);
    buttonBg.setDepth(3);

    const buttonText = this.add.text(buttonX, buttonY, 'Başla', {
      fontSize: '28px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(4);

    // Make button interactive
    const buttonHitArea = new Phaser.Geom.Rectangle(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight);
    
    this.input.on('pointerdown', (pointer) => {
      if (Phaser.Geom.Rectangle.Contains(buttonHitArea, pointer.x, pointer.y)) {
        // Start game directly (skip tutorial)
        // Pass flag to start progress bar when game starts
        this.scene.start('GameScene', {
          playerName: this.playerInfo.name,
          companyName: this.playerInfo.company,
          startProgressBar: true
        });
      }
    });

    // Button hover effect
    this.input.on('pointermove', (pointer) => {
      if (Phaser.Geom.Rectangle.Contains(buttonHitArea, pointer.x, pointer.y)) {
        buttonBg.clear();
        buttonBg.fillStyle(0xcc0018, 1);
        buttonBg.fillRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 10);
        buttonBg.lineStyle(2, 0xffffff, 1);
        buttonBg.strokeRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 10);
        this.input.setDefaultCursor('pointer');
      } else {
        buttonBg.clear();
        buttonBg.fillStyle(0x990014, 1);
        buttonBg.fillRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 10);
        buttonBg.lineStyle(2, 0xffffff, 1);
        buttonBg.strokeRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 10);
        this.input.setDefaultCursor('default');
      }
    });
  }
}

