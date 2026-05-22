// Cookie/storage notice banner + accessibility widget.
// Injected on every page; depends on I18n being initialised already.

(function () {
  const COOKIE_KEY = 'babushka.cookie-ack.v1';
  const A11Y_KEY   = 'babushka.a11y.v1';

  // ---- Accessibility settings ----

  const defaultA11y = {
    fontStep: 0,        // -2 .. +4
    contrast: false,
    grayscale: false,
    underlineLinks: false,
  };

  function loadA11y() {
    try {
      return { ...defaultA11y, ...JSON.parse(localStorage.getItem(A11Y_KEY) || '{}') };
    } catch {
      return { ...defaultA11y };
    }
  }
  function saveA11y(s) { localStorage.setItem(A11Y_KEY, JSON.stringify(s)); }

  function applyA11y(s) {
    const root = document.documentElement;
    root.classList.toggle('a11y-contrast', !!s.contrast);
    root.classList.toggle('a11y-grayscale', !!s.grayscale);
    root.classList.toggle('a11y-underline-links', !!s.underlineLinks);
    // Each step is +6.25% (1pt at 16px). Clamp -2..+4 (= 87.5% .. 125%).
    const step = Math.max(-2, Math.min(4, s.fontStep | 0));
    root.style.setProperty('--a11y-font-scale', (1 + step * 0.0625).toFixed(4));
  }

  // ---- DOM injection ----

  function injectStyles() {
    // Pure-CSS rules so a11y settings apply even before main stylesheet
    // loads. The main stylesheet has the widget+banner visuals.
    const css = `
      :root { --a11y-font-scale: 1; }
      html { font-size: calc(100% * var(--a11y-font-scale)); }
      html.a11y-contrast {
        filter: contrast(1.25);
      }
      html.a11y-contrast body { background: #000 !important; color: #fff !important; }
      html.a11y-contrast .site-header,
      html.a11y-contrast .hero,
      html.a11y-contrast .card,
      html.a11y-contrast .admin-card,
      html.a11y-contrast .contact-info-card,
      html.a11y-contrast .contact-actions-card,
      html.a11y-contrast .login-card,
      html.a11y-contrast .legal-card { background: #111 !important; color: #fff !important; }
      html.a11y-contrast a { color: #FFE066 !important; }
      html.a11y-contrast .btn-primary,
      html.a11y-contrast .chip-active { background: #FFE066 !important; color: #000 !important; }
      html.a11y-grayscale { filter: grayscale(1); }
      html.a11y-grayscale.a11y-contrast { filter: grayscale(1) contrast(1.25); }
      html.a11y-underline-links a { text-decoration: underline !important; }
    `;
    const style = document.createElement('style');
    style.id = 'a11y-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectSkipLink() {
    const skip = document.createElement('a');
    skip.href = '#main';
    skip.className = 'skip-link';
    skip.textContent = I18n.t('skipToContent');
    document.body.insertBefore(skip, document.body.firstChild);
  }

  function injectA11yWidget() {
    const wrap = document.createElement('div');
    wrap.className = 'a11y-widget';
    wrap.innerHTML = `
      <button type="button" class="a11y-fab" aria-label="${I18n.t('a11yOpen')}" aria-expanded="false" aria-controls="a11y-panel">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="4" r="2"/>
          <path d="M19 8c-.5 0-2 .3-3.6.7l-.4.1V13l1.2 8.2c.1.4.5.8 1 .8.6 0 1.1-.5 1-1.1L17 14h.5l1.2 6.9c0 .6.5 1.1 1 1.1.6 0 1-.4 1-.8L20 13V9c0-.6-.5-1-1-1zM5 8c-.6 0-1 .4-1 1v4l-1 7.2c-.1.4.3.8.9.8.5 0 1-.5 1-1.1L6 14h.5l1.2 6.9c0 .6.5 1.1 1 1.1.6 0 1-.4.9-.8L9 13V8.8l-.4-.1C7 8.3 5.5 8 5 8z"/>
          <path d="M9 8.8V13H6.7l.3-3.8c.4-.1 1.4-.4 2-.4zm6 0V13h2.3l-.3-3.8c-.4-.1-1.4-.4-2-.4z" opacity=".5"/>
        </svg>
      </button>
      <div id="a11y-panel" class="a11y-panel" role="dialog" aria-modal="false" aria-labelledby="a11y-title" hidden>
        <div class="a11y-panel-head">
          <h3 id="a11y-title">${I18n.t('a11yTitle')}</h3>
          <button type="button" class="a11y-close" aria-label="${I18n.t('a11yClose')}">×</button>
        </div>
        <div class="a11y-options">
          <button type="button" data-a11y="font-plus">A+ ${I18n.t('a11yFontPlus')}</button>
          <button type="button" data-a11y="font-minus">A− ${I18n.t('a11yFontMinus')}</button>
          <button type="button" data-a11y="contrast">${I18n.t('a11yContrast')}</button>
          <button type="button" data-a11y="grayscale">${I18n.t('a11yGrayscale')}</button>
          <button type="button" data-a11y="underline-links">${I18n.t('a11yLinks')}</button>
          <button type="button" data-a11y="reset" class="a11y-reset">↺ ${I18n.t('a11yReset')}</button>
        </div>
        <a href="accessibility.html" class="a11y-statement-link">${I18n.t('a11yStatementLink')} →</a>
      </div>
    `;
    document.body.appendChild(wrap);

    const fab = wrap.querySelector('.a11y-fab');
    const panel = wrap.querySelector('.a11y-panel');
    const close = wrap.querySelector('.a11y-close');

    function setOpen(open) {
      panel.hidden = !open;
      fab.setAttribute('aria-expanded', String(open));
    }
    fab.addEventListener('click', () => setOpen(panel.hidden));
    close.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !panel.hidden) setOpen(false);
    });

    // Reflect active state on toggle buttons
    function refreshButtonState() {
      const s = loadA11y();
      wrap.querySelectorAll('[data-a11y]').forEach(btn => {
        const k = btn.dataset.a11y;
        const active = (k === 'contrast' && s.contrast)
                    || (k === 'grayscale' && s.grayscale)
                    || (k === 'underline-links' && s.underlineLinks);
        btn.classList.toggle('a11y-option-active', !!active);
      });
    }
    refreshButtonState();

    wrap.querySelectorAll('[data-a11y]').forEach(btn => {
      btn.addEventListener('click', () => {
        const s = loadA11y();
        const k = btn.dataset.a11y;
        if (k === 'font-plus')   s.fontStep = Math.min(4, (s.fontStep | 0) + 1);
        if (k === 'font-minus')  s.fontStep = Math.max(-2, (s.fontStep | 0) - 1);
        if (k === 'contrast')    s.contrast = !s.contrast;
        if (k === 'grayscale')   s.grayscale = !s.grayscale;
        if (k === 'underline-links') s.underlineLinks = !s.underlineLinks;
        if (k === 'reset') Object.assign(s, defaultA11y);
        saveA11y(s);
        applyA11y(s);
        refreshButtonState();
      });
    });
  }

  function injectCookieBanner() {
    if (localStorage.getItem(COOKIE_KEY) === 'true') return;
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Storage notice');
    banner.innerHTML = `
      <p class="cookie-text">${I18n.t('cookieText')}</p>
      <div class="cookie-actions">
        <a href="privacy.html" class="cookie-more">${I18n.t('cookieReadMore')}</a>
        <button type="button" class="btn btn-primary cookie-ok">${I18n.t('cookieAccept')}</button>
      </div>
    `;
    document.body.appendChild(banner);
    banner.querySelector('.cookie-ok').addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'true');
      banner.remove();
    });
  }

  function injectFooterLegal() {
    const footers = document.querySelectorAll('.site-footer .footer-inner');
    footers.forEach(footer => {
      // Avoid double-inject
      if (footer.querySelector('.footer-legal')) return;
      const nav = document.createElement('nav');
      nav.className = 'footer-legal';
      nav.setAttribute('aria-label', I18n.t('footerLegalTitle'));
      nav.innerHTML = `
        <a href="accessibility.html">${I18n.t('navAccessibility')}</a>
        <span aria-hidden="true">•</span>
        <a href="privacy.html">${I18n.t('navPrivacy')}</a>
        <span aria-hidden="true">•</span>
        <a href="terms.html">${I18n.t('navTerms')}</a>
      `;
      footer.appendChild(nav);
    });
  }

  // ---- Bootstrap ----

  injectStyles();
  applyA11y(loadA11y()); // apply before paint so no flash

  document.addEventListener('DOMContentLoaded', () => {
    injectSkipLink();
    injectA11yWidget();
    injectCookieBanner();
    injectFooterLegal();
  });
})();
