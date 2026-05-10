/* ============================================================
   WIN4SMEs Best Practices — App Logic
   ============================================================ */

let currentLang = 'pl';
let activeCategories = new Set();
let activeCountry = '';
let searchQuery = '';

// ---- DOM refs ----
const grid = document.getElementById('practices-grid');
const searchInput = document.getElementById('search-input');
const countryFilter = document.getElementById('country-filter');
const categoryPillsEl = document.getElementById('category-pills');
const resultCount = document.getElementById('result-count');
const criteriaGrid = document.getElementById('criteria-grid');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const modalBody = document.getElementById('modal-body');
const modalBadge = document.getElementById('modal-badge');
const modalTitle = document.getElementById('modal-title-text');
const modalFlag = document.getElementById('modal-flag');
const modalPartnerName = document.getElementById('modal-partner-name');
const modalPartnerLabel = document.getElementById('modal-partner-label');
const euLogoHeader = document.querySelector('.eu-logo-header');
const euLogoFooter = document.getElementById('footer-eu-logo');

// ============================================================
// LANGUAGE
// ============================================================
function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.getElementById('btn-en').setAttribute('aria-pressed', lang === 'en');
  document.getElementById('btn-pl').classList.toggle('active', lang === 'pl');
  document.getElementById('btn-pl').setAttribute('aria-pressed', lang === 'pl');

  // Swap EU logo
  const euSrc = lang === 'pl'
    ? 'assets/PL_Co-fundedbytheEU_RGB_POS.png'
    : 'assets/EN_Co-fundedbytheEU_RGB_POS.png';
  const euAlt = lang === 'pl' ? 'Współfinansowane przez Unię Europejską' : 'Co-funded by the European Union';
  if (euLogoHeader) { euLogoHeader.src = euSrc; euLogoHeader.alt = euAlt; }
  if (euLogoFooter) { euLogoFooter.src = euSrc; euLogoFooter.alt = euAlt; }

  // Update all i18n text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[lang][key] !== undefined) {
      el.textContent = I18N[lang][key];
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (I18N[lang][key]) el.placeholder = I18N[lang][key];
  });

  // Update country select first option
  const countryFirstOpt = countryFilter.querySelector('option[value=""]');
  if (countryFirstOpt) countryFirstOpt.textContent = I18N[lang].filter_all_countries;

  // Re-render dynamic parts
  renderCategoryPills();
  renderCriteria();
  renderGrid();
}

function t(key) {
  return I18N[currentLang][key] || I18N['en'][key] || key;
}

// ============================================================
// CATEGORY PILLS
// ============================================================
function renderCategoryPills() {
  categoryPillsEl.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const pill = document.createElement('button');
    pill.className = 'pill' + (activeCategories.has(cat.id) ? ' active' : '');
    pill.setAttribute('aria-pressed', activeCategories.has(cat.id));
    pill.dataset.catId = cat.id;

    const dot = document.createElement('span');
    dot.className = 'pill-dot';
    dot.style.backgroundColor = cat.color;
    dot.setAttribute('aria-hidden', 'true');

    const label = document.createTextNode(currentLang === 'pl' ? cat.pl : cat.en);

    pill.appendChild(dot);
    pill.appendChild(label);

    if (activeCategories.has(cat.id)) {
      pill.style.backgroundColor = cat.color;
      pill.style.color = '#fff';
    }

    pill.addEventListener('click', () => {
      if (activeCategories.has(cat.id)) {
        activeCategories.delete(cat.id);
      } else {
        activeCategories.add(cat.id);
      }
      renderCategoryPills();
      renderGrid();
    });

    categoryPillsEl.appendChild(pill);
  });
}

// ============================================================
// CRITERIA
// ============================================================
function renderCriteria() {
  criteriaGrid.innerHTML = '';
  const items = I18N[currentLang].criteria;
  items.forEach(text => {
    const div = document.createElement('div');
    div.className = 'criteria-item';
    div.setAttribute('role', 'listitem');
    div.textContent = text;
    criteriaGrid.appendChild(div);
  });
}

// ============================================================
// GRID RENDERING
// ============================================================
function getCategoryMeta(catId) {
  return CATEGORIES.find(c => c.id === catId) || { color: '#6B7280', bg: '#F9FAFB' };
}

function filterPractices() {
  const q = searchQuery.toLowerCase().trim();
  return PRACTICES.filter(p => {
    const titleMatch = (currentLang === 'pl' ? p.title_pl : p.title_en).toLowerCase().includes(q);
    const descMatch = (currentLang === 'pl' ? p.short_pl : p.short_en).toLowerCase().includes(q);
    const matchesSearch = !q || titleMatch || descMatch;
    const matchesCategory = activeCategories.size === 0 || activeCategories.has(p.category);
    const matchesCountry = !activeCountry || p.country === activeCountry || p.country.includes(activeCountry);
    return matchesSearch && matchesCategory && matchesCountry;
  });
}

function renderGrid() {
  const filtered = filterPractices();

  // Update result count
  const total = PRACTICES.length;
  resultCount.textContent = `${t('filter_results')} ${filtered.length} ${t('filter_of')} ${total} ${t('filter_practices')}`;

  grid.innerHTML = '';

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'no-results';
    empty.innerHTML = `
      <div class="emoji" aria-hidden="true">🔍</div>
      <h3>No practices found</h3>
      <p>Try adjusting your search or filters.</p>
    `;
    grid.appendChild(empty);
    return;
  }

  filtered.forEach((p, idx) => {
    const cat = getCategoryMeta(p.category);
    const title = currentLang === 'pl' ? p.title_pl : p.title_en;
    const shortDesc = currentLang === 'pl' ? p.short_pl : p.short_en;
    const partner = currentLang === 'pl' ? p.partner_pl : p.partner_en;
    const catLabel = currentLang === 'pl'
      ? CATEGORIES.find(c => c.id === p.category)?.pl
      : CATEGORIES.find(c => c.id === p.category)?.en;

    const card = document.createElement('article');
    card.className = 'practice-card';
    card.setAttribute('role', 'listitem');
    card.style.animationDelay = `${idx * 0.04}s`;
    card.tabIndex = 0;
    card.setAttribute('aria-label', title);

    card.innerHTML = `
      <div class="card-accent" style="background:${cat.color}"></div>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-number">#${String(p.id).padStart(2,'0')}</span>
          <span class="card-flag" aria-label="${p.country}">${p.flag}</span>
        </div>
        <div class="card-category" style="background:${cat.bg}; color:${cat.color}">
          <span aria-hidden="true">●</span>
          ${catLabel}
        </div>
        <h3 class="card-title">${title}</h3>
        <p class="card-desc">${shortDesc}</p>
        <div class="card-footer">
          <span class="card-partner" title="${partner}">${partner}</span>
          <button class="btn-read" data-id="${p.id}" aria-label="Read more about ${title}">
            ${t('card_read_more')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openModal(p.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(p.id); });
    card.querySelector('.btn-read').addEventListener('click', e => { e.stopPropagation(); openModal(p.id); });

    grid.appendChild(card);
  });
}

// ============================================================
// MODAL
// ============================================================
function openModal(id) {
  const p = PRACTICES.find(pr => pr.id === id);
  if (!p) return;

  const cat = getCategoryMeta(p.category);
  const lang = currentLang;
  const catLabel = lang === 'pl'
    ? CATEGORIES.find(c => c.id === p.category)?.pl
    : CATEGORIES.find(c => c.id === p.category)?.en;

  // Header
  modalBadge.textContent = catLabel;
  modalBadge.style.backgroundColor = cat.bg;
  modalBadge.style.color = cat.color;
  modalTitle.textContent = lang === 'pl' ? p.title_pl : p.title_en;
  modalFlag.textContent = p.flag;
  modalPartnerLabel.textContent = t('modal_partner') + ':';
  modalPartnerName.textContent = lang === 'pl' ? p.partner_pl : p.partner_en;

  // Body
  const shortDesc = lang === 'pl' ? p.short_pl : p.short_en;
  const longDesc = lang === 'pl' ? p.description_pl : p.description_en;
  const benefits = lang === 'pl' ? p.benefits_pl : p.benefits_en;
  const steps = lang === 'pl' ? p.steps_pl : p.steps_en;
  const conditions = lang === 'pl' ? p.conditions_pl : p.conditions_en;
  const challenges = lang === 'pl' ? p.challenges_pl : p.challenges_en;
  const example = lang === 'pl' ? p.example_pl : p.example_en;

  const benefitsHtml = benefits.map(b => `<li>${b}</li>`).join('');
  const stepsHtml = steps.map(s => `<li>${s}</li>`).join('');

  // Long description: split on \n\n to render as separate paragraphs
  const longDescHtml = longDesc
    .split('\n\n')
    .map(para => `<p class="modal-text">${para.trim()}</p>`)
    .join('');

  const linksHtml = p.links && p.links.length
    ? `<div class="modal-links">${p.links.map(l =>
        `<a href="${l.url}" class="modal-link" target="_blank" rel="noopener noreferrer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          ${l.label}
        </a>`
      ).join('')}</div>`
    : '';

  // Order: benefits → short desc → steps → conditions → challenges → long desc → example → contact
  modalBody.innerHTML = `
    <div class="modal-section">
      <div class="modal-section-title">${t('modal_benefits')}</div>
      <ul class="modal-list" role="list">${benefitsHtml}</ul>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">${t('modal_short_desc')}</div>
      <p class="modal-text">${shortDesc}</p>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">${t('modal_steps')}</div>
      <ul class="modal-list steps" role="list">${stepsHtml}</ul>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">${t('modal_conditions')}</div>
      <p class="modal-text">${conditions}</p>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">${t('modal_challenges')}</div>
      <p class="modal-text">${challenges}</p>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">${t('modal_long_desc')}</div>
      ${longDescHtml}
    </div>

    <div class="modal-section">
      <div class="modal-section-title">${t('modal_example')}</div>
      <p class="modal-text">${example}</p>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">${t('modal_contact')}</div>
      <div class="modal-contact">${p.contact}${linksHtml}</div>
    </div>
  `;

  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

// ============================================================
// COUNTER ANIMATION
// ============================================================
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function startCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(el => observer.observe(el));
}

// ============================================================
// EVENT LISTENERS
// ============================================================
searchInput.addEventListener('input', e => {
  searchQuery = e.target.value;
  renderGrid();
});

countryFilter.addEventListener('change', e => {
  activeCountry = e.target.value;
  renderGrid();
});

modalClose.addEventListener('click', closeModal);

modalBackdrop.addEventListener('click', e => {
  if (e.target === modalBackdrop) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeModal();
});

// ============================================================
// MOBILE NAV HAMBURGER
// ============================================================
function toggleMobileNav() {
  const nav = document.getElementById('mobile-nav');
  const btn = document.getElementById('hamburger-btn');
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
}
function closeMobileNav() {
  const nav = document.getElementById('mobile-nav');
  const btn = document.getElementById('hamburger-btn');
  nav.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
}

// ============================================================
// SMOOTH SCROLL — offset for sticky header + filter bar
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const targetId = href.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();

    const header = document.querySelector('.site-header');
    const headerH = header ? header.offsetHeight : 0;

    // Walk offsetParent chain to get absolute document position
    let absoluteTop = 0;
    let el = target;
    while (el && el !== document.body) {
      absoluteTop += el.offsetTop;
      el = el.offsetParent;
    }

    const scrollTarget = absoluteTop - headerH;

    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' });
  });
});

// ============================================================
// INIT
// ============================================================
function init() {
  setLang('pl');
  startCounters();
}

init();
