import type { Lang, Relation, Tier, Verdict } from './types';

type Stage = 'extract' | 'claims' | 'search' | 'judge' | 'explain';
export type FixtureId = 'scheme-forward' | 'health-tip' | 'old-news' | 'verified-news' | 'unclear-forward';

export interface Strings {
  tagline: string;
  heroLine: string;
  lumiAria: string;
  status: { online: string; checking: string; speaking: string };
  back: string; call: string; menu: string; language: string;
  langFull: Record<Lang, string>;
  welcome: string;
  tryDemo: string;
  fixtureChips: Record<FixtureId, string>;
  placeholder: string; send: string; record: string; attach: string;
  attachItems: { image: string; pdf: string; audio: string; url: string };
  forwarded: string; voiceNote: string; playVoiceNote: string; screenshot: string; pages: (n: number) => string;
  stages: Record<Stage, string>;
  claimsChecked: (n: number) => string;
  listen: string; listenSoon: string;
  replyToGroup: string; replyTitle: string; replyHint: string; copy: string; copied: string;
  helpful: string; notHelpful: string;
  demoData: string; close: string; claimDetails: string;
  whatsRight: string; whatsWrong: string; sources: string; limitations: string;
  checkedAt: string; published: string; openSource: string;
  tiers: Record<Tier, string>;
  relations: Record<Relation, string>;
  verdict: Record<Verdict, string>;
  demoForwards: string; darkMode: string; clearChat: string;
  moreInfo: string;
  moreChips: { paste: string; screenshot: string; link: string };
  howLumiChecks: string;
  steps: { title: string; body: string }[];
  callSoon: string; chatWithLumi: string;
  landing: {
    nav: { how: string; verdicts: string; languages: string };
    eyebrow: string; sub: string; lumiSays: string; demoLabel: string; lightMode: string;
    forwardTitle: string; forwardSub: string;
    inputs: Record<'text' | 'image' | 'audio' | 'pdf' | 'url', { title: string; body: string }>;
    howSub: string;
    verdictsTitle: string; verdictsSub: string; meaning: Record<Verdict, string>; noVerdict: string;
    langTitle: string; langSub: string;
    trustTitle: string; trust: { title: string; body: string }[];
    ctaTitle: string; ctaSub: string;
    builtBy: string; disclaimer: string;
  };
}

const en: Strings = {
  tagline: 'Evidence before belief',
  heroLine: 'Forward it to Lumi before you forward it to family',
  lumiAria: "Lumi, SATYA's fact-checking assistant",
  status: { online: 'online', checking: 'checking sources…', speaking: 'speaking…' },
  back: 'Back', call: 'Call Lumi', menu: 'Menu', language: 'Language',
  langFull: { en: 'English', hi: 'हिंदी', mr: 'मराठी' },
  welcome: "Hi, I'm Lumi! 👋 Got a forward you're not sure about? Paste it, forward it, or send a screenshot, voice note, PDF or link. I'll check it against reliable sources before you share it.",
  tryDemo: 'Try a demo forward',
  fixtureChips: {
    'scheme-forward': '₹5,000 scheme', 'health-tip': 'Lemon water cure', 'old-news': 'School closure notice',
    'verified-news': 'Bank Saturday holidays', 'unclear-forward': 'A vague forward',
  },
  placeholder: 'Paste or forward a message…', send: 'Send', record: 'Record voice note', attach: 'Attach',
  attachItems: { image: 'Photo or screenshot', pdf: 'Document (PDF)', audio: 'Audio', url: 'Link' },
  forwarded: 'Forwarded', voiceNote: 'Voice note', playVoiceNote: 'Play voice note', screenshot: 'Screenshot',
  pages: (n) => (n === 1 ? '1 page' : `${n} pages`),
  stages: {
    extract: 'Reading the message', claims: 'Finding claims', search: 'Searching reliable sources',
    judge: 'Weighing the evidence', explain: 'Writing the explanation',
  },
  claimsChecked: (n) => (n === 1 ? '1 claim checked' : `${n} claims checked`),
  listen: 'Listen', listenSoon: 'Listening is coming soon',
  replyToGroup: 'Reply to group', replyTitle: 'Reply to the group',
  replyHint: 'Edit it if you like, then copy and paste it into your group.',
  copy: 'Copy', copied: 'Copied!',
  helpful: 'Helpful', notHelpful: 'Not helpful',
  demoData: 'DEMO DATA', close: 'Close', claimDetails: 'Claim details',
  whatsRight: "What's right", whatsWrong: "What's wrong", sources: 'Sources', limitations: 'Limitations',
  checkedAt: 'Checked at', published: 'Published', openSource: 'Open source',
  tiers: { A: 'Official', B: 'Fact-checker', C: 'News', D: 'Lead' },
  relations: { SUPPORTS: 'Supports', CONTRADICTS: 'Contradicts', NARROWS: 'Adds context', SUPERSEDES: 'Newer info', NEUTRAL: 'Related' },
  verdict: { VERIFIED: 'Verified', FALSE: 'False', OUTDATED: 'Outdated', PARTLY_SUPPORTED: 'Partly true' },
  demoForwards: 'Demo forwards', darkMode: 'Dark mode', clearChat: 'Clear chat',
  moreInfo: "I'd love to check this, but I need a little more to go on. 🙂 Could you send me one of these?",
  moreChips: { paste: 'Paste the full message', screenshot: 'Send a clearer screenshot', link: 'Share the link it came from' },
  howLumiChecks: 'How Lumi checks',
  steps: [
    { title: 'Read', body: 'Reads text, screenshots, voice notes, PDFs and links.' },
    { title: 'Find claims', body: 'Splits the forward into claims that can be checked.' },
    { title: 'Search', body: 'Finds dated evidence from official sources and fact-checkers.' },
    { title: 'Judge', body: 'Fixed rules, not the AI, decide every verdict.' },
    { title: 'Explain', body: 'A simple explanation and a polite reply for your group.' },
  ],
  callSoon: 'Calls with Lumi are coming soon. Chat with her for now!', chatWithLumi: 'Chat with Lumi',
  landing: {
    nav: { how: 'How it works', verdicts: 'Verdicts', languages: 'Languages' },
    eyebrow: 'Fact-checks for family group forwards',
    sub: 'Send Lumi any forward: text, screenshot, voice note, PDF or link. She finds dated evidence from official sources and fact-checkers, gives a clear verdict, and writes a polite reply for your group.',
    lumiSays: 'Got a forward? Send it to me!',
    demoLabel: 'Live demo: Lumi checking a forwarded message',
    lightMode: 'Light mode',
    forwardTitle: 'Forward it however it reached you',
    forwardSub: 'No copying text out by hand. Lumi reads all of these.',
    inputs: {
      text: { title: 'Text', body: 'Paste or forward the message as it is.' },
      image: { title: 'Screenshot', body: 'Lumi reads the text inside the image.' },
      audio: { title: 'Voice note', body: 'She listens and writes it down first.' },
      pdf: { title: 'PDF', body: 'Notices and circulars, page by page.' },
      url: { title: 'Link', body: 'She opens the page safely and reads it.' },
    },
    howSub: 'Every step shows up live in the chat, so you can see the work.',
    verdictsTitle: 'Four clear verdicts',
    verdictsSub: 'Always an icon, a label and the reason, never colour alone.',
    meaning: {
      VERIFIED: 'Reliable sources confirm it.',
      FALSE: 'Reliable sources show it is wrong.',
      OUTDATED: 'It was true once, but newer information replaced it.',
      PARTLY_SUPPORTED: 'Some of it is right; some is wrong or missing context.',
    },
    noVerdict: 'Not enough to go on? Lumi never guesses. She asks for the full message, a clearer screenshot or the link it came from.',
    langTitle: "Speaks your family's language",
    langSub: 'Explanations, voice and the ready-to-paste reply in English, Hindi and Marathi.',
    trustTitle: 'Why you can trust Lumi',
    trust: [
      { title: 'Evidence before verdict', body: 'Every verdict links to the dated sources it came from.' },
      { title: 'No invented sources', body: 'Only links returned by real searches and fact-check databases are shown.' },
      { title: 'Rules decide, not AI', body: 'AI reads the evidence; fixed, tested rules pick the verdict.' },
      { title: 'Polite, never shaming', body: 'Replies correct the message, not the person who sent it.' },
    ],
    ctaTitle: 'Got a forward right now?',
    ctaSub: 'Check it in seconds, before it reaches the family group.',
    builtBy: 'Built by',
    disclaimer: 'Lumi can be wrong. For health, legal or money matters, confirm with an official source or professional.',
  },
};

const hi: Strings = {
  tagline: 'विश्वास से पहले सबूत',
  heroLine: 'परिवार को फ़ॉरवर्ड करने से पहले, लूमी को फ़ॉरवर्ड करें',
  lumiAria: 'लूमी, SATYA की फ़ैक्ट-चेकिंग असिस्टेंट',
  status: { online: 'ऑनलाइन', checking: 'स्रोत जाँच रही है…', speaking: 'बोल रही है…' },
  back: 'वापस', call: 'लूमी को कॉल करें', menu: 'मेन्यू', language: 'भाषा',
  langFull: en.langFull,
  welcome: 'नमस्ते, मैं लूमी हूँ! 👋 कोई फ़ॉरवर्ड मिला है जिस पर शक है? उसे यहाँ पेस्ट या फ़ॉरवर्ड करें, या स्क्रीनशॉट, वॉइस नोट, PDF या लिंक भेजें। शेयर करने से पहले मैं उसे भरोसेमंद स्रोतों से जाँच दूँगी।',
  tryDemo: 'डेमो फ़ॉरवर्ड आज़माएँ',
  fixtureChips: {
    'scheme-forward': '₹5,000 वाली योजना', 'health-tip': 'नींबू पानी इलाज', 'old-news': 'स्कूल बंद की सूचना',
    'verified-news': 'बैंक की शनिवार छुट्टियाँ', 'unclear-forward': 'एक अधूरा फ़ॉरवर्ड',
  },
  placeholder: 'कोई संदेश पेस्ट या फ़ॉरवर्ड करें…', send: 'भेजें', record: 'वॉइस नोट रिकॉर्ड करें', attach: 'अटैच करें',
  attachItems: { image: 'फ़ोटो या स्क्रीनशॉट', pdf: 'दस्तावेज़ (PDF)', audio: 'ऑडियो', url: 'लिंक' },
  forwarded: 'फ़ॉरवर्ड किया गया', voiceNote: 'वॉइस नोट', playVoiceNote: 'वॉइस नोट चलाएँ', screenshot: 'स्क्रीनशॉट',
  pages: (n) => `${n} पेज`,
  stages: {
    extract: 'संदेश पढ़ रही है', claims: 'दावे ढूँढ रही है', search: 'भरोसेमंद स्रोत खोज रही है',
    judge: 'सबूत परख रही है', explain: 'आसान भाषा में समझा रही है',
  },
  claimsChecked: (n) => (n === 1 ? '1 दावा जाँचा गया' : `${n} दावे जाँचे गए`),
  listen: 'सुनें', listenSoon: 'सुनने की सुविधा जल्द आ रही है',
  replyToGroup: 'ग्रुप को जवाब', replyTitle: 'ग्रुप को जवाब दें',
  replyHint: 'चाहें तो बदलें, फिर कॉपी करके अपने ग्रुप में पेस्ट करें।',
  copy: 'कॉपी करें', copied: 'कॉपी हो गया!',
  helpful: 'मददगार', notHelpful: 'मददगार नहीं',
  demoData: 'DEMO DATA', close: 'बंद करें', claimDetails: 'दावे की जानकारी',
  whatsRight: 'क्या सही है', whatsWrong: 'क्या गलत है', sources: 'स्रोत', limitations: 'सीमाएँ',
  checkedAt: 'जाँच का समय', published: 'प्रकाशित', openSource: 'स्रोत खोलें',
  tiers: { A: 'सरकारी', B: 'फ़ैक्ट-चेकर', C: 'समाचार', D: 'सुराग' },
  relations: { SUPPORTS: 'समर्थन करता है', CONTRADICTS: 'खंडन करता है', NARROWS: 'संदर्भ जोड़ता है', SUPERSEDES: 'नई जानकारी', NEUTRAL: 'संबंधित' },
  verdict: { VERIFIED: 'सही है', FALSE: 'गलत है', OUTDATED: 'पुरानी जानकारी', PARTLY_SUPPORTED: 'आंशिक रूप से सही' },
  demoForwards: 'डेमो फ़ॉरवर्ड', darkMode: 'डार्क मोड', clearChat: 'चैट साफ़ करें',
  moreInfo: 'मैं इसे ज़रूर जाँचना चाहूँगी, बस थोड़ी और जानकारी चाहिए। 🙂 क्या आप इनमें से कुछ भेज सकते हैं?',
  moreChips: { paste: 'पूरा संदेश पेस्ट करें', screenshot: 'साफ़ स्क्रीनशॉट भेजें', link: 'जिस लिंक से आया, वह भेजें' },
  howLumiChecks: 'लूमी कैसे जाँचती है',
  steps: [
    { title: 'पढ़ना', body: 'टेक्स्ट, स्क्रीनशॉट, वॉइस नोट, PDF और लिंक पढ़ती है।' },
    { title: 'दावे ढूँढना', body: 'फ़ॉरवर्ड को जाँचने लायक दावों में बाँटती है।' },
    { title: 'खोज', body: 'सरकारी स्रोतों और फ़ैक्ट-चेकर्स से तारीख़ वाले सबूत ढूँढती है।' },
    { title: 'फ़ैसला', body: 'हर फ़ैसला तय नियम करते हैं, AI नहीं।' },
    { title: 'समझाना', body: 'आसान भाषा में समझाती है और ग्रुप के लिए विनम्र जवाब देती है।' },
  ],
  callSoon: 'लूमी से कॉल जल्द शुरू होगी। तब तक चैट करें!', chatWithLumi: 'लूमी से चैट करें',
  landing: {
    nav: { how: 'कैसे काम करता है', verdicts: 'फ़ैसले', languages: 'भाषाएँ' },
    eyebrow: 'फ़ैमिली ग्रुप के फ़ॉरवर्ड की जाँच',
    sub: 'लूमी को कोई भी फ़ॉरवर्ड भेजें: टेक्स्ट, स्क्रीनशॉट, वॉइस नोट, PDF या लिंक। वह सरकारी स्रोतों और फ़ैक्ट-चेकर्स से तारीख़ वाले सबूत ढूँढती है, साफ़ फ़ैसला देती है, और आपके ग्रुप के लिए विनम्र जवाब लिखती है।',
    lumiSays: 'कोई फ़ॉरवर्ड मिला? मुझे भेजिए!',
    demoLabel: 'लाइव डेमो: लूमी एक फ़ॉरवर्ड जाँच रही है',
    lightMode: 'लाइट मोड',
    forwardTitle: 'जैसे मिला, वैसे ही भेजें',
    forwardSub: 'हाथ से टाइप करने की ज़रूरत नहीं। लूमी ये सब पढ़ लेती है।',
    inputs: {
      text: { title: 'टेक्स्ट', body: 'संदेश जैसा है वैसा पेस्ट या फ़ॉरवर्ड करें।' },
      image: { title: 'स्क्रीनशॉट', body: 'लूमी तस्वीर के अंदर का टेक्स्ट पढ़ती है।' },
      audio: { title: 'वॉइस नोट', body: 'वह पहले सुनकर लिख लेती है।' },
      pdf: { title: 'PDF', body: 'नोटिस और सर्कुलर, पेज दर पेज।' },
      url: { title: 'लिंक', body: 'वह पेज को सुरक्षित तरीके से खोलकर पढ़ती है।' },
    },
    howSub: 'हर कदम चैट में लाइव दिखता है, ताकि आप काम देख सकें।',
    verdictsTitle: 'चार साफ़ फ़ैसले',
    verdictsSub: 'हमेशा आइकन, लेबल और कारण के साथ, सिर्फ़ रंग से नहीं।',
    meaning: {
      VERIFIED: 'भरोसेमंद स्रोत इसकी पुष्टि करते हैं।',
      FALSE: 'भरोसेमंद स्रोत बताते हैं कि यह गलत है।',
      OUTDATED: 'कभी सही था, पर अब नई जानकारी आ चुकी है।',
      PARTLY_SUPPORTED: 'कुछ बातें सही हैं; कुछ गलत हैं या संदर्भ अधूरा है।',
    },
    noVerdict: 'जानकारी कम है? लूमी कभी अंदाज़ा नहीं लगाती। वह पूरा संदेश, साफ़ स्क्रीनशॉट या उसका लिंक माँगती है।',
    langTitle: 'आपके परिवार की भाषा में',
    langSub: 'समझाना, आवाज़ और पेस्ट करने लायक जवाब: अंग्रेज़ी, हिंदी और मराठी में।',
    trustTitle: 'लूमी पर भरोसा क्यों करें',
    trust: [
      { title: 'पहले सबूत, फिर फ़ैसला', body: 'हर फ़ैसला उन तारीख़ वाले स्रोतों से जुड़ा है जिनसे वह आया।' },
      { title: 'कोई मनगढ़ंत स्रोत नहीं', body: 'सिर्फ़ असली खोज और फ़ैक्ट-चेक डेटाबेस से मिले लिंक दिखते हैं।' },
      { title: 'फ़ैसला नियम करते हैं, AI नहीं', body: 'AI सबूत पढ़ता है; तय और परखे हुए नियम फ़ैसला चुनते हैं।' },
      { title: 'विनम्र, कभी शर्मिंदा नहीं', body: 'जवाब संदेश को सुधारता है, भेजने वाले को नहीं।' },
    ],
    ctaTitle: 'अभी कोई फ़ॉरवर्ड आया है?',
    ctaSub: 'फ़ैमिली ग्रुप तक पहुँचने से पहले, सेकंडों में जाँचें।',
    builtBy: 'बनाने वाले',
    disclaimer: 'लूमी से भी गलती हो सकती है। स्वास्थ्य, कानूनी या पैसों से जुड़े मामलों में किसी सरकारी स्रोत या विशेषज्ञ से पुष्टि करें।',
  },
};

const mr: Strings = {
  tagline: 'विश्वासाआधी पुरावा',
  heroLine: 'कुटुंबाला फॉरवर्ड करण्याआधी, लूमीला फॉरवर्ड करा',
  lumiAria: 'लूमी, SATYA ची फॅक्ट-चेकिंग असिस्टंट',
  status: { online: 'ऑनलाइन', checking: 'स्रोत तपासत आहे…', speaking: 'बोलत आहे…' },
  back: 'मागे', call: 'लूमीला कॉल करा', menu: 'मेनू', language: 'भाषा',
  langFull: en.langFull,
  welcome: 'नमस्कार, मी लूमी! 👋 एखाद्या फॉरवर्डबद्दल शंका आहे? तो इथे पेस्ट किंवा फॉरवर्ड करा, किंवा स्क्रीनशॉट, व्हॉइस नोट, PDF किंवा लिंक पाठवा. शेअर करण्याआधी मी तो विश्वासार्ह स्रोतांवरून तपासून देईन.',
  tryDemo: 'डेमो फॉरवर्ड वापरून पाहा',
  fixtureChips: {
    'scheme-forward': '₹5,000 ची योजना', 'health-tip': 'लिंबूपाणी उपाय', 'old-news': 'शाळा बंदची सूचना',
    'verified-news': 'बँकेच्या शनिवार सुट्ट्या', 'unclear-forward': 'एक अर्धवट फॉरवर्ड',
  },
  placeholder: 'संदेश पेस्ट किंवा फॉरवर्ड करा…', send: 'पाठवा', record: 'व्हॉइस नोट रेकॉर्ड करा', attach: 'जोडा',
  attachItems: { image: 'फोटो किंवा स्क्रीनशॉट', pdf: 'दस्तऐवज (PDF)', audio: 'ऑडिओ', url: 'लिंक' },
  forwarded: 'फॉरवर्ड केलेला', voiceNote: 'व्हॉइस नोट', playVoiceNote: 'व्हॉइस नोट ऐका', screenshot: 'स्क्रीनशॉट',
  pages: (n) => `${n} पाने`,
  stages: {
    extract: 'संदेश वाचत आहे', claims: 'दावे शोधत आहे', search: 'विश्वासार्ह स्रोत शोधत आहे',
    judge: 'पुरावे पडताळत आहे', explain: 'सोप्या भाषेत समजावत आहे',
  },
  claimsChecked: (n) => (n === 1 ? '1 दावा तपासला' : `${n} दावे तपासले`),
  listen: 'ऐका', listenSoon: 'ऐकण्याची सुविधा लवकरच येत आहे',
  replyToGroup: 'ग्रुपला उत्तर', replyTitle: 'ग्रुपला उत्तर द्या',
  replyHint: 'हवे तर बदला, मग कॉपी करून तुमच्या ग्रुपमध्ये पेस्ट करा.',
  copy: 'कॉपी करा', copied: 'कॉपी झाले!',
  helpful: 'उपयुक्त', notHelpful: 'उपयुक्त नाही',
  demoData: 'DEMO DATA', close: 'बंद करा', claimDetails: 'दाव्याचा तपशील',
  whatsRight: 'काय खरे आहे', whatsWrong: 'काय चुकीचे आहे', sources: 'स्रोत', limitations: 'मर्यादा',
  checkedAt: 'तपासल्याची वेळ', published: 'प्रकाशित', openSource: 'स्रोत उघडा',
  tiers: { A: 'सरकारी', B: 'फॅक्ट-चेकर', C: 'बातमी', D: 'धागा' },
  relations: { SUPPORTS: 'समर्थन करतो', CONTRADICTS: 'खंडन करतो', NARROWS: 'संदर्भ जोडतो', SUPERSEDES: 'नवी माहिती', NEUTRAL: 'संबंधित' },
  verdict: { VERIFIED: 'खरे आहे', FALSE: 'खोटे आहे', OUTDATED: 'जुनी माहिती', PARTLY_SUPPORTED: 'अंशतः खरे' },
  demoForwards: 'डेमो फॉरवर्ड', darkMode: 'डार्क मोड', clearChat: 'चॅट साफ करा',
  moreInfo: 'मला हे नक्की तपासायचे आहे, फक्त थोडी अधिक माहिती हवी आहे. 🙂 यापैकी काही पाठवाल का?',
  moreChips: { paste: 'पूर्ण संदेश पेस्ट करा', screenshot: 'स्पष्ट स्क्रीनशॉट पाठवा', link: 'तो कुठून आला ती लिंक पाठवा' },
  howLumiChecks: 'लूमी कसे तपासते',
  steps: [
    { title: 'वाचणे', body: 'टेक्स्ट, स्क्रीनशॉट, व्हॉइस नोट, PDF आणि लिंक वाचते.' },
    { title: 'दावे शोधणे', body: 'फॉरवर्डमधील तपासता येतील असे दावे वेगळे करते.' },
    { title: 'शोध', body: 'सरकारी स्रोत आणि फॅक्ट-चेकर्सकडून तारखेसह पुरावे शोधते.' },
    { title: 'निर्णय', body: 'प्रत्येक निर्णय ठरलेले नियम घेतात, AI नाही.' },
    { title: 'स्पष्टीकरण', body: 'सोप्या भाषेत समजावते आणि ग्रुपसाठी नम्र उत्तर देते.' },
  ],
  callSoon: 'लूमीशी कॉल लवकरच सुरू होईल. तोपर्यंत चॅट करा!', chatWithLumi: 'लूमीशी चॅट करा',
  landing: {
    nav: { how: 'कसे काम करते', verdicts: 'निर्णय', languages: 'भाषा' },
    eyebrow: 'फॅमिली ग्रुपमधील फॉरवर्डची तपासणी',
    sub: 'लूमीला कोणताही फॉरवर्ड पाठवा: टेक्स्ट, स्क्रीनशॉट, व्हॉइस नोट, PDF किंवा लिंक. ती सरकारी स्रोत आणि फॅक्ट-चेकर्सकडून तारखेसह पुरावे शोधते, स्पष्ट निर्णय देते आणि तुमच्या ग्रुपसाठी नम्र उत्तर लिहिते.',
    lumiSays: 'फॉरवर्ड आलाय? मला पाठवा!',
    demoLabel: 'लाइव्ह डेमो: लूमी एक फॉरवर्ड तपासत आहे',
    lightMode: 'लाइट मोड',
    forwardTitle: 'जसा आला, तसाच पाठवा',
    forwardSub: 'हाताने टाइप करायची गरज नाही. लूमी हे सगळे वाचते.',
    inputs: {
      text: { title: 'टेक्स्ट', body: 'संदेश जसा आहे तसा पेस्ट किंवा फॉरवर्ड करा.' },
      image: { title: 'स्क्रीनशॉट', body: 'लूमी चित्रातील मजकूर वाचते.' },
      audio: { title: 'व्हॉइस नोट', body: 'ती आधी ऐकून लिहून घेते.' },
      pdf: { title: 'PDF', body: 'नोटीस आणि परिपत्रके, पानोपानी.' },
      url: { title: 'लिंक', body: 'ती पान सुरक्षितपणे उघडून वाचते.' },
    },
    howSub: 'प्रत्येक टप्पा चॅटमध्ये लाइव्ह दिसतो, त्यामुळे काम तुम्हाला दिसते.',
    verdictsTitle: 'चार स्पष्ट निर्णय',
    verdictsSub: 'नेहमी आयकॉन, लेबल आणि कारणासह, फक्त रंगावरून नाही.',
    meaning: {
      VERIFIED: 'विश्वासार्ह स्रोत याला दुजोरा देतात.',
      FALSE: 'विश्वासार्ह स्रोत दाखवतात की हे चुकीचे आहे.',
      OUTDATED: 'एकेकाळी खरे होते, पण आता नवी माहिती आली आहे.',
      PARTLY_SUPPORTED: 'काही भाग खरा आहे; काही चुकीचा आहे किंवा संदर्भ अपुरा आहे.',
    },
    noVerdict: 'माहिती अपुरी आहे? लूमी कधीही अंदाज लावत नाही. ती पूर्ण संदेश, स्पष्ट स्क्रीनशॉट किंवा त्याची लिंक मागते.',
    langTitle: 'तुमच्या कुटुंबाच्या भाषेत',
    langSub: 'स्पष्टीकरण, आवाज आणि पेस्ट करण्यासाठी तयार उत्तर: इंग्रजी, हिंदी आणि मराठीत.',
    trustTitle: 'लूमीवर विश्वास का ठेवावा',
    trust: [
      { title: 'आधी पुरावा, मग निर्णय', body: 'प्रत्येक निर्णय तो ज्या तारखेसह स्रोतांवरून आला त्यांच्याशी जोडलेला असतो.' },
      { title: 'कोणतेही बनावट स्रोत नाहीत', body: 'फक्त खऱ्या शोधातून आणि फॅक्ट-चेक डेटाबेसमधून आलेल्या लिंक दिसतात.' },
      { title: 'निर्णय नियम घेतात, AI नाही', body: 'AI पुरावे वाचते; ठरलेले, तपासलेले नियम निर्णय निवडतात.' },
      { title: 'नम्र, कधीही अपमान नाही', body: 'उत्तर संदेश दुरुस्त करते, पाठवणाऱ्याला नाही.' },
    ],
    ctaTitle: 'आत्ता एखादा फॉरवर्ड आलाय?',
    ctaSub: 'फॅमिली ग्रुपपर्यंत पोहोचण्याआधी, काही सेकंदात तपासा.',
    builtBy: 'बनवणारे',
    disclaimer: 'लूमीकडूनही चूक होऊ शकते. आरोग्य, कायदेशीर किंवा पैशांच्या बाबतीत सरकारी स्रोत किंवा तज्ज्ञांकडून खात्री करा.',
  },
};

export const STR: Record<Lang, Strings> = { en, hi, mr };
