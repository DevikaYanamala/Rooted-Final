import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/** UI is English-only. Culture (ar/hi/pt) still drives search filters via URL — not interface language. */
const resources = {
  en: {
    translation: {
      app_name: 'Rooted',
      tagline: 'Every bite, a journey home',
      tagline_sub: 'Authentic products verified by 12,000+ diaspora members in Newcastle',
      search_placeholder: 'Search in any language…',
      search_expand_aria: 'Open search',
      search_collapse_aria: 'Close search',
      search_tap_to_edit: 'Edit',
      sort_by: 'Sort',
      sort_authentic: 'Most Authentic',
      sort_distance: 'Nearest',
      sort_price: 'Best Price',
      approved_by: '{{count}} locals approve',
      rate_authenticity: 'How does it compare to home?',
      submit: 'Submit My Rating',
      reviews: 'Community Reviews',
      distance: '{{dist}} mi',
      not_authentic: 'Not at all',
      exactly_home: 'Tastes like home',
      review_placeholder: 'Share your experience…',
      rating_submitted: 'Thank you! Your voice helps the community.',
      no_results: 'Nothing found. Try searching in your native language!',
      all_cultures: 'All cultures',
      detected_culture: 'Detected culture filter: {{culture}}',
      culture_indian: 'Indian',
      culture_arabic: 'Arabic (thyme demo)',
      culture_brazilian: 'Brazilian',
      demo_scenarios: 'Explore flavours from home',
      view_retailer: 'Buy here',
      buy_from: 'Buy from',
      results_subtitle: 'Community-verified products across UK retailers',
      results_count: 'results',
      product_details: 'Product details',
      you_label: 'You',
      review_no_text: 'Rating submitted.',
      location_set_text: 'Your location is set to Newcastle upon Tyne for this demo.',
      community_badge: 'Community verified',
      rating_prompt_high: 'Tastes like home! What makes it special?',
      rating_prompt_good: 'Almost there! What stands out?',
      rating_prompt_mid: 'Getting closer. What could be better?',
      rating_prompt_low: "Not quite right. What's different?",
      show_demos: 'Show demo shortcuts',
      hide_demos: 'Hide demo shortcuts',
      footer_line: 'Rooted · Newcastle upon Tyne · Every bite, a journey home',
      avg_rating_short: 'Community avg.',
      avg_rating_label: 'Community average',
      authenticity_score: 'Authenticity',
      badge_tastes_like_home: 'Tastes like home',
      top_pick_badge_alt: '100% authentic — top match for your search',
    },
  },
  hi: {
    translation: {
      app_name: 'रुटेड',
      tagline: 'हर बाइट, घर की एक यात्रा',
      search_placeholder: 'किसी भी भाषा में खोजें...',
      buy_from: 'यहाँ से खरीदें',
      reviews: 'समुदाय की समीक्षाएं',
      nearby_stores: 'आसपास के स्टोर से ऑर्डर करें',
      footer_line: 'रुटेड · हर बाइट, घर की एक यात्रा'
    }
  },
  ar: {
    translation: {
      app_name: 'روتيد',
      tagline: 'كل لقمة، رحلة إلى الوطن',
      search_placeholder: 'ابحث بأي لغة...',
      buy_from: 'اشتري من',
      reviews: 'آراء المجتمع',
      nearby_stores: 'اطلب من المتاجر القريبة',
      footer_line: 'روتيد · كل لقمة، رحلة إلى الوطن'
    }
  },
  es: {
    translation: {
      app_name: 'Rooted',
      tagline: 'Cada bocado, un viaje a casa',
      search_placeholder: 'Buscar en cualquier idioma...',
      buy_from: 'Comprar de',
      reviews: 'Reseñas de la comunidad',
      nearby_stores: 'Pedir en tiendas cercanas',
      footer_line: 'Rooted · Cada bocado, un viaje a casa'
    }
  },
  fr: {
    translation: {
      app_name: 'Rooted',
      tagline: 'Chaque bouchée, un voyage vers la maison',
      search_placeholder: 'Chercher dans n\'importe quelle langue...',
      buy_from: 'Acheter chez',
      reviews: 'Avis de la communauté',
      nearby_stores: 'Commander dans les magasins à proximité',
      footer_line: 'Rooted · Chaque bouchée, un voyage vers la maison'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
