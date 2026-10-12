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
};

export const STR: Record<Lang, Strings> = { en, hi, mr };
