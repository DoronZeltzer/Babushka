// Admin panel: login gate, item CRUD, image upload (stored as base64 in localStorage).

(function () {
  const loginScreen = document.getElementById('login-screen');
  const adminPanel = document.getElementById('admin-panel');
  const loginForm = document.getElementById('login-form');
  const passwordInput = document.getElementById('password');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');

  const newBtn = document.getElementById('new-item-btn');
  const itemForm = document.getElementById('item-form');
  const formTitle = document.getElementById('form-title');
  const cancelBtn = document.getElementById('cancel-btn');
  const adminGrid = document.getElementById('admin-grid');
  const adminEmpty = document.getElementById('admin-empty');

  const fTitle = document.getElementById('f-title');
  const fPrice = document.getElementById('f-price');
  const fCategory = document.getElementById('f-category');
  const fDescription = document.getElementById('f-description');
  const fImages = document.getElementById('f-images');
  const fSold = document.getElementById('f-sold');
  const imagePreviews = document.getElementById('image-previews');

  let editingId = null;
  let pendingImages = []; // array of base64 data URLs

  // --- AUTH ---

  function showLoggedIn() {
    loginScreen.hidden = true;
    adminPanel.hidden = false;
    logoutBtn.hidden = false;
  }

  function showLoggedOut() {
    loginScreen.hidden = false;
    adminPanel.hidden = true;
    logoutBtn.hidden = true;
  }

  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    if (Auth.login(passwordInput.value)) {
      loginError.hidden = true;
      passwordInput.value = '';
      showLoggedIn();
      renderAdminGrid();
    } else {
      loginError.hidden = false;
    }
  });

  logoutBtn.addEventListener('click', () => {
    Auth.logout();
    showLoggedOut();
  });

  // --- CATEGORY SELECT ---

  function populateCategories() {
    fCategory.innerHTML = CATEGORIES
      .map(c => `<option value="${c.id}">${c.label}</option>`)
      .join('');
  }

  // --- FORM ---

  function openFormForNew() {
    editingId = null;
    pendingImages = [];
    formTitle.textContent = 'פריט חדש';
    fTitle.value = '';
    fPrice.value = '';
    fCategory.value = CATEGORIES[0].id;
    fDescription.value = '';
    fSold.checked = false;
    fImages.value = '';
    renderImagePreviews();
    itemForm.hidden = false;
    itemForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    fTitle.focus();
  }

  function openFormForEdit(id) {
    const item = Store.getById(id);
    if (!item) return;
    editingId = id;
    pendingImages = [...(item.images || [])];
    formTitle.textContent = 'עריכת פריט';
    fTitle.value = item.title;
    fPrice.value = item.price;
    fCategory.value = item.category;
    fDescription.value = item.description || '';
    fSold.checked = !!item.sold;
    fImages.value = '';
    renderImagePreviews();
    itemForm.hidden = false;
    itemForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeForm() {
    itemForm.hidden = true;
    editingId = null;
    pendingImages = [];
  }

  newBtn.addEventListener('click', openFormForNew);
  cancelBtn.addEventListener('click', closeForm);

  // --- IMAGE UPLOAD ---

  fImages.addEventListener('change', async e => {
    const files = [...e.target.files];
    for (const file of files) {
      const dataUrl = await readAsDataUrl(file);
      const compressed = await compressImage(dataUrl, 1200, 0.82);
      pendingImages.push(compressed);
    }
    fImages.value = '';
    renderImagePreviews();
  });

  function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Resize to keep localStorage from filling up. ~5MB limit per origin.
  function compressImage(dataUrl, maxDim, quality) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  function renderImagePreviews() {
    imagePreviews.innerHTML = '';
    pendingImages.forEach((src, idx) => {
      const wrap = document.createElement('div');
      wrap.className = 'preview-thumb';
      wrap.innerHTML = `
        <img src="${src}" alt="">
        <button type="button" class="preview-remove" aria-label="הסר תמונה" data-idx="${idx}">×</button>
      `;
      imagePreviews.appendChild(wrap);
    });
  }

  imagePreviews.addEventListener('click', e => {
    const btn = e.target.closest('.preview-remove');
    if (!btn) return;
    pendingImages.splice(Number(btn.dataset.idx), 1);
    renderImagePreviews();
  });

  itemForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      title: fTitle.value.trim(),
      price: Number(fPrice.value),
      category: fCategory.value,
      description: fDescription.value.trim(),
      images: pendingImages,
      sold: fSold.checked,
    };

    try {
      if (editingId) {
        Store.update(editingId, data);
      } else {
        Store.add(data);
      }
    } catch (err) {
      if (String(err).includes('Quota')) {
        alert('הזיכרון המקומי מלא. נסי להעלות פחות תמונות או למחוק פריטים ישנים.');
      } else {
        alert('שגיאה בשמירה: ' + err.message);
      }
      return;
    }

    closeForm();
    renderAdminGrid();
  });

  // --- ADMIN GRID ---

  function renderAdminGrid() {
    const items = Store.getAll();
    adminGrid.innerHTML = '';
    adminEmpty.hidden = items.length > 0;

    items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'admin-card' + (item.sold ? ' admin-card-sold' : '');
      const imgUrl = item.images && item.images[0];

      card.innerHTML = `
        <div class="admin-card-image">
          ${imgUrl
            ? `<img src="${imgUrl}" alt="">`
            : `<div class="card-placeholder">אין תמונה</div>`}
          ${item.sold ? '<span class="badge-sold">נמכר</span>' : ''}
        </div>
        <div class="admin-card-body">
          <h4>${escapeHtml(item.title)}</h4>
          <p class="muted">${escapeHtml(categoryLabel(item.category))} • ${formatPrice(item.price)}</p>
          <div class="admin-card-actions">
            <button class="btn btn-small" data-action="edit" data-id="${item.id}">עריכה</button>
            <button class="btn btn-small btn-ghost" data-action="toggle-sold" data-id="${item.id}">
              ${item.sold ? 'סמן כזמין' : 'סמן כנמכר'}
            </button>
            <button class="btn btn-small btn-danger" data-action="delete" data-id="${item.id}">מחיקה</button>
          </div>
        </div>
      `;
      adminGrid.appendChild(card);
    });
  }

  adminGrid.addEventListener('click', e => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (action === 'edit') {
      openFormForEdit(id);
    } else if (action === 'toggle-sold') {
      const item = Store.getById(id);
      Store.update(id, { sold: !item.sold });
      renderAdminGrid();
    } else if (action === 'delete') {
      if (confirm('למחוק את הפריט הזה?')) {
        Store.remove(id);
        renderAdminGrid();
      }
    }
  });

  function escapeHtml(str) {
    return String(str ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  // --- INIT ---

  populateCategories();
  if (Auth.isLoggedIn()) {
    showLoggedIn();
    renderAdminGrid();
  } else {
    showLoggedOut();
  }
})();
