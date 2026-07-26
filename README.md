# K-Pop Idol Face Test

> **Which K-Pop idol do you look like?** AI face matcher trained on K-Pop idols from Korea's top 3 entertainment companies — SM, JYP, YG.

[![Live Site](https://img.shields.io/badge/Live-moony01.com%2Fkpopface-blue)](https://moony01.com/kpopface/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-enabled-purple.svg)](https://moony01.com/kpopface/)
[![Languages](https://img.shields.io/badge/i18n-15%20languages-orange.svg)](https://moony01.com/kpopface/)

🌐 **Live Demo**: https://moony01.com/kpopface/

---

## Overview

**K-Pop Idol Face Test** is a real-world AI web application that uses Google's **Teachable Machine** to analyze a user's face and match them with the most similar K-Pop idol. The model is trained on idols from Korea's three major entertainment agencies — SM, JYP, YG — and the app is built as a multilingual Jekyll site with global SEO across 15 languages.

## Key Features

- 🎯 **AI Face Matching** — Powered by Google Teachable Machine
- 🌏 **15 Languages** — Korean, English, Indonesian, Turkish, Spanish, Japanese, French, German, and more
- 📱 **Mobile-First PWA** — Installable as a mobile app, fully responsive
- 🔍 **SEO Optimized** — FAQ schema, multilingual hreflang, structured data
- 📊 **Production-Ready** — Google Analytics 4, AdSense, Search Console fully integrated
- ⚡ **Free & Instant** — No signup, no payment, results in seconds

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Jekyll, SCSS, Vanilla JavaScript |
| **AI / ML** | Google Teachable Machine (cloud API) |
| **Data Pipeline** | Python 3.9 + Selenium (image scraping) |
| **Hosting** | GitHub Pages |
| **Analytics** | Google Analytics 4, Google Search Console |
| **Monetization** | Google AdSense |
| **Mobile Wrapper** | React Native WebView (Android — discontinued) |

## Production Statistics (28 days, April 2026)

This is not a toy project — it serves real traffic from K-Pop fans worldwide.

| Metric | Value |
|--------|-------|
| Sessions | 5,513 |
| Unique Users | 5,239 |
| Pageviews | 11,665 |
| Search Impressions (GSC) | 37,649 |
| Search Clicks (GSC) | 5,155 |
| Average CTR | 13.69% |
| Top 3 Countries | Indonesia (66%), South Korea (14%), USA (3%) |
| Mobile Traffic | 81.5% |

**Top Search Queries (English):**
- "kpop face test" — Rank 1.6
- "my idol face" — Rank 5.6
- "kbs test face" — Rank 1.7

## Live Demo

🔗 **Try it now**: https://moony01.com/kpopface/

Available languages: 🇰🇷 한국어 / 🇺🇸 English / 🇮🇩 Bahasa Indonesia / 🇹🇷 Türkçe / 🇪🇸 Español / 🇯🇵 日本語 / 🇫🇷 Français / 🇩🇪 Deutsch / and 7 more.

## How It Works

1. **Upload a photo** — Take or select a clear, front-facing photo
2. **AI analyzes facial features** — Sent to Google Teachable Machine API for face matching against trained idol dataset
3. **Get your top idol matches** — Closest matches from SM, JYP, YG agencies in seconds

## Local Development

### Prerequisites
- Ruby 3.0+ ([Download](https://www.ruby-lang.org/en/downloads/))
- Bundler

### Setup

```bash
git clone https://github.com/moony01/kpopface.git
cd kpopface

bundle install
bundle exec jekyll serve
```

Open [http://localhost:4000/kpopface/](http://localhost:4000/kpopface/)

### Train Your Own Model (Optional)

1. Scrape idol images:
   ```bash
   pip install selenium
   python scraper.py
   ```
2. Upload images to [Teachable Machine](https://teachablemachine.withgoogle.com/)
3. Replace the model endpoint URL in `assets/js/`

## Project Structure

```
kpopface/
├── _layouts/         # Jekyll templates
├── _config.yml       # Site config + i18n
├── en/, id/, ja/...  # Per-language entry points (15 langs)
├── assets/
│   ├── css/          # SCSS styles
│   └── js/           # Teachable Machine API client + UI logic
├── sitemap.xml       # SEO
└── manifest.json     # PWA manifest
```

## SEO & Performance

- **Lighthouse Mobile**: 90+ (PWA, accessibility, best practices)
- **Indexed Pages**: 25+ across 15 languages
- **Structured Data**: WebApplication + FAQPage JSON-LD schemas
- **i18n**: hreflang tags for all 15 language variants

## Privacy

When you upload a photo, it is sent to Google's Teachable Machine API for face analysis — Google's terms of service apply for that processing step. We do **not** store your photos on our own servers, and we do not associate uploaded photos with any user account (the app has no login). Beyond standard Google Analytics page-view metrics and AdSense ad serving, no personal data is collected.

For details on what Google does with image data sent to Teachable Machine, refer to [Google's Privacy Policy](https://policies.google.com/privacy).

## Acknowledgments

- [Google Teachable Machine](https://teachablemachine.withgoogle.com/) — No-code ML training
- [Jekyll](https://jekyllrb.com/) — Static site generator

## License

[MIT License](LICENSE) © 2024–2026 [moony01](https://github.com/moony01)

You are free to use, modify, and distribute this code. Attribution appreciated.

## Contact

- 👤 **Author**: [@moony01](https://github.com/moony01)
- 📧 **Email**: mun01180@gmail.com
- 🌐 **Website**: [moony01.com](https://moony01.com)
- 💖 **Sponsor**: [github.com/sponsors/moony01](https://github.com/sponsors/moony01)
