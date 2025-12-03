# SEO Assets Setup Guide

## 1. OG Image (og-image.png)

An SVG template has been created at `/public/og-image.svg`. Convert it to PNG:

### Option A: Quick (Browser)
1. Open `og-image.svg` in your browser
2. Take a screenshot or use browser DevTools to export
3. Resize to exactly 1200×630px
4. Save as `/public/og-image.png`

### Option B: ImageMagick (CLI)
```bash
# Install: brew install imagemagick
convert public/og-image.svg -resize 1200x630 public/og-image.png
```

### Option C: Online
1. Go to cloudconvert.com or svgtopng.com
2. Upload `og-image.svg`
3. Download PNG, ensure 1200×630px

### Option D: Figma/Sketch
1. Import SVG
2. Export as PNG at 1x (1200×630)

---

## 2. PNG Favicons

Convert `/public/favicon.svg` to PNG formats:

### ImageMagick (recommended):
```bash
# 32x32
convert public/favicon.svg -resize 32x32 public/favicon-32x32.png

# 16x16
convert public/favicon.svg -resize 16x16 public/favicon-16x16.png

# Apple Touch Icon (180x180)
convert public/favicon.svg -resize 180x180 public/apple-touch-icon.png
```

### Online alternative:
1. Use realfavicongenerator.net
2. Upload `favicon.svg`
3. Download the generated package

---

## 3. Verification Checklist

After creating assets, verify:

- [ ] `/public/og-image.png` exists (1200×630px)
- [ ] `/public/favicon-32x32.png` exists
- [ ] `/public/favicon-16x16.png` exists
- [ ] `/public/apple-touch-icon.png` exists (180×180px)

### Test OG Image:
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/

### Test Favicons:
- Check all browsers display the favicon
- Check mobile home screen icon (Safari "Add to Home Screen")

---

## 4. Update Social Links

Edit `src/routes/RootLayout.tsx` footer:
- Update GitHub URL (currently placeholder)
- Update LinkedIn URL (currently placeholder)

Edit `index.html` JSON-LD:
- Update `sameAs` array with your actual social URLs

---

## Quick Reference

| Asset | Size | Location |
|-------|------|----------|
| OG Image | 1200×630 | /public/og-image.png |
| Favicon SVG | any | /public/favicon.svg |
| Favicon 32 | 32×32 | /public/favicon-32x32.png |
| Favicon 16 | 16×16 | /public/favicon-16x16.png |
| Apple Touch | 180×180 | /public/apple-touch-icon.png |
