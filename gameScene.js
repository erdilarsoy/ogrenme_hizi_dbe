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
      timeRemaining: 60, // 1 dakika = 60 saniye
      level: 1,
      streak: 0
    };
    this.startTime = null; // Track when game started for smooth progress bar
    this.gameEnded = false;
  }

  init(data) {
    this.playerInfo = {
      name: data && data.playerName ? data.playerName : '',
      company: data && data.companyName ? data.companyName : ''
    };
    // Get tutorial completion time to start progress bar at the right moment
    this.tutorialEndTime = data && data.tutorialEndTime ? data.tutorialEndTime : null;
    // Flag to start progress bar (from InfoScene)
    this.startProgressBarOnStart = data && data.startProgressBar ? true : false;
  }

  create() {
    // Background and Static UI
    this.add.image(512, 384, 'background').setDepth(-10); // ARKAPLAN.png
    this.add.image(512, 50, 'header').setDepth(1); // HEADER.png
    this.add.image(512, 720, 'footer').setDepth(1); // FOOTER.png

    // Layout container for the game area
    // SymbolManager handles the main 'layout' image in createGameGrid, so we leave it there or move it here.
    // If we move it here, we ensure layer order.
    // Let's leave layout in SymbolManager but ensure depth is correct.

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
        if (key >= '1' && key <= '7') {
          const digit = parseInt(key);
          event.preventDefault(); // Prevent default browser behavior
          this.inputHandler.handleDigitInput(digit);
        }
      });
    }

    // Progress bar starts when start button is clicked
    this.gameStarted = true;
    
    // Start timer if startProgressBar flag is set (from InfoScene)
    // Timer will start when scene is fully created
    this.time.delayedCall(100, () => {
      if (this.startProgressBarOnStart) {
        this.startGameTimer();
      }
    });

    // Create ambient glow effects
    this.createAmbientEffects();
  }

  createAmbientEffects() {
    // Removed per requirements
  }

  startGameTimer() {
    const maxTime = 60; // 1 dakika = 60 saniye
    
    // Record start time right before starting timers to ensure accurate timing
    this.startTime = this.time.now;
    
    // Update time remaining every second
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.gameData.timeRemaining--;
        if (this.gameData.timeRemaining <= 0) {
          this.gameData.timeRemaining = 0;
          this.endGame();
        }
      },
      repeat: maxTime - 1
    });

    // Update progress bar more frequently for smoother animation (every 50ms)
    this.progressBarTimer = this.time.addEvent({
      delay: 50,
      callback: () => {
        // Calculate smooth time remaining based on elapsed time
        const elapsed = (this.time.now - this.startTime) / 1000; // elapsed in seconds
        const smoothTimeRemaining = Math.max(0, maxTime - elapsed);
        
        // Update gameData for display, but keep integer for game logic
        this.gameData.timeRemainingForDisplay = smoothTimeRemaining;
        
        this.uiManager.updateTimer();
        
        // End game if time is up
        if (smoothTimeRemaining <= 0 && !this.gameEnded) {
          this.gameData.timeRemaining = 0;
          this.endGame();
        }
      },
      repeat: -1 // Repeat indefinitely until game ends
    });
  }

  processAnswer(digit) {
    if (this.gameData.timeRemaining <= 0) return; // Don't process if time is up
    
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
    if (this.gameTimer) this.gameTimer.destroy();
    if (this.progressBarTimer) this.progressBarTimer.destroy();

    // Calculate final metrics
    const accuracy = this.gameData.total > 0 ? (this.gameData.correct / this.gameData.total * 100).toFixed(1) : 0;
    const wpm = (this.gameData.correct / 1.0).toFixed(1); // 60 saniye = 1 dakika
    const durationSeconds = 60; // oyun süresi sabit

    // Hide all UI elements before showing thank-you message
    if (this.symbolManager) {
      this.symbolManager.gameSymbols.forEach(s => s.setVisible(false));
      this.symbolManager.referenceSprites.forEach(s => s.setVisible(false));
    }
    if (this.uiManager) {
      if (this.uiManager.progressBar) this.uiManager.progressBar.clear();
      if (this.uiManager.progressBarBg) this.uiManager.progressBarBg.clear();
      if (this.uiManager.scoreText) this.uiManager.scoreText.setVisible(false);
      if (this.uiManager.accuracyText) this.uiManager.accuracyText.setVisible(false);
      if (this.uiManager.streakText) this.uiManager.streakText.setVisible(false);
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
      const csvData = [['Ad Soyad', 'Şirket', 'Skor', 'Doğru', 'Toplam', 'Doğruluk', 'Süre (sn)', 'Tarih']];
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
    } catch (_) { }

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