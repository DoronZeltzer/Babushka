// Customer-facing catalog: render items, filter by category, item detail modal.

(function () {
  let currentCategory = 'all';

  const gridEl = document.getElementById('grid');
  const filtersEl = document.querySelector('.filters');
  const emptyEl = document.getElementById('empty-state');
  const modalEl = document.getElementById('modal');
  const modalBodyEl = document.getElementById('modal-body');

  function renderFilters() {
    const frag = document.createDocumentFragment();
    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.dataset.cat = cat.id;
      btn.textContent = cat.label;
      frag.appendChild(btn);
    });
    filtersEl.appendChild(frag);

    filtersEl.addEventListener('click', e => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      currentCategory = btn.dataset.cat;
      [...filtersEl.querySelectorAll('.chip')].forEach(c =>
        c.classList.toggle('chip-active', c === btn)
      );
      renderGrid();
    });
  }

  function renderGrid() {
    const items = Store.getAll().filter(item =>
      currentCategory === 'all' ? true : item.category === currentCategory
    );

    gridEl.innerHTML = '';
    emptyEl.hidden = items.length > 0;

    const frag = document.createDocumentFragment();
    items.forEach(item => frag.appendChild(buildCard(item)));
    gridEl.appendChild(frag);
  }

  function buildCard(item) {
    const card = document.createElement('article');
    card.className = 'card' + (item.sold ? ' card-sold' : '');
    card.dataset.id = item.id;

    const imgUrl = item.images && item.images[0]
      ? item.images[0]
      : null;

    card.innerHTML = `
      <div class="card-image">
        ${imgUrl
          ? `<img src="${escapeAttr(imgUrl)}" alt="${escapeAttr(item.title)}" loading="lazy">`
          : `<div class="card-placeholder">אין תמונה</div>`}
        ${item.sold ? '<span class="badge-sold">נמכר</span>' : ''}
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(item.title)}</h3>
        <p class="card-category">${escapeHtml(categoryLabel(item.category))}</p>
        <p class="card-price">${formatPrice(item.price)}</p>
      </div>
    `;

    card.addEventListener('click', () => openModal(item.id));
    return card;
  }

  function openModal(id) {
    const item = Store.getById(id);
    if (!item) return;

    const images = item.images && item.images.length ? item.images : [];
    const mainImg = images[0] || null;

    modalBodyEl.innerHTML = `
      <div class="modal-image">
        ${mainImg
          ? `<img id="modal-main-img" src="${escapeAttr(mainImg)}" alt="${escapeAttr(item.title)}">`
          : `<div class="card-placeholder modal-placeholder">אין תמונה</div>`}
        ${item.sold ? '<span class="badge-sold badge-sold-lg">נמכר</span>' : ''}
      </div>
      ${images.length > 1 ? `
        <div class="modal-thumbs">
          ${images.map((src, i) => `
            <button class="thumb${i === 0 ? ' thumb-active' : ''}" data-src="${escapeAttr(src)}">
              <img src="${escapeAttr(src)}" alt="">
            </button>
          `).join('')}
        </div>
      ` : ''}
      <div class="modal-details">
        <p class="modal-category">${escapeHtml(categoryLabel(item.category))}</p>
        <h2 class="modal-title">${escapeHtml(item.title)}</h2>
        <p class="modal-price">${formatPrice(item.price)}</p>
        ${item.description
          ? `<p class="modal-description">${escapeHtml(item.description)}</p>`
          : ''}
        <a href="https://www.facebook.com/babushka.regba/"
           target="_blank" rel="noopener"
           class="btn btn-primary modal-cta">
          ${item.sold ? 'הפריט נמכר — צרו קשר לפריטים דומים' : 'צרו קשר דרך פייסבוק'}
        </a>
      </div>
    `;

    // Thumbnail switching
    modalBodyEl.querySelectorAll('.thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.dataset.src;
        const mainImg = document.getElementById('modal-main-img');
        if (mainImg) mainImg.src = src;
        modalBodyEl.querySelectorAll('.thumb').forEach(t =>
          t.classList.toggle('thumb-active', t === btn)
        );
      });
    });

    modalEl.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalEl.hidden = true;
    document.body.style.overflow = '';
  }

  modalEl.addEventListener('click', e => {
    if (e.target.dataset.close !== undefined) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modalEl.hidden) closeModal();
  });

  function escapeHtml(str) {
    return String(str ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }
  function escapeAttr(str) {
    return escapeHtml(str).replaceAll('"', '&quot;');
  }

  renderFilters();
  renderGrid();
})();
