
const MAP_LANG_DICT = {
    'English': 'English',
    'தமிழ்': 'Tamil',
    'తెలుగు': 'Telugu',
    'ಕನ್ನಡ': 'Kannada',
    'മലയാളം': 'Malayalam',
    'हिंदी': 'Hindi',
    'मराठी': 'Marathi',
    'বাংলা': 'Bengali',
    'ગુજરાતી': 'Gujarati',
    'ਪੰਜਾਬੀ': 'Punjabi',
    'ଓଡ଼ିଆ': 'Odia',
    'অসমীয়া': 'Assamese'
};

const SUPERSCRIPT_CODES = [ 0x00B2, 0x00B3, 0x2074 ];

const CATEGORY_DICT = { 'categories' : [ { 'C' : 'person',   'I' : 'person-fill', 'N' : 'Person' },
                                         { 'C' : 'movie',    'I' : 'film',        'N' : 'Movie'  },
                                         { 'C' : 'about',    'I' : 'info-circle', 'N' : 'About'  },
                                       ]
                      };

let MAP_KEYBOARD_DICT = {"devanagari": {"base": "0x900", "vowel": ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ऌ", "ऍ", "ऎ", "ए", "ऐ", "ऑ", "ऒ", "ओ", "औ", "ॠ", "ॡ"], "glyph": ["्", "ा", "ि", "ी", "ु", "ू", "ृ", "ॢ", "ॅ", "ॆ", "े", "ै", "ॉ", "ॊ", "ो", "ौ", "ॄ", "ॣ", "ँ", "ं", "ः"], "consonant": ["क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ", "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न", "ऩ", "प", "फ", "ब", "भ", "म", "य", "र", "ऱ", "ल", "ळ", "ऴ", "व", "श", "ष", "स", "ह", "क़", "ख़", "ग़", "ज़", "ड़", "ढ़", "फ़", "य़"], "special": ["ऽ", "ॐ"], "middle": ["ँ", "ं", "ः"]}, "tamil": {"base": "0xb80", "vowel": ["அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ", "ஓ", "ஔ"], "glyph": ["்", "ா", "ி", "ீ", "ு", "ூ", "ெ", "ே", "ை", "ொ", "ோ", "ௌ"], "consonant": ["க", "ங", "ச", "ஞ", "ட", "த", "ந", "ன", "ண", "ப", "ம", "ய", "ர", "ற", "ல", "ள", "ழ", "வ"], "special": ["ஃ", "ௐ", "ஸ்ரீ"], "middle": ["ஜ", "ஶ", "ஷ", "ஸ", "ஹ", "க்ஷ"]}, "telugu": {"base": "0xc00", "vowel": ["అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ", "ఋ", "ఌ", "ఎ", "ఏ", "ఐ", "ఒ", "ఓ", "ఔ", "ౠ", "ౡ"], "glyph": ["్", "ా", "ి", "ీ", "ు", "ూ", "ృ", "ౢ", "ె", "ే", "ై", "ొ", "ో", "ౌ", "ౄ", "ౣ", "ఁ", "ం", "ః"], "consonant": ["క", "ఖ", "గ", "ఘ", "ఙ", "చ", "ఛ", "జ", "ఝ", "ఞ", "ట", "ఠ", "డ", "ఢ", "ణ", "త", "థ", "ద", "ధ", "న", "ప", "ఫ", "బ", "భ", "మ", "య", "ర", "ఱ", "ల", "ళ", "ఴ", "వ", "శ", "ష", "స", "హ"], "special": ["ఽ"], "middle": ["ఁ", "ం", "ః"]}, "kannada": {"base": "0xc80", "vowel": ["ಅ", "ಆ", "ಇ", "ಈ", "ಉ", "ಊ", "ಋ", "ಌ", "ಎ", "ಏ", "ಐ", "ಒ", "ಓ", "ಔ", "ೠ", "ೡ"], "glyph": ["್", "ಾ", "ಿ", "ೀ", "ು", "ೂ", "ೃ", "ೢ", "ೆ", "ೇ", "ೈ", "ೊ", "ೋ", "ೌ", "ೄ", "ೣ", "ಁ", "ಂ", "ಃ"], "consonant": ["ಕ", "ಖ", "ಗ", "ಘ", "ಙ", "ಚ", "ಛ", "ಜ", "ಝ", "ಞ", "ಟ", "ಠ", "ಡ", "ಢ", "ಣ", "ತ", "ಥ", "ದ", "ಧ", "ನ", "ಪ", "ಫ", "ಬ", "ಭ", "ಮ", "ಯ", "ರ", "ಲ", "ವ", "ಶ", "ಷ", "ಸ", "ಹ"], "special": ["ಽ"], "middle": ["ಁ", "ಂ", "ಃ"]}, "malayalam": {"base": "0xd00", "vowel": ["അ", "ആ", "ഇ", "ഈ", "ഉ", "ഊ", "ഋ", "ഌ", "എ", "ഏ", "ഐ", "ഒ", "ഓ", "ഔ", "ൠ", "ൡ"], "glyph": ["്", "ാ", "ി", "ീ", "ു", "ൂ", "ൃ", "ൢ", "െ", "േ", "ൈ", "ൊ", "ോ", "ൌ", "ൄ", "ൣ", "ം", "ഃ"], "consonant": ["ക", "ഖ", "ഗ", "ഘ", "ങ", "ച", "ഛ", "ജ", "ഝ", "ഞ", "ട", "ഠ", "ഡ", "ഢ", "ണ", "ത", "ഥ", "ദ", "ധ", "ന", "ഩ", "പ", "ഫ", "ബ", "ഭ", "മ", "യ", "ര", "റ", "ല", "ള", "ഴ", "വ", "ശ", "ഷ", "സ", "ഹ"], "special": ["ഽ"], "middle": ["ം", "ഃ"]}, "sanskrit": {"base": "0x900", "vowel": ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ऌ", "ऍ", "ए", "ऐ", "ऑ", "ओ", "औ", "ॠ", "ॡ"], "glyph": ["्", "ा", "ि", "ी", "ु", "ू", "ृ", "ॢ", "ॅ", "े", "ै", "ॉ", "ो", "ौ", "ॄ", "ॣ", "ँ", "ं", "ः"], "consonant": ["क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ", "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह", "क़", "ख़", "ग़", "ज़", "ड़", "ढ़", "फ़", "य़"], "special": ["ऽ", "ॐ"], "middle": ["ँ", "ं", "ः"]}, "hindi": {"base": "0x900", "vowel": ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ऌ", "ऍ", "ए", "ऐ", "ऑ", "ओ", "औ", "ॠ", "ॡ"], "glyph": ["्", "ा", "ि", "ी", "ु", "ू", "ृ", "ॢ", "ॅ", "े", "ै", "ॉ", "ो", "ौ", "ॄ", "ॣ", "ँ", "ं", "ः"], "consonant": ["क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ", "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह", "क़", "ख़", "ग़", "ज़", "ड़", "ढ़", "फ़", "य़"], "special": ["ऽ", "ॐ"], "middle": ["ँ", "ं", "ः"]}, "marathi": {"base": "0x900", "vowel": ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ऌ", "ऍ", "ए", "ऐ", "ऑ", "ओ", "औ", "ॠ", "ॡ"], "glyph": ["्", "ा", "ि", "ी", "ु", "ू", "ृ", "ॢ", "ॅ", "े", "ै", "ॉ", "ो", "ौ", "ॄ", "ॣ", "ँ", "ं", "ः"], "consonant": ["क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ", "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "ळ", "व", "श", "ष", "स", "ह", "क़", "ख़", "ग़", "ज़", "ड़", "ढ़", "फ़", "य़"], "special": ["ऽ"], "middle": ["ँ", "ं", "ः"]}, "bengali": {"base": "0x980", "vowel": ["অ", "আ", "ই", "ঈ", "উ", "ঊ", "ঋ", "ঌ", "এ", "ঐ", "ও", "ঔ", "ৠ", "ৡ"], "glyph": ["্", "া", "ি", "ী", "ু", "ূ", "ৃ", "ৢ", "ে", "ৈ", "ো", "ৌ", "ৄ", "ৣ", "ঁ", "ং", "ঃ"], "consonant": ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ", "ট", "ঠ", "ড", "ঢ", "ণ", "ত", "থ", "দ", "ধ", "ন", "প", "ফ", "ব", "ভ", "ম", "য", "র", "ল", "শ", "ষ", "স", "হ"], "special": ["ঽ"], "middle": ["ঁ", "ং", "ঃ"]}, "punjabi": {"base": "0xa00", "vowel": ["ਅ", "ਆ", "ਇ", "ਈ", "ਉ", "ਊ", "ਏ", "ਐ", "ਓ", "ਔ"], "glyph": ["੍", "ਾ", "ਿ", "ੀ", "ੁ", "ੂ", "ੇ", "ੈ", "ੋ", "ੌ", "ਁ", "ਂ", "ਃ"], "consonant": ["ਕ", "ਖ", "ਗ", "ਘ", "ਙ", "ਚ", "ਛ", "ਜ", "ਝ", "ਞ", "ਟ", "ਠ", "ਡ", "ਢ", "ਣ", "ਤ", "ਥ", "ਦ", "ਧ", "ਨ", "ਪ", "ਫ", "ਬ", "ਭ", "ਮ", "ਯ", "ਰ", "ਲ", "ਲ਼", "ਵ", "ਸ਼", "ਸ", "ਹ"], "special": [], "middle": ["ਁ", "ਂ", "ਃ"]}, "gujarati": {"base": "0xa80", "vowel": ["અ", "આ", "ઇ", "ઈ", "ઉ", "ઊ", "ઋ", "ઌ", "એ", "ઐ", "ઓ", "ઔ", "ૠ", "ૡ"], "glyph": ["્", "ા", "િ", "ી", "ુ", "ૂ", "ૃ", "ૢ", "ે", "ૈ", "ો", "ૌ", "ૄ", "ૣ", "ઁ", "ં", "ઃ"], "consonant": ["ક", "ખ", "ગ", "ઘ", "ઙ", "ચ", "છ", "જ", "ઝ", "ઞ", "ટ", "ઠ", "ડ", "ઢ", "ણ", "ત", "થ", "દ", "ધ", "ન", "પ", "ફ", "બ", "ભ", "મ", "ય", "ર", "લ", "વ", "શ", "ષ", "સ", "હ"], "special": ["ઽ"], "middle": ["ઁ", "ં", "ઃ"]}, "odia": {"base": "0xb00", "vowel": ["ଅ", "ଆ", "ଇ", "ଈ", "ଉ", "ଊ", "ଋ", "ଌ", "ଏ", "ଐ", "ଓ", "ଔ", "ୠ", "ୡ"], "glyph": ["୍", "ା", "ି", "ୀ", "ୁ", "ୂ", "ୃ", "ୢ", "େ", "ୈ", "ୋ", "ୌ", "ୄ", "ୣ", "ଁ", "ଂ", "ଃ"], "consonant": ["କ", "ଖ", "ଗ", "ଘ", "ଙ", "ଚ", "ଛ", "ଜ", "ଝ", "ଞ", "ଟ", "ଠ", "ଡ", "ଢ", "ଣ", "ତ", "ଥ", "ଦ", "ଧ", "ନ", "ପ", "ଫ", "ବ", "ଭ", "ମ", "ଯ", "ର", "ଲ", "ଵ", "ଶ", "ଷ", "ସ", "ହ"], "special": ["ଽ"], "middle": ["ଁ", "ଂ", "ଃ"]}, "assamese": {"base": "0x980", "vowel": ["অ", "আ", "ই", "ঈ", "উ", "ঊ", "ঋ", "ঌ", "এ", "ঐ", "ও", "ঔ", "ৠ", "ৡ"], "glyph": ["্", "া", "ি", "ী", "ু", "ূ", "ৃ", "ৢ", "ে", "ৈ", "ো", "ৌ", "ৄ", "ৣ", "ঁ", "ং", "ঃ"], "consonant": ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ", "ট", "ঠ", "ড", "ঢ", "ণ", "ত", "থ", "দ", "ধ", "ন", "প", "ফ", "ব", "ভ", "ম", "য", "র", "ল", "শ", "ষ", "স", "হ"], "special": ["ঽ"], "middle": ["ঁ", "ং", "ঃ"]}, "english": {"base": "0", "vowel": ["a", "A", "i", "I", "u", "U", ".R", "l.R", "aE", "e", "E", "ai", "aO", "o", "O", "au", ".R.R", "l.R.R"], "glyph": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""], "consonant": ["k", "kh", "g", "gh", "G", "c", "ch", "j", "jh", "J", "T", "Th", "D", "Dh", "N", "t", "th", "d", "dh", "n", ".n", "p", "ph", "b", "bh", "m", "y", "r", "R", "l", "L", "zh", "v", "S", "sh", "s", "h", "q", "qh", "g2", "z", "d3", "d3h", "f", "Y"], "special": [], "middle": []}};

