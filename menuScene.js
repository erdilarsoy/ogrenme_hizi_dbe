export default class MenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MenuScene' });
    }
  
    preload() {
      // Collect load errors
      this.loadErrors = [];
      this.load.on('loaderror', (file) => {
        this.loadErrors.push({ key: file.key, src: file.src || file.url || 'unknown' });
      });

      this.load.image('symbolCards', 'assets/symbolCardSet.png');
      this.load.image('digitCards', 'assets/digitCardSet.png');
      this.load.image('scoreboard', 'assets/scoreboardUI.png');
    }
  
    create() {
      // White background
      this.cameras.main.setBackgroundColor('#ffffff');

      // If there were load errors, show them and block start
      if (this.loadErrors && this.loadErrors.length > 0) {
        const box = this.add.graphics();
        box.fillStyle(0x2a0000, 0.95);
        box.fillRoundedRect(120, 140, 784, 488, 16);
        box.lineStyle(3, 0xff4444, 1);
        box.strokeRoundedRect(120, 140, 784, 488, 16);

        this.add.text(512, 180, 'Asset Yükleme Hatası', {
          fontSize: '32px',
          fontWeight: 'bold',
          fill: '#ff7777'
        }).setOrigin(0.5);

        const hint = 'Bazı dosyalar yüklenemedi. Dosya adlarını ve yollarını kontrol edin (assets/...).';
        this.add.text(512, 220, hint, {
          fontSize: '18px',
          fill: '#ffcccc',
          align: 'center',
          wordWrap: { width: 720 }
        }).setOrigin(0.5);

        const lines = this.loadErrors.map((e, i) => `${i + 1}. key: ${e.key} → ${e.src}`);
        this.add.text(160, 260, lines.join('\n'), {
          fontSize: '18px',
          fill: '#ffbbbb',
          lineSpacing: 8,
        });

        this.add.text(512, 600, 'Lütfen eksik/yanlış yolu düzeltip sayfayı yenileyin.', {
          fontSize: '20px',
          fill: '#ffffff'
        }).setOrigin(0.5);

        return;
      }
      // Title lines per spec
      this.add.text(512, 140, 'DBE Oyunlaştırılmış Değerlendirme Araçları', {
        fontSize: '36px',
        fontWeight: 'bold',
        fill: '#990014'
      }).setOrigin(0.5).setDepth(2);

      this.add.text(512, 185, 'Öğrenme Hızı Testi', {
        fontSize: '22px',
        fill: '#222222'
      }).setOrigin(0.5).setDepth(2);

      // Registration panel (name & company)
      const panel = this.add.graphics();
      panel.fillStyle(0xeeeeee, 1);
      panel.fillRoundedRect(212, 280, 600, 240, 12);
      panel.lineStyle(2, 0xcccccc, 1);
      panel.strokeRoundedRect(212, 280, 600, 240, 12);
      panel.setDepth(0);

      this.add.text(512, 305, 'Oyuncu Kaydı', {
        fontSize: '24px',
        fontWeight: 'bold',
        fill: '#990014'
      }).setOrigin(0.5).setDepth(2);

      const formHtml = `
        <div style="width: 520px; margin: 0 auto; font-family: Arial, sans-serif;">
          <label style=\"display:block;margin-bottom:8px;color:#333;\">Ad Soyad</label>
          <input id=\"playerName\" type=\"text\" placeholder=\"Adınızı girin\" style=\"width:100%;padding:10px;border:1px solid #bbb;border-radius:6px;margin-bottom:16px;font-size:16px;\" />
          <label style=\"display:block;margin-bottom:8px;color:#333;\">Şirket</label>
          <input id=\"companyName\" type=\"text\" placeholder=\"Şirket adını girin\" style=\"width:100%;padding:10px;border:1px solid #bbb;border-radius:6px;margin-bottom:20px;font-size:16px;\" />
          <button id=\"startBtn\" style=\"width:100%;padding:12px 16px;background:#990014;color:#fff;border:none;border-radius:6px;font-size:18px;cursor:pointer;\">Başlat</button>
        </div>
      `;

      const form = this.add.dom(512, 400).createFromHTML(formHtml);
      form.setDepth(2);

      form.addListener('click');
      form.on('click', (e) => {
        if (e.target && e.target.id === 'startBtn') {
          const nameInput = form.getChildByID('playerName');
          const companyInput = form.getChildByID('companyName');
          const playerName = (nameInput && nameInput.value ? nameInput.value.trim() : '');
          const companyName = (companyInput && companyInput.value ? companyInput.value.trim() : '');
          if (!playerName) {
            nameInput && nameInput.focus();
            return;
          }
          // clean up DOM and start tutorial
          try { form.removeListener('click'); } catch(_) {}
          try { form.destroy(); } catch(_) {}
          this.scene.start('TutorialScene', { playerName, companyName });
        }
      });
    }
  
    createParticles() {
      for (let i = 0; i < 20; i++) {
        const particle = this.add.circle(
          Phaser.Math.Between(0, 1024),
          Phaser.Math.Between(0, 768),
          2,
          0xffd700,
          0.3
        );
        
        this.tweens.add({
          targets: particle,
          y: particle.y - 100,
          alpha: 0,
          duration: Phaser.Math.Between(3000, 6000),
          repeat: -1,
          yoyo: false,
          onComplete: () => {
            particle.y = 800;
            particle.alpha = 0.3;
          }
        });
      }
    }
  }