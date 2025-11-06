# GitHub Pages Deployment Kurulumu

## Yapılan Değişiklikler

✅ **Base path güncellendi**: `/ogrenme_hizi_dbe/` olarak ayarlandı
✅ **GitHub Actions workflow** eklendi (`.github/workflows/deploy.yml`)
✅ **Build optimizasyonları** eklendi (Phaser ayrı chunk'a ayrıldı)
✅ **.gitignore** dosyası oluşturuldu
✅ **Deployment dosyaları** eklendi (Netlify, Vercel için)

## GitHub'a Push Adımları

### 1. Değişiklikleri Stage'e Alın
```bash
git add .github/
git add .gitignore
git add vite.config.js
git add DEPLOYMENT.md
git add netlify.toml
git add vercel.json
```

### 2. Commit Yapın
```bash
git commit -m "GitHub Pages deployment için yapılandırma eklendi"
```

### 3. GitHub'a Push Edin
```bash
git push origin main
```

## GitHub Pages Ayarları

Push yaptıktan sonra:

1. GitHub repository'nize gidin: https://github.com/erdilarsoy/ogrenme_hizi_dbe
2. **Settings** sekmesine tıklayın
3. Sol menüden **Pages** seçeneğine tıklayın
4. **Source** bölümünde:
   - **Deploy from a branch** yerine **GitHub Actions** seçin
5. Ayarları kaydedin

## Otomatik Deployment

Artık `main` branch'ine her push yaptığınızda:
- GitHub Actions otomatik olarak build yapacak
- Oyun otomatik olarak GitHub Pages'e deploy edilecek
- Oyun şu adreste yayında olacak: `https://erdilarsoy.github.io/ogrenme_hizi_dbe/`

## İlk Deployment

İlk deployment için:
1. Yukarıdaki adımları takip edin
2. GitHub Actions sekmesine gidin
3. Workflow'un çalıştığını kontrol edin
4. Deployment tamamlandıktan sonra (yaklaşık 2-3 dakika) oyun canlıda olacak

## Sorun Giderme

### Build başarısız olursa:
- GitHub Actions sekmesinden logları kontrol edin
- `npm ci` komutunun çalıştığından emin olun

### Oyun yüklenmiyorsa:
- `vite.config.js` dosyasındaki `base` path'in doğru olduğundan emin olun
- Browser console'da hata mesajlarını kontrol edin
- GitHub Pages URL'inin doğru olduğundan emin olun

## Manuel Build Test

Yerel olarak test etmek için:
```bash
npm run build
npm run preview
```

Bu komutlar build'i oluşturur ve yerel olarak test etmenizi sağlar.

