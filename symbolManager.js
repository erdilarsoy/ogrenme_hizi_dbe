import { SYMBOLS, DIGIT_MAPPING } from './constants.js';

export default class SymbolManager {
  constructor(scene) {
    this.scene = scene;
    this.symbols = SYMBOLS;
    this.digits = [1, 2, 3, 4, 5, 6, 7];
    this.symbolToDigit = DIGIT_MAPPING;
    this.currentSymbolIndex = 0;
    this.referenceSprites = [];
    this.gameSymbols = [];
    this.lastSymbol = null; // Track last symbol to avoid consecutive same symbols
  }

  createReferenceKey() {
    // Position Reference Key directly below header
    const keyY = 150;
    // Use the image asset as requested
    const keyBg = this.scene.add.image(512, keyY, 'refKey');
    keyBg.setScale(0.9); // Adjust scale if needed based on previous implementation
    keyBg.setDepth(1);

    // Position symbols inside the key
    // User requested to use ONLY the static image, so we remove dynamic overlays.
    /* 
    const visibleCount = 7;
    const spacing = 100;
    const startX = 512 - ((visibleCount - 1) * spacing) / 2;
    const symbolY = keyY - 20; 
    const digitY = keyY + 30; 

    for (let i = 0; i < visibleCount; i++) {
        // ... (Overlays removed)
    }
    */
    // We keep the loop structure commented out or just remove it.
    // Removing entirely for cleanliness as requested "sil" (delete).

  }

  createGameGrid() {
    // Game area layout - Main interaction zone
    // Position below RefKey. RefKey is at 150 (stays there).
    // Moving layout elements up by 50 pixels

    const layoutY = 400;
    // Layout image removed per user request
    // const layout = this.scene.add.image(512, layoutY, 'layout');

    // Text removed per user request
    // "Aşağıdaki sembolü doğru sayıyla eşleştir" text removed

    // Create grid of symbols to match
    this.createCurrentSymbol(layoutY);
  }

  createCurrentSymbol(yPos) {
    // Clear previous symbols
    this.gameSymbols.forEach(sprite => sprite.destroy());
    this.gameSymbols = [];

    // Get random symbol from the 7 available, but avoid same as last symbol
    let symbolIndex;
    let symbol;
    do {
      symbolIndex = Phaser.Math.Between(0, 6);
      symbol = this.symbols[symbolIndex];
    } while (symbol === this.lastSymbol && this.symbols.length > 1);

    this.lastSymbol = symbol;

    // Create large symbol in center of the layout
    // Position should be passed or calculated
    const finalY = yPos || 500;

    const symbolImg = this.scene.add.image(512, finalY, symbol);
    symbolImg.setScale(1.2);
    symbolImg.setDepth(2);

    this.gameSymbols.push(symbolImg);
    this.currentSymbol = symbol;
  }

  checkAnswer(inputDigit) {
    const correctDigit = this.symbolToDigit[this.currentSymbol];
    // inputDigit comes from key press (1-7)

    const isCorrect = (inputDigit === correctDigit);

    return {
      correct: isCorrect,
      expectedDigit: correctDigit,
      inputDigit: inputDigit
    };
  }

  nextSymbol() {
    // Small delay before showing next symbol
    this.scene.time.delayedCall(200, () => {
      this.createCurrentSymbol(400); // Maintain consistent Y pos (layoutY)
    });
  }
}
