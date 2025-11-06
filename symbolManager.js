import { SYMBOLS, DIGIT_MAPPING } from './constants.js';

export default class SymbolManager {
    constructor(scene) {
      this.scene = scene;
      this.symbols = SYMBOLS;
      this.digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      this.symbolToDigit = DIGIT_MAPPING;
      this.currentSymbolIndex = 0;
      this.referenceSprites = [];
      this.gameSymbols = [];
      
      // mapping fixed; no shuffle
    }
  
    generateMapping() {}
  
    createReferenceKey() {
      // Background for reference key
      const keyBg = this.scene.add.graphics();
      keyBg.fillStyle(0xffffff, 1);
      keyBg.fillRoundedRect(80, 30, 864, 120, 10);
      // no outline
      keyBg.setDepth(0);
  
      this.scene.add.text(512, 50, 'Referans Anahtarı', {
        fontSize: '18px',
        fontWeight: 'bold',
        fill: '#990014'
      }).setOrigin(0.5).setDepth(2);
  
      // Display symbol-digit pairs
      const spacing = 98;
      const visibleCount = 8;
      const totalWidth = (visibleCount - 1) * spacing;
      const startX = 512 - totalWidth / 2;
      const symbolY = 85;
      const digitY = 115;
      
      for (let i = 0; i < visibleCount; i++) { // Show first 8 pairs
        const symbol = this.symbols[i];
        const digit = this.symbolToDigit[symbol];
        const x = startX + i * spacing;
  
        // Symbol
        const symbolText = this.scene.add.text(x, symbolY, symbol, {
          fontSize: '32px',
          fontWeight: 'bold',
          fill: '#990014'
        }).setOrigin(0.5).setDepth(2);
  
        // Digit below symbol
        this.scene.add.text(x, digitY, digit.toString(), {
          fontSize: '28px',
          fontWeight: 'bold',
          fill: '#333333'
        }).setOrigin(0.5).setDepth(2);
  
        this.referenceSprites.push(symbolText);
      }
    }
  
    createGameGrid() {
      // Game area background
      const gameBg = this.scene.add.graphics();
      gameBg.fillStyle(0xffffff, 1);
      gameBg.fillRoundedRect(80, 180, 864, 400, 15);
      // no outline
      gameBg.setDepth(0);
  
      this.scene.add.text(512, 210, 'Aşağıdaki sembolü doğru sayıyla eşleştir:', {
        fontSize: '20px',
        fill: '#222222'
      }).setOrigin(0.5).setDepth(2);
  
      // Create grid of symbols to match
      this.createCurrentSymbol();
    }
  
    createCurrentSymbol() {
      // Clear previous symbols
      this.gameSymbols.forEach(sprite => sprite.destroy());
      this.gameSymbols = [];
  
      // Get random symbol from first 8 (matching reference key)
      const symbolIndex = Phaser.Math.Between(0, 7);
      const symbol = this.symbols[symbolIndex];
  
      // Create large symbol in center
      const symbolText = this.scene.add.text(512, 350, symbol, {
        fontSize: '80px',
        fontWeight: 'bold',
        fill: '#990014'
      }).setOrigin(0.5).setDepth(2);
  
      this.gameSymbols.push(symbolText);
      this.currentSymbol = symbol;
    }
  
    checkAnswer(inputDigit) {
      const correctDigit = this.symbolToDigit[this.currentSymbol];
      const symbol = this.gameSymbols[0];
      
      return {
        correct: inputDigit === correctDigit,
        symbol: symbol,
        expectedDigit: correctDigit,
        inputDigit: inputDigit
      };
    }
  
    nextSymbol() {
      // Small delay before showing next symbol
      this.scene.time.delayedCall(500, () => {
        this.createCurrentSymbol();
      });
    }
  }
  
  