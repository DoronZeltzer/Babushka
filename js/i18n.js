// Lightweight i18n for Hebrew + English.
// Stores language in localStorage. Reload-on-switch for simplicity.

const LANG_KEY = 'babushka.lang.v1';

const STRINGS = {
  he: {
    // Meta / titles
    pageTitleCustomer: 'בבושקה • חנות יד שניה • רגבה',
    pageTitleAdmin:    'ניהול • בבושקה',
    pageTitleContact:  'צור קשר • בבושקה',

    // Header
    siteTitle:   'בבושקה',
    taglineHome: 'חנות יד שניה ✻ רגבה',
    taglineAdmin:'פאנל ניהול',
    navFacebook: 'פייסבוק',
    navAdmin:    'ניהול',
    navToSite:   '← לאתר',
    navLogout:   'יציאה',
    langSwitch:  'EN',

    // Hero
    heroTitle:   'חיים שניים לדברים יפים',
    heroSubtitle:'כל פריט בחנות מחכה לבית חדש. מצאו את מה שאתם אוהבים.',

    // Filters
    filterAll:   'הכל',

    // Cards / modal
    noImage:     'אין תמונה',
    soldBadge:   'נמכר',
    closeLabel:  'סגור',
    contactCta:  'צרו קשר דרך פייסבוק',
    contactSoldCta:'הפריט נמכר — צרו קשר לפריטים דומים',

    // Empty states
    emptyCustomer:'אין כרגע פריטים בקטגוריה הזו. תחזרו לבדוק בקרוב!',
    emptyAdmin:   'אין עדיין פריטים. לחצי על "פריט חדש" כדי להתחיל.',

    // Footer
    footerTagline:'בבושקה • חנות יד שניה ברגבה',
    footerFollow: 'עקבו אחרינו בפייסבוק',
    footerAdmin:  'בבושקה • פאנל ניהול',

    // Login
    loginHeading:'כניסת מנהל',
    loginIntro:  'הזיני את הסיסמה כדי לערוך את החנות.',
    loginLabel:  'סיסמה',
    loginButton: 'כניסה',
    loginError:  'סיסמה שגויה',

    // Admin panel
    myItems:     'הפריטים שלי',
    newItem:     '+ פריט חדש',
    formNewTitle:'פריט חדש',
    formEditTitle:'עריכת פריט',
    fieldTitle:  'שם הפריט *',
    fieldPrice:  'מחיר (₪) *',
    fieldCategory:'קטגוריה *',
    fieldDescription:'תיאור',
    fieldImages: 'תמונות (אפשר לבחור כמה)',
    fieldSold:   'פריט נמכר (יוצג עם תווית "נמכר")',
    save:        'שמירה',
    cancel:      'ביטול',
    edit:        'עריכה',
    markSold:    'סמן כנמכר',
    markAvailable:'סמן כזמין',
    deleteItem:  'מחיקה',
    removeImage: 'הסר תמונה',
    confirmDelete:'למחוק את הפריט הזה?',
    quotaError:  'הזיכרון המקומי מלא. נסי להעלות פחות תמונות או למחוק פריטים ישנים.',
    saveError:   'שגיאה בשמירה: ',

    // Contact page
    navContact:        'צור קשר',
    contactTitle:      'צור קשר',
    contactSubtitle:   'נשמח לראות אתכם בחנות. הנה כל הדרכים להגיע אלינו.',
    contactDetails:    'פרטי התקשרות',
    contactPhone:      'טלפון',
    contactAddress:    'כתובת',
    contactAddressLine:'רחוב ההדס, רגבה 2280400',
    contactHours:      'שעות פתיחה',
    contactWhatsapp:   'שלחו הודעה בוואטסאפ',
    contactGoogleMaps: 'פתח ב-Google Maps',
    contactWaze:       'ניווט ב-Waze',
    closed:            'סגור',
    daySunday:         'יום ראשון',
    dayMonday:         'יום שני',
    dayTuesday:        'יום שלישי',
    dayWednesday:      'יום רביעי',
    dayThursday:       'יום חמישי',
    dayFriday:         'יום שישי',
    daySaturday:       'שבת',
  },

  en: {
    pageTitleCustomer: 'Babushka • Second-Hand Shop • Regba',
    pageTitleAdmin:    'Admin • Babushka',
    pageTitleContact:  'Contact • Babushka',

    siteTitle:   'Babushka',
    taglineHome: 'Second-Hand Shop ✻ Regba',
    taglineAdmin:'Admin Panel',
    navFacebook: 'Facebook',
    navAdmin:    'Admin',
    navToSite:   'To site →',
    navLogout:   'Log out',
    langSwitch:  'עברית',

    heroTitle:   'A second life for beautiful things',
    heroSubtitle:'Every item in the shop is waiting for a new home. Find what you love.',

    filterAll:   'All',

    noImage:     'No image',
    soldBadge:   'Sold',
    closeLabel:  'Close',
    contactCta:  'Contact us on Facebook',
    contactSoldCta:'This item is sold — contact us for similar pieces',

    emptyCustomer:'No items in this category yet. Check back soon!',
    emptyAdmin:   'No items yet. Click "New item" to get started.',

    footerTagline:'Babushka • Second-hand shop in Regba',
    footerFollow: 'Follow us on Facebook',
    footerAdmin:  'Babushka • Admin Panel',

    loginHeading:'Admin Login',
    loginIntro:  'Enter the password to edit the shop.',
    loginLabel:  'Password',
    loginButton: 'Sign in',
    loginError:  'Wrong password',

    myItems:     'My items',
    newItem:     '+ New item',
    formNewTitle:'New item',
    formEditTitle:'Edit item',
    fieldTitle:  'Title *',
    fieldPrice:  'Price (₪) *',
    fieldCategory:'Category *',
    fieldDescription:'Description',
    fieldImages: 'Photos (you can pick several)',
    fieldSold:   'Mark as sold (shows a "Sold" tag)',
    save:        'Save',
    cancel:      'Cancel',
    edit:        'Edit',
    markSold:    'Mark sold',
    markAvailable:'Mark available',
    deleteItem:  'Delete',
    removeImage: 'Remove image',
    confirmDelete:'Delete this item?',
    quotaError:  'Local storage is full. Try uploading fewer photos or deleting old items.',
    saveError:   'Save error: ',

    // Contact page
    navContact:        'Contact',
    contactTitle:      'Get in touch',
    contactSubtitle:   "We'd love to see you at the shop. Here are all the ways to reach us.",
    contactDetails:    'Contact details',
    contactPhone:      'Phone',
    contactAddress:    'Address',
    contactAddressLine:'HaHadas St, Regba 2280400, Israel',
    contactHours:      'Opening hours',
    contactWhatsapp:   'Message us on WhatsApp',
    contactGoogleMaps: 'Open in Google Maps',
    contactWaze:       'Navigate with Waze',
    closed:            'Closed',
    daySunday:         'Sunday',
    dayMonday:         'Monday',
    dayTuesday:        'Tuesday',
    dayWednesday:      'Wednesday',
    dayThursday:       'Thursday',
    dayFriday:         'Friday',
    daySaturday:       'Saturday',
  },
};

const CATEGORY_LABELS = {
  furniture: { he: 'רהיטים',                en: 'Furniture' },
  clothing:  { he: 'בגדים',                 en: 'Clothing' },
  house:     { he: 'כלי בית',               en: 'Housewares' },
  decor:     { he: 'אומנות ודקורציה',       en: 'Art & Decor' },
  toys:      { he: 'צעצועים ומשחקים',       en: 'Toys & Games' },
  books:     { he: 'ספרים',                 en: 'Books' },
  jewelry:   { he: 'תכשיטים ואקססוריז',     en: 'Jewelry & Accessories' },
  other:     { he: 'שונות',                 en: 'Other' },
};

const I18n = {
  current: 'he',

  init() {
    this.current = localStorage.getItem(LANG_KEY) || 'he';
    document.documentElement.lang = this.current;
    document.documentElement.dir = this.current === 'he' ? 'rtl' : 'ltr';
  },

  set(lang) {
    if (lang !== 'he' && lang !== 'en') return;
    localStorage.setItem(LANG_KEY, lang);
    location.reload();
  },

  toggle() {
    this.set(this.current === 'he' ? 'en' : 'he');
  },

  t(key) {
    return (STRINGS[this.current] && STRINGS[this.current][key])
      ?? STRINGS.he[key]
      ?? key;
  },

  cat(id) {
    return CATEGORY_LABELS[id]?.[this.current] ?? id;
  },

  // Walks the DOM and applies translations to elements with
  //   data-i18n="key"                       (sets textContent)
  //   data-i18n-attr="attr:key;attr:key"    (sets attribute values)
  applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s.trim());
        if (attr && key) el.setAttribute(attr, this.t(key));
      });
    });
    const page = document.body.dataset.page;
    if (page === 'admin') {
      document.title = this.t('pageTitleAdmin');
    } else if (page === 'contact') {
      document.title = this.t('pageTitleContact');
    } else {
      document.title = this.t('pageTitleCustomer');
    }
  },
};

// Initialise html lang/dir as early as possible (script is loaded in <head>
// without defer, before body renders, to avoid flash of wrong direction).
I18n.init();
