export default class UIManager {
    constructor(scene) {
      this.scene = scene;
      this.timerText = null;
      this.scoreText = null;
      this.accuracyText = null;
      this.streakText = null;
    }
  
    createUI() {
      // Zaman göstergesi metni kaldırıldı; sadece progress bar kalacak
      this.timerText = null;
  
      // Remove bottom texts (score, accuracy, streak)
      this.scoreText = null;
      this.accuracyText = null;
      this.streakText = null;
  
      // Progress bar background
      const progressBg = this.scene.add.graphics();
      progressBg.fillStyle(0x333333);
      progressBg.fillRoundedRect(80, 680, 864, 20, 10);
      progressBg.setDepth(0);
  
      this.progressBar = this.scene.add.graphics();
      this.progressBar.setDepth(0);
      this.updateProgressBar();
    }
  
    updateTimer() {
      this.updateProgressBar();
    }
  
    updateStats() {
      const data = this.scene.gameData;
  
      // Güvenli kontrol — streakText varsa renklendir
      if (this.streakText) {
        if (data.streak >= 10) {
          this.streakText.setFill('#ff8800');
        } else if (data.streak >= 5) {
          this.streakText.setFill('#ffdd00');
        } else {
          this.streakText.setFill('#ffaa88');
        }
      }
  
      // Skor animasyonu da varsa tetiklenebilir
      if (this.scoreText) {
        this.scene.tweens.add({
          targets: this.scoreText,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 150,
          yoyo: true
        });
      }
    }
  
    updateProgressBar() {
      this.progressBar.clear();
  
      const progress = 1 - (this.scene.gameData.timeRemaining / 90);
      const width = 864 * progress;
  
      // Color gradient based on progress
      let color = 0x00ff00; // Green
      if (progress > 0.7) color = 0xffaa00; // Orange
      if (progress > 0.9) color = 0xff4400; // Red
  
      this.progressBar.fillStyle(color, 0.8);
      this.progressBar.fillRoundedRect(80, 680, width, 20, 10);
  
      // Add glow effect
      this.progressBar.lineStyle(2, color, 0.6);
      this.progressBar.strokeRoundedRect(80, 680, width, 20, 10);
    }
  }
  