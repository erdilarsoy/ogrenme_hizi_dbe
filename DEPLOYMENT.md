# Deployment Rehberi

Oyunu canlıya almak için aşağıdaki seçeneklerden birini kullanabilirsiniz:

## 1. GitHub Pages (Önerilen)

### Otomatik Deployment (GitHub Actions)
1. GitHub repository'nize kodunuzu push edin
2. Repository Settings > Pages bölümüne gidin
3. Source olarak "GitHub Actions" seçin
4. `main` veya `master` branch'ine push yaptığınızda otomatik olarak deploy edilecektir

### Manuel Deployment
```bash
npm run build
# dist klasörünü GitHub Pages'e yükleyin
```

**Not:** `vite.config.js` dosyasındaki `base` path'i GitHub repository yapınıza göre güncelleyin.

## 2. Netlify

1. [Netlify](https://www.netlify.com/) hesabı oluşturun
2. "Add new site" > "Import an existing project" seçin
3. GitHub repository'nizi bağlayın
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy butonuna tıklayın

Veya Netlify CLI ile:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 3. Vercel

1. [Vercel](https://vercel.com/) hesabı oluşturun
2. "Import Project" seçin
3. GitHub repository'nizi bağlayın
4. Vercel otomatik olarak ayarları algılayacaktır
5. Deploy butonuna tıklayın

Veya Vercel CLI ile:
```bash
npm install -g vercel
vercel --prod
```

## 4. Diğer Static Hosting Servisleri

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

### Surge.sh
```bash
npm install -g surge
npm run build
surge dist
```

## Önemli Notlar

- Build yapmadan önce `vite.config.js` dosyasındaki `base` path'i deployment platformunuza göre ayarlayın
- GitHub Pages için: `/repository-name/` formatında olmalı
- Netlify/Vercel için: `/` olarak ayarlayın
- Build komutu: `npm run build`
- Output klasörü: `dist`

## Base Path Ayarlama

GitHub Pages için (subdirectory):
```js
base: '/ogrenme_hizi_dbe/'
```

Root domain için:
```js
base: '/'
```

