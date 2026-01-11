export default class InputHandler {
  constructor(scene) {
    this.scene = scene;
    this.digitButtons = [];
  }

  setupInput() {
    // Keyboard input will be handled by GameScene backup handler
    // This ensures no conflicts - mouse buttons work here

    // Create clickable digit buttons
    this.createDigitButtons();

    // Mouse/touch input for symbols (alternative input method)
    this.scene.input.on('pointerdown', (pointer) => {
      // Check if clicking on current symbol for hint
      if (this.scene.symbolManager && this.scene.symbolManager.gameSymbols.length > 0) {
        const symbol = this.scene.symbolManager.gameSymbols[0];
        const bounds = symbol.getBounds();

        if (bounds.contains(pointer.x, pointer.y)) {
          this.showHint(symbol);
        }
      }
    });
  }

  createDigitButtons() {
    const buttonY = 470; // Moved up by 80 pixels (was 550)
    const buttonSpacing = 120; // Spread evenly (was 60)

    // Create buttons for digits 1-7
    const digits = [1, 2, 3, 4, 5, 6, 7];

    const totalWidth = (digits.length - 1) * buttonSpacing;
    const startX = 512 - totalWidth / 2;
    digits.forEach((digit, index) => {
      const x = startX + index * buttonSpacing;

      // Use digit image as button
      const button = this.scene.add.image(x, buttonY, `digit${digit}`).setInteractive({ useHandCursor: true });
      button.setScale(0.8); // Slightly smaller

      // Hover effects
      button.on('pointerover', () => {
        button.setTint(0xcccccc); // Darken slightly on hover
        button.setScale(0.9);
        this.scene.input.setDefaultCursor('pointer');
      });

      button.on('pointerout', () => {
        button.clearTint();
        button.setScale(0.8);
        this.scene.input.setDefaultCursor('default');
      });

      button.on('pointerdown', () => {
        this.handleDigitInput(digit);

        // Button press animation
        this.scene.tweens.add({
          targets: button,
          scaleX: 0.7,
          scaleY: 0.7,
          duration: 100,
          yoyo: true
        });
      });

      this.digitButtons.push({ button, digit }); // No text object anymore
    });
  }

  handleDigitInput(digit) {
    if (this.scene.gameData.timeRemaining <= 0) return;

    // Process the answer
    this.scene.processAnswer(digit);

    // Button feedback is handled by pointerdown animation in createDigitButtons
    // Same as tutorial for consistency
  }

  showHint(symbol) {
    // Show a brief hint by highlighting the correct answer in reference key
    const currentSymbol = this.scene.symbolManager.currentSymbol;
    const correctDigit = this.scene.symbolManager.symbolToDigit[currentSymbol];

    // Find and highlight the reference pair
    const hintText = this.scene.add.text(symbol.x, symbol.y - 100, `→ ${correctDigit}`, {
      fontSize: '24px',
      fontWeight: 'bold',
      fill: '#ffff00'
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: hintText,
      alpha: 0,
      y: hintText.y - 30,
      duration: 1500,
      onComplete: () => hintText.destroy()
    });
  }
}

