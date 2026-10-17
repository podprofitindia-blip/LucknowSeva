export interface VerifiedProvider {
  id: string;
  verificationCode: string;
  name: string;
  serviceId: string;
  serviceNameHi: string;
  experienceYears: number;
  coveredAreas: string[];
  verificationDate: string;
  verifiedBy: string;
  policeVerificationStatus: 'सत्यापित (Police Verified)' | 'आधार व निवास सत्यापित';
  specialization: string;
  isActive: boolean;
  notes?: string;
}

export const INITIAL_VERIFIED_PROVIDERS: VerifiedProvider[] = [
  {
    id: 'prov-1',
    verificationCode: 'LK-ELC-201',
    name: 'मास्टर मोहम्मद आरिफ़',
    serviceId: 'electrician',
    serviceNameHi: 'इलेक्ट्रीशियन (Electrician)',
    experienceYears: 12,
    coveredAreas: ['हज़रतगंज', 'गोमती नगर', 'महानगर', 'अलीगंज'],
    verificationDate: '15 मार्च 2026',
    verifiedBy: 'लखनऊ सेवा एडमिन (व्यक्तिगत जांच)',
    policeVerificationStatus: 'सत्यापित (Police Verified)',
    specialization: 'घरेलू वायरिंग, इन्वर्टर रिपेयर, फॉल्ट डायग्नोसिस व शॉर्ट सर्किट फिक्स',
    isActive: true,
    notes: 'समय के पाबंद, उच्च गुणवत्ता के औजार व मीटर के साथ उपस्थित।'
  },
  {
    id: 'prov-2',
    verificationCode: 'LK-PLM-202',
    name: 'राजेश कुमार शर्मा',
    serviceId: 'plumber',
    serviceNameHi: 'प्लंबर (Plumber)',
    experienceYears: 11,
    coveredAreas: ['इंदिरा नगर', 'गोमती नगर विस्तार', 'चिनहट', 'विकास नगर'],
    verificationDate: '18 मार्च 2026',
    verifiedBy: 'लखनऊ सेवा एडमिन (व्यक्तिगत जांच)',
    policeVerificationStatus: 'आधार व निवास सत्यापित',
    specialization: 'पाइप लीकेज, कंसील्ड फिटिंग, मोटर व सिंक/कमोड ड्रेनेज क्लियरिंग',
    isActive: true,
    notes: 'प्लंबिंग में प्रशिक्षित एवं व्यावहारिक अनुभव संपन्न।'
  },
  {
    id: 'prov-3',
    verificationCode: 'LK-ACR-203',
    name: 'अमित कुमार यादव',
    serviceId: 'ac-repair',
    serviceNameHi: 'एसी रिपेयर व सर्विस (AC Repair)',
    experienceYears: 8,
    coveredAreas: ['गोमती नगर', 'सुशांत गोल्फ सिटी', 'आशियाना', 'आलमबाग'],
    verificationDate: '22 मार्च 2026',
    verifiedBy: 'लखनऊ सेवा एडमिन (व्यक्तिगत जांच)',
    policeVerificationStatus: 'सत्यापित (Police Verified)',
    specialization: 'जेट फोम वॉश, गैस लीकेज समाधान (R32/R410), पीसीबी डायग्नोस्टिक्स',
    isActive: true,
    notes: 'प्रमाणित एचवीएसी (HVAC) डिप्लोमा धारक, डिजिटल मैनिफोल्ड गेज उपयोग।'
  },
  {
    id: 'prov-4',
    verificationCode: 'LK-CRP-204',
    name: 'सुनील कश्यप',
    serviceId: 'carpenter',
    serviceNameHi: 'बढ़ई / कारपेंटर (Carpenter)',
    experienceYears: 14,
    coveredAreas: ['चौक', 'राजाजीपुरम', 'अमीनाबाद', 'चारबाग'],
    verificationDate: '25 मार्च 2026',
    verifiedBy: 'लखनऊ सेवा एडमिन (व्यक्तिगत जांच)',
    policeVerificationStatus: 'आधार व निवास सत्यापित',
    specialization: 'दरवाजे/ताले की मरम्मत, मॉड्यूलर किचन व वार्डरोब फिटिंग',
    isActive: true,
    notes: 'विशिष्ट काष्ठ शिल्पी, टिकाऊ और फिनिशिंग युक्त कार्य।'
  },
  {
    id: 'prov-5',
    verificationCode: 'LK-PNT-205',
    name: 'दीपक वर्मा व टीम',
    serviceId: 'painter',
    serviceNameHi: 'पेंटर व रंगाई-पुताई (Painter)',
    experienceYears: 9,
    coveredAreas: ['समस्त लखनऊ (All Lucknow)'],
    verificationDate: '28 मार्च 2026',
    verifiedBy: 'लखनऊ सेवा एडमिन (व्यक्तिगत जांच)',
    policeVerificationStatus: 'आधार व निवास सत्यापित',
    specialization: 'सीलन वॉटरप्रूफिंग, रॉयल लक्जरी इमल्शन, टेक्सचर व पुट्टी फिनिश',
    isActive: true,
    notes: 'काम पूरा होने के बाद फर्श व खिड़कियों की संपूर्ण सफाई अनिवार्य।'
  },
  {
    id: 'prov-6',
    verificationCode: 'LK-CLN-206',
    name: 'श्रीमती अनीता देवी व महिला स्वच्छता दल',
    serviceId: 'cleaning',
    serviceNameHi: 'सफाई व डीप क्लीनिंग (Cleaning)',
    experienceYears: 6,
    coveredAreas: ['गोमती नगर', 'हज़रतगंज', 'इंदिरा नगर', 'महानगर'],
    verificationDate: '30 मार्च 2026',
    verifiedBy: 'लखनऊ सेवा एडमिन (व्यक्तिगत जांच)',
    policeVerificationStatus: 'आधार व निवास सत्यापित',
    specialization: 'किचन डीप-क्लीनिंग, बाथरूम डीस्केलिंग, सोफा शैम्पू वॉश',
    isActive: true,
    notes: 'पूर्णतः सुरक्षित, परिवार के अनुकूल एवं पेशेवर स्वच्छता विशेषज्ञ।'
  },
  {
    id: 'prov-7',
    verificationCode: 'LK-TUT-207',
    name: 'इंजी. विवेक श्रीवास्तव (M.Tech, B.Ed)',
    serviceId: 'home-tutor',
    serviceNameHi: 'होम ट्यूटर / शिक्षक (Home Tutor)',
    experienceYears: 7,
    coveredAreas: ['गोमती नगर', 'गोमती नगर विस्तार', 'इंदिरा नगर'],
    verificationDate: '02 अप्रैल 2026',
    verifiedBy: 'लखनऊ सेवा एडमिन (शैक्षणिक प्रमाण पत्र सत्यापित)',
    policeVerificationStatus: 'आधार व निवास सत्यापित',
    specialization: 'गणित व भौतिकी (कक्षा 9वीं से 12वीं, CBSE/ICSE)',
    isActive: true,
    notes: 'सकारात्मक दृष्टिकोण, कमजोर छात्रों पर विशेष व्यक्तिगत ध्यान।'
  },
  {
    id: 'prov-8',
    verificationCode: 'LK-APP-208',
    name: 'संजय कुमार मौर्या',
    serviceId: 'appliance-repair',
    serviceNameHi: 'घरेलू उपकरण मरम्मत (Appliance Repair)',
    experienceYears: 10,
    coveredAreas: ['आलमबाग', 'तेलीबाग', 'वृंदावन योजना', 'सरोजिनी नगर'],
    verificationDate: '05 अप्रैल 2026',
    verifiedBy: 'लखनऊ सेवा एडमिन (व्यक्तिगत जांच)',
    policeVerificationStatus: 'सत्यापित (Police Verified)',
    specialization: 'ऑटोमैटिक वॉशिंग मशीन, डबल डोर फ्रिज व आरओ सर्विस',
    isActive: true,
    notes: 'ओरिजिनल स्पेयर पार्ट्स उपयोग व सर्विस रसीद प्रदान करना।'
  }
];

const LOCAL_STORAGE_KEY = 'lucknowseva_verified_providers_v1';

export function getVerifiedProviders(): VerifiedProvider[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_VERIFIED_PROVIDERS;
}

export function saveVerifiedProviders(providers: VerifiedProvider[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(providers));
  } catch (e) {
    console.error('Failed to save providers to localStorage', e);
  }
}

export function resetToDefaultProviders(): VerifiedProvider[] {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // ignore
  }
  return INITIAL_VERIFIED_PROVIDERS;
}
