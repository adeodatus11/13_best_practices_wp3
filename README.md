# WIN4SMEs — Best Practices Website

Strona internetowa prezentująca 13 najlepszych praktyk innowacji w miejscu pracy dla MŚP, zebranych w ramach projektu WIN4SMEs (WP3 Milestone 9).

## Pliki

```
├── index.html      — główna strona (single-page)
├── styles.css      — style CSS
├── app.js          — logika: filtry, wyszukiwarka, modal, EN/PL
├── data.js         — dane 13 praktyk (EN + PL)
├── assets/         — logotypy i grafiki
│   ├── Logo-2025.png
│   ├── cove-polska-logo.png
│   ├── PL_Co-fundedbytheEU_RGB_POS.png
│   └── EN_co_fundedvertical_RGB_Monochrome.png
└── Milestone09_Workplace-Innovation-for-SMEs_Template-Best-Practices.pdf
```

## Uruchomienie lokalnie

Otwórz plik `index.html` bezpośrednio w przeglądarce — żadna konfiguracja serwera nie jest wymagana.

## Wdrożenie na GitHub Pages

### Krok 1 — Utwórz repozytorium GitHub

1. Zaloguj się na [github.com](https://github.com)
2. Kliknij **New repository**
3. Nadaj nazwę (np. `win4smes-best-practices`)
4. Ustaw jako **Public**
5. Kliknij **Create repository**

### Krok 2 — Wgraj pliki

Opcja A — przez interfejs GitHub:
1. Kliknij **Add file → Upload files**
2. Przeciągnij wszystkie pliki i folder `assets/`
3. Kliknij **Commit changes**

Opcja B — przez terminal (Git):
```bash
git init
git add .
git commit -m "Add WIN4SMEs best practices website"
git remote add origin https://github.com/TWOJA-NAZWA/win4smes-best-practices.git
git push -u origin main
```

### Krok 3 — Włącz GitHub Pages

1. W repozytorium kliknij **Settings**
2. W lewym menu: **Pages**
3. W sekcji "Source" wybierz: **Deploy from a branch**
4. Branch: **main**, folder: **/ (root)**
5. Kliknij **Save**

### Krok 4 — Gotowe!

Po kilku minutach strona będzie dostępna pod adresem:
```
https://TWOJA-NAZWA.github.io/win4smes-best-practices/
```

## Funkcjonalności

- 🌐 Dwujęzyczność EN/PL (przełącznik w nagłówku)
- 🔍 Wyszukiwarka tekstowa
- 🏷️ Filtry po 5 kategoriach innowacji
- 🌍 Filtr po 8 krajach
- 📋 Modal ze szczegółami każdej praktyki
- 📱 Responsywny (mobile, tablet, desktop)
- ♿ Dostępny (ARIA, nawigacja klawiaturą)
- 📥 Link do pobrania pełnego raportu PDF

## Kategorie

| Kategoria | Kolor |
|---|---|
| Digital Innovation / Innowacje cyfrowe | Niebieski |
| Workplace Culture / Kultura pracy | Pomarańczowy |
| Inclusion & Diversity / Różnorodność i inkluzja | Zielony |
| Talent Development / Rozwój talentów | Fioletowy |
| Recruitment Innovation / Innowacyjna rekrutacja | Czerwony |

## Projekt

WIN4SMEs — Workplace Innovation for SMEs  
WP3 Milestone 9 · Czerwiec 2025  
Współfinansowane przez Unię Europejską · Program Erasmus+ CoVE
