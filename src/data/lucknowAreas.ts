export interface LucknowArea {
  id: string;
  nameHi: string;
  nameEn: string;
  zone: string;
  popularPincode?: string;
  landmarks?: string[];
}

export const LUCKNOW_AREAS: LucknowArea[] = [
  {
    id: 'gomti-nagar',
    nameHi: 'गोमती नगर',
    nameEn: 'Gomti Nagar',
    zone: 'पूर्वी लखनऊ',
    popularPincode: '226010',
    landmarks: ['विशाल खंड', 'विपुल खंड', 'पत्रकारपुरम', 'मनोज पांडे चौराहा']
  },
  {
    id: 'gomti-nagar-ext',
    nameHi: 'गोमती नगर विस्तार',
    nameEn: 'Gomti Nagar Extension',
    zone: 'पूर्वी लखनऊ',
    popularPincode: '226010',
    landmarks: ['इकाना स्टेडियम', 'प्लासियो मॉल', 'सेक्टर 4, 6, 7']
  },
  {
    id: 'hazratganj',
    nameHi: 'हज़रतगंज',
    nameEn: 'Hazratganj',
    zone: 'मध्य लखनऊ',
    popularPincode: '226001',
    landmarks: ['जीपीओ', 'कैथेड्रल', 'विधानसभा मार्ग', 'अशोक मार्ग']
  },
  {
    id: 'indira-nagar',
    nameHi: 'इंदिरा नगर',
    nameEn: 'Indira Nagar',
    zone: 'उत्तरी लखनऊ',
    popularPincode: '226016',
    landmarks: ['मुंशी पुलिया', 'भूतनाथ मार्केट', 'कुकुरैल पिकनिक स्पॉट रोड']
  },
  {
    id: 'aliganj',
    nameHi: 'अलीगंज',
    nameEn: 'Aliganj',
    zone: 'उत्तरी लखनऊ',
    popularPincode: '226024',
    landmarks: ['कपूरथला', 'हनुमान सेतु मंदिर मार्ग', 'सेक्टर बी, सी, जे']
  },
  {
    id: 'mahanagar',
    nameHi: 'महानगर',
    nameEn: 'Mahanagar',
    zone: 'मध्य-उत्तर लखनऊ',
    popularPincode: '226006',
    landmarks: ['गोल मार्केट', 'छत्रपति शिवाजी मार्ग', 'बादशाह नगर']
  },
  {
    id: 'alambagh',
    nameHi: 'आलमबाग',
    nameEn: 'Alambagh',
    zone: 'दक्षिणी लखनऊ',
    popularPincode: '226005',
    landmarks: ['आलमबाग चौराहा', 'बस टर्मिनल', 'चंदर नगर', 'सिंगार नगर']
  },
  {
    id: 'ashiyana',
    nameHi: 'आशियाना (एलडीए कॉलोनी)',
    nameEn: 'Ashiyana',
    zone: 'दक्षिणी लखनऊ',
    popularPincode: '226012',
    landmarks: ['बंगला बाजार', 'पावर हाउस चौराहा', 'सेक्टर एच, एम, एल']
  },
  {
    id: 'rajajipuram',
    nameHi: 'राजाजीपुरम',
    nameEn: 'Rajajipuram',
    zone: 'पश्चिमी लखनऊ',
    popularPincode: '226017',
    landmarks: ['ई-ब्लॉक चौराहा', 'रानी लक्ष्मीबाई अस्पताल', 'तालकटोरा']
  },
  {
    id: 'chowk',
    nameHi: 'चौक',
    nameEn: 'Chowk',
    zone: 'पुराना लखनऊ',
    popularPincode: '226003',
    landmarks: ['बड़ा इमामबाड़ा', 'रूमी दरवाजा', 'कोनेश्वर मंदिर', 'नक्कास']
  },
  {
    id: 'aminabad',
    nameHi: 'अमीनाबाद',
    nameEn: 'Aminabad',
    zone: 'मध्य लखनऊ',
    popularPincode: '226018',
    landmarks: ['गड़बड़झाला', 'प्रताप मार्केट', 'नजीराबाद', 'कैसरबाग']
  },
  {
    id: 'jankipuram',
    nameHi: 'जानकीपुरम',
    nameEn: 'Jankipuram',
    zone: 'उत्तरी लखनऊ',
    popularPincode: '226021',
    landmarks: ['जानकीपुरम विस्तार', 'इंजीनियरिंग कॉलेज चौराहा', 'सेक्टर 1-9']
  },
  {
    id: 'vikas-nagar',
    nameHi: 'विकास नगर',
    nameEn: 'Vikas Nagar',
    zone: 'उत्तरी लखनऊ',
    popularPincode: '226022',
    landmarks: ['टेढ़ी पुलिया', 'सेक्टर 1 से 8', 'रिंग रोड']
  },
  {
    id: 'chinhat',
    nameHi: 'चिनहट',
    nameEn: 'Chinhat',
    zone: 'पूर्वी लखनऊ',
    popularPincode: '226028',
    landmarks: ['कमता चौराहा', 'मटियारी चौराहा', 'अयोध्या रोड']
  },
  {
    id: 'telibagh',
    nameHi: 'तेलीबाग',
    nameEn: 'Telibagh',
    zone: 'दक्षिणी लखनऊ',
    popularPincode: '226025',
    landmarks: ['रायबरेली रोड', 'सैनिक नगर', 'कमांड हॉस्पिटल']
  },
  {
    id: 'charbagh',
    nameHi: 'चारबाग',
    nameEn: 'Charbagh',
    zone: 'मध्य लखनऊ',
    popularPincode: '226004',
    landmarks: ['रेलवे स्टेशन', 'हुसैनगंज', 'नाका हिंडोला']
  },
  {
    id: 'sushant-golf-city',
    nameHi: 'सुशांत गोल्फ सिटी',
    nameEn: 'Sushant Golf City',
    zone: 'दक्षिणी-पूर्वी लखनऊ',
    popularPincode: '226030',
    landmarks: ['लूलू मॉल (Lulu Mall)', 'मेदांता अस्पताल', 'अंसल']
  },
  {
    id: 'dubagga',
    nameHi: 'दुबग्गा',
    nameEn: 'Dubagga',
    zone: 'पश्चिमी लखनऊ',
    popularPincode: '226003',
    landmarks: ['मंडी', 'हरदोई रोड', 'बसंत कुंज योजना']
  },
  {
    id: 'sarojini-nagar',
    nameHi: 'सरोजिनी नगर',
    nameEn: 'Sarojini Nagar',
    zone: 'दक्षिणी लखनऊ',
    popularPincode: '226008',
    landmarks: ['अमौसी एयरपोर्ट रोड', 'ट्रांसपोर्ट नगर', 'कानपुर रोड']
  },
  {
    id: 'vrindavan-yojna',
    nameHi: 'वृंदावन योजना',
    nameEn: 'Vrindavan Yojna',
    zone: 'दक्षिणी लखनऊ',
    popularPincode: '226029',
    landmarks: ['पीजीआई रोड', 'डिफेंस एक्सपो ग्राउंड', 'सेक्टर 5B']
  }
];
