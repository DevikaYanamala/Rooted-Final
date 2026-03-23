import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app_name: "Rooted",
      tagline: "Find the taste of home",
      search_placeholder: "Search in any language...",
      sort_by: "Sort by",
      sort_authentic: "Most Authentic",
      sort_distance: "Nearest",
      sort_price: "Best Price",
      approved_by: "{{count}} locals approve",
      rate_authenticity: "How authentic is this compared to home?",
      submit: "Submit Rating",
      reviews: "Reviews",
      distance: "{{dist}} mi away",
      not_authentic: "Not at all",
      exactly_home: "Exactly like home",
      review_placeholder: "Share your thoughts (optional)...",
      rating_submitted: "Thanks! Your rating updates the community score.",
      no_results: "No products found. Try searching in your native language!",
      results_for: "Results for",
      all_cultures: "Showing all cultures",
      detected_culture: "Detected: {{culture}}",
      culture_indian: "Indian",
      culture_arabic: "Arabic",
      culture_brazilian: "Brazilian",
      miles: "mi",
      back_to_search: "New search",
    }
  },
  ar: {
    translation: {
      app_name: "Rooted",
      tagline: "اعثر على طعم الوطن",
      search_placeholder: "ابحث بأي لغة...",
      sort_by: "ترتيب حسب",
      sort_authentic: "الأكثر أصالة",
      sort_distance: "الأقرب",
      sort_price: "أفضل سعر",
      approved_by: "وافق عليه {{count}} من السكان المحليين",
      rate_authenticity: "ما مدى أصالة هذا المنتج مقارنة ببلدك؟",
      submit: "إرسال التقييم",
      reviews: "التقييمات",
      distance: "على بُعد {{dist}} أميال",
      not_authentic: "ليس أصيلاً إطلاقاً",
      exactly_home: "تماماً كما في الوطن",
      review_placeholder: "شاركنا رأيك (اختياري)...",
      rating_submitted: "شكراً! تقييمك يُحدّث النتيجة المجتمعية.",
      no_results: "لم يتم العثور على منتجات. جرّب البحث بلغتك الأم!",
      results_for: "نتائج البحث عن",
      all_cultures: "عرض جميع الثقافات",
      detected_culture: "تم الكشف: {{culture}}",
      culture_indian: "هندي",
      culture_arabic: "عربي",
      culture_brazilian: "برازيلي",
      miles: "ميل",
      back_to_search: "بحث جديد",
    }
  },
  hi: {
    translation: {
      app_name: "Rooted",
      tagline: "घर का स्वाद खोजें",
      search_placeholder: "किसी भी भाषा में खोजें...",
      sort_by: "क्रमबद्ध",
      sort_authentic: "सबसे प्रामाणिक",
      sort_distance: "निकटतम",
      sort_price: "सबसे अच्छी कीमत",
      approved_by: "{{count}} स्थानीय लोग सहमत हैं",
      rate_authenticity: "यह आपके घर की तुलना में कितना प्रामाणिक है?",
      submit: "रेटिंग सबमिट करें",
      reviews: "समीक्षाएं",
      distance: "{{dist}} मील दूर",
      not_authentic: "बिल्कुल नहीं",
      exactly_home: "बिल्कुल घर जैसा",
      review_placeholder: "अपने विचार साझा करें (वैकल्पिक)...",
      rating_submitted: "धन्यवाद! आपकी रेटिंग सामुदायिक स्कोर को अपडेट करती है।",
      no_results: "कोई उत्पाद नहीं मिला। अपनी मातृभाषा में खोजें!",
      results_for: "के लिए परिणाम",
      all_cultures: "सभी संस्कृतियाँ दिखा रहे हैं",
      detected_culture: "पहचाना गया: {{culture}}",
      culture_indian: "भारतीय",
      culture_arabic: "अरबी",
      culture_brazilian: "ब्राज़ीलियन",
      miles: "मील",
      back_to_search: "नई खोज",
    }
  },
  pt: {
    translation: {
      app_name: "Rooted",
      tagline: "Encontre o gosto de casa",
      search_placeholder: "Pesquise em qualquer idioma...",
      sort_by: "Ordenar por",
      sort_authentic: "Mais Autêntico",
      sort_distance: "Mais Próximo",
      sort_price: "Melhor Preço",
      approved_by: "{{count}} locais aprovam",
      rate_authenticity: "Quão autêntico é isso comparado à sua terra?",
      submit: "Enviar Avaliação",
      reviews: "Avaliações",
      distance: "A {{dist}} milhas",
      not_authentic: "Nada autêntico",
      exactly_home: "Igualzinho de casa",
      review_placeholder: "Compartilhe sua opinião (opcional)...",
      rating_submitted: "Obrigado! Sua avaliação atualiza a nota da comunidade.",
      no_results: "Nenhum produto encontrado. Tente pesquisar na sua língua nativa!",
      results_for: "Resultados para",
      all_cultures: "Mostrando todas as culturas",
      detected_culture: "Detectado: {{culture}}",
      culture_indian: "Indiano",
      culture_arabic: "Árabe",
      culture_brazilian: "Brasileiro",
      miles: "mi",
      back_to_search: "Nova pesquisa",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
