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
      const buttonY = 600;
      const buttonWidth = 50;
      const buttonSpacing = 55;
  
      // Create buttons for digits 1-9, 0
      const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      
      const totalWidth = (digits.length - 1) * buttonSpacing;
      const startX = 512 - totalWidth / 2;
      digits.forEach((digit, index) => {
        const x = startX + index * buttonSpacing;
        
        // Button background
        const button = this.scene.add.graphics();
        button.fillStyle(0x2a2a2a, 0.8);
        button.fillRoundedRect(x - 20, buttonY - 15, 40, 30, 5);
        button.lineStyle(2, 0x555555, 0.8);
        button.strokeRoundedRect(x - 20, buttonY - 15, 40, 30, 5);
        
        // Button text (make interactive as well)
        const buttonText = this.scene.add.text(x, buttonY, digit.toString(), {
          fontSize: '20px',
          fontWeight: 'bold',
          fill: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  
        // Make interactive
        const hitArea = new Phaser.Geom.Rectangle(x - 20, buttonY - 15, 40, 30);
        button.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        
        button.on('pointerover', () => {
          button.clear();
          button.fillStyle(0x4a4a4a, 0.9);
          button.fillRoundedRect(x - 20, buttonY - 15, 40, 30, 5);
          button.lineStyle(2, 0x888888, 0.9);
          button.strokeRoundedRect(x - 20, buttonY - 15, 40, 30, 5);
          buttonText.setTint(0xffff88);
          this.scene.input.setDefaultCursor('pointer');
        });
  
        button.on('pointerout', () => {
          button.clear();
          button.fillStyle(0x2a2a2a, 0.8);
          button.fillRoundedRect(x - 20, buttonY - 15, 40, 30, 5);
          button.lineStyle(2, 0x555555, 0.8);
          button.strokeRoundedRect(x - 20, buttonY - 15, 40, 30, 5);
          buttonText.clearTint();
          this.scene.input.setDefaultCursor('default');
        });
  
        button.on('pointerdown', () => {
          this.handleDigitInput(digit);
          
          // Button press animation
          this.scene.tweens.add({
            targets: [button, buttonText],
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 100,
            yoyo: true
          });
        });

        // Text click triggers as well
        buttonText.on('pointerdown', () => {
          this.handleDigitInput(digit);
        });
  
        this.digitButtons.push({ button, text: buttonText, digit });
      });
    }
  
    handleDigitInput(digit) {
      if (this.scene.gameData.timeRemaining <= 0) return;
      
      // Process the answer
      this.scene.processAnswer(digit);
      
      // Visual feedback for the pressed digit
      const buttonData = this.digitButtons.find(b => b.digit === digit);
      if (buttonData) {
        this.scene.tweens.add({
          targets: buttonData.text,
          tint: 0x00ff88,
          scaleX: 1.3,
          scaleY: 1.3,
          duration: 200,
          yoyo: true,
          onComplete: () => {
            buttonData.text.clearTint();
          }
        });
      }
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
  
  