// Shared data layer. Uses localStorage to persist listings and admin auth.
// Note: localStorage is per-browser, so this is a single-device demo.
// To make it a real shop, swap this file for a Firebase/Supabase backend.

const STORE_KEY = 'babushka.items.v1';
const AUTH_KEY = 'babushka.auth.v1';

// Change this password before sharing the admin URL.
const ADMIN_PASSWORD = 'babushka2026';

const CATEGORIES = [
  { id: 'furniture', label: 'רהיטים' },
  { id: 'clothing',  label: 'בגדים' },
  { id: 'house',     label: 'כלי בית' },
  { id: 'decor',     label: 'אומנות ודקורציה' },
  { id: 'toys',      label: 'צעצועים ומשחקים' },
  { id: 'books',     label: 'ספרים' },
  { id: 'jewelry',   label: 'תכשיטים ואקססוריז' },
  { id: 'other',     label: 'שונות' },
];

const SEED_ITEMS = [
  {
    id: 'seed-1',
    title: 'כורסת קטיפה וינטג\'',
    description: 'כורסה יפהפיה משנות ה-70, ריפוד קטיפה ירוקה במצב מעולה. נוחה במיוחד לפינת קריאה.',
    price: 450,
    category: 'furniture',
    sold: false,
    images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'seed-2',
    title: 'סט כוסות תה פורצלן',
    description: 'שישה כוסות תה עם תחתיות, פורצלן עדין עם ציור פרחים. מתנה מושלמת.',
    price: 120,
    category: 'house',
    sold: false,
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'seed-3',
    title: 'שמלת קיץ פרחונית',
    description: 'שמלה כותנה בהדפס פרחים, מידה M. כמעט חדשה, נלבשה פעם אחת.',
    price: 80,
    category: 'clothing',
    sold: true,
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'seed-4',
    title: 'מנורת שולחן פליז',
    description: 'מנורת שולחן עתיקה, בסיס פליז עם אהיל בד. עובדת מצוין.',
    price: 180,
    category: 'decor',
    sold: false,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'seed-5',
    title: 'אוסף ספרי שירה',
    description: 'שמונה ספרי שירה עברית קלאסית. במצב טוב מאוד, חלקם במהדורה ראשונה.',
    price: 95,
    category: 'books',
    sold: false,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80'],
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: 'seed-6',
    title: 'בובת מטריושקה מעץ',
    description: 'סט מטריושקה מסורתי מצויר ביד, 7 בובות. אספנות אמיתית.',
    price: 220,
    category: 'toys',
    sold: false,
    images: ['https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80'],
    createdAt: Date.now() - 1000 * 60 * 30,
  },
];

const Store = {
  getAll() {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw === null) {
      localStorage.setItem(STORE_KEY, JSON.stringify(SEED_ITEMS));
      return [...SEED_ITEMS];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...SEED_ITEMS];
    }
  },

  saveAll(items) {
    localStorage.setItem(STORE_KEY, JSON.stringify(items));
  },

  getById(id) {
    return this.getAll().find(item => item.id === id) || null;
  },

  add(item) {
    const items = this.getAll();
    const newItem = {
      ...item,
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      createdAt: Date.now(),
      sold: false,
    };
    items.unshift(newItem);
    this.saveAll(items);
    return newItem;
  },

  update(id, patch) {
    const items = this.getAll();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...patch };
    this.saveAll(items);
    return items[idx];
  },

  remove(id) {
    const items = this.getAll().filter(i => i.id !== id);
    this.saveAll(items);
  },

  resetToSeed() {
    localStorage.setItem(STORE_KEY, JSON.stringify(SEED_ITEMS));
  },

  exportJson() {
    return JSON.stringify(this.getAll(), null, 2);
  },
};

const Auth = {
  isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) === 'true';
  },
  login(password) {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem(AUTH_KEY);
  },
};

function categoryLabel(id) {
  const c = CATEGORIES.find(c => c.id === id);
  return c ? c.label : id;
}

function formatPrice(n) {
  return '₪' + Number(n).toLocaleString('he-IL');
}
