/* js/i18n.js - simple i18n key->translation */
const TRANSLATIONS = {
  en: {
    featured: "Featured Listings", searchPlaceholder:"Search city, hotel, restaurant",
    filters:"Filters", applyFilters:"Apply Filters", clear:"Clear", results:"results"
  },
  hi: {
    featured: "फ़ीचर्ड लिस्टिंग्स", searchPlaceholder:"शहर, होटल, रेस्टोरेंट खोजें",
    filters:"फ़िल्टर", applyFilters:"फ़िल्टर लागू करें", clear:"साफ़ करें", results:"परिणाम"
  }
};
function applyLanguage(lang='en'){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) el.textContent = TRANSLATIONS[lang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key = el.getAttribute('data-i18n-placeholder');
    if(TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) el.placeholder = TRANSLATIONS[lang][key];
  });
}

