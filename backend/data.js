export const DEMO_SCENARIOS = [
  { id: 'hi', query: 'मसाला', label: 'Indian' },
  { id: 'ar', query: 'زعتر', label: 'Arabic' },
  { id: 'pt', query: 'café', label: 'Brazilian' },
];

const L = (d) => `https://www.google.com/s2/favicons?domain=${d}&sz=64`;

/** Favicons for retailer product links (Google s2). */
const LOGOS = {
  tesco: L('tesco.com'),
  sainsburys: L('sainsburys.co.uk'),
  asda: L('asda.com'),
  aldi: L('aldi.co.uk'),
  lidl: L('lidl.co.uk'),
  morrisons: L('morrisons.com'),
  waitrose: L('waitrose.com'),
  amazon: L('amazon.co.uk'),
  ocado: L('ocado.com'),
  buywholefoods: L('buywholefoodsonline.co.uk'),
  bulkbuydirect: L('bulkbuydirect.co.uk'),
  spicentice: L('spicentice.com'),
  wholefoodearth: L('wholefoodearth.com'),
  busybeans: L('busybeansfoods.com'),
};

const hiR1 = [
  { author: 'Priya S.', rating: 9.5, text: 'बिल्कुल घर जैसा मसाला! Same blend my mum uses in Mumbai.' },
  { author: 'Arjun K.', rating: 9, text: 'Best garam masala in Newcastle — my dal finally tastes right.' },
  { author: 'Meera R.', rating: 8.5, text: 'Aroma is spot on. Fair price for real मसाला.' },
];
const hiR2 = [
  { author: 'Raj P.', rating: 9, text: 'घर की याद! This tikka masala paste is the real deal.' },
  { author: 'Ananya D.', rating: 9.5, text: 'Finally found authentic taste in the UK. Highly recommend!' },
  { author: 'Vikram S.', rating: 8, text: 'Very close to what we get at home — good मसाला base.' },
];
const hiR3 = [
  { author: 'Deepa M.', rating: 8.5, text: 'बहुत अच्छा biryani मसाला. Kids loved the flavour.' },
  { author: 'Sanjay T.', rating: 9, text: "Can't believe I found this शान mix in Newcastle!" },
  { author: 'Kavita R.', rating: 9.2, text: 'Authentic quality. Will buy this मसाला again.' },
];

const arR1 = [
  { author: 'Fatima A.', rating: 9, text: 'طعم زعتر أصيل! Reminds me of manakish in Beirut.' },
  { author: 'Omar H.', rating: 9.5, text: 'Finally authentic زعتر in Newcastle. الحمد لله' },
  { author: 'Layla M.', rating: 8.5, text: 'Just like home — sesame and sumac balance is perfect.' },
];
const arR2 = [
  { author: 'Ahmed K.', rating: 9.5, text: 'ممتاز! Exactly the زعتر quality I was looking for.' },
  { author: 'Sara N.', rating: 9, text: 'My family approved — tastes like Amman bakery زعتر.' },
  { author: 'Hassan B.', rating: 8, text: 'Good blend. Brings back breakfast زعتر memories.' },
];
const arR3 = [
  { author: 'Noor S.', rating: 8.5, text: 'كأنك في البيت! Lovely wild thyme زعتر mix.' },
  { author: 'Khalid R.', rating: 9, text: 'Authentic زعتر at a fair price for the UK.' },
  { author: 'Amira F.', rating: 9.2, text: 'My go-to زعتر for manakish. Never disappoints.' },
];

const ptR1 = [
  { author: 'Julia F.', rating: 9, text: 'Café Pilão que lembra a padaria em SP. Perfeito!' },
  { author: 'Rafael S.', rating: 9.5, text: 'Melhor café brasileiro que encontrei no UK!' },
  { author: 'Camila M.', rating: 8.5, text: 'Cafezinho forte do jeito certo — adorei o aroma.' },
];
const ptR2 = [
  { author: 'Lucas O.', rating: 9, text: 'Sabor de casa! 3 Corações com leite é tradição.' },
  { author: 'Fernanda C.', rating: 9.5, text: 'Finally real Brazilian café torrado in Newcastle!' },
  { author: 'Thiago P.', rating: 8, text: 'Very close to the café we drink back in Curitiba.' },
];
const ptR3 = [
  { author: 'Ana L.', rating: 8.5, text: 'Café orgânico suave — ótimo para coado.' },
  { author: 'Pedro H.', rating: 9, text: 'Extra forte como eu gosto. Authentic Brazilian roast.' },
  { author: 'Isabela R.', rating: 9.2, text: 'Worth every penny. Tastes like Rio café da manhã.' },
];

/**
 * Pack photography: Amazon UK `m.media-amazon.com` SL1500 assets (white-background PDP shots) where we
 * matched the named SKU; plus Ocado / Shopify / BWFO CDNs where those listings are authoritative.
 * <img referrerPolicy="no-referrer" /> helps some hosts (see ProductCard).
 */
const LISTING_IMAGE_BY_ID = {
  // Indian — masala (Amazon UK listing art matched to each product name)
  1: 'https://m.media-amazon.com/images/I/71kkPmNgxcL._AC_SL1500_.jpg',
  2: 'https://m.media-amazon.com/images/I/81OeFupXdRL._AC_SL1500_.jpg',
  3: 'https://m.media-amazon.com/images/I/91rr7BF1gaL._AC_SL1500_.jpg',
  4: 'https://m.media-amazon.com/images/I/71kwAEGWSLL._AC_SL1500_.jpg',
  5: 'https://m.media-amazon.com/images/I/61HHTW1IDSL._AC_SL1500_.jpg',
  6: 'https://m.media-amazon.com/images/I/81yCd3raIML._AC_SL1500_.jpg',
  7: 'https://m.media-amazon.com/images/I/71cA6DSnM6L._AC_SL1500_.jpg',
  8: 'https://m.media-amazon.com/images/I/71s-BPkzZQL._AC_SL1500_.jpg',
  9: 'https://m.media-amazon.com/images/I/91BEryAHDHL._AC_SL1500_.jpg',
  10: 'https://m.media-amazon.com/images/I/51j-RjGG2GL._AC_SL1500_.jpg',
  11: 'https://m.media-amazon.com/images/I/71v5XlcatTL._AC_SL1500_.jpg',
  12: 'https://m.media-amazon.com/images/I/81iUMCDYbQL._AC_SL1500_.jpg',
  13: 'https://m.media-amazon.com/images/I/81ojhQhWbUL._AC_SL1500_.jpg',
  14: 'https://onlinemeatshop.com/cdn/shop/files/RAJMAH_1-612946.jpg?v=1729217738',
  15: 'https://m.media-amazon.com/images/I/615DfvjS7DL._AC_SL1500_.jpg',
  16: 'https://m.media-amazon.com/images/I/81ME49HHq9L._AC_SL1500_.jpg',
  17: 'https://m.media-amazon.com/images/I/91uz-cCmrXL._AC_SL1500_.jpg',

  // Arabic — thyme (your retailer links; Tesco/Sainsbury’s/Waitrose CDNs block many clients — Amazon/ocado/shopify mirrors)
  18: 'https://www.ocado.com/images-v3/eafa5127-d256-497b-9609-4869092accd6/4e7ec111-d892-4963-a7c2-29c2f9e29b9f/800x800.jpg',
  19: 'https://m.media-amazon.com/images/I/71+pOImISwL._AC_SL1500_.jpg',
  20: 'https://digitalcontent.api.tesco.com/v2/media/ghs/6000c92a-7308-42ce-ab8a-0ae46816976f/683612d8-5da0-44e8-bcdf-0cb786c205f4.jpeg?h=960&w=960',
  21: 'https://d1w45f4n3fpfve.cloudfront.net/media/catalog/product/t/h/thyme_1.png?d=430x430',
  22: 'https://m.media-amazon.com/images/I/71+SFPDkmML._AC_SL1500_.jpg',
  23: 'https://ecom-su-static-prod.wtrecom.com/images/products/11/LN_082745_BP_11.jpg',
  24: 'https://m.media-amazon.com/images/I/81WmySknzML._AC_SL1500_.jpg',
  25: 'https://bulkbuydirect.co.uk/cdn/shop/files/chef-s-larder-herbs-seeds-default-title-chef-s-larder-thyme-200g-pack-of-1-63021270466946.jpg?v=1769036855',
  26: 'https://m.media-amazon.com/images/I/61V4KDGsOjL._AC_SL1500_.jpg',
  27: 'https://www.spicentice.com/cdn/shop/files/SQ_Thyme_Dried_Pouch_200g_1200x1200.jpg?v=1747318787',
  28: 'https://m.media-amazon.com/images/I/61iHE+ELH3L._AC_SL1500_.jpg',
  29: 'https://cdn.shopify.com/s/files/1/0027/6008/1477/files/ffb7f39b-900b-4f9a-98f6-1e5fb541a504.webp?v=1751037115',
  30: 'https://www.busybeansfoods.com/cdn/shop/files/Organic_Thyme_0733e93e-3325-43aa-bb27-53225ad3d807.jpg?crop=center&height=1200&v=1750248533&width=1200',

  // Brazilian — café (Amazon UK PDP art; rare UK listings use closest clean pack match)
  31: 'https://m.media-amazon.com/images/I/61gG43l5M8L._AC_SL1500_.jpg',
  32: 'https://m.media-amazon.com/images/I/61k8aYR8kpL._AC_SL1500_.jpg',
  33: 'https://m.media-amazon.com/images/I/71OWCz3D0fL._AC_SL1500_.jpg',
  34: 'https://m.media-amazon.com/images/I/51ceVlfEdgL._SS400_.jpg',
  35: 'https://m.media-amazon.com/images/I/71oTA3i1Y6L._AC_SL1500_.jpg',
  // Caboclo / Pelé / Santa Clara: UK search often surfaces wrong ASINs; these P-images use US/legacy catalogue ASINs (swap if pack looks off).
  36: 'https://brazuka.co.uk/cdn/shop/files/Cafe-Tradicional-Caboclo-250g.jpg?v=1693946120',
  37: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6fmiejiqwq884',
  38: 'https://images-na.ssl-images-amazon.com/images/I/61aW-JIe3nL._AC_UL495_SR435,495_.jpg',
  39: 'https://m.media-amazon.com/images/I/71vBonbU52L._AC_SL1500_.jpg',
  40: 'https://m.media-amazon.com/images/I/71sJX-2sfIL._AC_SL1500_.jpg',
  41: 'https://m.media-amazon.com/images/I/71-mXXKwhLL._AC_SL1500_.jpg',
  42: 'https://m.media-amazon.com/images/I/91a9z11ks+L._AC_SL1500_.jpg',
  43: 'https://m.media-amazon.com/images/I/616C5gFcvnL._AC_SL1500_.jpg',
  44: 'https://m.media-amazon.com/images/I/71-SvfLZ6NL._AC_SL1500_.jpg',
  45: 'https://m.media-amazon.com/images/I/71vQyKCI52L._AC_SL1500_.jpg',
  46: 'https://m.media-amazon.com/images/I/713YqDqTmfL._AC_SL1500_.jpg',
};

function productImageById(productId) {
  return LISTING_IMAGE_BY_ID[productId];
}

export const productsData = [
  // ── Indian — मसाला / spice blends (17) ───────────────────────────
  { id: 1, name: 'MDH Garam Masala 100g', nativeDesc: 'असली गरम मसाला', img: productImageById(1), culture: 'hi', score_authenticity: 9.7, score_distance: 0.8, score_price: 2.79, store: 'Tesco Extra, Kingston Park', location: 'Newcastle upon Tyne', retailerName: 'Tesco', retailerUrl: 'https://www.tesco.com/', retailerLogo: LOGOS.tesco, productUrl: 'https://www.tesco.com/groceries/en-GB/search?query=mdh+garam+masala', tags: ['Indian', 'Masala', 'Spice'], reviews: 642, keywords: ['masala', 'garam', 'spice', 'मसाला', 'mdh', 'powder', 'blend'], reviewSamples: hiR1 },
  { id: 2, name: "Patak's Tikka Masala Paste 283g", nativeDesc: 'टिक्का मसाला पेस्ट', img: productImageById(2), culture: 'hi', score_authenticity: 9.2, score_distance: 1.1, score_price: 2.19, store: "Sainsbury's, Newcastle", location: 'Newcastle upon Tyne', retailerName: "Sainsbury's", retailerUrl: 'https://www.sainsburys.co.uk/', retailerLogo: LOGOS.sainsburys, productUrl: 'https://www.sainsburys.co.uk/gol-ui/SearchResults/pataks+tikka', tags: ['Indian', 'Masala', 'Paste'], reviews: 421, keywords: ['tikka', 'masala', 'paste', 'pataks', 'टिक्का', 'मसाला', 'curry'], reviewSamples: hiR2 },
  { id: 3, name: 'Shan Biryani Masala 60g', nativeDesc: 'बिरयानी मसाला', img: productImageById(3), culture: 'hi', score_authenticity: 9.3, score_distance: 3.5, score_price: 2.49, store: "Sainsbury's, Newcastle", location: 'Newcastle upon Tyne', retailerName: "Sainsbury's", retailerUrl: 'https://www.sainsburys.co.uk/', retailerLogo: LOGOS.sainsburys, productUrl: 'https://www.sainsburys.co.uk/gol-ui/SearchResults/shan+biryani+masala', tags: ['Indian', 'Masala', 'Biryani'], reviews: 197, keywords: ['biryani', 'masala', 'shan', 'शान', 'बिरयानी', 'मसाला', 'rice'], reviewSamples: hiR3 },
  { id: 4, name: 'Everest Chaat Masala 100g', nativeDesc: 'चाट मसाला — खट्टा मीठा', img: productImageById(4), culture: 'hi', score_authenticity: 9.1, score_distance: 1.6, score_price: 2.29, store: "Sainsbury's, Newcastle", location: 'Newcastle upon Tyne', retailerName: "Sainsbury's", retailerUrl: 'https://www.sainsburys.co.uk/', retailerLogo: LOGOS.sainsburys, productUrl: 'https://www.sainsburys.co.uk/gol-ui/SearchResults/chaat+masala', tags: ['Indian', 'Masala', 'Street food'], reviews: 189, keywords: ['chaat', 'masala', 'चाट', 'मसाला', 'everest', 'snack'], reviewSamples: hiR1 },
  { id: 5, name: 'MDH Chana Masala 100g', nativeDesc: 'छोले मसाला', img: productImageById(5), culture: 'hi', score_authenticity: 9.4, score_distance: 0.9, score_price: 2.59, store: 'ASDA Superstore, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'ASDA', retailerUrl: 'https://groceries.asda.com/', retailerLogo: LOGOS.asda, productUrl: 'https://groceries.asda.com/search/chana+masala', tags: ['Indian', 'Masala', 'Legume'], reviews: 312, keywords: ['chana', 'masala', 'chole', 'मसाला', 'mdh', 'chickpea'], reviewSamples: hiR2 },
  { id: 6, name: 'Shan Tandoori Masala 50g', nativeDesc: 'तंदूरी मसाला', img: productImageById(6), culture: 'hi', score_authenticity: 9.0, score_distance: 2.2, score_price: 1.99, store: 'Morrisons, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Morrisons', retailerUrl: 'https://groceries.morrisons.com/', retailerLogo: LOGOS.morrisons, productUrl: 'https://groceries.morrisons.com/search?q=tandoori+masala', tags: ['Indian', 'Masala', 'Grill'], reviews: 256, keywords: ['tandoori', 'masala', 'तंदूरी', 'मसाला', 'chicken', 'shan'], reviewSamples: hiR3 },
  { id: 7, name: 'Rajah Madras Curry Powder 100g', nativeDesc: 'मद्रास करी पाउडर', img: productImageById(7), culture: 'hi', score_authenticity: 8.9, score_distance: 1.3, score_price: 2.15, store: 'Tesco Extra, Kingston Park', location: 'Newcastle upon Tyne', retailerName: 'Tesco', retailerUrl: 'https://www.tesco.com/', retailerLogo: LOGOS.tesco, productUrl: 'https://www.tesco.com/groceries/en-GB/search?query=rajah+madras', tags: ['Indian', 'Masala', 'Curry'], reviews: 178, keywords: ['madras', 'curry', 'powder', 'masala', 'मसाला', 'rajah'], reviewSamples: hiR1 },
  { id: 8, name: 'MDH Kitchen King 100g', nativeDesc: 'किचन किंग मसाला', img: productImageById(8), culture: 'hi', score_authenticity: 9.2, score_distance: 1.8, score_price: 2.69, store: 'Lidl, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Lidl', retailerUrl: 'https://www.lidl.co.uk/', retailerLogo: LOGOS.lidl, productUrl: 'https://www.lidl.co.uk/', tags: ['Indian', 'Masala', 'All-purpose'], reviews: 334, keywords: ['kitchen king', 'masala', 'मसाला', 'mdh', 'mixed'], reviewSamples: hiR2 },
  { id: 9, name: "Patak's Jalfrezi Masala Paste", nativeDesc: 'जलफ़्रेज़ी मसाला', img: productImageById(9), culture: 'hi', score_authenticity: 9.1, score_distance: 1.0, score_price: 2.09, store: 'Aldi, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Aldi', retailerUrl: 'https://www.aldi.co.uk/', retailerLogo: LOGOS.aldi, productUrl: 'https://www.aldi.co.uk/', tags: ['Indian', 'Masala', 'Paste'], reviews: 205, keywords: ['jalfrezi', 'masala', 'paste', 'pataks', 'मसाला', 'curry'], reviewSamples: hiR3 },
  { id: 10, name: 'Badshah Pav Bhaji Masala 100g', nativeDesc: 'पाव भाजी मसाला', img: productImageById(10), culture: 'hi', score_authenticity: 9.3, score_distance: 2.4, score_price: 2.39, store: 'Waitrose, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Waitrose', retailerUrl: 'https://www.waitrose.com/', retailerLogo: LOGOS.waitrose, productUrl: 'https://www.waitrose.com/ecom/shop/search?searchTerm=pav+bhaji+masala', tags: ['Indian', 'Masala', 'Street food'], reviews: 142, keywords: ['pav bhaji', 'masala', 'badshah', 'मसाला', 'mumbai'], reviewSamples: hiR1 },
  { id: 11, name: 'MDH Sambar Masala 100g', nativeDesc: 'संबर मसाला', img: productImageById(11), culture: 'hi', score_authenticity: 9.0, score_distance: 1.5, score_price: 2.49, store: 'Waitrose, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Waitrose', retailerUrl: 'https://www.waitrose.com/', retailerLogo: LOGOS.waitrose, productUrl: 'https://www.waitrose.com/ecom/shop/search?searchTerm=sambar+masala', tags: ['Indian', 'Masala', 'South Indian'], reviews: 167, keywords: ['sambar', 'masala', 'संबर', 'मसाला', 'mdh', 'lentil'], reviewSamples: hiR2 },
  { id: 12, name: 'Shan Karahi Masala 50g', nativeDesc: 'कढ़ाई मसाला', img: productImageById(12), culture: 'hi', score_authenticity: 8.9, score_distance: 3.2, score_price: 1.89, store: 'Morrisons, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Morrisons', retailerUrl: 'https://groceries.morrisons.com/', retailerLogo: LOGOS.morrisons, productUrl: 'https://groceries.morrisons.com/search?q=shan+karahi+masala', tags: ['Indian', 'Masala', 'Karahi'], reviews: 121, keywords: ['karahi', 'kadai', 'masala', 'कढ़ाई', 'मसाला', 'shan'], reviewSamples: hiR3 },
  { id: 13, name: 'Everest Meat Masala 100g', nativeDesc: 'मीट मसाला', img: productImageById(13), culture: 'hi', score_authenticity: 9.1, score_distance: 1.2, score_price: 2.55, store: 'ASDA Superstore, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'ASDA', retailerUrl: 'https://groceries.asda.com/', retailerLogo: LOGOS.asda, productUrl: 'https://groceries.asda.com/search/meat+masala', tags: ['Indian', 'Masala', 'Meat'], reviews: 198, keywords: ['meat', 'masala', 'मसाला', 'everest', 'curry'], reviewSamples: hiR1 },
  { id: 14, name: 'MDH Rajma Masala 100g', nativeDesc: 'राजमा मसाला', img: productImageById(14), culture: 'hi', score_authenticity: 9.2, score_distance: 0.8, score_price: 2.59, store: 'Tesco Extra, Kingston Park', location: 'Newcastle upon Tyne', retailerName: 'Tesco', retailerUrl: 'https://www.tesco.com/', retailerLogo: LOGOS.tesco, productUrl: 'https://www.tesco.com/groceries/en-GB/search?query=rajma+masala', tags: ['Indian', 'Masala', 'Beans'], reviews: 276, keywords: ['rajma', 'masala', 'राजमा', 'मसाला', 'kidney bean'], reviewSamples: hiR2 },
  { id: 15, name: 'Eastern Fish Masala 100g', nativeDesc: 'फिश मसाला', img: productImageById(15), culture: 'hi', score_authenticity: 8.8, score_distance: 2.0, score_price: 2.19, store: 'Morrisons, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Morrisons', retailerUrl: 'https://groceries.morrisons.com/', retailerLogo: LOGOS.morrisons, productUrl: 'https://groceries.morrisons.com/search?q=fish+masala', tags: ['Indian', 'Masala', 'Seafood'], reviews: 134, keywords: ['fish', 'masala', 'मसाला', 'eastern', 'seafood'], reviewSamples: hiR3 },
  { id: 16, name: 'Everest Shahi Paneer Masala 100g', nativeDesc: 'शाही पनीर मसाला', img: productImageById(16), culture: 'hi', score_authenticity: 9.0, score_distance: 1.4, score_price: 2.45, store: "Sainsbury's, Newcastle", location: 'Newcastle upon Tyne', retailerName: "Sainsbury's", retailerUrl: 'https://www.sainsburys.co.uk/', retailerLogo: LOGOS.sainsburys, productUrl: 'https://www.sainsburys.co.uk/gol-ui/SearchResults/shahi+paneer', tags: ['Indian', 'Masala', 'Creamy'], reviews: 223, keywords: ['shahi', 'paneer', 'masala', 'मसाला', 'cream', 'everest'], reviewSamples: hiR1 },
  { id: 17, name: 'Ramdev Garam Masala 200g', nativeDesc: 'रामदेव गरम मसाला', img: productImageById(17), culture: 'hi', score_authenticity: 8.9, score_distance: 2.8, score_price: 3.99, store: 'Amazon.co.uk (delivery)', location: 'Newcastle upon Tyne', retailerName: 'Amazon', retailerUrl: 'https://www.amazon.co.uk/', retailerLogo: LOGOS.amazon, productUrl: 'https://www.amazon.co.uk/s?k=ramdev+garam+masala', tags: ['Indian', 'Masala', 'Bulk'], reviews: 156, keywords: ['ramdev', 'garam', 'masala', 'मसाला', 'bulk'], reviewSamples: hiR2 },

  // ── Arabic — زعتر demo: 13 UK listings (curator notes live in productUrl / keywords, not UI copy) ──
  { id: 18, name: 'Schwartz Thyme Jar (Ocado)', img: productImageById(18), culture: 'ar', score_authenticity: 9.31, score_distance: 1.5, score_price: 2.2, store: 'Ocado (delivery)', location: 'Newcastle upon Tyne', retailerName: 'Ocado', retailerUrl: 'https://www.ocado.com/', retailerLogo: LOGOS.ocado, productUrl: 'https://www.ocado.com/products/schwartz-thyme-jar/316758011', tags: ['Arabic', 'Thyme', 'Jar'], reviews: 312, keywords: ['thyme', 'زعتر', 'schwartz', 'jar', 'dried', 'ocado'], reviewSamples: arR1 },
  { id: 19, name: 'Gorilla Food Co Thyme Dried (Amazon)', img: productImageById(19), culture: 'ar', score_authenticity: 9.29, score_distance: 0.5, score_price: 4.95, store: 'Amazon.co.uk (delivery)', location: 'Newcastle upon Tyne', retailerName: 'Amazon', retailerUrl: 'https://www.amazon.co.uk/', retailerLogo: LOGOS.amazon, productUrl: 'https://www.amazon.co.uk/Gorilla-Food-Co-Thyme-Dried/dp/B0FTN8SBNC', tags: ['Arabic', 'Thyme', 'Dried'], reviews: 156, keywords: ['thyme', 'زعتر', 'gorilla', 'dried', 'amazon'], reviewSamples: arR2 },
  { id: 20, name: 'Tesco Thyme 20g (fresh)', img: productImageById(20), culture: 'ar', score_authenticity: 9.27, score_distance: 1.2, score_price: 0.52, store: 'Tesco Extra, Kingston Park', location: 'Newcastle upon Tyne', retailerName: 'Tesco', retailerUrl: 'https://www.tesco.com/', retailerLogo: LOGOS.tesco, productUrl: 'https://www.tesco.com/groceries/en-GB/products/304785930', tags: ['Arabic', 'Thyme', 'Fresh'], reviews: 428, keywords: ['thyme', 'زعتر', 'tesco', '20g', 'fresh', 'bunched'], reviewSamples: arR3 },
  { id: 21, name: 'Thyme — Buy Whole Foods Online', img: productImageById(21), culture: 'ar', score_authenticity: 9.25, score_distance: 2.4, score_price: 3.6, store: 'Buy Whole Foods Online (delivery)', location: 'Newcastle upon Tyne', retailerName: 'Buy Whole Foods Online', retailerUrl: 'https://www.buywholefoodsonline.co.uk/', retailerLogo: LOGOS.buywholefoods, productUrl: 'https://www.buywholefoodsonline.co.uk/thyme.html?sku=SKU182546', tags: ['Arabic', 'Thyme', 'Bulk'], reviews: 201, keywords: ['thyme', 'زعتر', 'buy whole foods online', 'bulk', 'dried'], reviewSamples: arR1 },
  { id: 22, name: 'Thyme Leaves Organic — Sussex Wholefoods (Amazon)', img: productImageById(22), culture: 'ar', score_authenticity: 9.23, score_distance: 0.6, score_price: 5.49, store: 'Amazon.co.uk (delivery)', location: 'Newcastle upon Tyne', retailerName: 'Amazon', retailerUrl: 'https://www.amazon.co.uk/', retailerLogo: LOGOS.amazon, productUrl: 'https://www.amazon.co.uk/Thyme-Leaves-Organic-Sussex-Wholefoods/dp/B07FJY1W73', tags: ['Arabic', 'Thyme', 'Organic'], reviews: 243, keywords: ['thyme', 'زعتر', 'organic', 'sussex wholefoods', 'amazon'], reviewSamples: arR2 },
  { id: 23, name: "Waitrose Cooks' Ingredients Pot Thyme", img: productImageById(23), culture: 'ar', score_authenticity: 9.21, score_distance: 1.7, score_price: 2.5, store: 'Waitrose, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Waitrose', retailerUrl: 'https://www.waitrose.com/', retailerLogo: LOGOS.waitrose, productUrl: 'https://www.waitrose.com/ecom/products/cooks-ingredients-pot-thyme/082745-42075-42076', tags: ['Arabic', 'Thyme', 'Fresh pot'], reviews: 178, keywords: ['thyme', 'زعتر', 'waitrose', 'pot', 'fresh', 'cooks ingredients'], reviewSamples: arR3 },
  { id: 24, name: "Sainsbury's Bunched Thyme 20g", img: productImageById(24), culture: 'ar', score_authenticity: 9.19, score_distance: 1.0, score_price: 1.1, store: "Sainsbury's, Newcastle", location: 'Newcastle upon Tyne', retailerName: "Sainsbury's", retailerUrl: 'https://www.sainsburys.co.uk/', retailerLogo: LOGOS.sainsburys, productUrl: 'https://www.sainsburys.co.uk/gol-ui/product/sainsburys-bunched-thyme-20g?productId=1192706', tags: ['Arabic', 'Thyme', 'Fresh'], reviews: 267, keywords: ['thyme', 'زعتر', 'sainsburys', 'bunched', 'fresh'], reviewSamples: arR1 },
  { id: 25, name: "Chef's Larder Thyme 200g (Pack of 1) — Bulk Buy Direct", img: productImageById(25), culture: 'ar', score_authenticity: 9.17, score_distance: 2.8, score_price: 4.99, store: 'Bulk Buy Direct (delivery)', location: 'Newcastle upon Tyne', retailerName: 'Bulk Buy Direct', retailerUrl: 'https://bulkbuydirect.co.uk/', retailerLogo: LOGOS.bulkbuydirect, productUrl: 'https://bulkbuydirect.co.uk/products/chefs-larder-thyme-200g-pack-of-1', tags: ['Arabic', 'Thyme', 'Bulk'], reviews: 89, keywords: ['thyme', 'زعتر', 'chefs larder', 'bulk', '200g'], reviewSamples: arR2 },
  { id: 26, name: "Sainsbury's Thyme 12g", img: productImageById(26), culture: 'ar', score_authenticity: 9.15, score_distance: 1.0, score_price: 0.78, store: "Sainsbury's, Newcastle", location: 'Newcastle upon Tyne', retailerName: "Sainsbury's", retailerUrl: 'https://www.sainsburys.co.uk/', retailerLogo: LOGOS.sainsburys, productUrl: 'https://www.sainsburys.co.uk/gol-ui/product/sainsburys-thyme-12g?productId=970886', tags: ['Arabic', 'Thyme', 'Dried'], reviews: 334, keywords: ['thyme', 'زعتر', 'sainsburys', '12g', 'dried'], reviewSamples: arR3 },
  { id: 27, name: 'Spicentice Premium Dried Thyme Leaves — 100g', img: productImageById(27), culture: 'ar', score_authenticity: 9.13, score_distance: 2.2, score_price: 3.49, store: 'Spicentice (delivery)', location: 'Newcastle upon Tyne', retailerName: 'Spicentice', retailerUrl: 'https://www.spicentice.com/', retailerLogo: LOGOS.spicentice, productUrl: 'https://www.spicentice.com/products/premium-dried-thyme-bulk-sizes-100g-1kg-pure-uk-supplier', tags: ['Arabic', 'Thyme', 'Bulk'], reviews: 412, keywords: ['thyme', 'زعتر', 'spicentice', 'premium', '100g', 'dried leaves'], reviewSamples: arR1 },
  { id: 28, name: 'Chopped Dried Thyme 100g — Selected (Amazon)', img: productImageById(28), culture: 'ar', score_authenticity: 9.11, score_distance: 0.5, score_price: 4.25, store: 'Amazon.co.uk (delivery)', location: 'Newcastle upon Tyne', retailerName: 'Amazon', retailerUrl: 'https://www.amazon.co.uk/', retailerLogo: LOGOS.amazon, productUrl: 'https://www.amazon.co.uk/Chopped-Dried-Thyme-100g-Selected/dp/B09B3W2KVX', tags: ['Arabic', 'Thyme', 'Chopped'], reviews: 198, keywords: ['thyme', 'زعتر', 'chopped', 'dried', '100g', 'amazon', 'selected'], reviewSamples: arR2 },
  { id: 29, name: 'Organic Thyme — Wholefood Earth', img: productImageById(29), culture: 'ar', score_authenticity: 9.09, score_distance: 2.6, score_price: 6.23, store: 'Wholefood Earth (delivery)', location: 'Newcastle upon Tyne', retailerName: 'Wholefood Earth', retailerUrl: 'https://wholefoodearth.com/', retailerLogo: LOGOS.wholefoodearth, productUrl: 'https://wholefoodearth.com/p/organic-thyme', tags: ['Arabic', 'Thyme', 'Organic'], reviews: 167, keywords: ['thyme', 'زعتر', 'organic', 'wholefood earth'], reviewSamples: arR3 },
  { id: 30, name: 'Organic Thyme — Busy Beans Organic', img: productImageById(30), culture: 'ar', score_authenticity: 9.07, score_distance: 2.5, score_price: 1.88, store: 'Busy Beans Organic (delivery)', location: 'Newcastle upon Tyne', retailerName: 'Busy Beans Organic', retailerUrl: 'https://busybeansfoods.com/', retailerLogo: LOGOS.busybeans, productUrl: 'https://busybeansfoods.com/products/organic-thyme', tags: ['Arabic', 'Thyme', 'Organic'], reviews: 124, keywords: ['thyme', 'زعتر', 'organic', 'busy beans'], reviewSamples: arR1 },

  // ── Brazilian — café / coffee (16) ───────────────────────────────
  { id: 31, name: 'Café Pilão 500g', nativeDesc: 'Café torrado e moído Pilão', img: productImageById(31), culture: 'pt', score_authenticity: 9.2, score_distance: 3.5, score_price: 5.95, store: 'Tesco Extra, Kingston Park', location: 'Newcastle upon Tyne', retailerName: 'Tesco', retailerUrl: 'https://www.tesco.com/', retailerLogo: LOGOS.tesco, productUrl: 'https://www.tesco.com/groceries/en-GB/search?query=pilao+coffee', tags: ['Brazilian', 'Coffee', 'Ground'], reviews: 324, keywords: ['cafe', 'café', 'coffee', 'pilao', 'pilão', 'torrado', 'brasileiro'], reviewSamples: ptR1 },
  { id: 32, name: '3 Corações Tradicional 500g', nativeDesc: 'Café 3 Corações tradicional', img: productImageById(32), culture: 'pt', score_authenticity: 9.0, score_distance: 2.1, score_price: 5.49, store: 'ASDA Superstore, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'ASDA', retailerUrl: 'https://groceries.asda.com/', retailerLogo: LOGOS.asda, productUrl: 'https://groceries.asda.com/search/3+coracoes+coffee', tags: ['Brazilian', 'Coffee', 'Ground'], reviews: 287, keywords: ['cafe', 'café', 'coffee', '3 corações', 'tradicional', 'brasileiro'], reviewSamples: ptR2 },
  { id: 33, name: 'Café do Ponto 250g', nativeDesc: 'Café do Ponto moído', img: productImageById(33), culture: 'pt', score_authenticity: 8.9, score_distance: 1.5, score_price: 4.25, store: 'Tesco Extra, Kingston Park', location: 'Newcastle upon Tyne', retailerName: 'Tesco', retailerUrl: 'https://www.tesco.com/', retailerLogo: LOGOS.tesco, productUrl: 'https://www.tesco.com/groceries/en-GB/search?query=cafe+do+ponto', tags: ['Brazilian', 'Coffee', 'Ground'], reviews: 198, keywords: ['cafe', 'café', 'coffee', 'ponto', 'moído', 'brasileiro'], reviewSamples: ptR3 },
  { id: 34, name: 'Melitta Torrado Médio 500g', nativeDesc: 'Café Melitta torra média', img: productImageById(34), culture: 'pt', score_authenticity: 8.8, score_distance: 1.9, score_price: 5.2, store: "Sainsbury's, Newcastle", location: 'Newcastle upon Tyne', retailerName: "Sainsbury's", retailerUrl: 'https://www.sainsburys.co.uk/', retailerLogo: LOGOS.sainsburys, productUrl: 'https://www.sainsburys.co.uk/gol-ui/SearchResults/brazilian+coffee', tags: ['Brazilian', 'Coffee', 'Ground'], reviews: 176, keywords: ['cafe', 'café', 'coffee', 'melitta', 'torrado', 'brasileiro'], reviewSamples: ptR1 },
  { id: 35, name: 'Café Iguaçu Extra Forte 500g', nativeDesc: 'Café Iguaçu extra forte', img: productImageById(35), culture: 'pt', score_authenticity: 9.1, score_distance: 2.4, score_price: 5.75, store: 'Morrisons, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Morrisons', retailerUrl: 'https://groceries.morrisons.com/', retailerLogo: LOGOS.morrisons, productUrl: 'https://groceries.morrisons.com/search?q=brazilian+coffee', tags: ['Brazilian', 'Coffee', 'Strong'], reviews: 154, keywords: ['cafe', 'café', 'coffee', 'iguaçu', 'forte', 'brasileiro'], reviewSamples: ptR2 },
  { id: 36, name: 'Caboclo Café Torrado 250g', nativeDesc: 'Café Caboclo tradicional', img: productImageById(36), culture: 'pt', score_authenticity: 8.7, score_distance: 1.2, score_price: 3.99, store: 'Lidl, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Lidl', retailerUrl: 'https://www.lidl.co.uk/', retailerLogo: LOGOS.lidl, productUrl: 'https://www.lidl.co.uk/', tags: ['Brazilian', 'Coffee', 'Ground'], reviews: 143, keywords: ['cafe', 'café', 'coffee', 'caboclo', 'torrado', 'brasileiro'], reviewSamples: ptR3 },
  { id: 37, name: 'Café Pelé 500g', nativeDesc: 'Café Pelé moído', img: productImageById(37), culture: 'pt', score_authenticity: 8.9, score_distance: 2.8, score_price: 5.35, store: 'Aldi, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Aldi', retailerUrl: 'https://www.aldi.co.uk/', retailerLogo: LOGOS.aldi, productUrl: 'https://www.aldi.co.uk/', tags: ['Brazilian', 'Coffee', 'Ground'], reviews: 167, keywords: ['cafe', 'café', 'coffee', 'pelé', 'pele', 'brasileiro'], reviewSamples: ptR1 },
  { id: 38, name: 'Santa Clara Orgânico 250g', nativeDesc: 'Café orgânico Santa Clara', img: productImageById(38), culture: 'pt', score_authenticity: 9.0, score_distance: 3.1, score_price: 6.49, store: 'Waitrose, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Waitrose', retailerUrl: 'https://www.waitrose.com/', retailerLogo: LOGOS.waitrose, productUrl: 'https://www.waitrose.com/ecom/shop/search?searchTerm=organic+coffee', tags: ['Brazilian', 'Coffee', 'Organic'], reviews: 121, keywords: ['cafe', 'café', 'coffee', 'orgânico', 'santa clara', 'brasileiro'], reviewSamples: ptR2 },
  { id: 39, name: 'Café Bom Dia 500g', nativeDesc: 'Café Bom Dia torrado', img: productImageById(39), culture: 'pt', score_authenticity: 8.8, score_distance: 1.6, score_price: 4.89, store: 'Tesco Extra, Kingston Park', location: 'Newcastle upon Tyne', retailerName: 'Tesco', retailerUrl: 'https://www.tesco.com/', retailerLogo: LOGOS.tesco, productUrl: 'https://www.tesco.com/groceries/en-GB/search?query=brazilian+coffee', tags: ['Brazilian', 'Coffee', 'Ground'], reviews: 112, keywords: ['cafe', 'café', 'coffee', 'bom dia', 'torrado', 'brasileiro'], reviewSamples: ptR3 },
  { id: 40, name: 'Café Orfeu Gourmet 250g', nativeDesc: 'Café Orfeu especial', img: productImageById(40), culture: 'pt', score_authenticity: 9.3, score_distance: 2.2, score_price: 7.25, store: "Sainsbury's, Newcastle", location: 'Newcastle upon Tyne', retailerName: "Sainsbury's", retailerUrl: 'https://www.sainsburys.co.uk/', retailerLogo: LOGOS.sainsburys, productUrl: 'https://www.sainsburys.co.uk/gol-ui/SearchResults/orfeu+coffee', tags: ['Brazilian', 'Coffee', 'Specialty'], reviews: 98, keywords: ['cafe', 'café', 'coffee', 'orfeu', 'gourmet', 'brasileiro'], reviewSamples: ptR1 },
  { id: 41, name: 'Café União Tradicional 500g', nativeDesc: 'Café União moído', img: productImageById(41), culture: 'pt', score_authenticity: 8.9, score_distance: 1.4, score_price: 5.1, store: 'ASDA Superstore, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'ASDA', retailerUrl: 'https://groceries.asda.com/', retailerLogo: LOGOS.asda, productUrl: 'https://groceries.asda.com/search/cafe+uniao', tags: ['Brazilian', 'Coffee', 'Ground'], reviews: 189, keywords: ['cafe', 'café', 'coffee', 'união', 'uniao', 'brasileiro'], reviewSamples: ptR2 },
  { id: 42, name: 'Pilão Extra Forte 500g', nativeDesc: 'Café Pilão extra forte', img: productImageById(42), culture: 'pt', score_authenticity: 9.1, score_distance: 3.6, score_price: 6.2, store: 'Morrisons, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Morrisons', retailerUrl: 'https://groceries.morrisons.com/', retailerLogo: LOGOS.morrisons, productUrl: 'https://groceries.morrisons.com/search?q=pilao+coffee', tags: ['Brazilian', 'Coffee', 'Strong'], reviews: 256, keywords: ['cafe', 'café', 'coffee', 'pilão', 'pilao', 'extra forte', 'brasileiro'], reviewSamples: ptR3 },
  { id: 43, name: 'Nescafé Tradición Brasileira', nativeDesc: 'Nescafé sabor café brasileiro', img: productImageById(43), culture: 'pt', score_authenticity: 8.6, score_distance: 1.0, score_price: 4.5, store: 'Lidl, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Lidl', retailerUrl: 'https://www.lidl.co.uk/', retailerLogo: LOGOS.lidl, productUrl: 'https://www.lidl.co.uk/', tags: ['Brazilian', 'Coffee', 'Instant'], reviews: 312, keywords: ['cafe', 'café', 'coffee', 'nescafe', 'instant', 'brasileiro'], reviewSamples: ptR1 },
  { id: 44, name: 'Café Brasília Torrado 500g', nativeDesc: 'Café Brasília moído', img: productImageById(44), culture: 'pt', score_authenticity: 8.8, score_distance: 2.0, score_price: 4.95, store: "Sainsbury's, Newcastle", location: 'Newcastle upon Tyne', retailerName: "Sainsbury's", retailerUrl: 'https://www.sainsburys.co.uk/', retailerLogo: LOGOS.sainsburys, productUrl: 'https://www.sainsburys.co.uk/gol-ui/SearchResults/brazilian+coffee', tags: ['Brazilian', 'Coffee', 'Ground'], reviews: 134, keywords: ['cafe', 'café', 'coffee', 'brasília', 'brasilia', 'brasileiro'], reviewSamples: ptR2 },
  { id: 45, name: 'Café Mineiro Gourmet 250g', nativeDesc: 'Café mineiro torrado', img: productImageById(45), culture: 'pt', score_authenticity: 9.0, score_distance: 2.5, score_price: 6.8, store: 'Amazon.co.uk (delivery)', location: 'Newcastle upon Tyne', retailerName: 'Amazon', retailerUrl: 'https://www.amazon.co.uk/', retailerLogo: LOGOS.amazon, productUrl: 'https://www.amazon.co.uk/s?k=brazilian+coffee+pilao', tags: ['Brazilian', 'Coffee', 'Gourmet'], reviews: 101, keywords: ['cafe', 'café', 'coffee', 'mineiro', 'gourmet', 'brasileiro'], reviewSamples: ptR3 },
  { id: 46, name: 'Itambé Café Coado 500g', nativeDesc: 'Café Itambé para coador', img: productImageById(46), culture: 'pt', score_authenticity: 8.9, score_distance: 1.8, score_price: 5.45, store: 'Morrisons, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Morrisons', retailerUrl: 'https://groceries.morrisons.com/', retailerLogo: LOGOS.morrisons, productUrl: 'https://groceries.morrisons.com/search?q=brazilian+coffee', tags: ['Brazilian', 'Coffee', 'Filter'], reviews: 88, keywords: ['cafe', 'café', 'coffee', 'itambé', 'itambe', 'coado', 'brasileiro'], reviewSamples: ptR1 },
];

