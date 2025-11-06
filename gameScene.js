import SymbolManager from './symbolManager.js';
import UIManager from './uiManager.js';
import InputHandler from './inputHandler.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.gameData = {
      score: 0,
      correct: 0,
      total: 0,
      timeRemaining: 90,
      level: 1,
      streak: 0
    };
  }

  init(data) {
    this.playerInfo = {
      name: data && data.playerName ? data.playerName : '',
      company: data && data.companyName ? data.companyName : ''
    };
  }

  create() {
    // Plain white background
    this.cameras.main.setBackgroundColor('#ffffff');

    // Ensure inputs are enabled
    this.input.enabled = true;
    if (this.input.keyboard) {
      this.input.keyboard.enabled = true;
    }
    // Focus canvas to receive keyboard events
    if (this.game && this.game.canvas && this.game.canvas.focus) {
      this.game.canvas.setAttribute('tabindex', '0');
      this.game.canvas.focus();
    }
    // On first click/touch, re-focus to ensure keyboard works on some browsers
    this.input.once('pointerdown', () => {
      if (this.game && this.game.canvas && this.game.canvas.focus) {
        this.game.canvas.focus();
      }
      if (this.input.keyboard) this.input.keyboard.enabled = true;
    });

    // Initialize managers
    this.symbolManager = new SymbolManager(this);
    this.uiManager = new UIManager(this);
    this.inputHandler = new InputHandler(this);

    // Create game elements
    this.symbolManager.createReferenceKey();
    this.symbolManager.createGameGrid();
    this.uiManager.createUI();
    this.inputHandler.setupInput();

    // Backup keyboard handler to ensure digits always register
    if (this.input.keyboard) {
      // Remove any existing handlers to avoid conflicts
      this.input.keyboard.removeAllListeners('keydown');
      this.input.keyboard.on('keydown', (event) => {
        if (this.gameData.timeRemaining <= 0) return; // Don't process if game ended
        const key = event.key;
        if (key >= '0' && key <= '9') {
          const digit = parseInt(key);
          event.preventDefault(); // Prevent default browser behavior
          this.inputHandler.handleDigitInput(digit);
        }
      });
    }

    // Start game timer
    this.startGameTimer();

    // Create ambient glow effects
    this.createAmbientEffects();
  }

  createAmbientEffects() {
    // Removed per requirements
  }

  startGameTimer() {
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.gameData.timeRemaining--;
        this.uiManager.updateTimer();
        
        if (this.gameData.timeRemaining <= 0) {
          this.endGame();
        }
      },
      repeat: this.gameData.timeRemaining - 1
    });
  }

  processAnswer(digit) {
    const result = this.symbolManager.checkAnswer(digit);
    this.gameData.total++;
    
    if (result.correct) {
      this.gameData.correct++;
      this.gameData.score += (10 + this.gameData.streak);
      this.gameData.streak++;
      this.showFeedback(result.symbol, true);
    } else {
      this.gameData.streak = 0;
      this.showFeedback(result.symbol, false);
    }
    
    this.uiManager.updateStats();
    this.symbolManager.nextSymbol();
  }

  showFeedback(symbol, correct) {
    // Disabled visual feedback (+ / X, tint, popups)
  }

  endGame() {
    this.gameTimer.destroy();
    
    // Calculate final metrics
    const accuracy = this.gameData.total > 0 ? (this.gameData.correct / this.gameData.total * 100).toFixed(1) : 0;
    const wpm = (this.gameData.correct / 1.5).toFixed(1); // 90 saniye = 1.5 dakika
    const durationSeconds = 90; // oyun süresi sabit
    
    // Hide all UI elements before showing thank-you message
    if (this.symbolManager) {
      this.symbolManager.gameSymbols.forEach(s => s.setVisible(false));
      this.symbolManager.referenceSprites.forEach(s => s.setVisible(false));
    }
    if (this.uiManager) {
      if (this.uiManager.timerText) this.uiManager.timerText.setVisible(false);
      if (this.uiManager.scoreText) this.uiManager.scoreText.setVisible(false);
      if (this.uiManager.accuracyText) this.uiManager.accuracyText.setVisible(false);
      if (this.uiManager.streakText) this.uiManager.streakText.setVisible(false);
      if (this.uiManager.progressBar) this.uiManager.progressBar.clear();
    }
    if (this.inputHandler) {
      this.inputHandler.digitButtons.forEach(b => {
        if (b.button) b.button.setVisible(false);
        if (b.text) b.text.setVisible(false);
      });
    }
    
    // Save to localStorage
    try {
      const record = {
        name: this.playerInfo.name || '',
        company: this.playerInfo.company || '',
        score: this.gameData.score,
        accuracy: Number(accuracy),
        durationSeconds: durationSeconds,
        total: this.gameData.total,
        correct: this.gameData.correct,
        endedAt: new Date().toISOString()
      };
      const key = 'sdmt_results';
      const existing = localStorage.getItem(key);
      const prev = existing ? JSON.parse(existing) : [];
      prev.push(record);
      localStorage.setItem(key, JSON.stringify(prev));

      // Auto-download CSV after saving
      const csvData = [['Ad Soyad','Şirket','Skor','Doğru','Toplam','Doğruluk','Süre (sn)','Tarih']];
      const results = JSON.parse(localStorage.getItem('sdmt_results') || '[]');
      results.forEach(r => {
        csvData.push([
          r.name, r.company, r.score, r.correct, r.total, r.accuracy, r.durationSeconds, r.endedAt
        ]);
      });
      const csvString = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'sdmt_results.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (_) {}

    // Show only thank-you message on white overlay and stop input
    const overlay = this.add.graphics();
    overlay.fillStyle(0xffffff, 1);
    overlay.fillRect(0, 0, this.scale.width, this.scale.height);
    overlay.setDepth(1000);
    const msg = "Öğrenme Hızı Testi'ni Tamamladınız. Teşekkür Ederiz.";
    this.add.text(512, 384, msg, {
      fontSize: '24px',
      fontWeight: 'bold',
      fill: '#990014',
      align: 'center',
      wordWrap: { width: 800 }
    }).setOrigin(0.5).setDepth(1001);
    this.input.enabled = false;
  }
}