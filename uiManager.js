export default class UIManager {
  constructor(scene) {
    this.scene = scene;
    this.progressBar = null;
    this.progressBarBg = null;
    this.scoreText = null;
    this.accuracyText = null;
    this.streakText = null;
  }

  createUI() {
    // Progress bar area - shows time countdown (60 seconds to 0)
    // Stats (Skor, Doğruluk Oranı, Seri) displayed above the progress bar
    // Moved up by 50 pixels
    const barX = 80;
    const barY = 630;
    const barWidth = 864;
    const barHeight = 20;

    // Progress bar graphics container (for time countdown)
    this.progressBar = this.scene.add.graphics();
    this.progressBar.setDepth(2);

    // Background for the progress bar
    this.progressBarBg = this.scene.add.graphics();
    this.progressBarBg.setDepth(1);
    
    // Stats displayed above the progress bar
    const statsY = 600;
    
    // Skor (Left)
    this.scoreText = this.scene.add.text(250, statsY, 'Skor: 0', {
      fontSize: '20px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2);

    // Doğruluk Oranı (Center)
    this.accuracyText = this.scene.add.text(512, statsY, 'Doğruluk: %100', {
      fontSize: '20px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2);

    // Seri (Right)
    this.streakText = this.scene.add.text(774, statsY, 'Seri: 0', {
      fontSize: '20px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2);

    // Initialize progress bar (shows time)
    this.updateProgressBar();
  }

  updateTimer() {
    // Update progress bar (shows time countdown)
    this.updateProgressBar();
  }

  updateStats() {
    // Update stats text above progress bar
    const data = this.scene.gameData;

    // Update Score
    if (this.scoreText) this.scoreText.setText(`Skor: ${data.score}`);

    // Update Accuracy
    let accuracy = 0;
    if (data.total > 0) {
      accuracy = Math.round((data.correct / data.total) * 100);
    }
    if (this.accuracyText) this.accuracyText.setText(`Doğruluk: %${accuracy}`);

    // Update Streak
    if (this.streakText) this.streakText.setText(`Seri: ${data.streak}`);

    // Streak visual flair
    if (this.streakText) {
      if (data.streak > 5) this.streakText.setTint(0xffaa00);
      else this.streakText.clearTint();
    }
  }

  updateProgressBar() {
    const data = this.scene.gameData;
    const barX = 80;
    const barY = 630; // Moved up by 50 pixels
    const barWidth = 864;
    const barHeight = 20;
    const maxTime = 60; // 1 dakika = 60 saniye

    // Clear previous drawing
    this.progressBar.clear();
    this.progressBarBg.clear();

    // Draw background (dark gray/black)
    this.progressBarBg.fillStyle(0x222222, 0.8);
    this.progressBarBg.fillRoundedRect(barX, barY, barWidth, barHeight, 10);
    this.progressBarBg.lineStyle(2, 0x444444, 0.6);
    this.progressBarBg.strokeRoundedRect(barX, barY, barWidth, barHeight, 10);

    // Progress bar fills from empty (0) to full (1) as time passes
    // If timer hasn't started yet, show empty bar
    let progress = 0;
    if (data.timeRemainingForDisplay !== undefined) {
      // Calculate progress: elapsed time / max time
      const elapsed = maxTime - data.timeRemainingForDisplay;
      progress = Math.max(0, Math.min(1, elapsed / maxTime));
    } else if (data.timeRemaining !== undefined && data.timeRemaining !== maxTime) {
      // Fallback: use integer timeRemaining
      const elapsed = maxTime - data.timeRemaining;
      progress = Math.max(0, Math.min(1, elapsed / maxTime));
    }
    
    // Width increases from 0 to barWidth as time passes (soldan sağa dolsun)
    const width = barWidth * progress;

    // Color gradient: starts green (progress 0) and becomes red (progress 1.0)
    // Progress 0.0 = green (0xff0000 = 0 red, 255 green), progress 1.0 = red (255 red, 0 green)
    const red = Math.round(progress * 255);
    const green = Math.round((1 - progress) * 255);
    const blue = 0;
    const color = (red << 16) | (green << 8) | blue;

    // Draw progress bar (time remaining) - fills from left to right
    this.progressBar.fillStyle(color, 0.9);
    this.progressBar.fillRoundedRect(barX, barY, width, barHeight, 10);

    // Add glow effect
    this.progressBar.lineStyle(2, color, 1);
    this.progressBar.strokeRoundedRect(barX, barY, width, barHeight, 10);
  }
}
