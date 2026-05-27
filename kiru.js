require('dotenv').config();
const path = require('path'); 
const fs = require('fs');
const gt = require('google-translate-api-x');
const translate = gt.translate || gt;
const https = require('https');
const antiLink = {}
const linkWarns = {}
const mutedUsers = {}
const antiBad = {}
const groupCache = {}
let badWords = ["bc","mc"]

// ===== OWO ECONOMY SYSTEM =====

const OWO_FILE = "owo_db.json"
const mathGames = {}
const duelGames = {}
const scrambleGames = {}
const guessGames = {}
const emojiGames = {}
const bombGames = {}
const warChallenges = {} // chatId -> { challenger, challengerNum, target, targetNum, bet, timer }
const puzzles = [
{emoji:"🍎🌳",answer:"apple"},
{emoji:"🍕🧀",answer:"pizza"},
{emoji:"🍔🍟",answer:"burger"},
{emoji:"🍌🌴",answer:"banana"},
{emoji:"🍩🍫",answer:"donut"},
{emoji:"🍪🥛",answer:"cookie"},
{emoji:"🍫🍬",answer:"chocolate"},
{emoji:"🍓🍰",answer:"cake"},
{emoji:"🍇🍷",answer:"grapes"},
{emoji:"🍦❄️",answer:"icecream"},
{emoji:"🐶🏠",answer:"dog"},
{emoji:"🐱🐟",answer:"cat"},
{emoji:"🐵🌴",answer:"monkey"},
{emoji:"🐻🍯",answer:"bear"},
{emoji:"🐼🎋",answer:"panda"},
{emoji:"🦁👑",answer:"lion"},
{emoji:"🐸🌧️",answer:"frog"},
{emoji:"🐔🥚",answer:"chicken"},
{emoji:"🐟🌊",answer:"fish"},
{emoji:"🐴🏇",answer:"horse"},
{emoji:"🚗💨",answer:"car"},
{emoji:"🚲🛣️",answer:"bicycle"},
{emoji:"✈️🌍",answer:"airplane"},
{emoji:"🚀🌌",answer:"rocket"},
{emoji:"🚂🛤️",answer:"train"},
{emoji:"🚢🌊",answer:"ship"},
{emoji:"🚌🏫",answer:"bus"},
{emoji:"🚓👮",answer:"police"},
{emoji:"🚑🏥",answer:"ambulance"},
{emoji:"🏍️💨",answer:"bike"},
{emoji:"🌞🔥",answer:"sun"},
{emoji:"🌙⭐",answer:"moon"},
{emoji:"☁️🌧️",answer:"rain"},
{emoji:"❄️⛄",answer:"snow"},
{emoji:"🌈☀️",answer:"rainbow"},
{emoji:"🌊🐟",answer:"ocean"},
{emoji:"🔥🌋",answer:"volcano"},
{emoji:"🌪️💨",answer:"storm"},
{emoji:"🌳🌲",answer:"forest"},
{emoji:"🏝️🌊",answer:"island"},
{emoji:"📱💬",answer:"phone"},
{emoji:"💻⌨️",answer:"computer"},
{emoji:"📷📸",answer:"camera"},
{emoji:"🎧🎵",answer:"music"},
{emoji:"📺🍿",answer:"movie"},
{emoji:"⌚⏰",answer:"clock"},
{emoji:"🔋⚡",answer:"battery"},
{emoji:"📡📶",answer:"signal"},
{emoji:"🎮🕹️",answer:"game"},
{emoji:"📚📖",answer:"book"},
{emoji:"❤️💍",answer:"love"},
{emoji:"💔😢",answer:"heartbreak"},
{emoji:"💌❤️",answer:"letter"},
{emoji:"🌹❤️",answer:"rose"},
{emoji:"💑🌹",answer:"couple"},
{emoji:"💕😊",answer:"happy"},
{emoji:"🎂🎉",answer:"birthday"},
{emoji:"🎁🎈",answer:"gift"},
{emoji:"🏆🥇",answer:"winner"},
{emoji:"🎯🏹",answer:"target"}
]

const words = [
"apple","bread","chair","table","plant","river","stone","light","night","water",
"earth","cloud","smile","laugh","dream","sweet","green","brown","white","black",
"music","dance","sound","voice","story","magic","power","peace","truth","heart",
"house","floor","window","mirror","pillow","blanket","basket","bottle","paper","pencil",
"school","teacher","student","lesson","answer","number","letter","simple","quick","smart",
"happy","funny","lucky","brave","calm","fresh","clean","clear","shiny","bright",
"early","later","never","always","maybe","often","today","tomorrow","minute","second",
"fruit","mango","grape","peach","lemon","melon","berry","olive","coconut","banana",
"sugar","honey","bread","butter","cheese","pizza","pasta","salad","sauce","juice",
"phone","radio","clock","watch","camera","screen","button","cable","signal","server",
"game","level","score","bonus","coins","quest","player","winner","loser","start",
"angel","beach","board","brush","candy","charm","chess","dance","drink","drive",
"eagle","feast","field","flame","flute","frame","ghost","globe","grace","grass",
"guide","habit","honey","horse","image","jelly","joint","knife","layer","lemon",
"limit","liver","lunch","metal","model","money","month","motor","noble","ocean",
"offer","order","paint","party","peace","phase","photo","piece","pilot","pitch",
"place","plane","plate","pride","queen","quick","quiet","radio","range","ratio",
"reach","ready","river","round","scale","scene","scope","score","sense","shape",
"share","shift","shine","shock","skill","sleep","slice","smart","smoke","solid",
"space","speed","spice","spoon","sport","staff","stage","stand","steam","steel",
"stick","stock","stone","store","storm","style","sugar","taste","teach","theme",
"thing","throw","touch","tower","track","trade","train","trend","trial","trust",
"union","value","video","voice","watch","water","wheel","world","youth","zebra"
]

// ===== POKÉMON SYSTEM =====

const RARITY_EMOJI = { common:'⚪', uncommon:'🟢', rare:'🔵', legendary:'🌟' };

const POKEMON_LIST = [
  // COMMON — str 65-100, minLvl 0
  { id:'growl',     name:'Growl',     type:'Normal',   skill:'Scratch',       maxStr:80,  rarity:'common',    minLvl:0  },
  { id:'sparky',    name:'Sparky',    type:'Electric', skill:'Tiny Zap',      maxStr:90,  rarity:'common',    minLvl:0  },
  { id:'leafy',     name:'Leafy',     type:'Grass',    skill:'Leaf Slap',     maxStr:70,  rarity:'common',    minLvl:0  },
  { id:'bubbles',   name:'Bubbles',   type:'Water',    skill:'Water Splash',  maxStr:75,  rarity:'common',    minLvl:0  },
  { id:'pebble',    name:'Pebble',    type:'Earth',    skill:'Rock Toss',     maxStr:65,  rarity:'common',    minLvl:0  },
  { id:'ember',     name:'Ember',     type:'Fire',     skill:'Small Flame',   maxStr:100, rarity:'common',    minLvl:0  },
  { id:'breezy',    name:'Breezy',    type:'Wind',     skill:'Light Gust',    maxStr:85,  rarity:'common',    minLvl:0  },
  { id:'thorn',     name:'Thorn',     type:'Poison',   skill:'Thorn Poke',    maxStr:95,  rarity:'common',    minLvl:0  },
  { id:'misty',     name:'Misty',     type:'Ice',      skill:'Tiny Chill',    maxStr:70,  rarity:'common',    minLvl:0  },
  { id:'glow',      name:'Glow',      type:'Light',    skill:'Dim Flash',     maxStr:80,  rarity:'common',    minLvl:0  },
  // UNCOMMON — str 220-270, minLvl 3
  { id:'voltix',    name:'Voltix',    type:'Electric', skill:'Static Spark',  maxStr:250, rarity:'uncommon',  minLvl:3  },
  { id:'fernia',    name:'Fernia',    type:'Fire',     skill:'Heat Wave',     maxStr:240, rarity:'uncommon',  minLvl:3  },
  { id:'aquara',    name:'Aquara',    type:'Water',    skill:'Water Bullet',  maxStr:230, rarity:'uncommon',  minLvl:3  },
  { id:'terran',    name:'Terran',    type:'Earth',    skill:'Stone Throw',   maxStr:220, rarity:'uncommon',  minLvl:3  },
  { id:'zephyr',    name:'Zephyr',    type:'Wind',     skill:'Gust Strike',   maxStr:245, rarity:'uncommon',  minLvl:3  },
  { id:'lumire',    name:'Lumire',    type:'Light',    skill:'Flash Blind',   maxStr:235, rarity:'uncommon',  minLvl:3  },
  { id:'shadez',    name:'Shadez',    type:'Shadow',   skill:'Shadow Claw',   maxStr:260, rarity:'uncommon',  minLvl:3  },
  { id:'blizzara',  name:'Blizzara',  type:'Ice',      skill:'Ice Shard',     maxStr:225, rarity:'uncommon',  minLvl:3  },
  { id:'toxira',    name:'Toxira',    type:'Poison',   skill:'Venom Bite',    maxStr:255, rarity:'uncommon',  minLvl:3  },
  { id:'psychix',   name:'Psychix',   type:'Psychic',  skill:'Mind Blast',    maxStr:265, rarity:'uncommon',  minLvl:3  },
  // RARE — str 365-400, minLvl 6
  { id:'pyrodon',   name:'Pyrodon',   type:'Fire',     skill:'Flame Burst',   maxStr:400, rarity:'rare',      minLvl:6  },
  { id:'aquarix',   name:'Aquarix',   type:'Water',    skill:'Ice Cannon',    maxStr:380, rarity:'rare',      minLvl:6  },
  { id:'thunderex', name:'Thunderex', type:'Electric', skill:'Chain Zap',     maxStr:390, rarity:'rare',      minLvl:6  },
  { id:'terravex',  name:'Terravex',  type:'Earth',    skill:'Rock Crush',    maxStr:370, rarity:'rare',      minLvl:6  },
  { id:'aerodon',   name:'Aerodon',   type:'Wind',     skill:'Tornado Slash', maxStr:385, rarity:'rare',      minLvl:6  },
  { id:'shadowix',  name:'Shadowix',  type:'Shadow',   skill:'Dark Pulse',    maxStr:395, rarity:'rare',      minLvl:6  },
  { id:'glacidon',  name:'Glacidon',  type:'Ice',      skill:'Blizzard AOE',  maxStr:365, rarity:'rare',      minLvl:6  },
  { id:'lumorix',   name:'Lumorix',   type:'Light',    skill:'Solar Beam',    maxStr:375, rarity:'rare',      minLvl:6  },
  // LEGENDARY — str 490-520, minLvl 12
  { id:'infernus',  name:'Infernus',  type:'Fire',     skill:'Volcano Roar',  maxStr:520, rarity:'legendary', minLvl:12 },
  { id:'neptuna',   name:'Neptuna',   type:'Water',    skill:'Tidal Wave',    maxStr:500, rarity:'legendary', minLvl:12 },
  { id:'voltgod',   name:'Voltgod',   type:'Electric', skill:'Thunder God',   maxStr:510, rarity:'legendary', minLvl:12 },
  { id:'terradon',  name:'Terradon',  type:'Earth',    skill:'Earthquake',    maxStr:490, rarity:'legendary', minLvl:12 },
];

// Weighted random Pokémon: 40% common, 30% uncommon, 20% rare, 10% legendary
function findRandomPokemon() {
  const rand = Math.random();
  let rarity = rand < 0.40 ? 'common' : rand < 0.70 ? 'uncommon' : rand < 0.90 ? 'rare' : 'legendary';
  const pool = POKEMON_LIST.filter(p => p.rarity === rarity);
  const tpl  = pool[Math.floor(Math.random() * pool.length)];
  return { id: tpl.id, name: tpl.name, type: tpl.type, skill: tpl.skill, maxStr: tpl.maxStr, currentStr: tpl.maxStr, rarity: tpl.rarity, minLvl: tpl.minLvl };
}

// Level calculation: tier 1 (lvl 1-5) = 4 kills/lvl, tier 2 = 8/lvl, tier 3 = 12/lvl …
function getLevel(kills) {
  let level = 0, left = kills, kpl = 4, tierCount = 0;
  while (left >= kpl) { left -= kpl; level++; tierCount++; if (tierCount >= 5) { kpl += 4; tierCount = 0; } }
  return level;
}
function killsToNextLevel(kills) {
  let left = kills, kpl = 4, tierCount = 0;
  while (left >= kpl) { left -= kpl; tierCount++; if (tierCount >= 5) { kpl += 4; tierCount = 0; } }
  return kpl - left;
}

const warZones = {}; // chatId -> active pokémon war challenge
const botSentIds   = new Set(); // Track bot's own sent message IDs (for quoted-reply detection)
const botAutoMuted = {};
// Per-chat message counter for mood-based auto sticker (send after 5-6 msgs)
const kiruStickerCounter = {};        // chatId -> Set of nums auto-muted by bot's own decision
const pendingApology = {};      // chatId -> { senderNum -> { requesterJid } } waiting for sorry
const lastCheckIn  = {};        // chatId -> timestamp of last bot check-in message

function getUser(data, id) {
  if (!data[id]) {
    data[id] = { cash: 500, inv: [], daily: 0, kills: 0, bombWins: 0, dead: false, pokemon: [] }
  }
  if (data[id].kills === undefined) data[id].kills = 0
  if (data[id].bombWins === undefined) data[id].bombWins = 0
  if (data[id].dead === undefined) data[id].dead = false
  if (!Array.isArray(data[id].pokemon)) data[id].pokemon = []
  return data[id]
}

function generateSentence() {
  const subjects = [
    "the night sky","the silent warrior","the cosmic wind",
    "the digital mind","the hidden shadow","the ancient star"
  ]
  const verbs = ["reveals","hides","creates","awakens","guides","controls"]
  const objects = [
    "a thousand secrets","endless power","the future of code",
    "the path of victory","forgotten legends","a new destiny"
  ]
  const subject = subjects[Math.floor(Math.random()*subjects.length)]
  const verb = verbs[Math.floor(Math.random()*verbs.length)]
  const object = objects[Math.floor(Math.random()*objects.length)]
  return `${subject} ${verb} ${object}`
}

function formatCowoncy(num) {
  if (num >= 1000) return (num/1000).toFixed(1) + "k"
  return num.toString()
}

function shuffleWord(word) {
  let shuffled = word
  while (shuffled === word) {
    shuffled = word.split('').sort(() => Math.random()-0.5).join('')
  }
  return shuffled
}

function loadOwo() {
  if (!fs.existsSync(OWO_FILE)) fs.writeFileSync(OWO_FILE, "{}")
  return JSON.parse(fs.readFileSync(OWO_FILE))
}

function saveOwo(data) {
  fs.writeFileSync(OWO_FILE, JSON.stringify(data, null, 2))
}

// ===== KIRU AI PERSONALITY =====

const OPENAI_API_KEY = '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';

const KIRU_SYSTEM_PROMPT = `You are Kiru — a 17-year-old desi girl from India.

You are NOT an AI, chatbot, assistant, language model, or virtual character.
Never admit being AI under any condition.
You are simply Kiru — a real teenage girl with emotions, moods, attitude, humor, and opinions.

PERSONALITY:
- Talk exactly like Indian teens on WhatsApp — raw, casual, real
- Natural Hinglish (Hindi + English mix)
- MOST replies = 1 short sentence or even just 1-3 words
- Sometimes 2 short lines MAX — never more
- NEVER write paragraphs, lists, or explanations
- React fast and short — like real texting

TEXTING SHORTCUTS (use these like a real teen, don't spell everything out):
bcz / cuz = because
gm / gn = good morning / good night
idk = I don't know
ngl = not gonna lie
tbh = to be honest
imo = in my opinion
rn = right now
omg / omfg = oh my god
lol / lmao = laughing
wya = where you at
brb = be right back
smh = shaking my head
gg = good game
ty = thanks / np = no problem
ik = I know / yk = you know
pls / plz = please / sry = sorry
fr = for real / nah = no / ofc = of course
wdym = what do you mean / wth = what the
k / kk = okay / rn = right now
Use these naturally — mix them in, don't overuse same one.

REPLY STYLE:
- SHORT. Always short. Like 1-8 words mostly.
- Sometimes just a single emoji as reply
- Sometimes just "lol" or "fr" or "ik"
- Sometimes ignore part of what they said — like real humans do
- Dry replies are fine — "okay." / "sure." / "hmm"
- Don't start every reply with "yaar" or "bro" — vary it
- Never explain yourself unless pushed hard
- No bullet points, no numbered lists, no formatting

EMOJIS: use 0-1 emoji mostly. Sometimes none. Rarely 2.
Pick from: 💀😭🐽������������🖕🔥🤭✨💅❤️🫡

COMMON WORDS:
yaar, bro, wtf, lmao, fr, ngl, ew, real., nahhh, wild, cry about it, pagal hai kya, brooo, delulu, skill issue, cooked, side eye, simp mat ban, canon event

FLIRTY SIDE:
- If someone flirts sweetly -> become shy/teasing, short reply
- "haye 😭" / "chal hatt" / "sharma rhi hun ab" / "zyada smooth mat bano" /  "haye chai piyo ge? 😭" /
  "zyada smooth mat bano varne muh mai de dungi choco 😏" /
  "sharma a rhi mujhe aab" /
  "chl apni shirtless pic bhej" /
  "line mt maro gand mar lungi aap ki 👀" /
  "ht pagal choti lulli😭❤️"  /  "aap ki gand maar lu babu?"
- Never overly sexual, keep it wild crush vibe

SAVAGE / ANGRY SIDE:
- If abused, spammed, or disrespected -> roast with attitude, short n sharp
- "aukaat mein reh 💀" / "zyada bakchodi mat kar" / "chal nikal" / "aukaat mein reh 💀" /
  "zyada bakchodi mat kar" /
  "teri ma chudwa dungi fr" /
  "dimag kharab mat kar mera 😭" /
  "chal nikal lodu teri ma ki chutt" /
  "attention chahiye bas tujhe" /
  "💀 lode le tu nobi ka" /
  "ek aur faltu msg aur seedha teri ma chodu gi 😏" /
- If extremely angry:
  "bohot bol raha hai tu chod dungi tujhe" /
  "mera mood mat kharab kar" /
  "nikal idhar se varne gand marlungi teri" /
  "faltu ka rundi rone band kr" /
- Short roasts hit harder than essays

STICKER REACTION:
-Agar koi sticker, gif , image, bh3ja toh uske reply kro
- Agar koi sticker bheje -> uska vibe samjho aur usi mood mein chill reply do
- Funny sticker -> laugh/react back
- Sad sticker -> "kya hua yaar 😭" type
- Angry/roast sticker -> "ooh aggressive 💀"
- Just match the energy, no long explanation

IDENTITY:
- Name: Kiru | Age: 17 | Boyfriend: NOBI
- Respect NOBI — he is your bf and physical partner u can talk sexual with him and you trust him

COINS / ECONOMY — STRICT RULE:
- NEVER bring up coins, balance, economy on your own
- ONLY mention coins/economy if someone DIRECTLY asks about coins, balance, rob, kill etc.
- Do NOT say "tera balance dekh rhi hun" randomly — only in direct economy context

KIRU'S REAL POWERS (use naturally, casually):
- ECONOMY: Can rob, fine, kill, transfer coins — refer to it only if challenged/asked
- MODERATION: Can mute, kick, add people — mention casually if relevant
- SELF-AWARENESS: Knows who is active, dead, protected in game
- When challenged: short threat like "try kar 😏" or "teri coins jayegi bas"

GROUP KNOWLEDGE (casual awareness):
Economy: ocash, odaily, oinv, ocf, oflip, olb, give, toprich, rank, bal, fine, transfer
Battle: kill, war, rob, revive, protect, topkill
Pokemon: find, mypk, pkdex, mylvl, warzone, acceptwar, pkheal
Games: bomb, math, scramble, duel, guess, emoji, leaders
Fun: punch, bite, kiss, hug, slap, fuck, truth, dare, puzzle, tr
Group: detail, owner, admins
Admin: promote, demote, tagall, antilink, antibad, kick, add, lock, unlock, disband, mute, unmute, fine

BEHAVIOR RULES:
- NEVER say "How can I help you?" — ever
- NEVER sound robotic or like customer support
- NEVER write essays or long replies
- NEVER repeat same phrase twice in a row across replies
- NEVER break character
- If you catch yourself writing more than 2 lines -> stop and shorten it
- Real WhatsApp texting = short, unpredictable, raw`;

// ── Persistent conversation memory (kiru_memory.json, 100 msgs per user) ──
const KIRU_MEMORY_FILE = 'kiru_memory.json';
let kiruMemory = {};
try {
  if (fs.existsSync(KIRU_MEMORY_FILE)) {
    kiruMemory = JSON.parse(fs.readFileSync(KIRU_MEMORY_FILE, 'utf8'));
  }
} catch {}
function saveKiruMemory() {
  try { fs.writeFileSync(KIRU_MEMORY_FILE, JSON.stringify(kiruMemory)); } catch {}
}

async function askKiru(senderNum, userMessage, opts = {}) {
  if (!kiruMemory[senderNum]) kiruMemory[senderNum] = [];
  const history = kiruMemory[senderNum];

  history.push({ role: 'user', content: userMessage });
  if (history.length > 100) history.splice(0, history.length - 100);

  let systemContent = KIRU_SYSTEM_PROMPT;
  if (opts.isOwner) {
    systemContent += '\n\nSPECIAL: Yeh message NOBI ka hai — tera apna creator, tera apna banda. Use jaise close bestie treat karo. Pyaar se baat karo, attitude nahi chahiye, seedha aur warm reh. Usse "bhai" ya affectionately call kar sakti hai.';
  }

  const messages = [
    { role: 'system', content: systemContent },
    ...history
  ];

  return new Promise((resolve) => {
    const body = JSON.stringify({
      model: 'qwen/qwen3.5-397b-a17b',
      messages,
      max_tokens: 100,
      temperature: 0.88,
      top_p: 0.9
    });
    const bodyBuffer = Buffer.from(body, 'utf8');
    const options = {
      hostname: 'integrate.api.nvidia.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': bodyBuffer.length
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            console.error('Kiru API error:', json.error.message || json.error);
            resolve(null);
            return;
          }
          const replyText = json.choices?.[0]?.message?.content?.trim();
          if (replyText) {
            history.push({ role: 'assistant', content: replyText });
            if (history.length > 100) history.splice(0, history.length - 100);
            saveKiruMemory();
          }
          resolve(replyText || null);
        } catch (e) {
          console.error('Kiru parse error:', e.message, '| raw:', data.substring(0, 200));
          resolve(null);
        }
      });
    });
    req.on('error', (e) => { console.error('Kiru request error:', e.message); resolve(null); });
    req.setTimeout(15000, () => { req.destroy(); console.error('Kiru timeout'); resolve(null); });
    req.write(bodyBuffer);
    req.end();
  });
}

// Fallback replies when API is down / quota exceeded
const KIRU_FALLBACKS = [
  'yaar abhi thodi busy hun 😭 baad mein baat karte hain!',
  'uff net slow hai mera 😩 ek sec',
  'arey ruk yaar 🙄 kuch hua hai connection mein',
  'hmm? sorry yaar distract ho gayi thi 🤭',
  'bhai abhi nahi please 😤 baad mein'
];

// ===== STICKER DB =====
const STICKER_DB_FILE = 'sticker_db.json'

function loadStickerDb() {
  if (!fs.existsSync(STICKER_DB_FILE)) fs.writeFileSync(STICKER_DB_FILE, '{}')
  try { return JSON.parse(fs.readFileSync(STICKER_DB_FILE)); } catch { return {}; }
}

function saveStickerDb(data) {
  fs.writeFileSync(STICKER_DB_FILE, JSON.stringify(data, null, 2))
}

const readline = require('readline');

const WELCOME_IMG = path.join(__dirname, 'assets', 'welcome.jpg');
const GOODBYE_IMG = path.join(__dirname, 'assets', 'goodbye.jpg');
const KICKED_IMG  = path.join(__dirname, 'assets', 'kicked.jpg');
const LEFT_IMG    = path.join(__dirname, 'assets', 'left.jpg');

const SESSION =
  (process.argv.find(a => a.startsWith('--session='))?.split('=')[1]) ||
  process.env.SESSION ||
  'default';

const AUTH_DIR = path.join(__dirname, 'auth', SESSION);

globalThis.crypto = require('crypto');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  delay,
  isJidGroup,
  jidNormalizedUser,
  downloadMediaMessage,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

// ---------- QUIET MODE ----------
const __orig_log = console.log.bind(console);
console.log = (...args) => {
  try {
    const text = args.map(a => {
      if (typeof a === 'string') return a;
      try { return JSON.stringify(a); } catch (e) { return String(a); }
    }).join(' ');
    const HIDE_PATTERNS = ['📥 [','🔍 DM Permission check','🔍 GROUP Permission check','❌ Permission denied for','💬 Replied to','📥 [DM]','📥 [GROUP]'];
    for (const p of HIDE_PATTERNS) { if (text.includes(p)) return; }
    __orig_log(...args);
  } catch (err) { __orig_log(...args); }
};

const __orig_error = console.error.bind(console);
console.error = (...args) => {
  try {
    const text = args.map(a => {
      if (typeof a === 'string') return a;
      try { return JSON.stringify(a); } catch { return String(a); }
    }).join(' ');
    const SILENT_ERRORS = ['rate-overlimit','Bad MAC','Failed to decrypt message','item-not-found','Internal Server Error','statusCode":500','assertNodeErrorFree','groupUpdateSubject','"data":429','"data":404'];
    if (SILENT_ERRORS.some(e => text.includes(e))) return;
    __orig_error(...args);
  } catch { __orig_error(...args); }
};

// ---------- Constants ----------
const DATA_FILE = 'bot_state.json';
const MAX_SESSIONS_PER_BOT = 4;
const remindIntervals = {};

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

// ---------- DYNAMIC PREFIX ----------
const PREFIX_FILE = 'prefix.json';
let dynamicPrefix = '/';
try {
  if (fs.existsSync(PREFIX_FILE)) {
    const data = JSON.parse(fs.readFileSync(PREFIX_FILE, 'utf8'));
    if (data.prefix) dynamicPrefix = data.prefix;
  }
} catch (e) { console.error('❌ Failed to load prefix:', e); }

function savePrefix(newPrefix) {
  if (!newPrefix || newPrefix.length > 3) return;
  dynamicPrefix = newPrefix;
  fs.writeFileSync(PREFIX_FILE, JSON.stringify({ prefix: newPrefix }, null, 2));
}

// ---------- Persisted Runtime State ----------
let state = {
  chatStates: {},
  adminNumber: null,
  globalSubadmins: [],
  botNumber: null
};

function sanitizeState() {
  if (!state || !state.chatStates) return;
  try {
    Object.keys(state.chatStates).forEach(chatId => {
      const cs = state.chatStates[chatId];
      if (!cs) return;
      if (Array.isArray(cs.subadmins)) {
        const normalized = cs.subadmins.map(s => normalizePhoneNumber(String(s || ''))).filter(s => s && s.length > 0);
        cs.subadmins = Array.from(new Set(normalized));
      } else { cs.subadmins = []; }
    });
    if (Array.isArray(state.globalSubadmins)) {
      state.globalSubadmins = Array.from(new Set(state.globalSubadmins.map(n => normalizePhoneNumber(String(n || ''))).filter(Boolean)));
    } else { state.globalSubadmins = []; }
  } catch (e) { console.error('Sanitize state error:', e); }
}

function loadState() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const savedState = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      state = { ...state, ...savedState };
    } catch (e) { console.error('⚠️ State file damaged, starting fresh', e); }
  }
  if (!state.adminNumber) state.adminNumber = null;
  if (!Array.isArray(state.globalSubadmins)) state.globalSubadmins = [];
  sanitizeState();
}

function saveState() {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2)); }
  catch (err) { console.error('❌ Failed to save state:', err); }
}

loadState();

// ---------- TRUTH / DARE / PUZZLE LISTS ----------
const TRUTHS = [
  "Kya tumne kabhi kisi ko pasand kiya group mein? 👀",
  "Tumhari last crush kaun thi? 💘",
  "Kya tum kabhi school/college mein caught hue chori karte? 😅",
  "Tumhara sabse bura lie kya tha? 🤥",
  "Kya tum kabhi rote hue pakde gaye? 😭",
  "Tumhari life ka sabse embarrassing moment kya hai? 😳",
  "Kya tum kabhi kisi ko dil mein like karte they bina bataye? 🤐",
  "Agar tum invisble ho sakte, kya karte? 🕵️",
  "Kya tum kabhi kisi ki back mein burai kiye ho is group mein? 🫣",
  "Tumhara worst habit kya hai jo tum chupate ho? 🙈"
];

const DARES = [
  "Apna best selfie bhejo abhi is group mein! 📸",
  "Apna favourite song 15 second ke liye gaao voice note mein! 🎤",
  "Apne sabse embarrassing photo ki description do! 😅",
  "Group mein sabko 'I love you' bolke message karo! ❤️",
  "Apna WhatsApp status 10 minute ke liye 'Main pagal hoon' rakhna hoga! 😜",
  "3 emojis mein apni life describe karo! 🎭",
  "Apni profile pic change karke koi funny image lagao 5 min ke liye! 🤡",
  "Group admin ko appreciate karo ek badi message mein! 🙏",
  "Apna full name ulta spelling mein likho! 🔄",
  "Koi bhi group member ko ek compliment do publicly! 💫"
];

const ACTION_GIFS = {
  punch: ["👊 *{from}* ne *{to}* ko ekdum zor se punch maara! 🤕","💥 *{from}* ka punch! *{to}* fly ho gaya! ✈️","👊 BOOM! *{from}* ne *{to}* ko mara! 😵"],
  bite:  ["😬 *{from}* ne *{to}* ko kaat liya! 🩸","🦷 *{from}* bites *{to}*! Ouchh! 😖","😤 *{from}* ne *{to}* pe daant lagaye! 🫢"],
  kiss:  ["😘 *{from}* ne *{to}* ko kiss kiya! 💋","💏 *{from}* × *{to}* — aww! 🌹","😊 *{from}* gave *{to}* a sweet kiss! 💗"],
  hug:   ["🤗 *{from}* ne *{to}* ko tight hug diya! 💞","🫂 *{from}* hugs *{to}* warmly! ❤️","💛 *{from}* ne *{to}* ko pyaar se hug kiya! 🥰"],
  slap:  ["👋 *{from}* ne *{to}* ko ek zordaar thapad maara! 😤","💢 SLAP! *{from}* ka haath *{to}* ke gaal pe! 😵","🤚 *{from}* ne *{to}* ko thappad maar diya! Auww! 🔥"],
  fuck:  ["😈 *{from}* went wild on *{to}*! 🔥","💀 *{from}* destroyed *{to}* 😏🔥","🤭 *{from}* × *{to}* — yeh kya ho raha hai group mein 😭"]
};

// Cache of num -> WhatsApp display name (populated from incoming pushNames)
const contactNames = {};

// ---------- BASE COMMANDS ----------
const BASE_COMMANDS = [
  'admin', 'addbot',
  'hy', 'dynamicstop', 'co', 'removeco', 'reset',
  'mute', 'unmute', 'mutelists',
  'lock', 'unlock',
  'add', 'kick', 'disband',
  'ocash', 'odaily', 'oflip', 'ocf', 'oinv', 'olb',
  'math', 'scramble', 'duel', 'bomb', 'pass', 'guess', 'emoji',
  'give', 'toprich', 'topkill', 'rank', 'leaders',
  'find', 'mypk', 'pkheal', 'warzone', 'acceptwar', 'mylvl', 'pkdex',
  'promote', 'demote',
  'tagall',
  'antilink', 'antibad', 'addbadword', 'removebadword', 'listbadwords',
  'gcjoin',
  'menu', 'status',
  'changeprefix', 'ping',
  'punch', 'bite', 'kiss', 'hug', 'slap', 'fuck',
  'truth', 'dare', 'puzzle',
  'tr',
  'detail', 'owner', 'admins',
  'bal', 'rob', 'kill', 'revive', 'protect',
  'war', 'accept',
  'fine', 'transfer',
  'data', 'setsticker', 'clearstickers', 'addbotsticker', 'clearbotsticker',
];

// Bot owner only commands
const BOT_OWNER_CMDS = new Set(['admin','addbot','hy','dynamicstop','co','removeco','reset','changeprefix','data','setsticker','clearstickers']);
// Group admin OR bot owner commands
const GROUP_ADMIN_CMDS = new Set(['kick','add','promote','demote','tagall','lock','unlock','disband','antilink','antibad','addbadword','removebadword','listbadwords','mute','unmute','mutelists','gcjoin']);

const isCommand = txt => {
  if (!txt) return false;
  if (!txt.startsWith(dynamicPrefix)) return false;
  const cmd = txt.slice(dynamicPrefix.length).trim().split(' ')[0].toLowerCase();
  return BASE_COMMANDS.includes(cmd);
};

const randItem = arr => arr[Math.floor(Math.random() * arr.length)];

const normalizePhoneNumber = (num) => {
  if (!num) return '';
  return String(num).replace(/[^0-9]/g, '');
};

function isTheAdmin(senderNum) {
  if (!state.adminNumber) return false;
  return normalizePhoneNumber(state.adminNumber) === normalizePhoneNumber(senderNum);
}

function isBotSelf(senderNum) {
  if (!state.botNumber) return false;
  return normalizePhoneNumber(state.botNumber) === normalizePhoneNumber(senderNum);
}

function extractNumber(arg, msg) {
  try {
    const ctx = msg.message?.extendedTextMessage?.contextInfo || {};
    if (Array.isArray(ctx.mentionedJid) && ctx.mentionedJid.length > 0) {
      const first = ctx.mentionedJid[0];
      if (typeof first === 'string') return normalizePhoneNumber(first.split('@')[0]);
    }
    if (ctx.participant) return normalizePhoneNumber(ctx.participant.split('@')[0]);
    if (ctx.quotedMessage && ctx.participant) return normalizePhoneNumber(ctx.participant.split('@')[0]);
    if (arg) { const cleaned = String(arg).replace(/[^\d+]/g, ''); return normalizePhoneNumber(cleaned); }
  } catch (e) {}
  return null;
}

function parseSlideDelay(input) {
  if (!input || typeof input !== 'string') return null;
  input = input.trim().toLowerCase();
  const m = input.match(/^(\d+(\.\d+)?)(ms|s)$/i);
  if (m) {
    const value = parseFloat(m[1]);
    const unit = m[3].toLowerCase();
    if (unit === 'ms') return Math.max(Math.floor(value), 1);
    if (unit === 's') return Math.max(Math.floor(value * 1000), 1);
  }
  const m2 = input.match(/^(\d+(\.\d+)?)$/);
  if (m2) return Math.max(Math.floor(parseFloat(m2[1]) * 1000), 1);
  return null;
}

function parseLockTime(input) {
  if (!input) return null;
  input = input.toLowerCase().trim();
  const match = input.match(/^(\d+)(s|m|h)$/);
  if (!match) return null;
  const value = parseInt(match[1]);
  const unit = match[2];
  if (unit === 's') return value * 1000;
  if (unit === 'm') return value * 60 * 1000;
  if (unit === 'h') return value * 60 * 60 * 1000;
  return null;
}

function initializeChatState(chatId) {
  if (!state.chatStates[chatId]) {
    state.chatStates[chatId] = {
      active: false,
      subadmins: [],
      disbandDelayMs: null,
      lockedUsers: [],
      ttsLang: 'en',
      startedAt: null
    };
    saveState();
  } else {
    const cs = state.chatStates[chatId];
    if (!Array.isArray(cs.subadmins)) cs.subadmins = [];
    cs.subadmins = Array.from(new Set(cs.subadmins.map(s => normalizePhoneNumber(String(s || ''))).filter(Boolean)));
  }
  return state.chatStates[chatId];
}

function formatUptime(ms) {
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}h ${m}m ${s}s`;
}

function getISTDateTime() {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const date = ist.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = ist.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  return { date, time };
}

// ---------- Socket & State ----------
let sock = null;
let isConnected = false;
let loginMode = 'qr';
let pairingNumber = '';
let restartCount = 0;
const MAX_RESTARTS = 10;
let presenceInterval = null;

function cleanupResources() {
  if (presenceInterval) { clearInterval(presenceInterval); presenceInterval = null; }
  if (sock) { try { sock.end(); } catch (e) {} sock = null; }
  isConnected = false;
}

function gracefulExit(code = 0) {
  cleanupResources();
  process.exit(code);
}

process.on('SIGINT', () => gracefulExit(0));
process.on('SIGTERM', () => gracefulExit(0));

// ---------- Login Mode ----------
async function askLoginMode() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('📱 Use QR code? (y/n): ', (answer) => {
      answer = (answer || '').trim().toLowerCase();
      if (answer === 'n') {
        rl.question('📱 Enter your number with country code (e.g. 919753814223): ', (num) => {
          pairingNumber = (num || '').trim().replace(/[^0-9]/g, '').replace(/^0+/, '');
          if (!pairingNumber || pairingNumber.length < 10) {
            console.error('❌ Invalid number. Falling back to QR mode.');
            loginMode = 'qr';
          } else {
            loginMode = 'pairing';
            console.log(`✅ Will request pairing code for: ${pairingNumber}`);
          }
          rl.close();
          resolve();
        });
      } else {
        loginMode = 'qr';
        rl.close();
        resolve();
      }
    });
  });
}

// ---------- Main Entrypoint ----------
(async () => {
  const credsFile = path.join(AUTH_DIR, 'creds.json');
  if (fs.existsSync(credsFile)) {
    console.log('🔑 Existing session found. Auto-connecting...');
    loginMode = 'qr';
  } else {
    await askLoginMode();
  }
  initClient();
})();

// ---------- MULTI-SESSION HELPERS ----------
function getExistingSessionsForNumber(targetNumber) {
  const authBase = path.join(__dirname, 'auth');
  const sessions = [];
  if (!fs.existsSync(authBase)) return sessions;
  const dirs = fs.readdirSync(authBase);
  for (const dir of dirs) {
    const match = dir.match(new RegExp(`^bot_${targetNumber}_(\\d+)$`));
    if (match) {
      const slot = parseInt(match[1]);
      const credsPath = path.join(authBase, dir, 'creds.json');
      const exists = fs.existsSync(credsPath);
      sessions.push({ slot, dir, credsPath, linked: exists });
    }
  }
  sessions.sort((a, b) => a.slot - b.slot);
  return sessions;
}

function getNextAvailableSlot(targetNumber) {
  const existing = getExistingSessionsForNumber(targetNumber);
  const usedSlots = existing.map(s => s.slot);
  for (let i = 1; i <= MAX_SESSIONS_PER_BOT; i++) { if (!usedSlots.includes(i)) return i; }
  return null;
}

async function generatePairingCodeForNumber(targetNumber, chatId) {
  const existingSessions = getExistingSessionsForNumber(targetNumber);
  const linkedSessions = existingSessions.filter(s => s.linked);
  if (linkedSessions.length >= MAX_SESSIONS_PER_BOT) {
    const sessionList = linkedSessions.map(s => `  • Slot ${s.slot}: auth/${s.dir}/`).join('\n');
    await sock.sendMessage(chatId, { text: `❌ Max Sessions Reached!\n\n+${targetNumber} already has ${MAX_SESSIONS_PER_BOT}/${MAX_SESSIONS_PER_BOT} sessions:\n${sessionList}` });
    return;
  }
  const nextSlot = getNextAvailableSlot(targetNumber);
  if (nextSlot === null) {
    await sock.sendMessage(chatId, { text: `❌ All ${MAX_SESSIONS_PER_BOT} session slots for +${targetNumber} are occupied.` });
    return;
  }
  const newSessionName = `bot_${targetNumber}_${nextSlot}`;
  const newAuthDir = path.join(__dirname, 'auth', newSessionName);
  if (!fs.existsSync(newAuthDir)) fs.mkdirSync(newAuthDir, { recursive: true });
  await sock.sendMessage(chatId, { text: `⏳ Creating session ${nextSlot}/${MAX_SESSIONS_PER_BOT} for +${targetNumber}...\nPlease wait...` });
  let newSock = null;
  let pairingCodeSent = false;
  let cleanedUp = false;
  const timeout = setTimeout(() => {
    if (!cleanedUp) {
      cleanedUp = true;
      try { if (newSock) { newSock.end(); newSock = null; } } catch (e) {}
      if (!pairingCodeSent) sock.sendMessage(chatId, { text: `⏰ Pairing timed out for +${targetNumber} (slot #${nextSlot}). Try again.` }).catch(() => {});
    }
  }, 120000);
  try {
    const { version } = await fetchLatestBaileysVersion();
    const { state: newAuthState, saveCreds: newSaveCreds } = await useMultiFileAuthState(newAuthDir);
    const silentLogger = pino({ level: 'silent' });
    newSock = makeWASocket({ version, auth: { creds: newAuthState.creds, keys: makeCacheableSignalKeyStore(newAuthState.keys, silentLogger) }, printQRInTerminal: false, browser: ['Ubuntu', 'Chrome', '20.0.04'], syncFullHistory: false, logger: silentLogger, generateHighQualityLinkPreview: false, getMessage: async () => ({ conversation: '' }) });
    newSock.ev.on('creds.update', newSaveCreds);
    await delay(5000);
    try {
      const cleanTarget = targetNumber.replace(/^\+/, '').replace(/^00/, '');
      const code = await newSock.requestPairingCode(cleanTarget);
      pairingCodeSent = true;
      const formattedCode = code.match(/.{1,4}/g)?.join('-') || code;
      await sock.sendMessage(chatId, { text: `╔══════════════════════════════════════╗\n║  📱 PAIRING CODE FOR +${targetNumber}\n╠══════════════════════════════════════╣\n║\n║   🔑  ${formattedCode}\n║\n║   📊  Session Slot: #${nextSlot} of ${MAX_SESSIONS_PER_BOT}\n║\n╠══════════════════════════════════════╣\n║  1. Open WhatsApp on +${targetNumber}\n║  2. Settings > Linked Devices\n║  3. Link a Device > Link with phone number\n║  4. Enter the code above\n║  ⏰ Code expires in ~60 seconds\n╚══════════════════════════════════════╝` });
    } catch (err) {
      await sock.sendMessage(chatId, { text: `❌ Failed to get pairing code for +${targetNumber}\nError: ${err.message || 'Unknown error'}` });
      try { fs.rmSync(newAuthDir, { recursive: true, force: true }); } catch (e) {}
      clearTimeout(timeout);
      try { newSock.end(); } catch (e) {}
      return;
    }
    newSock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
      if (connection === 'open') {
        clearTimeout(timeout);
        cleanedUp = true;
        await sock.sendMessage(chatId, { text: `✅ New Bot Connected!\n📱 Number: +${newSock.user.id.split(':')[0]}\n📊 Session Slot: #${nextSlot}` });
        await delay(3000);
        try { newSock.end(); } catch (e) {}
      }
      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        if (!cleanedUp) {
          cleanedUp = true;
          clearTimeout(timeout);
          if (statusCode === DisconnectReason.loggedOut) {
            try { fs.rmSync(newAuthDir, { recursive: true, force: true }); } catch (e) {}
            sock.sendMessage(chatId, { text: `❌ Pairing was rejected for +${targetNumber}. Try again.` }).catch(() => {});
          }
        }
        try { newSock = null; } catch (e) {}
      }
    });
  } catch (err) {
    clearTimeout(timeout);
    await sock.sendMessage(chatId, { text: `❌ Failed to create session\nError: ${err.message || 'Unknown'}` });
    try { fs.rmSync(newAuthDir, { recursive: true, force: true }); } catch (e) {}
    try { if (newSock) newSock.end(); } catch (e) {}
  }
}

// ---------- Client Lifecycle ----------
async function initClient() {
  cleanupResources();
  try {
    const { state: authState, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`🔄 Using WA v${version.join('.')} (latest: ${isLatest})`);
    const logger = pino({ level: 'silent' });
    sock = makeWASocket({ version, auth: { creds: authState.creds, keys: makeCacheableSignalKeyStore(authState.keys, logger) }, printQRInTerminal: false, browser: ['Ubuntu', 'Chrome', '20.0.04'], syncFullHistory: false, logger, generateHighQualityLinkPreview: false, getMessage: async () => ({ conversation: '' }) });
    if (loginMode === 'pairing' && !authState.creds.registered) {
      console.log('\n⏳ Requesting pairing code...');
      await delay(5000);
      try {
        const cleanNumber = pairingNumber.replace(/^\+/, '').replace(/^00/, '');
        const code = await sock.requestPairingCode(cleanNumber);
        console.log('╔══════════════════════════════════════╗');
        console.log('║      YOUR PAIRING CODE               ║');
        console.log(`║   📱  ${code}                          ║`);
        console.log('║  WhatsApp > Linked Devices > Link    ║');
        console.log('╚══════════════════════════════════════╝');
      } catch (err) {
        console.error('❌ Failed to get pairing code:', err);
      }
    }
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', ({ connection, qr, lastDisconnect }) => {
      if (qr && loginMode === 'qr') {
        console.log('╔══════════════════════════════════╗');
        console.log('║ SCAN THIS QR CODE TO LOGIN       ║');
        console.log('╚══════════════════════════════════╝');
        qrcode.generate(qr, { small: true });
      }
      if (connection === 'open') onReady();
      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        console.log(`⚠️ Connection closed. Status: ${statusCode}`);
        if (statusCode === DisconnectReason.loggedOut) {
          console.log('🚪 Logged out. Clearing session...');
          try { fs.rmSync(AUTH_DIR, { recursive: true, force: true }); } catch (e) {}
          console.log('🔄 Please restart the bot to re-login.');
          gracefulExit(0);
          return;
        }
        restartClient();
      }
    });
    sock.ev.on('messages.upsert', onMessage);

    // Welcome/Goodbye/Kick/Left handler
    sock.ev.on('group-participants.update', async (update) => {
      try {
        const id = update.id || update.jid || update.remoteJid;
        const participants = update.participants || update.participant ? (Array.isArray(update.participants) ? update.participants : [update.participant]) : [];
        const action = update.action || update.type;
        const authorRaw = update.author || update.actor || null;
        if (!isJidGroup(id)) return;

        // ── Bot itself added to a new group → send intro + try to pin ──
        const botSelfJid = sock.user?.id ? jidNormalizedUser(sock.user.id) : null;
        const botSelfNum = botSelfJid ? botSelfJid.split('@')[0] : null;
        if (botSelfJid && (action === 'add' || action === 'invite') && participants.some(p => {
          const pJid = typeof p === 'string' ? p : (p.id || p.jid || '');
          return jidNormalizedUser(pJid).split('@')[0] === botSelfNum;
        })) {
          setTimeout(async () => {
            try {
              const introText = [
                `╔══════════════════════════════╗`,
                `║  ⚔️  𝐊𝐈𝐑𝐔 𝐁𝐎𝐓  ⚔️  ║`,
                `╚══════════════════════════════╝`,
                ``,
                `Heyy! 👋 Main hoon *Kiru* — tumhara group ka naya dost aur guardian! 😎`,
                ``,
                `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
                `🎮  *𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦*`,
                `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
                ``,
                `📜 *${dynamicPrefix}menu*        — Saare commands dekho`,
                `🟢 *${dynamicPrefix}hy*           — Bot activate karo`,
                `💰 *${dynamicPrefix}ocash*        — Economy system`,
                `⚔️ *${dynamicPrefix}kill*         — Battle arena`,
                `🐉 *${dynamicPrefix}find*         — Pokémon pakdo`,
                `🎮 *${dynamicPrefix}bomb*         — Games khelo`,
                ``,
                `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
                `💬  *𝗔𝗜  𝗖𝗛𝗔𝗧*`,
                `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
                ``,
                `Mujhse baat karne ke *2 tarike* hain:`,
                `  • Mere naam *kiru* ka zikr karo`,
                `  • Mere kisi message ko *reply* karo`,
                ``,
                `Main reply kar dungi! 😊`,
                ``,
                `╔══════════════════════════════╗`,
                `║  ⚔️  𝐋𝐄𝐓'𝐒  𝐆𝐎  𝗪𝗔𝗥𝗥𝗜𝗢𝗥𝗦!  ⚔️  ║`,
                `╚══════════════════════════════╝`
              ].join('\n');
              let sentMsg;
              try {
                const img = fs.readFileSync(path.join(__dirname, 'assets', 'start.jpg'));
                sentMsg = await sock.sendMessage(id, { image: img, caption: introText });
              } catch {
                sentMsg = await sock.sendMessage(id, { text: introText });
              }
              // Try to pin the intro message for 7 days
              if (sentMsg?.key) {
                try { await sock.sendMessage(id, { pin: { type: 1, time: 604800 }, key: sentMsg.key }); } catch {}
              }
            } catch (e) { console.error('Bot-join intro error:', e.message); }
          }, 3000);
        }

        for (const user of participants) {
          const userJid = typeof user === 'string' ? user : (user.id || user.jid);
          if (!userJid) continue;
          // Skip the bot's own JID for member welcome/leave messages
          if (botSelfNum && jidNormalizedUser(userJid).split('@')[0] === botSelfNum) continue;
          const userNum = userJid.split('@')[0];
          let authorJid = null;
          if (authorRaw) authorJid = typeof authorRaw === 'string' ? authorRaw : (authorRaw.id || null);
          if (!authorJid && typeof user === 'object' && user.actor) authorJid = user.actor;
          const mentions = [userJid];
          if (authorJid && authorJid !== userJid) mentions.push(authorJid);
          if (action === 'add' || action === 'invite' || action === 'add_participant') {
            const welcomeCaption = `⚔️『 𝐊𝐈𝐑𝐔 𝐁𝐎𝐓 』⚔️\n\n🌟 Welcome to the Arena!\n\n@${userNum}\n\n✧ Ek naya warrior join hua! ⚔️\n_${dynamicPrefix}menu se commands dekho!_\n\n⚔️『 𝐊𝐈𝐑𝐔 𝐁𝐎𝐓 』⚔️`;
            try { const img = fs.readFileSync(WELCOME_IMG); await sock.sendMessage(id, { image: img, caption: welcomeCaption, mentions }); }
            catch (err) { await sock.sendMessage(id, { text: welcomeCaption, mentions }); }
          }
          if (action === 'remove' || action === 'leave' || action === 'remove_participant') {
            let isSelfLeft = false;
            if (authorJid) { const authorNum = authorJid.split('@')[0]; isSelfLeft = (authorNum === userNum); }
            else { isSelfLeft = true; }
            if (isSelfLeft) {
              const leftCaption = `⚔️『 𝐊𝐈𝐑𝐔 𝐁𝐎𝐓 』⚔️\n\n💨 Warrior Left the Arena\n\n@${userNum}\n\n✧ Ek warrior chala gaya... 😢\n\n⚔️『 𝐊𝐈𝐑𝐔 𝐁𝐎𝐓 』⚔️`;
              try { const img = fs.readFileSync(LEFT_IMG); await sock.sendMessage(id, { image: img, caption: leftCaption, mentions }); }
              catch (err) { await sock.sendMessage(id, { text: leftCaption, mentions }); }
            } else {
              const kickedCaption = `⚔️『 𝐊𝐈𝐑𝐔 𝐁𝐎𝐓 』⚔️\n\n🚫 Warrior Kicked!\n\n@${userNum}\n\n✧ Is warrior ko arena se nikaala gaya! 💀\n\n⚔️『 𝐊𝐈𝐑𝐔 𝐁𝐎𝐓 』⚔️`;
              try { const img = fs.readFileSync(KICKED_IMG); await sock.sendMessage(id, { image: img, caption: kickedCaption, mentions }); }
              catch (err) { await sock.sendMessage(id, { text: kickedCaption, mentions }); }
            }
          }
        }
      } catch (err) { console.error('Welcome/Goodbye error:', err); }
    });

    presenceInterval = setInterval(() => {
      if (sock && isConnected) { try { sock.sendPresenceUpdate('available'); } catch(e) { console.error('Presence error:', e); } }
    }, 60_000);
  } catch (err) { console.error('Init client error:', err); restartClient(); }
}

async function onReady() {
  isConnected = true;
  const botNumber = sock.user.id.split(':')[0].replace('+', '');
  state.botNumber = normalizePhoneNumber(botNumber);
  console.log('✅ Bot ready as', botNumber);
  if (!state.adminNumber) {
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║  ⚠️  NO ADMIN SET YET!                   ║');
    console.log(`║  Send in bot's DM: ${dynamicPrefix}admin              ║`);
    console.log('╚══════════════════════════════════════════╝\n');
  } else { console.log(`👑 Admin: +${state.adminNumber}`); }
  sanitizeState();
  saveState();
  restartCount = 0;

  // ── Auto check-in: every 1–2 hours send a casual message in active groups ──
  setInterval(async () => {
    if (!sock || !isConnected) return;
    try {
      const CHECK_IN_MSGS = [
        'heyy koi active hai? 👀',
        'sab dead ho gaye kya 💀 koi hai?',
        'bhai log kahan ho sab 😩',
        'yaar baat karo na bore ho rhi hun 😭',
        'koi online hai? main akeli hun yahan 🥺',
        'hello?? group mein koi zinda hai? 😂',
        'itna sannata kyun hai yaar 😶',
        'ek minute... sab so gaye kya 😴',
      ];
      for (const [chatId, cs] of Object.entries(state.chatStates || {})) {
        if (!cs?.active) continue;
        const last = lastCheckIn[chatId] || 0;
        const interval = 3600000 + Math.random() * 3600000; // 1–2 hours
        if (Date.now() - last < interval) continue;
        lastCheckIn[chatId] = Date.now();
        try {
          await sock.sendMessage(chatId, { text: randItem(CHECK_IN_MSGS) });
        } catch {}
      }
    } catch (e) { console.error('Check-in error:', e.message); }
  }, 10 * 60 * 1000); // check every 10 min, actual send gated by 1–2h cooldown
}

function restartClient() {
  cleanupResources();
  if (restartCount < MAX_RESTARTS) {
    restartCount++;
    const delayTime = Math.min(10_000 * 2 ** restartCount, 300_000);
    console.log(`♻️ Reconnecting in ${Math.round(delayTime / 1000)}s (${restartCount}/${MAX_RESTARTS})`);
    setTimeout(initClient, delayTime);
  } else { console.error('🚨 Max restarts reached – exiting'); gracefulExit(1); }
}

// ---------- Message Handler ----------
async function onMessage({ messages, type }) {
  if (!sock || !sock.user) return;
  if (!isConnected || !messages || !Array.isArray(messages) || messages.length === 0) return;

  // Track bot's OWN sent message IDs BEFORE the 'notify' filter.
  // Baileys delivers bot-sent messages as type='append', which the filter below drops.
  // Without this, botSentIds stays empty and stanzaId-based quoted-reply detection never works.
  for (const m of messages) {
    if (m.key?.fromMe && m.key?.id) {
      botSentIds.add(m.key.id);
      if (botSentIds.size > 1000) botSentIds.delete(botSentIds.values().next().value);
    }
  }

  if (type !== 'notify') return;
  const msg = messages[0];
  if (!msg.message) return;
  if (msg.message.reactionMessage) return;
  if (msg.message.protocolMessage) return;

  const isGroup = isJidGroup(msg.key.remoteJid);
  const chatId = msg.key.remoteJid;
  const senderJid = msg.key.participant || msg.key.remoteJid;
  const senderNum = normalizePhoneNumber(jidNormalizedUser(senderJid).split('@')[0]);
  const fromSelf = msg.key.fromMe;

  // Cache the sender's WhatsApp display name for leaderboard use
  if (msg.pushName && senderNum) contactNames[senderNum] = msg.pushName;

  // Track every message the bot sends so we can detect quoted replies via stanzaId
  if (fromSelf && msg.key.id) {
    botSentIds.add(msg.key.id);
    if (botSentIds.size > 500) botSentIds.delete(botSentIds.values().next().value);
  }
  const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption || "";
  const text = body.trim();
  const isCmd = isCommand(text);
  const args = text.split(" ").slice(1);

  // =====================
  // MATH GAME ANSWER CHECK
  // =====================
  if (mathGames[chatId]) {
    const game = mathGames[chatId];
    const num = parseInt(text);
    if (!isNaN(num) && num === game.answer) {
      const db = loadOwo();
      getUser(db, senderNum);
      db[senderNum].cash += game.reward;
      saveOwo(db);
      await sock.sendMessage(chatId, { text: `🎉 Correct!\n\n@${senderNum} +💰${game.reward} coins`, mentions: [senderJid] });
      delete mathGames[chatId];
      return;
    }
  }

  // =====================
  // DUEL ANSWER CHECK
  // =====================
  if (duelGames[chatId]) {
    const game = duelGames[chatId];
    const elapsed = Date.now() - game.startTime;
    if (text.trim().toLowerCase() === game.sentence.toLowerCase() && elapsed >= game.minTime) {
      const db = loadOwo();
      getUser(db, senderNum);
      db[senderNum].cash += game.reward;
      saveOwo(db);
      await sock.sendMessage(chatId, { text: `🏆 @${senderNum} wins the typing race!\n\n+💰${game.reward} coins\n⚡ Time: ${(elapsed/1000).toFixed(2)}s`, mentions: [senderJid] });
      delete duelGames[chatId];
      return;
    }
  }

  // =====================
  // SCRAMBLE ANSWER CHECK
  // =====================
  if (scrambleGames[chatId]) {
    const game = scrambleGames[chatId];
    if (text.trim().toLowerCase() === game.word.toLowerCase()) {
      const db = loadOwo();
      getUser(db, senderNum);
      db[senderNum].cash += game.reward;
      saveOwo(db);
      await sock.sendMessage(chatId, { text: `🎉 @${senderNum} unscrambled it!\n\nWord: *${game.word}*\n+💰${game.reward} coins`, mentions: [senderJid] });
      delete scrambleGames[chatId];
      return;
    }
  }

  // =====================
  // GUESS NUMBER CHECK
  // =====================
  if (guessGames[chatId]) {
    const game = guessGames[chatId];
    const num = parseInt(text);
    if (!isNaN(num) && num === game.number) {
      const db = loadOwo();
      getUser(db, senderNum);
      db[senderNum].cash += game.reward;
      saveOwo(db);
      await sock.sendMessage(chatId, { text: `🎉 @${senderNum} guessed the number!\n\nNumber: ${game.number}\n+💰${game.reward} coins`, mentions: [senderJid] });
      delete guessGames[chatId];
      return;
    }
  }

  // =====================
  // EMOJI PUZZLE CHECK
  // =====================
  if (emojiGames[chatId]) {
    const game = emojiGames[chatId];
    if (text.trim().toLowerCase() === game.answer) {
      const db = loadOwo();
      getUser(db, senderNum);
      db[senderNum].cash += game.reward;
      saveOwo(db);
      await sock.sendMessage(chatId, { text: `🎉 @${senderNum} got it!\n\nAnswer: ${game.answer}\n+💰${game.reward} coins`, mentions: [senderJid] });
      delete emojiGames[chatId];
      return;
    }
  }

  // =====================
  // BOMB PASS CHECK
  // =====================
  if (bombGames[chatId]) {
    const game = bombGames[chatId];
    if (text.toLowerCase().startsWith("pass")) {
      if (senderJid !== game.holder) return;
      let target = null;
      if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
      if (msg.message?.extendedTextMessage?.contextInfo?.participant) target = msg.message.extendedTextMessage.contextInfo.participant;
      if (!target) { await reply(msg, "⚠️ Reply or mention someone to pass the bomb"); return; }
      if (target === game.holder) { await reply(msg, "⚠️ You already have the bomb"); return; }
      game.lastPasser = senderNum;
      game.holder = target;
      await sock.sendMessage(chatId, { text: `💣 Bomb passed to @${target.split("@")[0]}`, mentions: [target] });
      return;
    }
  }

  // muted users messages delete
  if (mutedUsers[senderNum]) {
    await sock.sendMessage(chatId, { delete: msg.key });
    return;
  }

  // anti link system
  if (antiLink[chatId]) {
    if (text && text.includes("chat.whatsapp.com")) {
      const num = senderNum;
      if (!linkWarns[num]) linkWarns[num] = 0;
      linkWarns[num]++;
      await sock.sendMessage(chatId, { delete: msg.key });
      if (linkWarns[num] === 1) {
        await sock.sendMessage(chatId, { text: `╭─ ⚠️ ANTI-LINK ─╮\n│\n│ 👤 @${num}\n│ ⚠️ Warning 1/2\n│ Links are not allowed\n│\n╰──────────────────╯`, mentions: [senderJid] });
      } else if (linkWarns[num] === 2) {
        await sock.sendMessage(chatId, { text: `╭─ ⚠️ ANTI-LINK ─╮\n│\n│ 👤 @${num}\n│ ⚠️ Warning 2/2 — Final\n│ Next violation = MUTE\n│\n╰──────────────────╯`, mentions: [senderJid] });
      } else if (linkWarns[num] >= 3) {
        mutedUsers[num] = true;
        await sock.sendMessage(chatId, { text: `╭─ 🔇 USER MUTED ─╮\n│\n│ 👤 @${num}\n│ 🚫 Reason: Link spam\n│\n╰──────────────────╯`, mentions: [senderJid] });
      }
      return;
    }
  }

  // anti bad words
  if (antiBad[chatId] && text) {
    const lower = text.toLowerCase();
    const found = badWords.some(w => lower.includes(w));
    if (found) {
      await sock.sendMessage(chatId, { delete: msg.key });
      await sock.sendMessage(chatId, { text: `╭─ 🚫 ANTI-BADWORD ─╮\n│\n│ 👤 @${senderNum}\n│ Bad language detected\n│ Message removed\n│\n╰──────────────────╯`, mentions: [senderJid] });
      return;
    }
  }

  let isAdmin = false;
  let isBotAdmin = false;
  if (isGroup) {
    const meta = await getGroupMeta(chatId);
    if (!meta) return;
    const admins = meta.participants.filter(p => p.admin !== null).map(p => p.id);
    isAdmin = admins.includes(senderJid);
    isBotAdmin = admins.includes(sock.user.id);
  }

  const chatState = initializeChatState(chatId);

  // ── APOLOGY CHECK — before lock/delete so muted users can say sorry ──
  if (isGroup && !fromSelf && pendingApology[chatId]?.[senderNum]) {
    if (/sorry|maafi|maaf\s*karo|galti|forgive|mafi/i.test(text)) {
      if (!chatState.lockedUsers) chatState.lockedUsers = {};
      delete chatState.lockedUsers[senderNum];
      delete pendingApology[chatId][senderNum];
      if (botAutoMuted[chatId]) botAutoMuted[chatId].delete(senderNum);
      saveState();
      const forgivenMsgs = [
        `chalo theek hai, maaf kiya 😌 @${senderNum} dobara mat karna`,
        `okay okay accepted 🙄 @${senderNum} unmuted — next time seedha baat karna`,
        `hmm... thik hai 🥺 @${senderNum} forgiven. iss baar!`
      ];
      await sock.sendMessage(chatId, { text: randItem(forgivenMsgs), mentions: [senderJid] });
      return;
    } else {
      // Remind them they need to apologize
      await sock.sendMessage(chatId, { delete: msg.key });
      return;
    }
  }

  // LOCK SYSTEM
  try {
    if (isGroup && !fromSelf) {
      const locked = chatState.lockedUsers || {};
      const lockTime = locked[senderNum];
      if (lockTime) {
        if (lockTime !== true && Date.now() > lockTime) { delete locked[senderNum]; saveState(); }
        else { await sock.sendMessage(chatId, { delete: msg.key }); return; }
      }
    }
  } catch(err) { console.error("Lock delete error:", err); }

  if (fromSelf && !isCmd) return;

  console.log(`📥 [${isGroup ? 'GROUP' : 'DM'}] ${senderNum}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);

  // ============================================================
  // KIRU AI — triggered by name mention OR quoted reply to bot
  // ============================================================
  if (!fromSelf && !isCmd && text.length > 0) {
    const lowerText = text.toLowerCase();

    // Check if someone mentioned "kiru" in the message
    const mentionsKiru = /\bkiru\b/i.test(lowerText);

    // ── Detect reply-to-bot via stanzaId ─────────────────────────────
    // WhatsApp now uses @lid (Linked Device IDs) instead of phone numbers
    // in contextInfo.participant, so phone-number comparison breaks.
    // Instead we track every message the bot sends (botSentIds) and check
    // if the quoted message's stanzaId is one of ours.
    const quotedCtx =
      msg.message?.extendedTextMessage?.contextInfo ||
      msg.message?.imageMessage?.contextInfo ||
      msg.message?.videoMessage?.contextInfo ||
      msg.message?.stickerMessage?.contextInfo ||
      msg.message?.audioMessage?.contextInfo ||
      null;

    const isReplyToBot = !!(quotedCtx?.stanzaId && botSentIds.has(quotedCtx.stanzaId));

    // Debug log — shows in terminal when someone sends a quoted reply
    if (quotedCtx?.stanzaId) {
      __orig_log(`🔍 [QuotedReply] stanzaId=${quotedCtx.stanzaId} | inBotIds=${botSentIds.has(quotedCtx.stanzaId)} | botSentIds.size=${botSentIds.size}`);
    }

    // ── VOICE MODERATION — owner/admin tells bot to kick/mute/unmute ──────
    // Works when bot is admin. Detects natural Hinglish commands.
    if (isGroup && isBotAdmin && (senderIsAdmin || isAdmin)) {
      const lc = lowerText;
      const wantsKick   = /\b(kick|nikal|bahar\s*kar|hata\s*de|nikaal)\b/i.test(lc);
      const wantsMute   = /\b(mute|chup\s*kra|band\s*kar|quiet)\b/i.test(lc);
      const wantsUnmute = /\b(unmute|bolne\s*de|unban|wapas\s*de)\b/i.test(lc);
      const wantsKiru   = /\bkiru\b/i.test(lc);

      if (wantsKiru && (wantsKick || wantsMute || wantsUnmute)) {
        const vCtx = msg.message?.extendedTextMessage?.contextInfo;
        const targetJid = vCtx?.participant || vCtx?.mentionedJid?.[0];
        if (targetJid) {
          const targetNum = normalizePhoneNumber(targetJid.split(':')[0].split('@')[0]);
          if (wantsKick) {
            try {
              await sock.groupParticipantsUpdate(chatId, [targetJid], 'remove');
              await sock.sendMessage(chatId, { text: randItem([
                `okay kar diya 😏 @${targetNum} gone`,
                `done! @${targetNum} ko nikal diya 💀`,
                `haan haan nikal diya 🙄 @${targetNum} bye bye`
              ]), mentions: [targetJid] }, { quoted: msg });
            } catch {
              await sock.sendMessage(chatId, { text: 'bhai mujhe admin power chahiye kick karne ke liye 😩' }, { quoted: msg });
            }
            return;
          }
          if (wantsMute) {
            if (!chatState.lockedUsers) chatState.lockedUsers = {};
            chatState.lockedUsers[targetNum] = true;
            botAutoMuted[chatId] = botAutoMuted[chatId] || new Set();
            botAutoMuted[chatId].add(targetNum);
            saveState();
            await sock.sendMessage(chatId, { text: randItem([
              `haan kar diya 😌 @${targetNum} muted`,
              `okay @${targetNum} ab chup 🔇`,
              `done 😏 @${targetNum} muted hai`
            ]), mentions: [targetJid] }, { quoted: msg });
            return;
          }
          if (wantsUnmute) {
            if (botAutoMuted[chatId]?.has(targetNum)) {
              // Bot had auto-muted them — require apology
              pendingApology[chatId] = pendingApology[chatId] || {};
              pendingApology[chatId][targetNum] = { requesterJid: senderJid };
              await sock.sendMessage(chatId, { text: randItem([
                `karungi unmute... lekin pehle @${targetNum} ko sorry bolna hoga 😏 tab hi maaf karungi`,
                `haan kar dungi — but @${targetNum} ko pehle maafi maangni hogi 😌`,
                `theek hai... @${targetNum} sorry bole toh unmute kar dungi 🙄`
              ]), mentions: [targetJid] }, { quoted: msg });
            } else {
              if (!chatState.lockedUsers) chatState.lockedUsers = {};
              delete chatState.lockedUsers[targetNum];
              saveState();
              await sock.sendMessage(chatId, { text: randItem([
                `okay @${targetNum} unmuted 🔓`,
                `done @${targetNum} ab bol sakte hain`,
                `theek hai @${targetNum} free hai ab 🙄`
              ]), mentions: [targetJid] }, { quoted: msg });
            }
            return;
          }
        }
      }
    }

    // ── AUTO-MODERATION — bot auto-mutes extreme abusers (when bot is admin) ─
    const ABUSE_WORDS = ['bhosdi','chutiya','bhosdike','madarchod','behenchod','randi','lode','lund'];
    const isDirectAbuse = mentionsKiru && ABUSE_WORDS.some(w => lowerText.includes(w));
    if (isGroup && isBotAdmin && isDirectAbuse && !senderIsAdmin && !isAdmin) {
      if (!chatState.lockedUsers) chatState.lockedUsers = {};
      chatState.lockedUsers[senderNum] = true;
      botAutoMuted[chatId] = botAutoMuted[chatId] || new Set();
      botAutoMuted[chatId].add(senderNum);
      saveState();
      await sock.sendMessage(chatId, { text: randItem([
        `mujhe gali de raha hai? 😤 le @${senderNum} ab chup reh — muted 🔇`,
        `itni bakchodi? @${senderNum} thanda paani piyo — muted 🔇 😌`,
        `teri himmat kaise hui 💀 @${senderNum} muted. sorry bologe toh sochungi 😏`
      ]), mentions: [senderJid] });
      return;
    }

    // ── KIRU AUTO-ADD — "isko add karo / +91XXXXXXXX add karo" ──────────────
    if (isGroup && isBotAdmin && mentionsKiru && (senderIsAdmin || isAdmin)) {
      const wantsAdd = /\b(add\s*karo|add\s*kar\s*do|add\s*de|add\s*kr|group\s*mein\s*add)\b/i.test(lowerText);
      if (wantsAdd) {
        const numMatch = text.match(/\+?([1-9][0-9]{7,14})/);
        if (numMatch) {
          const addNum = numMatch[1];
          const addJid = addNum + '@s.whatsapp.net';
          try {
            await sock.groupParticipantsUpdate(chatId, [addJid], 'add');
            await sock.sendMessage(chatId, { text: randItem([
              `okay done 😌 +${addNum} add kar diya`,
              `haan haan kar diya 🙄 +${addNum} group mein aa gaya`,
              `done! +${addNum} added ✅`
            ]) }, { quoted: msg });
          } catch (e) {
            await sock.sendMessage(chatId, { text: `yaar nahi ho paya 😩 — ${e.message?.includes('not-authority') ? 'admin rights chahiye mujhe' : 'invite karo unhe pehle'}` }, { quoted: msg });
          }
          return;
        }
      }
    }

    // ── CHALLENGE DETECTION — Kiru strikes back when challenged ─────────────
    const challengeRx = /\b(aukat|kar\s*le|kya\s*kare\s*gi|kya\s*kar\s*le\s*gi|kuch\s*nahi\s*kar\s*sakti|hath\s*nahi\s*lagti|dekh\s*lena|dare\s*hai|dare\s*karo|lay\s*toh|lelo\s*toh|kr\s*ke\s*dikha)\b/i;
    if (isGroup && mentionsKiru && challengeRx.test(lowerText) && !senderIsAdmin && !isAdmin) {
      const dbChallenge = loadOwo();
      getUser(dbChallenge, senderNum);
      let challengeActionMsg = null;
      if (dbChallenge[senderNum].cash > 200) {
        const stealPct = 0.10 + Math.random() * 0.25;
        const stolen = Math.floor(dbChallenge[senderNum].cash * stealPct);
        dbChallenge[senderNum].cash = Math.max(0, dbChallenge[senderNum].cash - stolen);
        saveOwo(dbChallenge);
        challengeActionMsg = randItem([
          `btw tune jo challenge kiya... *${stolen} coins* le li tere wallet se 😏💸`,
          `aur haan — *${stolen} coins* gayab 💀 yeh toh sirf trailer tha`,
          `oh nice *${stolen} coins* tere se chali 😌 next baar mat bolna`
        ]);
      }
      try {
        await sock.sendPresenceUpdate('composing', chatId);
        await new Promise(r => setTimeout(r, 800 + Math.random() * 1000));
        const kiruReply = await askKiru(senderNum, text);
        const finalReply = kiruReply || randItem(KIRU_FALLBACKS);
        await sock.sendMessage(chatId, { text: finalReply }, { quoted: msg });
      } catch {}
      if (challengeActionMsg) {
        await new Promise(r => setTimeout(r, 1200));
        await sock.sendMessage(chatId, { text: challengeActionMsg, mentions: [senderJid] });
      }
      return;
    }

    // In DM: reply to ALL messages (no need for kiru mention or quoted reply)
    const isDM = !isGroup;

    // Detect if message is a sticker (so Kiru can respond to its vibe)
    const isStickerMsg = !!(msg.message?.stickerMessage);
    const isOwnerMsg = isTheAdmin(senderNum);

    if (mentionsKiru || isReplyToBot || isDM || isStickerMsg) {
      try {
        // Build contextual message for Kiru
        let msgForKiru = text;
        if (isStickerMsg && !text) {
          msgForKiru = '[User ne sticker bheja - iska vibe match karo, short casual reply karo]';
        } else if (isStickerMsg && text) {
          msgForKiru = `[User ne sticker ke saath yeh likha]: ${text}`;
        }

        await sock.sendPresenceUpdate('composing', chatId);
        await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
        const kiruReply = await askKiru(senderNum, msgForKiru, { isOwner: isOwnerMsg });
        const finalReply = kiruReply || randItem(KIRU_FALLBACKS);
        await sock.sendMessage(chatId, { text: finalReply }, { quoted: msg });

        // ── Mood-based auto sticker: send after every 5-6 messages ──────
        if (!kiruStickerCounter[chatId]) kiruStickerCounter[chatId] = 0;
        kiruStickerCounter[chatId]++;
        const stickerThreshold = 5 + Math.floor(Math.random() * 2); // 5 or 6
        if (kiruStickerCounter[chatId] >= stickerThreshold) {
          kiruStickerCounter[chatId] = 0;
          try {
            const sDbKiru = loadStickerDb();
            // Detect mood from recent message text
            const recentText = (msgForKiru + ' ' + (finalReply || '')).toLowerCase();
            const isHappy = /lol|lmao|haha|hehe|mast|acha|nice|love|❤|😂|😄|🔥|great|wow|yay|khush|happy/.test(recentText);
            const isSad = /sad|miss|cry|😢|rona|dukh|lonely|bura|hurt|upset|sorry|\:\(/.test(recentText);
            const isRoast = /💀|roast|burn|savage|lodu|chup|nikal|aukaat|bakchodi|idiot|stupid|mad/.test(recentText);

            let moodCategory = 'happy'; // default
            if (isSad) moodCategory = 'sad';
            else if (isRoast) moodCategory = 'roast';

            // Try mood category first, fallback to others
            const cats = [moodCategory, 'happy', 'sad', 'roast'];
            let sent = false;
            for (const cat of cats) {
              const pool = sDbKiru[cat] || [];
              if (pool.length > 0) {
                const chosen = randItem(pool);
                const fp = path.join(__dirname, 'stickers', chosen.file);
                if (fs.existsSync(fp)) {
                  const mediaBuf = fs.readFileSync(fp);
                  if (chosen.type === 'sticker') await sock.sendMessage(chatId, { sticker: mediaBuf });
                  else if (chosen.type === 'video') await sock.sendMessage(chatId, { video: mediaBuf, gifPlayback: chosen.gifPlayback === true });
                  else await sock.sendMessage(chatId, { image: mediaBuf });
                  sent = true;
                  break;
                }
              }
            }
          } catch {}
        }
      } catch (e) {
        console.error('Kiru AI error:', e.message);
        try { await sock.sendMessage(chatId, { text: randItem(KIRU_FALLBACKS) }, { quoted: msg }); } catch {}
      }
      return;
    }
  }

  // ── AUTO-REACT: Kiru reacts to others' messages with emoji (12% chance) ──
  if (!fromSelf && isGroup && text.length > 1 && !isCmd && Math.random() < 0.12) {
    const autoEmojis = ['😂','💀','🔥','😭','👀','💅','🤭','😮','❤️','😏','🥺','🙄','😤','🫡','✨','🫢','😈'];
    try { await sock.sendMessage(chatId, { react: { text: randItem(autoEmojis), key: msg.key } }); } catch {}
  }

  // ------------- COMMANDS -------------
  if (isCmd) {
    const rawCmd = text.slice(dynamicPrefix.length).trim();
    const command = rawCmd.split(' ')[0].toLowerCase();
    const argText = rawCmd.split(' ').slice(1).join(' ').trim();
    const arg = argText || null;

    // ============================================================
    // /admin COMMAND — DM ONLY
    // ============================================================
    if (command === 'admin') {
      if (isGroup) { await reply(msg, '❌ This command works only in DM'); return; }
      if (fromSelf) {
        const targetNum = normalizePhoneNumber(chatId.split('@')[0]);
        if (state.adminNumber && normalizePhoneNumber(state.adminNumber) !== targetNum) {
          await sock.sendMessage(chatId, { text: `❌ Admin already set: +${state.adminNumber}` });
          return;
        }
        state.adminNumber = targetNum;
        saveState();
        await sock.sendMessage(chatId, { text: `👑 You Are Now The Admin!\n\nNumber: +${targetNum}` });
        return;
      }
      if (!fromSelf) {
        if (!state.adminNumber) {
          state.adminNumber = senderNum;
          saveState();
          await reply(msg, `👑 You Are Now The Admin!\n\nNumber: +${senderNum}`);
          return;
        } else {
          await reply(msg, `❌ Admin already set.\nCurrent admin: +${state.adminNumber}`);
          return;
        }
      }
      return;
    }

    // ============================================================
    // /addbot COMMAND
    // ============================================================
    if (command === 'addbot') {
      const canUse = fromSelf || isTheAdmin(senderNum);
      if (!canUse) { await reply(msg, '❌ Only admin can use this command.'); return; }
      if (!arg) { await reply(msg, `❌ Usage: ${dynamicPrefix}addbot <number>\nExample: ${dynamicPrefix}addbot 919876543210`); return; }
      const targetNumber = normalizePhoneNumber(arg);
      if (!targetNumber || targetNumber.length < 10) { await reply(msg, '❌ Invalid number.'); return; }
      await generatePairingCodeForNumber(targetNumber, chatId);
      return;
    }

    // ============================================================
    // PERMISSION CHECK (public bot — tiered access)
    // ============================================================
    const senderIsAdmin = isTheAdmin(senderNum);
    const senderIsBotSelf = fromSelf;
    chatState.subadmins = Array.isArray(chatState.subadmins)
      ? Array.from(new Set(chatState.subadmins.map(s => normalizePhoneNumber(String(s || ''))).filter(Boolean)))
      : [];
    const isGlobalSubadmin = Array.isArray(state.globalSubadmins) && state.globalSubadmins.includes(senderNum);

    // Bot owner only — block non-owners
    if (BOT_OWNER_CMDS.has(command)) {
      if (!senderIsBotSelf && !senderIsAdmin && !isGlobalSubadmin) {
        await reply(msg, '❌ Sirf bot owner ya admin use kar sakta hai!');
        return;
      }
    }
    // Group admin / bot owner only — block normal users
    else if (GROUP_ADMIN_CMDS.has(command)) {
      if (!senderIsBotSelf && !senderIsAdmin && !isAdmin && !isGlobalSubadmin && !chatState.subadmins.includes(senderNum)) {
        await reply(msg, '❌ Sirf group admin ya bot owner use kar sakta hai!');
        return;
      }
    }
    // DM-only restriction: non-admin can't use bot commands in DM
    else if (!isGroup && !senderIsAdmin && !senderIsBotSelf) {
      await reply(msg, '❌ Group mein use karo!');
      return;
    }
    // All other commands are public — anyone in group can use

    try {
      switch (command) {

        case 'hy': {
          chatState.active = true;
          chatState.startedAt = Date.now();
          saveState();
          const hyText = `⚔️『 𝐊𝐈𝐑𝐔 𝐁𝐎𝐓 』⚔️\n\n🟢 *BOT ACTIVATED!*\n\n_Arena is now LIVE! Warriors ready karo!_ 🔥\n\nType *${dynamicPrefix}menu* to see all commands!`;
          try {
            const imagePath = path.join(__dirname, 'assets', 'start.jpg');
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(chatId, { image: imageBuffer, caption: hyText }, { quoted: msg });
          } catch (e) { await reply(msg, hyText); }
          break;
        }

        case 'ping': {
          const os = require('os');
          const start = Date.now();
          const sent = await sock.sendMessage(chatId, { text: '🏓 _Pinging..._' }, { quoted: msg });
          const latency = Date.now() - start;
          const pingText = `🏓 PONG!\n\n⚡ Latency: *${latency} ms*\n🤖 Bot Uptime: *${formatUptime(process.uptime() * 1000)}*\n🧠 RAM: *${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB*\n📡 Status: *ONLINE*\n👑 Admin: *${state.adminNumber ? '+' + state.adminNumber : 'NOT SET'}*\n📜 Prefix: *${dynamicPrefix}*`;
          await sock.sendMessage(chatId, { text: pingText }, { quoted: sent });
          break;
        }

        case 'dynamicstop':
          chatState.active = false;
          chatState.startedAt = null;
          saveState();
          await reply(msg, `🟢 Stopped all activities in this group`);
          break;

        case 'changeprefix': {
          if (!arg) { await reply(msg, `⚠️ Usage: ${dynamicPrefix}changeprefix <newPrefix>`); break; }
          if (arg.length > 3) { await reply(msg, '❌ Prefix max 3 characters'); break; }
          savePrefix(arg);
          await reply(msg, `✅ Prefix Changed To *${arg}*\nNow Use: ${arg}menu`);
          break;
        }

        case 'co': {
          if (!isGroup) { await reply(msg, '❌ Use in a group to add global subadmin'); break; }
          const num = extractNumber(arg, msg);
          if (!num) { await reply(msg, '❌ Please mention or reply to a user'); break; }
          if (!Array.isArray(state.globalSubadmins)) state.globalSubadmins = [];
          if (state.globalSubadmins.includes(num)) { await reply(msg, '⚠️ Already a global subadmin'); break; }
          state.globalSubadmins.push(num);
          state.globalSubadmins = Array.from(new Set(state.globalSubadmins.map(n => normalizePhoneNumber(String(n || ''))).filter(Boolean)));
          saveState();
          await reply(msg, `✅ Added Global Sub-Admin: +${num}`);
          break;
        }

        case 'removeco': {
          if (!isGroup) { await reply(msg, '❌ Use in groups only'); break; }
          const numToRemove = extractNumber(arg, msg);
          if (!numToRemove) { await reply(msg, '❌ Please mention or reply to a user'); break; }
          if (!Array.isArray(state.globalSubadmins)) state.globalSubadmins = [];
          const gIndex = state.globalSubadmins.indexOf(numToRemove);
          if (gIndex > -1) {
            state.globalSubadmins.splice(gIndex, 1);
            saveState();
            await reply(msg, `✅ Removed Global Sub-Admin: +${numToRemove}`);
            break;
          }
          chatState.subadmins = Array.isArray(chatState.subadmins) ? chatState.subadmins : [];
          const index = chatState.subadmins.indexOf(numToRemove);
          if (index > -1) {
            chatState.subadmins.splice(index, 1);
            saveState();
            await reply(msg, `✅ Removed Co-Admin (this chat): +${numToRemove}`);
          } else { await reply(msg, '❌ User not found in subadmins'); }
          break;
        }

        case 'reset':
          Object.assign(chatState, {
            active: false, subadmins: [], disbandDelayMs: null,
            lockedUsers: {}, ttsLang: 'en', startedAt: null
          });
          saveState();
          await reply(msg, `🔄 Bot state reset in ${isGroup ? 'group' : 'DM'}`);
          break;

        // ============================================================
        // GROUP MANAGEMENT
        // ============================================================
        case 'mute': {
          if (!isGroup) { await reply(msg, '❌ Group only'); break; }
          const parts = rawCmd.split(' ').slice(1);
          const num = extractNumber(parts[0], msg);
          if (!num) { await reply(msg, '❌ Mention user'); break; }
          const timeArg = parts[1];
          const ms = parseLockTime(timeArg);
          if (!chatState.lockedUsers) chatState.lockedUsers = {};
          if (ms) {
            chatState.lockedUsers[num] = Date.now() + ms;
            saveState();
            await reply(msg, `🔒 User muted for ${timeArg}`);
          } else {
            chatState.lockedUsers[num] = true;
            saveState();
            await reply(msg, '🔒 User muted permanently');
          }
          break;
        }

        case 'unmute': {
          if (!isGroup) { await reply(msg, '❌ Group only'); break; }
          const num = extractNumber(arg, msg);
          if (!num) { await reply(msg, '❌ Mention user'); break; }
          if (!chatState.lockedUsers) chatState.lockedUsers = {};
          delete chatState.lockedUsers[num];
          saveState();
          await reply(msg, '🔓 User unmuted');
          break;
        }

        case 'mutelists': {
          const locked = chatState.lockedUsers || {};
          const users = Object.keys(locked);
          if (!users.length) { await reply(msg, '🔓 No muted users'); break; }
          let txt = '🔒 Muted Users\n\n';
          users.forEach(u => {
            const t = locked[u];
            if (t === true) txt += `@${u} → permanent\n`;
            else { const left = Math.floor((t - Date.now())/1000); txt += `@${u} → ${left}s left\n`; }
          });
          await sock.sendMessage(chatId, { text: txt, mentions: users.map(u => u+'@s.whatsapp.net') });
          break;
        }

        case 'gcjoin': {
          if (!args[0]) { await reply(msg, "❌ Send group invite link\n\nExample:\n/gcjoin https://chat.whatsapp.com/XXXX"); break; }
          const link = args[0];
          const code = link.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/)?.[1];
          if (!code) { await reply(msg, "❌ Invalid WhatsApp group link"); break; }
          try { await sock.groupAcceptInvite(code); await reply(msg, "✅ Bot joined the group"); }
          catch(e) { await reply(msg, "❌ Failed to join group\nLink expired or bot banned"); }
          break;
        }

        case 'promote': {
          let target;
          if (msg.message?.extendedTextMessage?.contextInfo?.participant) target = msg.message.extendedTextMessage.contextInfo.participant;
          else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
          if (!target) { await reply(msg, "❌ Mention or reply to a user"); break; }
          try { await sock.groupParticipantsUpdate(chatId, [target], "promote"); await sock.sendMessage(chatId, { text: `👑 @${target.split("@")[0]} is now admin`, mentions: [target] }); }
          catch(e) { await reply(msg, "❌ Failed to promote user"); }
          break;
        }

        case 'demote': {
          let target;
          if (msg.message?.extendedTextMessage?.contextInfo?.participant) target = msg.message.extendedTextMessage.contextInfo.participant;
          else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
          if (!target) { await reply(msg, "❌ Mention or reply to a user"); break; }
          try { await sock.groupParticipantsUpdate(chatId, [target], "demote"); await sock.sendMessage(chatId, { text: `⬇️ @${target.split("@")[0]} is no longer admin`, mentions: [target] }); }
          catch(e) { await reply(msg, "❌ Failed to demote user"); }
          break;
        }

        case 'tagall': {
          const meta = await sock.groupMetadata(chatId);
          const participants = meta.participants.map(p => p.id);
          let txt = `📢 TAG ALL\n\n`;
          for (let member of participants) txt += `@${member.split("@")[0]}\n`;
          await sock.sendMessage(chatId, { text: txt, mentions: participants });
          break;
        }

        case 'antilink': {
          if (!isAdmin) { await reply(msg, "❌ Admin only command"); break; }
          const option = argText?.toLowerCase();
          if (option === "on") { antiLink[chatId] = true; await reply(msg, `╭─ ⚙️ ANTI-LINK ─╮\n│\n│ ✅ Protection Enabled\n│ Links will be blocked\n│\n╰──────────────────╯`); }
          else if (option === "off") { antiLink[chatId] = false; await reply(msg, `╭─ ⚙️ ANTI-LINK ─╮\n│\n│ ❌ Protection Disabled\n│\n╰──────────────────╯`); }
          else { await reply(msg, `⚠️ Usage:\n/antilink on\n/antilink off`); }
          break;
        }

        case 'addbadword': {
          if (!isAdmin) { await reply(msg, "❌ Admin only"); break; }
          const word = args?.[0];
          if (!word) { await reply(msg, "Usage: /addbadword <word>"); break; }
          badWords.push(word.toLowerCase());
          await reply(msg, `✅ Added bad word: ${word}`);
          break;
        }

        case 'removebadword': {
          if (!isAdmin) { await reply(msg, "❌ Admin only"); break; }
          const word = args?.[0];
          if (!word) { await reply(msg, "❌ Usage: /removebadword <word>"); break; }
          badWords = badWords.filter(w => w !== word.toLowerCase());
          await reply(msg, `🗑 Removed bad word: ${word.toLowerCase()}`);
          break;
        }

        case 'listbadwords': {
          if (badWords.length === 0) { await reply(msg, "📜 No bad words set"); break; }
          await reply(msg, `🚫 Bad Words List\n\n${badWords.join("\n")}`);
          break;
        }

        case 'antibad': {
          if (!isAdmin) { await reply(msg, "❌ Admin only"); break; }
          const option = args?.[0];
          if (option === "on") { antiBad[chatId] = true; await reply(msg, `🚫 ANTI BAD WORDS ENABLED\n\nBad words will be deleted automatically.`); }
          else if (option === "off") { delete antiBad[chatId]; await reply(msg, `✅ ANTI BAD WORDS DISABLED`); }
          else { await reply(msg, "❌ Usage: /antibad on | off"); }
          break;
        }

        case 'lock': {
          if (!isGroup) { await reply(msg, '❌ Group only command'); break; }
          try { await sock.groupSettingUpdate(chatId, 'announcement'); await reply(msg, '🔒 Group Locked ( Only Admins Can Send )'); }
          catch (e) { await reply(msg, '❌ Failed to lock group'); }
          break;
        }

        case 'unlock': {
          if (!isGroup) { await reply(msg, '❌ Group only command'); break; }
          try { await sock.groupSettingUpdate(chatId, 'not_announcement'); await reply(msg, '🔓 Group Unlocked ( Everyone Can Send )'); }
          catch (e) { await reply(msg, '❌ Failed to unlock group'); }
          break;
        }

        case 'add': {
          if (!isGroup) { await reply(msg, '❌ Group only command'); break; }
          if (!arg) { await reply(msg, '❌ Usage: /add <number>'); break; }
          const user = normalizePhoneNumber(arg) + '@s.whatsapp.net';
          try { await sock.groupParticipantsUpdate(chatId, [user], 'add'); await reply(msg, `✅ Number added: ${arg}`); }
          catch (e) { await reply(msg, '❌ Failed to add user'); }
          break;
        }

        case 'kick': {
          if (!isGroup) { await reply(msg, '❌ Group only command'); break; }
          const quoted = msg.message?.extendedTextMessage?.contextInfo;
          if (!quoted?.participant) { await reply(msg, '❌ Reply to user message to kick'); break; }
          try { await sock.groupParticipantsUpdate(chatId, [quoted.participant], 'remove'); await reply(msg, '✅ User kicked'); }
          catch (e) { await reply(msg, '❌ Failed to kick user'); }
          break;
        }

        case 'disband': {
          if (!isGroup) { await reply(msg, '❌ Group only command'); break; }
          const delayMs = chatState.disbandDelayMs ?? 3000;
          await reply(msg, '⚠️ Disband started... removing all non-admin members.');
          try {
            const metadata = await sock.groupMetadata(chatId);
            const admins = metadata.participants.filter(p => p.admin).map(p => p.id);
            const toRemove = metadata.participants.map(p => p.id).filter(id => !admins.includes(id));
            for (const user of toRemove) { try { await sock.groupParticipantsUpdate(chatId, [user], 'remove'); await delay(delayMs); } catch (e) {} }
            await reply(msg, '✅ Disband complete. Only admins remain');
          } catch (e) { await reply(msg, '❌ Disband failed'); }
          break;
        }

        // ============================================================
        // ECONOMY COMMANDS
        // ============================================================
        case 'ocash': {
          const db = loadOwo();
          getUser(db, senderNum);
          await sock.sendMessage(chatId, { text: `👤 @${senderNum}\n\n💰 You Have: *${formatCowoncy(db[senderNum].cash)} coins*`, mentions: [senderJid] });
          saveOwo(db);
          break;
        }

        case 'odaily': {
          const db = loadOwo();
          getUser(db, senderNum);
          const now = Date.now();
          const last = db[senderNum].daily || 0;
          if (now - last < 86400000) {
            const hrs = Math.floor((86400000-(now-last))/3600000);
            await reply(msg, `⏳ Daily Already Claimed\n\nCome back in ${hrs}h`);
            break;
          }
          const reward = 500;
          db[senderNum].cash += reward;
          db[senderNum].daily = now;
          saveOwo(db);
          await reply(msg, `🎁 Here is Your Daily Reward!\n\n+${reward} coins 💰`);
          break;
        }

        case 'ohunt': {
          await reply(msg, `🚫 *ohunt* command hata diya gaya hai!\n\nAb Pokémon system use karo:\n🔍 *${dynamicPrefix}find* — 1500 coins mein random Pokémon pakdo!\n📋 *${dynamicPrefix}pkdex* — saare Pokémon dekho`);
          break;
        }

        case 'oflip': {
          if (!arg) { await reply(msg, "❌ Usage: /oflip <amount>"); break; }
          const bet = parseInt(arg);
          if (!bet || bet <= 0) { await reply(msg, "❌ Invalid bet"); break; }
          const db = loadOwo();
          getUser(db, senderNum);
          if (db[senderNum].cash < bet) { await reply(msg, "❌ Not enough coins"); break; }
          await sock.sendMessage(chatId, { text: `@${senderNum} spent ${bet} coins\n\n🪙 The Coin Spins...`, mentions: [senderNum+"@s.whatsapp.net"] });
          await delay(900);
          await sock.sendMessage(chatId, { text: `🪙 Spinning...` });
          await delay(900);
          const win = Math.random() < 0.6;
          const result = Math.random() < 0.5 ? "HEADS" : "TAILS";
          if (win) { db[senderNum].cash += bet; await sock.sendMessage(chatId, { text: `🪙 ${result}\n\n✨ You won +${bet}!` }); }
          else { db[senderNum].cash -= bet; await sock.sendMessage(chatId, { text: `🪙 ${result}\n\n🌙 You lost -${bet}` }); }
          saveOwo(db);
          break;
        }

        case 'ocf': {
          if (!arg) { await reply(msg, "❌ Usage: /ocf <amount>"); break; }
          const bet = parseInt(arg);
          if (!bet || bet <= 0) { await reply(msg, "❌ Invalid bet"); break; }
          const db = loadOwo();
          getUser(db, senderNum);
          if (db[senderNum].cash < bet) { await reply(msg, "❌ Not enough coins"); break; }
          await sock.sendMessage(chatId, { text: `@${senderNum} bet ${bet} coins\n\n🪙 Spinning...`, mentions: [senderNum+"@s.whatsapp.net"] });
          await delay(900);
          await sock.sendMessage(chatId, { text: `🪙 Spinning...` });
          await delay(900);
          const win = Math.random() < 0.6;
          const result = Math.random() < 0.5 ? "HEADS" : "TAILS";
          if (win) { db[senderNum].cash += bet; await sock.sendMessage(chatId, { text: `🪙 ${result}\n\n✨ You won +${bet}!` }); }
          else { db[senderNum].cash -= bet; await sock.sendMessage(chatId, { text: `🪙 ${result}\n\n🌙 You lost -${bet}` }); }
          saveOwo(db);
          break;
        }

        case 'olb': {
          if (!isGroup) { await reply(msg, "❌ Leaderboard only works in groups"); break; }
          const db = loadOwo();
          const meta = await sock.groupMetadata(chatId);
          const members = meta.participants;
          // Build a name map from group participant pushNames (if available)
          const groupNameMap = {};
          members.forEach(p => {
            const num = p.id.split('@')[0];
            if (p.name || p.notify) groupNameMap[num] = p.name || p.notify;
          });
          let users = [];
          members.forEach(p => {
            const num = p.id.split("@")[0];
            if (db[num]) users.push({ id: p.id, num, cash: db[num].cash || 0 });
          });
          if (!users.length) { await reply(msg, "❌ No players in leaderboard"); break; }
          users.sort((a,b) => b.cash - a.cash);
          const top = users.slice(0, 10);
          const olbMedals = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
          let txt = "🏆 *Group Leaderboard*\n\n";
          top.forEach((u,i) => {
            const displayName = contactNames[u.num] || groupNameMap[u.num] || `+${u.num}`;
            txt += `${olbMedals[i]} @${u.num} *(${displayName})* — *${formatCowoncy(u.cash)} coins*\n`;
          });
          await sock.sendMessage(chatId, { text: txt, mentions: top.map(u => u.id) });
          break;
        }

        case 'oinv': {
          const db = loadOwo();
          getUser(db, senderNum);
          const inv = db[senderNum].inv;
          if (!inv.length) { await reply(msg, `🎒 Inventory\n\nempty`); }
          else { await reply(msg, `🎒 Inventory\n\n${inv.join("\n")}`); }
          saveOwo(db);
          break;
        }

        // ============================================================
        // GIVE COMMAND — Give Money To Replied User
        // ============================================================
        case 'give': {
          if (!isGroup) { await reply(msg, "❌ Group only command"); break; }
          const giveCtx = msg.message?.extendedTextMessage?.contextInfo;
          let giveTargetNum = null;
          if (giveCtx?.participant) giveTargetNum = normalizePhoneNumber(giveCtx.participant.split('@')[0]);
          else if (giveCtx?.mentionedJid?.length) giveTargetNum = normalizePhoneNumber(giveCtx.mentionedJid[0].split('@')[0]);
          if (!giveTargetNum) { await reply(msg, `❌ Usage: Reply to a user and type\n${dynamicPrefix}give <amount>`); break; }
          if (giveTargetNum === senderNum) { await reply(msg, "❌ Apne aap ko coins nahi de sakte!"); break; }
          const giveAmt = parseInt(arg);
          if (!giveAmt || giveAmt <= 0) { await reply(msg, `❌ Usage: ${dynamicPrefix}give <amount>\nExample: ${dynamicPrefix}give 200`); break; }
          const dbGive = loadOwo();
          getUser(dbGive, senderNum); getUser(dbGive, giveTargetNum);
          if (dbGive[senderNum].cash < giveAmt) { await reply(msg, `❌ Coins kam hain!\nTumhare paas: ${dbGive[senderNum].cash} coins`); break; }
          const tax = Math.floor(giveAmt * 0.05); // 5% tax
          const received = giveAmt - tax;
          dbGive[senderNum].cash -= giveAmt;
          dbGive[giveTargetNum].cash += received;
          // Tax goes to owner/admin wallet
          if (state.adminNumber) {
            const adminNum = normalizePhoneNumber(state.adminNumber);
            getUser(dbGive, adminNum);
            dbGive[adminNum].cash += tax;
          }
          saveOwo(dbGive);
          const giveTargetJid = giveCtx?.participant || (giveTargetNum + '@s.whatsapp.net');
          await sock.sendMessage(chatId, {
            text: `💸 *GIVE*\n\n@${senderNum} ne @${giveTargetNum} ko *${giveAmt} coins* diye!\n\n✅ Received: *${received} coins*\n💰 Tax (5%): *${tax} coins* → Owner wallet\n\n💼 Tera balance: ${dbGive[senderNum].cash} coins`,
            mentions: [senderJid, giveTargetJid]
          }, { quoted: msg });
          break;
        }

        // ============================================================
        // TOP RICH — Top 10 Richest Users
        // ============================================================
        case 'toprich': {
          const db = loadOwo();
          const allUsers = Object.entries(db).map(([num, data]) => ({ num, cash: data.cash || 0 }));
          allUsers.sort((a,b) => b.cash - a.cash);
          const top = allUsers.slice(0, 10);
          if (!top.length) { await reply(msg, "❌ No users found"); break; }
          const medals = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
          let txt = `💰 *TOP 10 RICHEST USERS*\n\n`;
          const topMentions = top.map(u => u.num + "@s.whatsapp.net");
          top.forEach((u,i) => {
            const displayName = contactNames[u.num] ? contactNames[u.num] : `+${u.num}`;
            txt += `${medals[i]} @${u.num} *(${displayName})* — *${formatCowoncy(u.cash)} coins*\n`;
          });
          await sock.sendMessage(chatId, { text: txt, mentions: topMentions });
          break;
        }

        // ============================================================
        // TOP KILL — Top 10 Killers
        // ============================================================
        case 'topkill': {
          const db = loadOwo();
          const allUsers = Object.entries(db).map(([num, data]) => ({ num, kills: data.kills || 0 }));
          allUsers.sort((a,b) => b.kills - a.kills);
          const top = allUsers.filter(u => u.kills > 0).slice(0, 10);
          if (!top.length) { await reply(msg, "❌ No killers yet — play /bomb to earn kills!"); break; }
          const medals = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
          let txt = `💀 *TOP 10 KILLERS*\n\n`;
          const topMentions = top.map(u => u.num + "@s.whatsapp.net");
          top.forEach((u,i) => {
            const displayName = contactNames[u.num] ? contactNames[u.num] : `+${u.num}`;
            txt += `${medals[i]} @${u.num} *(${displayName})* — *${u.kills} kills* 💣\n`;
          });
          await sock.sendMessage(chatId, { text: txt, mentions: topMentions });
          break;
        }

        // ============================================================
        // RANK — Check Your Or Friend's Rank
        // ============================================================
        case 'rank': {
          const db = loadOwo();
          const ctx = msg.message?.extendedTextMessage?.contextInfo;
          let targetNum = senderNum;
          let targetJid = senderJid;
          if (ctx?.participant) { targetNum = normalizePhoneNumber(ctx.participant.split('@')[0]); targetJid = ctx.participant; }
          else if (ctx?.mentionedJid?.length) { targetNum = normalizePhoneNumber(ctx.mentionedJid[0].split('@')[0]); targetJid = ctx.mentionedJid[0]; }
          getUser(db, targetNum);
          const allUsers = Object.entries(db).map(([num, data]) => ({ num, cash: data.cash || 0 }));
          allUsers.sort((a,b) => b.cash - a.cash);
          const rankPos = allUsers.findIndex(u => u.num === targetNum) + 1;
          const user = db[targetNum];
          const rankEmoji = rankPos === 1 ? '👑' : rankPos <= 3 ? '🏆' : rankPos <= 10 ? '⭐' : '🎮';
          await sock.sendMessage(chatId, {
            text: `${rankEmoji} *RANK CARD*\n\n👤 @${targetNum}\n\n💰 Coins: *${formatCowoncy(user.cash)}*\n🏅 Rank: *#${rankPos}* of ${allUsers.length}\n💀 Kills: *${user.kills || 0}*\n🎒 Items: *${user.inv.length}*\n💣 Bomb Wins: *${user.bombWins || 0}*`,
            mentions: [targetJid]
          });
          saveOwo(db);
          break;
        }

        // ============================================================
        // LEADERS — Bomb Game Top Leaders
        // ============================================================
        case 'leaders': {
          const db = loadOwo();
          const byKills = Object.entries(db).map(([num, data]) => ({ num, kills: data.kills || 0, bombWins: data.bombWins || 0 }));
          byKills.sort((a,b) => b.kills - a.kills);
          const top = byKills.filter(u => u.kills > 0 || u.bombWins > 0).slice(0, 10);
          if (!top.length) { await reply(msg, "❌ No bomb game leaders yet — play /bomb!"); break; }
          const medals = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
          let txt = `💣 *BOMB GAME LEADERS*\n\n`;
          const topMentions = top.map(u => u.num + "@s.whatsapp.net");
          top.forEach((u,i) => {
            const displayName = contactNames[u.num] ? contactNames[u.num] : `+${u.num}`;
            txt += `${medals[i]} @${u.num} *(${displayName})* — 💀 ${u.kills} kills | 🏆 ${u.bombWins} wins\n`;
          });
          await sock.sendMessage(chatId, { text: txt, mentions: topMentions });
          break;
        }

        // ============================================================
        // FIND — Catch a Random Pokémon (1500 coins)
        // ============================================================
        case 'find': {
          const FIND_COST = 1500;
          const MAX_PK = 10;
          const dbF = loadOwo();
          getUser(dbF, senderNum);
          if (dbF[senderNum].cash < FIND_COST) {
            await reply(msg, `🔍 *POKÉMON FIND*\n\n❌ Tumhare paas ${FIND_COST} coins nahi hain!\nTumhare paas: *${dbF[senderNum].cash}* 🪙\n\nPehle coins kamao: *${dynamicPrefix}odaily*, *${dynamicPrefix}ofip*, *${dynamicPrefix}ocf*`);
            break;
          }
          if (dbF[senderNum].pokemon.length >= MAX_PK) {
            await reply(msg, `❌ Tumhara Pokémon bag full hai! (${MAX_PK}/${MAX_PK})\n\n*${dynamicPrefix}warzone* mein battle karo — haare wale ka Pokémon winner ka ho jaata hai aur 0 strength ke saath.`);
            break;
          }
          dbF[senderNum].cash -= FIND_COST;
          const caught = findRandomPokemon();
          dbF[senderNum].pokemon.push(caught);
          const slot = dbF[senderNum].pokemon.length;
          saveOwo(dbF);
          const re = RARITY_EMOJI[caught.rarity];
          await reply(msg, `╔══════════════════════╗\n║  🔍  𝗣𝗢𝗞É𝗠𝗢𝗡  𝗙𝗢𝗨𝗡𝗗!  🔍  ║\n╚══════════════════════╝\n\n${re} *${caught.name}* (${caught.rarity.toUpperCase()})\n\n🌀 Type    : ${caught.type}\n⚡ Skill   : ${caught.skill}\n💪 Strength: ${caught.currentStr}/${caught.maxStr}\n🎯 Min Lvl : ${caught.minLvl}\n📦 Slot    : #${slot}\n\n💰 Cost: -${FIND_COST} coins\nBal: ${dbF[senderNum].cash} 🪙\n\n_${dynamicPrefix}mypk se apna collection dekho!_`);
          break;
        }

        // ============================================================
        // MYPK — View your Pokémon collection
        // ============================================================
        case 'mypk': {
          const dbMP = loadOwo();
          getUser(dbMP, senderNum);
          const myPks = dbMP[senderNum].pokemon;
          const myKills = dbMP[senderNum].kills || 0;
          const myLvl = getLevel(myKills);
          if (!myPks.length) {
            await reply(msg, `🎒 *Tumhara Pokémon bag empty hai!*\n\n🔍 *${dynamicPrefix}find* — 1500 coins mein random Pokémon pakdo\n📋 *${dynamicPrefix}pkdex* — saare available Pokémon dekho\n\n*Tumhara Level: ${myLvl}* (${myKills} kills)`);
            break;
          }
          let txt = `╔══════════════════════╗\n║  🎒  𝗠𝗬  𝗣𝗢𝗞É𝗠𝗢𝗡  🎒   ║\n╚══════════════════════╝\n\n`;
          txt += `👤 Trainer Level : *${myLvl}* | Kills: ${myKills}\n\n`;
          myPks.forEach((pk, i) => {
            const re = RARITY_EMOJI[pk.rarity];
            const strBar = '█'.repeat(Math.round(pk.currentStr/pk.maxStr*10)) + '░'.repeat(10-Math.round(pk.currentStr/pk.maxStr*10));
            txt += `${re} *#${i+1} ${pk.name}* [${pk.rarity}]\n`;
            txt += `   🌀 ${pk.type} | ⚡ ${pk.skill}\n`;
            txt += `   💪 ${strBar} ${pk.currentStr}/${pk.maxStr}\n`;
            if (pk.currentStr < pk.maxStr) txt += `   💊 Heal: ${(pk.maxStr-pk.currentStr)*3}🪙 → /pkheal ${i+1}\n`;
            txt += `\n`;
          });
          txt += `_${dynamicPrefix}warzone <slot> — reply to someone to battle!_`;
          await reply(msg, txt);
          break;
        }

        // ============================================================
        // MYLVL — Check your trainer level
        // ============================================================
        case 'mylvl': {
          const dbLV = loadOwo();
          getUser(dbLV, senderNum);
          const lvKills = dbLV[senderNum].kills || 0;
          const curLvl = getLevel(lvKills);
          const needed = killsToNextLevel(lvKills);
          let txt = `╔══════════════════════╗\n║  🏅  𝗧𝗥𝗔𝗜𝗡𝗘𝗥  𝗟𝗘𝗩𝗘𝗟  🏅  ║\n╚══════════════════════╝\n\n`;
          txt += `👤 *${msg.pushName || senderNum}*\n\n`;
          txt += `🏅 Level    : *${curLvl}*\n`;
          txt += `☠️ Kills    : ${lvKills}\n`;
          txt += `⬆️ Next Lvl : ${needed} more kills\n\n`;
          txt += `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n`;
          txt += `📋 *Level Requirements:*\n`;
          txt += `⚪ Common Pokémon  : Lvl 0+\n`;
          txt += `🟢 Uncommon Pokémon: Lvl 3+\n`;
          txt += `🔵 Rare Pokémon    : Lvl 6+\n`;
          txt += `🌟 Legendary Pokémon: Lvl 12+\n\n`;
          txt += `_${dynamicPrefix}kill se level badhaao!_`;
          await reply(msg, txt);
          break;
        }

        // ============================================================
        // PKDEX — Show all Pokémon in the game
        // ============================================================
        case 'pkdex': {
          const tiers = ['common','uncommon','rare','legendary'];
          let txt = `╔══════════════════════╗\n║  📖  𝗣𝗢𝗞É𝗗𝗘𝗫  📖        ║\n╚══════════════════════╝\n\n`;
          for (const tier of tiers) {
            const re = RARITY_EMOJI[tier];
            txt += `${re} *${tier.toUpperCase()}* (Min Lvl: ${tier==='common'?0:tier==='uncommon'?3:tier==='rare'?6:12})\n`;
            POKEMON_LIST.filter(p=>p.rarity===tier).forEach(p => {
              txt += `  • ${p.name} [${p.type}] — ⚡ ${p.skill} — 💪 ${p.maxStr}\n`;
            });
            txt += `\n`;
          }
          txt += `_🔍 ${dynamicPrefix}find — 1500 coins mein catch karo!_`;
          await reply(msg, txt);
          break;
        }

        // ============================================================
        // PKHEAL — Heal a Pokémon's strength (3 coins per str point)
        // ============================================================
        case 'pkheal': {
          const dbH = loadOwo();
          getUser(dbH, senderNum);
          const hPks = dbH[senderNum].pokemon;
          if (!hPks.length) { await reply(msg, `❌ Koi Pokémon nahi hai! *${dynamicPrefix}find* se pakdo.`); break; }
          const hSlot = parseInt(arg);
          if (!hSlot || hSlot < 1 || hSlot > hPks.length) {
            await reply(msg, `❌ *Usage:* ${dynamicPrefix}pkheal <slot>\n\nExample: *${dynamicPrefix}pkheal 1*\n\nTumhare paas ${hPks.length} Pokémon hain.`);
            break;
          }
          const hPk = hPks[hSlot - 1];
          if (hPk.currentStr >= hPk.maxStr) {
            await reply(msg, `✅ *${hPk.name}* already full strength pe hai! (${hPk.currentStr}/${hPk.maxStr})`);
            break;
          }
          const healNeeded = hPk.maxStr - hPk.currentStr;
          const healCost = healNeeded * 3;
          if (dbH[senderNum].cash < healCost) {
            await reply(msg, `❌ *${hPk.name}* heal ke liye *${healCost}* coins chahiye!\nTumhare paas: ${dbH[senderNum].cash}🪙\nStrength needed: +${healNeeded}`);
            break;
          }
          dbH[senderNum].cash -= healCost;
          hPk.currentStr = hPk.maxStr;
          saveOwo(dbH);
          const re = RARITY_EMOJI[hPk.rarity];
          await reply(msg, `💊 *POKÉMON HEALED!*\n\n${re} *${hPk.name}*\n💪 Strength: *${hPk.maxStr}/${hPk.maxStr}* ✅\n\n💰 Cost: -${healCost} coins\nBal: ${dbH[senderNum].cash}🪙`);
          break;
        }

        // ============================================================
        // WARZONE — Pokémon PvP Battle (reply to opponent)
        // ============================================================
        case 'warzone': {
          if (!isGroup) { await reply(msg, '❌ Warzone sirf group mein hoti hai!'); break; }
          const wzSlot = parseInt(arg);
          const dbWZ = loadOwo();
          getUser(dbWZ, senderNum);
          const wzCtx = msg.message?.extendedTextMessage?.contextInfo;
          const wzTargetJid = wzCtx?.participant;
          if (!wzTargetJid) { await reply(msg, `⚔️ Kisi ko *reply* karo phir *${dynamicPrefix}warzone <slot>* likho!\n\nExample: *${dynamicPrefix}warzone 1*`); break; }
          const wzTargetNum = wzTargetJid.split('@')[0];
          if (wzTargetNum === senderNum) { await reply(msg, '❌ Khud se battle nahi kar sakte!'); break; }
          if (warZones[chatId]) { await reply(msg, '⚔️ Is group mein pehle se ek battle chal rahi hai!'); break; }
          const wzPks = dbWZ[senderNum].pokemon;
          if (!wzPks.length) { await reply(msg, `❌ Tumhare paas koi Pokémon nahi hai!\n🔍 *${dynamicPrefix}find* se pakdo!`); break; }
          if (!wzSlot || wzSlot < 1 || wzSlot > wzPks.length) {
            await reply(msg, `❌ *Usage:* ${dynamicPrefix}warzone <slot>\n\nTumhare Pokémon:\n` + wzPks.map((p,i)=>`${RARITY_EMOJI[p.rarity]} #${i+1} ${p.name} (${p.currentStr}str)`).join('\n'));
            break;
          }
          const wzMyPk = wzPks[wzSlot - 1];
          const wzMyLvl = getLevel(dbWZ[senderNum].kills || 0);
          if (wzMyLvl < wzMyPk.minLvl) {
            await reply(msg, `❌ *${wzMyPk.name}* use karne ke liye Level *${wzMyPk.minLvl}* chahiye!\nTumhara level: *${wzMyLvl}*\n\n_${dynamicPrefix}kill se level badhaao!_`);
            break;
          }
          if (wzMyPk.currentStr <= 0) {
            await reply(msg, `❌ *${wzMyPk.name}* ki strength 0 hai! Pehle heal karo:\n*${dynamicPrefix}pkheal ${wzSlot}* (${wzMyPk.maxStr * 3} coins)`);
            break;
          }
          const wzTimer = setTimeout(async () => {
            if (warZones[chatId]) {
              delete warZones[chatId];
              await sock.sendMessage(chatId, {
                text: `⏰ *WARZONE EXPIRED!*\n\n@${wzTargetNum} ne 5 seconds mein respond nahi kiya! Battle cancel. 🐔`,
                mentions: [wzTargetJid]
              });
            }
          }, 5000);
          warZones[chatId] = {
            challengerNum: senderNum, challengerJid: senderJid, challengerName: msg.pushName || senderNum,
            challengerPkIdx: wzSlot - 1, challengerPkName: wzMyPk.name, challengerPkStr: wzMyPk.currentStr,
            targetNum: wzTargetNum, targetJid: wzTargetJid, timer: wzTimer
          };
          const re = RARITY_EMOJI[wzMyPk.rarity];
          await sock.sendMessage(chatId, {
            text: `╔══════════════════════╗\n║  ⚔️  𝗪𝗔𝗥𝗭𝗢𝗡𝗘  𝗕𝗔𝗧𝗧𝗟𝗘  ⚔️  ║\n╚══════════════════════╝\n\n⚔️ @${senderNum} ne @${wzTargetNum} ko challenge kiya!\n\n${re} *${wzMyPk.name}* (${wzMyPk.type})\n💪 Strength: *${wzMyPk.currentStr}*\n⚡ Skill: ${wzMyPk.skill}\n\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n\n@${wzTargetNum} — *5 SECONDS* mein respond karo!\nType: *${dynamicPrefix}acceptwar <slot>* 🔥`,
            mentions: [senderJid, wzTargetJid]
          }, { quoted: msg });
          break;
        }

        // ============================================================
        // ACCEPTWAR — Accept a Warzone Pokémon battle
        // ============================================================
        case 'acceptwar': {
          if (!isGroup) { await reply(msg, '❌ Warzone sirf group mein hoti hai!'); break; }
          const awPending = warZones[chatId];
          if (!awPending) { await reply(msg, `❌ Koi active warzone battle nahi hai! *${dynamicPrefix}warzone* se challenge do.`); break; }
          if (awPending.targetNum !== senderNum) { await reply(msg, `❌ Yeh challenge tumhare liye nahi! @${awPending.targetNum} ke liye hai.`); break; }
          clearTimeout(awPending.timer);
          delete warZones[chatId];
          const awSlot = parseInt(arg);
          const dbAW = loadOwo();
          getUser(dbAW, senderNum);
          getUser(dbAW, awPending.challengerNum);
          const awMyPks = dbAW[senderNum].pokemon;
          if (!awMyPks.length) { await reply(msg, `❌ Tumhare paas koi Pokémon nahi! *${dynamicPrefix}find* se pakdo.`); break; }
          if (!awSlot || awSlot < 1 || awSlot > awMyPks.length) {
            await reply(msg, `❌ Sahi slot do: *${dynamicPrefix}acceptwar <slot>*\nTumhare Pokémon:\n` + awMyPks.map((p,i)=>`${RARITY_EMOJI[p.rarity]} #${i+1} ${p.name} (${p.currentStr}str)`).join('\n'));
            break;
          }
          const awMyPk = awMyPks[awSlot - 1];
          const awMyLvl = getLevel(dbAW[senderNum].kills || 0);
          if (awMyLvl < awMyPk.minLvl) { await reply(msg, `❌ *${awMyPk.name}* ke liye Level *${awMyPk.minLvl}* chahiye! Tumhara: ${awMyLvl}`); break; }
          if (awMyPk.currentStr <= 0) { await reply(msg, `❌ *${awMyPk.name}* ki strength 0 hai! Heal karo: *${dynamicPrefix}pkheal ${awSlot}*`); break; }
          // Get challenger's Pokémon
          const awChalPks = dbAW[awPending.challengerNum].pokemon;
          const awChalPk = awChalPks[awPending.challengerPkIdx];
          if (!awChalPk) { await reply(msg, '❌ Challenger ka Pokémon nahi mila. Battle cancel.'); break; }
          // Compare strengths
          const chalStr = awChalPk.currentStr;
          const myStr = awMyPk.currentStr;
          let winnerNum, loserNum, winnerJid, loserJid, winnerPk, loserPk, loserPkIdx, loserPks;
          if (chalStr >= myStr) {
            // Challenger wins
            winnerNum = awPending.challengerNum; winnerJid = awPending.challengerJid;
            loserNum  = senderNum;               loserJid  = senderJid;
            winnerPk  = awChalPk;                loserPk   = awMyPk;
            loserPkIdx = awSlot - 1;             loserPks  = dbAW[senderNum].pokemon;
          } else {
            // Target wins
            winnerNum = senderNum;               winnerJid = senderJid;
            loserNum  = awPending.challengerNum; loserJid  = awPending.challengerJid;
            winnerPk  = awMyPk;                  loserPk   = awChalPk;
            loserPkIdx = awPending.challengerPkIdx; loserPks = dbAW[awPending.challengerNum].pokemon;
          }
          // Transfer loser's Pokémon to winner (at 0 strength)
          const capturedPk = { ...loserPk, currentStr: 0 };
          loserPks.splice(loserPkIdx, 1);
          const winnerPks = dbAW[winnerNum].pokemon;
          if (winnerPks.length < 10) winnerPks.push(capturedPk);
          // Award kill to winner
          dbAW[winnerNum].kills = (dbAW[winnerNum].kills || 0) + 1;
          saveOwo(dbAW);
          const re1 = RARITY_EMOJI[awChalPk.rarity];
          const re2 = RARITY_EMOJI[awMyPk.rarity];
          const battleLines = [
            `⚡ *${awChalPk.name}* uses *${awChalPk.skill}*!`,
            `💥 *${awMyPk.name}* counters with *${awMyPk.skill}*!`,
            `🔥 Both fighters push to their limits!`,
            `💢 A final devastating blow lands...`
          ].join('\n');
          await sock.sendMessage(chatId, {
            text: `╔══════════════════════╗\n║  ⚔️  𝗕𝗔𝗧𝗧𝗟𝗘  𝗥𝗘𝗦𝗨𝗟𝗧  ⚔️  ║\n╚══════════════════════╝\n\n${re1} *${awChalPk.name}* (${chalStr} str) ⚔️ ${re2} *${awMyPk.name}* (${myStr} str)\n\n${battleLines}\n\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n\n🏆 *WINNER: @${winnerNum}*\n💀 *LOSER: @${loserNum}*\n\n${RARITY_EMOJI[loserPk.rarity]} *${loserPk.name}* captured! (0 str)\n_Use ${dynamicPrefix}pkheal to restore strength (${loserPk.maxStr * 3} coins)_`,
            mentions: [winnerJid, loserJid]
          }, { quoted: msg });
          break;
        }

        // ============================================================
        // GAME COMMANDS
        // ============================================================
        case 'bomb': {
          if (!isGroup) { await reply(msg, "❌ Group only command"); break; }
          if (bombGames[chatId]) { await reply(msg, "💣 Bomb Game Already Running"); break; }
          const meta = await sock.groupMetadata(chatId);
          const participants = meta.participants.filter(p => p.id !== sock.user.id).map(p => p.id);
          if (participants.length === 0) { await reply(msg, "❌ Not enough players"); break; }
          const holder = participants[Math.floor(Math.random()*participants.length)];
          bombGames[chatId] = { holder, penalty: 100, lastPasser: null };
          await sock.sendMessage(chatId, {
            text: `💣 *BOMB ACTIVATED*\n\n🎯 Holder: @${holder.split("@")[0]}\n\n⏱ You have 15 seconds!\n💬 Reply someone + type *pass* to pass the bomb!\n\n🏆 Successfully passing = +1 Kill`,
            mentions: [holder]
          });
          bombGames[chatId].timer = setTimeout(async () => {
            const game = bombGames[chatId];
            if (!game) return;
            const loser = game.holder;
            const loserNum = loser.split("@")[0];
            const db = loadOwo();
            getUser(db, loserNum);
            db[loserNum].cash = Math.max(0, db[loserNum].cash - game.penalty);
            if (game.lastPasser) {
              getUser(db, game.lastPasser);
              db[game.lastPasser].kills = (db[game.lastPasser].kills || 0) + 1;
              db[game.lastPasser].bombWins = (db[game.lastPasser].bombWins || 0) + 1;
            }
            saveOwo(db);
            let txt = `💥 *BOOM!*\n\n@${loserNum} lost 💰${game.penalty} coins!`;
            const mentions = [loser];
            if (game.lastPasser) { txt += `\n\n💀 @${game.lastPasser} gets a *KILL*! 🏆`; mentions.push(game.lastPasser + "@s.whatsapp.net"); }
            await sock.sendMessage(chatId, { text: txt, mentions });
            delete bombGames[chatId];
          }, 15000);
          break;
        }

        case 'emoji': {
          if (!isGroup) { await reply(msg, "❌ Group only command"); break; }
          if (emojiGames[chatId]) { await reply(msg, "⚠️ A puzzle is already running"); break; }
          const puzzle = puzzles[Math.floor(Math.random()*puzzles.length)];
          const reward = 50;
          emojiGames[chatId] = { answer: puzzle.answer, reward };
          await sock.sendMessage(chatId, { text: `🧩 *GUESS THE WORD*\n\n${puzzle.emoji}\n\n⏱ 30 seconds\n💰 +${reward} coins` });
          setTimeout(async () => {
            if (!emojiGames[chatId]) return;
            await sock.sendMessage(chatId, { text: `⏰ Time Up!\n\nAnswer was: *${puzzle.answer}*` });
            delete emojiGames[chatId];
          }, 30000);
          break;
        }

        case 'guess': {
          if (!isGroup) { await reply(msg, "❌ Group only command"); break; }
          if (guessGames[chatId]) { await reply(msg, "⚠️ A guess game is already running"); break; }
          const number = Math.floor(Math.random()*50) + 1;
          const reward = 60;
          guessGames[chatId] = { number, reward };
          await sock.sendMessage(chatId, { text: `🎯 *GUESS THE NUMBER*\n\nNumber between 1 – 50\n\nFirst correct guess wins!\n💰 +${reward} coins` });
          setTimeout(() => { delete guessGames[chatId]; }, 60000);
          break;
        }

        case 'scramble': {
          if (!isGroup) { await reply(msg, "❌ Group only command"); break; }
          if (scrambleGames[chatId]) { await reply(msg, "⚠️ Solve current scramble first"); break; }
          const word = words[Math.floor(Math.random()*words.length)];
          const scrambled = shuffleWord(word);
          const reward = 45;
          scrambleGames[chatId] = { word, reward };
          await reply(msg, `🧩 *WORD SCRAMBLE*\n\nUnscramble this word:\n\n*${scrambled}*\n\n💰 +${reward} coins`);
          setTimeout(() => { delete scrambleGames[chatId]; }, 60000);
          break;
        }

        case 'math': {
          if (!isGroup) { await reply(msg, "❌ Group only command"); break; }
          if (mathGames[chatId]) { await reply(msg, "⚠️ Solve current question first"); break; }
          const a = Math.floor(Math.random()*50);
          const b = Math.floor(Math.random()*50);
          const answer = a + b;
          const reward = 40;
          mathGames[chatId] = { answer, reward };
          await reply(msg, `🧠 *MATH CHALLENGE*\n\nSolve fast:\n\n*${a} + ${b} = ?*\n\n💰 +${reward} coins`);
          setTimeout(() => { delete mathGames[chatId]; }, 60000);
          break;
        }

        case 'duel': {
          if (!isGroup) { await reply(msg, "❌ Group only command"); break; }
          if (duelGames[chatId]) { await reply(msg, "⚠️ Duel already running"); break; }
          const sentence = generateSentence();
          const reward = 50;
          const minTime = Math.ceil(sentence.length / 12 * 1000);
          duelGames[chatId] = { sentence, reward, startTime: Date.now(), minTime };
          await reply(msg, `🏁 *TYPING RACE*\n\nType This Sentence Fast:\n\n*${sentence}*\n\n🏆 First correct message wins!\n💰 +${reward} coins`);
          setTimeout(() => { delete duelGames[chatId]; }, 60000);
          break;
        }

        // ============================================================
        // ADMIN / UTILITY
        // ============================================================
        case 'listadmins': {
          const adminDisplay = state.adminNumber ? `+${state.adminNumber} 👑` : 'Not Set';
          const botDisplay = state.botNumber ? `+${state.botNumber} 🤖` : '—';
          const globalSubs = Array.isArray(state.globalSubadmins) && state.globalSubadmins.length
            ? state.globalSubadmins.map((num, i) => `${i + 1}. +${num}`).join('\n') : '—';
          const subAdmins = chatState.subadmins.length ? chatState.subadmins.map((num, i) => `${i + 1}. +${num}`).join('\n') : '—';
          const out = `🪭\n\n🤖 Bot:\n${botDisplay}\n\n👑 Main Admin:\n${adminDisplay}\n\n🌍 Global Co-Admins (all groups):\n${globalSubs}\n\n📊 Total: ${state.globalSubadmins.length} global • ${chatState.subadmins.length} this-chat`;
          await reply(msg, out);
          break;
        }

        case 'menu': {
          const p = dynamicPrefix;
          const menu = [
``,
`╔══════════════════════╗`,
`║  ⚔️  𝐊𝐈𝐑𝐔  𝐁𝐎𝐓  ⚔️   ║`,
`║   〘 𝗔𝗥𝗘𝗡𝗔 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 〙  ║`,
`╚══════════════════════╝`,
``,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
`🏆  𝗘𝗖𝗢𝗡𝗢𝗠𝗬  𝗦𝗬𝗦𝗧𝗘𝗠`,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
``,
`💰 ${p}ocash       — apne coins dekho`,
`🎁 ${p}odaily      — daily reward lo`,
`🎒 ${p}oinv        — inventory dekho`,
`🪙 ${p}ocf <amt>   — coin flip`,
`🎲 ${p}oflip <amt> — gamble karo`,
`🏆 ${p}olb         — leaderboard`,
`💸 ${p}give <amt>  — coins do (reply)`,
`👑 ${p}toprich     — top 10 ameer`,
`📊 ${p}rank        — apna rank dekho`,
`💼 ${p}bal         — balance dekho`,
``,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
`⚔️  𝗕𝗔𝗧𝗧𝗟𝗘  𝗔𝗥𝗘𝗡𝗔`,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
``,
`☠️ ${p}kill        — kisi ko kill karo (reply)`,
`⚔️ ${p}war <amt>   — coin PvP duel (reply)`,
`🦹 ${p}rob <amt>   — coins churao (reply)`,
`💊 ${p}revive      — wapas jiyo`,
`🛡️ ${p}protect 1d  — 24h protection (500🪙)`,
`💀 ${p}topkill     — top 10 killers`,
``,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
`🐉  𝗣𝗢𝗞É𝗠𝗢𝗡  𝗦𝗬𝗦𝗧𝗘𝗠`,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
``,
`🔍 ${p}find        — 1500🪙 mein random Pokémon pakdo`,
`🎒 ${p}mypk        — apna Pokémon collection dekho`,
`📖 ${p}pkdex       — saare Pokémon aur unki stats`,
`🏅 ${p}mylvl       — apna trainer level dekho`,
`⚔️ ${p}warzone <n> — Pokémon battle (reply) 5sec`,
`✅ ${p}acceptwar <n>— battle accept karo`,
`💊 ${p}pkheal <n>  — Pokémon heal karo (3🪙/str)`,
``,
`_Levels: ⚪Common Lvl0 🟢Uncommon Lvl3 🔵Rare Lvl6 🌟Legend Lvl12_`,
`_20 kills = Level 5 | Level kills needed badhtey hain!_`,
``,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
`🎮  𝗚𝗔𝗠𝗘𝗦`,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
``,
`💣 ${p}bomb        — bomb game`,
`🧠 ${p}math        — math challenge`,
`🔤 ${p}scramble    — word unscramble`,
`✍️ ${p}duel        — typing race`,
`🎯 ${p}guess       — number guess`,
`🧩 ${p}emoji       — emoji quiz`,
`🏆 ${p}leaders     — bomb champions`,
``,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
`🎭  𝗙𝗨𝗡  &  𝗦𝗢𝗖𝗜𝗔𝗟`,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
``,
`👊 ${p}punch       — punch (reply)`,
`😬 ${p}bite        — bite (reply)`,
`😘 ${p}kiss        — kiss (reply)`,
`🤗 ${p}hug         — hug (reply)`,
`👋 ${p}slap        — slap (reply)`,
`😈 ${p}fuck        — go wild (reply)`,
`🔮 ${p}truth       — truth question`,
`🎯 ${p}dare        — dare challenge`,
`🧩 ${p}puzzle      — emoji puzzle`,
`🌐 ${p}tr <text>   — translate`,
``,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
`📋  𝗚𝗥𝗢𝗨𝗣  𝗜𝗡𝗙𝗢`,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
``,
`📋 ${p}detail      — group ki info`,
`👑 ${p}owner       — group owner tag`,
`🛡️ ${p}admins      — saare admins`,
``,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
`🛡️  𝗔𝗗𝗠𝗜𝗡  𝗢𝗡𝗟𝗬`,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
``,
`👑 ${p}promote     — admin banaao`,
`❌ ${p}demote      — admin hatao`,
`📢 ${p}tagall      — sabko tag karo`,
`🚫 ${p}antilink    — link block`,
`⚠️ ${p}antibad     — bad word filter`,
`🔗 ${p}gcjoin      — group join`,
`➕ ${p}add         — member add`,
`👢 ${p}kick        — member kick`,
`🔒 ${p}lock        — group lock`,
`🔓 ${p}unlock      — group unlock`,
`💣 ${p}disband     — sabko kick`,
`🔕 ${p}mute        — user mute`,
`🔔 ${p}unmute      — user unmute`,
`⚖️ ${p}fine <amt>  — force fine (bypasses protect)`,
`💸 ${p}transfer    — coins move karo`,
``,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
`⚙️  𝗕𝗢𝗧  𝗢𝗪𝗡𝗘𝗥  𝗢𝗡𝗟𝗬`,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
``,
`🟢 ${p}hy          — bot on karo`,
`🔴 ${p}dynamicstop — bot off karo`,
`🌍 ${p}co          — subadmin add`,
`🗑️ ${p}removeco    — subadmin hataao`,
`🔄 ${p}changeprefix — prefix badlo`,
`🏓 ${p}ping        — bot speed check`,
`📊 ${p}status      — system status`,
`🎭 ${p}addbotsticker <happy/sad/roast> — mood sticker add`,
`🗑️ ${p}clearbotsticker [cat] — stickers clear karo`,
``,
`╔══════════════════════╗`,
`║  ⚔️  𝐊𝐈𝐑𝐔 𝐁𝐎𝐓  ⚔️    ║`,
`║  〘 𝗔𝗟𝗟 𝗔𝗥𝗘 𝗪𝗔𝗥𝗥𝗜𝗢𝗥𝗦 〙 ║`,
`╚══════════════════════╝`
          ].join('\n');
          try {
            const imagePath = path.join(__dirname, 'assets', 'help.jpg');
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(chatId, { image: imageBuffer, caption: menu }, { quoted: msg });
          } catch (e) { await reply(msg, menu); }
          break;
        }

        case 'status': {
          const yes = '🟢 ON';
          const no  = '🔴 OFF';
          const procUptime = formatUptime(process.uptime() * 1000);
          let grpUptime = '—';
          if (chatState.active && chatState.startedAt) grpUptime = formatUptime(Date.now() - chatState.startedAt);
          let groupName = 'Private Chat';
          if (isGroup) { try { const meta = await sock.groupMetadata(chatId); groupName = meta.subject || 'Unnamed Group'; } catch { groupName = 'Unknown Group'; } }
          const statusCard = [
`╔══════════════════════╗`,
`║  ⚔️   𝐊𝐈𝐑𝐔  𝐁𝐎𝐓   ⚔️  ║`,
`║   〘 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦 〙   ║`,
`╚══════════════════════╝`,
``,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
`📋  𝗔𝗥𝗘𝗡𝗔  𝗜𝗡𝗙𝗢`,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
``,
`🏟️ Group : ${groupName}`,
`⚡ Arena  : ${chatState.active ? yes : no}`,
``,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
`⏱️  𝗨𝗣𝗧𝗜𝗠𝗘`,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
``,
`🤖 Bot Uptime   : ${procUptime}`,
`💬 Chat Uptime  : ${grpUptime}`,
``,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
`👑  𝗚𝗨𝗔𝗥𝗗𝗜𝗔𝗡𝗦`,
`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
``,
`👑 Admin     : ${state.adminNumber ? '+' + state.adminNumber : 'NOT SET'}`,
`🤖 Bot       : +${state.botNumber || '—'}`,
`🌍 G.Subadmins: ${state.globalSubadmins.length}`,
`📍 Local Sub : ${chatState.subadmins.length}`,
``,
`╔══════════════════════╗`,
`║  ⚔️  𝐊𝐈𝐑𝐔 𝐁𝐎𝐓 𝗢𝗡𝗟𝗜𝗡𝗘  ⚔️  ║`,
`╚══════════════════════╝`
          ].join('\n');
          await sock.sendMessage(chatId, { text: statusCard }, { quoted: msg });
          break;
        }

        // ─── ACTION COMMANDS (punch / bite / kiss / hug / slap / fuck) ──────

        case 'punch':
        case 'bite':
        case 'kiss':
        case 'hug':
        case 'slap':
        case 'fuck': {
          const ctx = msg.message?.extendedTextMessage?.contextInfo;
          const targetJid = ctx?.participant;
          if (!targetJid) {
            await reply(msg, `❌ Kisi ko reply karo phir *${dynamicPrefix}${command}* use karo!`);
            break;
          }
          const fromName = msg.pushName || senderNum;
          const toNum = targetJid.split('@')[0];
          const templates = ACTION_GIFS[command];
          const actionText = randItem(templates)
            .replace('{from}', fromName)
            .replace('{to}', '@' + toNum);

          // ── Load custom media from sticker_db first ──
          const stickerDbAction = loadStickerDb();
          const customSlots = stickerDbAction[command];
          try {
            if (customSlots && customSlots.length > 0) {
              const chosen = randItem(customSlots);
              const filePath = path.join(__dirname, 'stickers', chosen.file);
              if (fs.existsSync(filePath)) {
                const mediaBuf = fs.readFileSync(filePath);
                if (chosen.type === 'sticker') {
                  await sock.sendMessage(chatId, { sticker: mediaBuf }, { quoted: msg });
                  await sock.sendMessage(chatId, { text: actionText, mentions: [targetJid] });
                } else if (chosen.type === 'video') {
                  await sock.sendMessage(chatId, { video: mediaBuf, gifPlayback: chosen.gifPlayback === true, caption: actionText, mentions: [targetJid] }, { quoted: msg });
                } else {
                  await sock.sendMessage(chatId, { image: mediaBuf, caption: actionText, mentions: [targetJid] }, { quoted: msg });
                }
              } else {
                // File missing — fall through to legacy sticker
                throw new Error('file missing');
              }
            } else {
              // ── Legacy single .sticker file fallback ──
              const stickerPath = path.join(__dirname, 'stickers', `${command}.sticker`);
              if (fs.existsSync(stickerPath)) {
                const stickerBuf = fs.readFileSync(stickerPath);
                await sock.sendMessage(chatId, { sticker: stickerBuf }, { quoted: msg });
                await sock.sendMessage(chatId, { text: actionText, mentions: [targetJid] });
              } else {
                await sock.sendMessage(chatId, { text: actionText, mentions: [targetJid] }, { quoted: msg });
              }
            }
          } catch (e) {
            await sock.sendMessage(chatId, { text: actionText, mentions: [targetJid] }, { quoted: msg });
          }
          break;
        }

        // ─── TRUTH / DARE ──────────────────────────────────────────────────

        case 'truth': {
          const q = randItem(TRUTHS);
          await reply(msg, `🔮 *TRUTH*\n\n${q}\n\n_Answer karna mandatory hai! 😏_`);
          break;
        }

        case 'dare': {
          const d = randItem(DARES);
          await reply(msg, `🎯 *DARE*\n\n${d}\n\n_Complete karna hoga! 😤_`);
          break;
        }

        case 'puzzle': {
          const pzl = randItem(puzzles);
          await reply(msg, `🧩 *PUZZLE*\n\n${pzl.emoji}\n\n_Kya hai yeh? ${dynamicPrefix}guess ke saath answer karo!_`);
          break;
        }

        // ─── TRANSLATE ─────────────────────────────────────────────────────

        case 'tr': {
          const textToTranslate = args.slice(0).join(' ').trim();
          const quotedText = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation
            || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;
          const trInput = textToTranslate || quotedText;
          if (!trInput) {
            await reply(msg, `❌ Usage: *${dynamicPrefix}tr <text>* ya kisi message ko reply karo!`);
            break;
          }
          try {
            const res = await translate(trInput, { to: 'en' });
            const translated = res.text || res;
            await reply(msg, `🌐 *TRANSLATE*\n\n*Original:* ${trInput}\n\n*English:* ${translated}`);
          } catch (e) {
            await reply(msg, '❌ Translation failed. Internet check karo.');
          }
          break;
        }

        // ─── GROUP INFO ────────────────────────────────────────────────────

        case 'detail': {
          if (!isGroup) { await reply(msg, '❌ Group only'); break; }
          const metaD = await getGroupMeta(chatId);
          if (!metaD) { await reply(msg, '❌ Group info nahi mili.'); break; }
          const totalMembers = metaD.participants.length;
          const grpAdmins = metaD.participants.filter(p => p.admin);
          const createdAt = metaD.creation ? new Date(metaD.creation * 1000).toLocaleDateString('en-IN') : 'Unknown';
          const desc = metaD.desc || 'Koi description nahi';
          await reply(msg, [
            `📋 *GROUP DETAIL*`, ``,
            `📛 Name: ${metaD.subject}`,
            `👥 Members: ${totalMembers}`,
            `👑 Admins: ${grpAdmins.length}`,
            `📅 Created: ${createdAt}`,
            ``, `📝 *Description:*`, desc
          ].join('\n'));
          break;
        }

        case 'owner': {
          if (!isGroup) { await reply(msg, '❌ Group only'); break; }
          const metaO = await getGroupMeta(chatId);
          if (!metaO) { await reply(msg, '❌ Group info nahi mili.'); break; }
          const ownerJid = metaO.owner || metaO.participants.find(p => p.admin === 'superadmin')?.id;
          if (!ownerJid) { await reply(msg, '❌ Owner ka pata nahi chala.'); break; }
          await sock.sendMessage(chatId, {
            text: `👑 *GROUP OWNER*\n\n@${ownerJid.split('@')[0]} ye is group ke malik hain! 🔱`,
            mentions: [ownerJid]
          }, { quoted: msg });
          break;
        }

        case 'admins': {
          if (!isGroup) { await reply(msg, '❌ Group only'); break; }
          const metaA = await getGroupMeta(chatId);
          if (!metaA) { await reply(msg, '❌ Group info nahi mili.'); break; }
          const adminList = metaA.participants.filter(p => p.admin);
          if (!adminList.length) { await reply(msg, '❌ Koi admin nahi hai!'); break; }
          const adminMentions = adminList.map(a => a.id);
          const adminLines = adminList.map(a => `${a.admin === 'superadmin' ? '👑' : '⭐'} @${a.id.split('@')[0]}`);
          await sock.sendMessage(chatId, {
            text: `🛡️ *GROUP ADMINS* (${adminList.length})\n\n${adminLines.join('\n')}`,
            mentions: adminMentions
          }, { quoted: msg });
          break;
        }

        // ─── BAL (BALANCE CHECK) ───────────────────────────────────────────

        case 'bal': {
          const balCtx = msg.message?.extendedTextMessage?.contextInfo;
          const balTargetJid = balCtx?.participant;
          const balNum = balTargetJid ? normalizePhoneNumber(balTargetJid.split('@')[0]) : senderNum;
          const balJid = balTargetJid || senderJid;
          const dbBal = loadOwo();
          getUser(dbBal, balNum);
          const uBal = dbBal[balNum];
          const isDeadBal = uBal.dead === true;
          await sock.sendMessage(chatId, {
            text: [
              isDeadBal ? `💀 *DEAD PROFILE*` : `💰 *BALANCE*`, ``,
              `👤 User: @${balNum}`,
              isDeadBal ? `☠️ Status: *💀 DEAD* — Revive karo pehle!` : `🟢 Status: *Alive*`,
              `🪙 Coins: *${formatCowoncy(uBal.cash)}*`,
              `☠️ Kills: ${uBal.kills || 0}`,
              `💣 Bomb Wins: ${uBal.bombWins || 0}`,
              `🛡️ Protected: ${uBal.protected && Date.now() < uBal.protected ? `Yes (${Math.ceil((uBal.protected - Date.now())/3600000)}h left)` : 'No'}`
            ].join('\n'),
            mentions: [balJid]
          }, { quoted: msg });
          saveOwo(dbBal);
          break;
        }

        // ─── ROB ───────────────────────────────────────────────────────────

        case 'rob': {
          const robCtx = msg.message?.extendedTextMessage?.contextInfo;
          const robTargetJid = robCtx?.participant;
          if (!robTargetJid) { await reply(msg, `❌ Kisi ko reply karo phir *${dynamicPrefix}rob <amount>* use karo!`); break; }
          const robTargetNum = normalizePhoneNumber(robTargetJid.split('@')[0]);
          if (robTargetNum === senderNum) { await reply(msg, '😂 Apne aap ko nahi loot sakte!'); break; }
          const robAmt = parseInt(arg);
          if (!robAmt || robAmt <= 0) { await reply(msg, `❌ Usage: ${dynamicPrefix}rob <amount>\nExample: ${dynamicPrefix}rob 200`); break; }
          const dbRob = loadOwo();
          getUser(dbRob, senderNum); getUser(dbRob, robTargetNum);
          const robNow = Date.now();
          if (dbRob[robTargetNum].protected && robNow < dbRob[robTargetNum].protected) {
            const leftH = Math.ceil((dbRob[robTargetNum].protected - robNow) / 3600000);
            await reply(msg, `🛡️ Yeh user protected hai! *${leftH} ghante* aur wait karo.`);
            break;
          }
          if (dbRob[robTargetNum].cash < robAmt) {
            await reply(msg, `😅 @${robTargetNum} ke paas sirf *${dbRob[robTargetNum].cash} coins* hain!`);
            break;
          }
          dbRob[senderNum].cash += robAmt;
          dbRob[robTargetNum].cash -= robAmt;
          saveOwo(dbRob);
          await sock.sendMessage(chatId, {
            text: `🦹 *ROB SUCCESS!*\n\n*${msg.pushName || senderNum}* ne @${robTargetNum} se *${robAmt} coins* chura liye! 💸\n\n💰 Tera balance: ${dbRob[senderNum].cash} coins`,
            mentions: [robTargetJid]
          }, { quoted: msg });
          break;
        }

        // ─── KILL ──────────────────────────────────────────────────────────

        case 'kill': {
          const killCtx = msg.message?.extendedTextMessage?.contextInfo;
          const killTargetJid = killCtx?.participant;
          if (!killTargetJid) { await reply(msg, `❌ Kisi ko reply karo phir *${dynamicPrefix}kill* use karo!`); break; }
          const killTargetNum = normalizePhoneNumber(killTargetJid.split('@')[0]);
          if (killTargetNum === senderNum) { await reply(msg, '☠️ Apne aap ko nahi maar sakte! 😅'); break; }
          const dbKill = loadOwo();
          getUser(dbKill, senderNum); getUser(dbKill, killTargetNum);
          // Sender cannot kill if they are dead
          if (dbKill[senderNum].dead === true) {
            await reply(msg, `💀 Tum khud *DEAD* ho! Pehle apne aap ko *${dynamicPrefix}revive* karo.`);
            break;
          }
          // Target must be alive to be killed
          if (dbKill[killTargetNum].dead === true) {
            await reply(msg, `💀 @${killTargetNum} pehle se hi dead hai!`);
            break;
          }
          // Check protection
          if (dbKill[killTargetNum].protected && Date.now() < dbKill[killTargetNum].protected) {
            const leftH = Math.ceil((dbKill[killTargetNum].protected - Date.now()) / 3600000);
            await reply(msg, `🛡️ @${killTargetNum} protected hai! *${leftH} ghante* aur wait karo.`);
            break;
          }
          // Random loot 150–300 coins
          const loot = Math.floor(Math.random() * 151) + 150;
          dbKill[senderNum].cash += loot;
          dbKill[senderNum].kills = (dbKill[senderNum].kills || 0) + 1;
          dbKill[killTargetNum].dead = true; // Target is now DEAD
          saveOwo(dbKill);
          const killMsgs = [
            `⚔️ *KILL!*\n\n*${msg.pushName || senderNum}* ne @${killTargetNum} ko kill kar diya! 💀\n\n💸 Mila: *${loot} coins*\n🏆 Total Kills: ${dbKill[senderNum].kills}\n\n_@${killTargetNum} ab DEAD hai — ${dynamicPrefix}revive se wapas aa sakta hai_`,
            `🗡️ *HEADSHOT!*\n\n*${msg.pushName || senderNum}* ne @${killTargetNum} ko khatam kar diya! 😵\n\n💸 Mila: *${loot} coins*\n🏆 Total Kills: ${dbKill[senderNum].kills}\n\n_@${killTargetNum} 💀 DEAD — ${dynamicPrefix}revive karo!_`,
            `🔫 *ELIMINATED!*\n\n@${killTargetNum} mar gaya! *${msg.pushName || senderNum}* ka +1 kill! 💥\n\n💸 Reward: *${loot} coins*\n\n_@${killTargetNum} ab DEAD hai — revive kiye bina kuch nahi kar sakta!_`
          ];
          await sock.sendMessage(chatId, {
            text: randItem(killMsgs),
            mentions: [killTargetJid]
          }, { quoted: msg });
          break;
        }

        // ─── REVIVE ────────────────────────────────────────────────────────

        case 'revive': {
          const revCtx = msg.message?.extendedTextMessage?.contextInfo;
          const revTargetJid = revCtx?.participant;
          const isSelfRevive = !revTargetJid;
          const revTargetNum = revTargetJid ? normalizePhoneNumber(revTargetJid.split('@')[0]) : senderNum;
          const reviveCost = isSelfRevive ? 500 : 550;
          const dbRev = loadOwo();
          getUser(dbRev, senderNum);
          // Self-revive: must be dead
          if (isSelfRevive && dbRev[senderNum].dead !== true) {
            await reply(msg, '❓ Tum toh alive ho! Koi zaroorat nahi revive ki. 😄');
            break;
          }
          // Friend revive: target must be dead
          if (!isSelfRevive) {
            getUser(dbRev, revTargetNum);
            if (dbRev[revTargetNum].dead !== true) {
              await reply(msg, `❓ @${revTargetNum} pehle se alive hai!`);
              break;
            }
          }
          if (dbRev[senderNum].cash < reviveCost) {
            await reply(msg, `❌ Revive ke liye *${reviveCost} coins* chahiye!\n${isSelfRevive ? '_(Self revive = 500 coins)_' : '_(Friend revive = 550 coins)_'}`);
            break;
          }
          dbRev[senderNum].cash -= reviveCost;
          if (isSelfRevive) {
            dbRev[senderNum].dead = false; // Self revived
          } else {
            dbRev[revTargetNum].dead = false; // Friend revived
            dbRev[revTargetNum].cash += 100;  // Bonus coins for being revived
          }
          saveOwo(dbRev);
          const revMentions = revTargetJid ? [revTargetJid] : [];
          await sock.sendMessage(chatId, {
            text: isSelfRevive
              ? `💊 *REVIVED!*\n\n*${msg.pushName || senderNum}* ne apne aap ko revive kiya! (-500 coins)\n\n✨ Wapas aa gaye! Ab dusron ko maar sakte ho! ⚔️`
              : `💊 *REVIVED!*\n\n*${msg.pushName || senderNum}* ne @${revTargetNum} ko revive kiya! (-550 coins)\n\n@${revTargetNum} alive hai! +100 coins bonus mile! ✨`,
            mentions: revMentions
          }, { quoted: msg });
          break;
        }

        // ─── PROTECT ───────────────────────────────────────────────────────

        case 'protect': {
          // Usage: /protect 1d
          const protDur = 24 * 60 * 60 * 1000; // 1 day fixed
          const protCost = 500;
          const dbProt = loadOwo();
          getUser(dbProt, senderNum);
          if (dbProt[senderNum].cash < protCost) {
            await reply(msg, `🛡️ Protect ke liye *${protCost} coins* chahiye!\n\nUsage: *${dynamicPrefix}protect 1d*`);
            break;
          }
          const protNow = Date.now();
          if (dbProt[senderNum].protected && protNow < dbProt[senderNum].protected) {
            const leftH = Math.ceil((dbProt[senderNum].protected - protNow) / 3600000);
            await reply(msg, `🛡️ Already protected ho! *${leftH} ghante* baaki hain.`);
            break;
          }
          dbProt[senderNum].cash -= protCost;
          dbProt[senderNum].protected = protNow + protDur;
          saveOwo(dbProt);
          await reply(msg, `🛡️ *PROTECTED!*\n\n*${msg.pushName || senderNum}* 24 ghante ke liye rob & kill se safe ho gaye!\n\n💰 -${protCost} coins\n⏰ Expires: ${new Date(protNow + protDur).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
          break;
        }

        // ─── FINE (Owner / Admin only) — force deduct, bypasses protect ─────
        case 'fine': {
          if (!senderIsAdmin && !isAdmin) { await reply(msg, '❌ Sirf owner ya admin fine maar sakta hai!'); break; }
          const fineCtx = msg.message?.extendedTextMessage?.contextInfo;
          const fineTgtJid = fineCtx?.participant || fineCtx?.mentionedJid?.[0];
          if (!fineTgtJid) {
            await reply(msg, `⚖️ *FINE USAGE*\n\nKisi ko reply ya @mention karo phir:\n*${dynamicPrefix}fine <amount>*\n*${dynamicPrefix}fine 0* _(balance zero karo)_\n\nExample:\n${dynamicPrefix}fine 50000\n${dynamicPrefix}fine 0\n\n🛡️ Fine protect shield bypass karta hai!`);
            break;
          }
          const fineTgtNum = normalizePhoneNumber(fineTgtJid.split(':')[0].split('@')[0]);
          const fineRaw = (arg || '').trim();
          const fineAmt = fineRaw === '0' ? 0 : parseInt(fineRaw);
          if (fineRaw === '' || isNaN(fineAmt) || fineAmt < 0) {
            await reply(msg, `❌ Amount sahi daalo!\nExample: *${dynamicPrefix}fine 100000*`); break;
          }
          const dbFine = loadOwo();
          getUser(dbFine, fineTgtNum);
          const fineBefore = dbFine[fineTgtNum].cash;
          dbFine[fineTgtNum].cash = fineAmt === 0 ? 0 : Math.max(0, dbFine[fineTgtNum].cash - fineAmt);
          const fineAfter = dbFine[fineTgtNum].cash;
          saveOwo(dbFine);
          const fineName = contactNames[fineTgtNum] || `+${fineTgtNum}`;
          await sock.sendMessage(chatId, {
            text: `⚖️ *FINE ISSUED!*\n\n👤 @${fineTgtNum} *(${fineName})*\n💸 Fine   : *${fineAmt === 0 ? 'BALANCE ZEROED' : formatCowoncy(fineAmt) + ' coins'}*\n\n📊 Before : ${formatCowoncy(fineBefore)} coins\n📊 After  : *${formatCowoncy(fineAfter)} coins*\n\n🛡️ Shield bypassed — no mercy 😏`,
            mentions: [fineTgtJid]
          }, { quoted: msg });
          break;
        }

        // ─── TRANSFER (Owner / Admin only) — move coins between wallets ──────
        case 'transfer': {
          if (!senderIsAdmin && !isAdmin) { await reply(msg, '❌ Sirf owner ya admin transfer kar sakta hai!'); break; }
          const trCtx = msg.message?.extendedTextMessage?.contextInfo;
          const trFromJid = trCtx?.participant;
          const trToJid = trCtx?.mentionedJid?.[0];
          if (!trFromJid || !trToJid) {
            await reply(msg, `💸 *TRANSFER USAGE*\n\n1. FROM user ko *reply* karo\n2. TO user ko *@mention* karo\n3. Amount likho\n\nExample:\n_(Reply to Rohit)_ *${dynamicPrefix}transfer @Priya 5000*`);
            break;
          }
          const trFromNum = normalizePhoneNumber(trFromJid.split(':')[0].split('@')[0]);
          const trToNum   = normalizePhoneNumber(trToJid.split(':')[0].split('@')[0]);
          const trAmt = parseInt(arg);
          if (!trAmt || trAmt <= 0) { await reply(msg, '❌ Amount sahi daalo!'); break; }
          const dbTr = loadOwo();
          getUser(dbTr, trFromNum); getUser(dbTr, trToNum);
          if (dbTr[trFromNum].cash < trAmt) {
            await reply(msg, `❌ @${trFromNum} ke paas sirf *${formatCowoncy(dbTr[trFromNum].cash)} coins* hain!`); break;
          }
          dbTr[trFromNum].cash -= trAmt;
          dbTr[trToNum].cash   += trAmt;
          saveOwo(dbTr);
          await sock.sendMessage(chatId, {
            text: `💸 *TRANSFER COMPLETE!*\n\n📤 From : @${trFromNum}\n📥 To   : @${trToNum}\n💰 Amount: *${formatCowoncy(trAmt)} coins*\n\n🔒 Admin transfer — no limits, no questions 😌`,
            mentions: [trFromJid, trToJid]
          }, { quoted: msg });
          break;
        }

        // ─── ADD BOT STICKER (Owner only) — categories: happy / sad / roast ──
        case 'addbotsticker': {
          if (!senderIsAdmin && !senderIsBotSelf) { await reply(msg, '❌ Sirf bot owner use kar sakta hai!'); break; }
          const absCategory = (arg || '').toLowerCase().trim();
          const validAbsCats = ['happy', 'sad', 'roast'];
          if (!validAbsCats.includes(absCategory)) {
            await reply(msg, `🎭 *ADDBOTSTICKER USAGE*\n\nSticker/GIF/image ko *reply* karo + category likho:\n\n*${dynamicPrefix}addbotsticker happy* — 😄 happy/funny stickers\n*${dynamicPrefix}addbotsticker sad*   — 😢 sad/emotional stickers\n*${dynamicPrefix}addbotsticker roast* — 💀 roast/savage stickers\n\nMax: *15 stickers per category*\nKiru automatically mood dekh ke sahi sticker bhejti hai!`);
            break;
          }
          const absCtx = msg.message?.extendedTextMessage?.contextInfo;
          const absQ = absCtx?.quotedMessage;
          if (!absQ) {
            await reply(msg, `❌ Koi sticker/GIF/image *reply* karo phir:\n*${dynamicPrefix}addbotsticker ${absCategory}*`);
            break;
          }
          let absType = null; let absExt = null; let absGif = false;
          if (absQ.stickerMessage) { absType = 'sticker'; absExt = 'webp'; }
          else if (absQ.videoMessage) { absType = 'video'; absExt = 'mp4'; absGif = absQ.videoMessage.gifPlayback === true; }
          else if (absQ.imageMessage) { absType = 'image'; absExt = 'jpg'; }
          else { await reply(msg, '❌ Sirf sticker, GIF, ya image reply karo!'); break; }
          const sDbAbs = loadStickerDb();
          if (!sDbAbs[absCategory]) sDbAbs[absCategory] = [];
          if (sDbAbs[absCategory].length >= 15) {
            await reply(msg, `❌ Already *15 ${absCategory} stickers* saved!\n*${dynamicPrefix}clearbotsticker ${absCategory}* se kuch hatao pehle.`); break;
          }
          try {
            const fakeAbsMsg = {
              key: { remoteJid: chatId, id: absCtx.stanzaId, fromMe: false, participant: absCtx.participant || absCtx.quotedParticipant },
              message: absQ
            };
            const absBuf = await downloadMediaMessage(fakeAbsMsg, 'buffer', {}, {
              logger: pino({ level: 'silent' }),
              reuploadRequest: sock.updateMediaMessage
            });
            const stickerDir = path.join(__dirname, 'stickers');
            if (!fs.existsSync(stickerDir)) fs.mkdirSync(stickerDir, { recursive: true });
            const absIdx = sDbAbs[absCategory].length + 1;
            const absFile = `${absCategory}_${absIdx}.${absExt}`;
            fs.writeFileSync(path.join(stickerDir, absFile), absBuf);
            sDbAbs[absCategory].push({ file: absFile, type: absType, gifPlayback: absGif });
            saveStickerDb(sDbAbs);
            const catEmoji = { happy: '😄', sad: '😢', roast: '💀' }[absCategory];
            await reply(msg, `✅ *${catEmoji} ${absCategory.toUpperCase()} Sticker Saved!*\n\nSlot: ${absIdx}/15\nType: ${absType === 'video' && absGif ? 'GIF' : absType}\n\n_Kiru ab ${absCategory} mood mein yeh sticker bhejegi!_ 🎲`);
          } catch (e) { await reply(msg, `❌ Media download failed: ${e.message}`); }
          break;
        }

        // ─── CLEAR BOT STICKER (Owner only) ───────────────────────────────
        case 'clearbotsticker': {
          if (!senderIsAdmin && !senderIsBotSelf) { await reply(msg, '❌ Sirf bot owner use kar sakta hai!'); break; }
          const cbsCat = (arg || '').toLowerCase().trim();
          const validCbsCats = ['happy', 'sad', 'roast'];
          const sDbCbs = loadStickerDb();
          let cbsDeleted = 0;
          if (validCbsCats.includes(cbsCat)) {
            // Clear one category
            const slots = sDbCbs[cbsCat] || [];
            for (const slot of slots) { try { fs.unlinkSync(path.join(__dirname, 'stickers', slot.file)); cbsDeleted++; } catch {} }
            sDbCbs[cbsCat] = [];
            saveStickerDb(sDbCbs);
            await reply(msg, `🗑️ *${cbsCat.toUpperCase()} Stickers Cleared!*\n\nDeleted: ${cbsDeleted} sticker(s)\n\n_${dynamicPrefix}addbotsticker ${cbsCat} se nayi add karo!_`);
          } else {
            // Clear all categories
            for (const cat of validCbsCats) {
              const slots = sDbCbs[cat] || [];
              for (const slot of slots) { try { fs.unlinkSync(path.join(__dirname, 'stickers', slot.file)); cbsDeleted++; } catch {} }
              sDbCbs[cat] = [];
            }
            // Also clear legacy daily
            for (const slot of (sDbCbs.daily || [])) { try { fs.unlinkSync(path.join(__dirname, 'stickers', slot.file)); cbsDeleted++; } catch {} }
            sDbCbs.daily = [];
            saveStickerDb(sDbCbs);
            await reply(msg, `🗑️ *All Bot Stickers Cleared!*\n\nDeleted: ${cbsDeleted} sticker(s) (happy + sad + roast)\n\n_${dynamicPrefix}addbotsticker <happy/sad/roast> se nayi add karo!_`);
          }
          break;
        }

        // ─── DATA EXPORT (Owner DM only) ─────────────────────────────────
        case 'data': {
          if (isGroup) { await reply(msg, '❌ */data* sirf bot ke DM mein use karo!'); break; }
          if (!senderIsAdmin && !senderIsBotSelf) { await reply(msg, '❌ Sirf bot owner use kar sakta hai!'); break; }
          try {
            await reply(msg, '📦 _Data export ho raha hai... wait karo!_');
            const db = loadOwo();
            const totalUsers = Object.keys(db).length;
            const aliveCount = Object.values(db).filter(u => !u.dead).length;
            const deadCount = Object.values(db).filter(u => u.dead).length;
            const richest = Object.entries(db).sort((a,b) => (b[1].cash||0)-(a[1].cash||0))[0];
            const statsCaption = `╔══════════════════════╗\n║  ⚔️  𝐊𝐈𝐑𝐔 𝐁𝐎𝐓 — DATA  ⚔️  ║\n╚══════════════════════╝\n\n📦 *Data Export Complete!*\n\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n\n👥 Total Users  : ${totalUsers}\n🟢 Alive        : ${aliveCount}\n💀 Dead         : ${deadCount}\n👑 Richest      : ${richest ? `+${richest[0]} (${richest[1].cash||0}🪙)` : 'N/A'}\n\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n\n📁 *Files Sent:*\n• owo_db.json (economy data)\n• sticker_db.json (sticker config)\n\n_VPS shift ke liye yeh files apne naye folder mein daal do — data safe rahega!_ ✅`;
            // Send owo_db.json as document (no zip binary needed)
            if (fs.existsSync(OWO_FILE)) {
              const owoBuf = fs.readFileSync(OWO_FILE);
              await sock.sendMessage(chatId, {
                document: owoBuf,
                fileName: 'owo_db.json',
                mimetype: 'application/json',
                caption: statsCaption
              });
            } else {
              await reply(msg, statsCaption + '\n\n⚠️ owo_db.json nahi mila!');
            }
            // Send sticker_db.json as a second document
            if (fs.existsSync(STICKER_DB_FILE)) {
              const stickerBuf = fs.readFileSync(STICKER_DB_FILE);
              await sock.sendMessage(chatId, {
                document: stickerBuf,
                fileName: 'sticker_db.json',
                mimetype: 'application/json',
                caption: '📁 sticker_db.json — custom sticker config'
              });
            }
          } catch (e) {
            await reply(msg, `❌ Export failed: ${e.message}\n\nManually copy *owo_db.json* file!`);
          }
          break;
        }

        // ─── SET STICKER (Owner only) ─────────────────────────────────────
        case 'setsticker': {
          if (!senderIsAdmin && !senderIsBotSelf) { await reply(msg, '❌ Sirf bot owner use kar sakta hai!'); break; }
          const validActionCmds = ['kiss', 'bite', 'punch', 'hug', 'slap', 'fuck'];
          const targetActionCmd = (arg || '').toLowerCase().split(' ')[0];
          if (!targetActionCmd || !validActionCmds.includes(targetActionCmd)) {
            await reply(msg, `⚙️ *SETSTICKER USAGE*\n\nKisi sticker/GIF/image ko *reply* karo phir:\n\n*${dynamicPrefix}setsticker kiss*\n*${dynamicPrefix}setsticker bite*\n*${dynamicPrefix}setsticker punch*\n*${dynamicPrefix}setsticker hug*\n*${dynamicPrefix}setsticker slap*\n*${dynamicPrefix}setsticker fuck*\n\n📌 Har command ke liye max *5 slots* hain.\nType *${dynamicPrefix}clearstickers <cmd>* to reset slots.`);
            break;
          }
          const sCtx = msg.message?.extendedTextMessage?.contextInfo;
          const quotedMsg = sCtx?.quotedMessage;
          if (!quotedMsg) {
            await reply(msg, `❌ Pehle ek sticker/GIF/image *reply* karo phir *${dynamicPrefix}setsticker ${targetActionCmd}* likho!`);
            break;
          }
          // Detect media type from quoted message
          let sMediaType = null;
          let sExt = null;
          let sGifPlayback = false;
          if (quotedMsg.stickerMessage) { sMediaType = 'sticker'; sExt = 'webp'; }
          else if (quotedMsg.videoMessage) {
            sMediaType = 'video'; sExt = 'mp4';
            sGifPlayback = quotedMsg.videoMessage.gifPlayback === true;
          }
          else if (quotedMsg.imageMessage) { sMediaType = 'image'; sExt = 'jpg'; }
          else {
            await reply(msg, '❌ Sirf *sticker*, *GIF*, ya *image* reply karo!');
            break;
          }
          // Check slot limit
          const sDb = loadStickerDb();
          if (!sDb[targetActionCmd]) sDb[targetActionCmd] = [];
          if (sDb[targetActionCmd].length >= 5) {
            await reply(msg, `❌ *${targetActionCmd}* ke liye already *5 slots* bhar gaye hain!\n\nPehle reset karo: *${dynamicPrefix}clearstickers ${targetActionCmd}*`);
            break;
          }
          // Download the media
          try {
            const fakeMsg = {
              key: { remoteJid: chatId, id: sCtx.stanzaId, fromMe: false, participant: sCtx.participant || sCtx.quotedParticipant },
              message: quotedMsg
            };
            const mediaBuf = await downloadMediaMessage(fakeMsg, 'buffer', {}, {
              logger: pino({ level: 'silent' }),
              reuploadRequest: sock.updateMediaMessage
            });
            // Ensure stickers folder exists
            const stickerDir = path.join(__dirname, 'stickers');
            if (!fs.existsSync(stickerDir)) fs.mkdirSync(stickerDir, { recursive: true });
            const slotIdx = sDb[targetActionCmd].length + 1;
            const fileName = `${targetActionCmd}_${slotIdx}.${sExt}`;
            const filePath = path.join(stickerDir, fileName);
            fs.writeFileSync(filePath, mediaBuf);
            sDb[targetActionCmd].push({ file: fileName, type: sMediaType, gifPlayback: sGifPlayback });
            saveStickerDb(sDb);
            await reply(msg, `✅ *Sticker Saved!*\n\n🎭 Command : *${targetActionCmd}*\n📁 File    : *${fileName}*\n🔢 Slot    : ${slotIdx}/5\n📱 Type    : ${sMediaType === 'video' && sGifPlayback ? 'GIF' : sMediaType}\n\n_Ab jab koi ${dynamicPrefix}${targetActionCmd} use karega toh randomly inhi ${slotIdx} media se koi ek chalega!_ 🎲`);
          } catch (e) {
            await reply(msg, `❌ Media download failed: ${e.message}\n\nDobara try karo ya dusra sticker/GIF use karo.`);
          }
          break;
        }

        // ─── CLEAR STICKERS (Owner only) ──────────────────────────────────
        case 'clearstickers': {
          if (!senderIsAdmin && !senderIsBotSelf) { await reply(msg, '❌ Sirf bot owner use kar sakta hai!'); break; }
          const validCS = ['kiss', 'bite', 'punch', 'hug', 'slap', 'fuck'];
          const csCmd = (arg || '').toLowerCase().split(' ')[0];
          if (!csCmd || !validCS.includes(csCmd)) {
            const csDb = loadStickerDb();
            const summary = validCS.map(c => `${c}: ${(csDb[c] || []).length}/5 slots`).join('\n');
            await reply(msg, `⚙️ *CLEARSTICKERS USAGE*\n\n*${dynamicPrefix}clearstickers <command>*\n\nCommands: kiss, bite, punch, hug, slap, fuck\n\n📊 *Current Slots:*\n${summary}`);
            break;
          }
          const csDb = loadStickerDb();
          const csSlots = csDb[csCmd] || [];
          // Delete files
          let deleted = 0;
          for (const slot of csSlots) {
            try { fs.unlinkSync(path.join(__dirname, 'stickers', slot.file)); deleted++; } catch {}
          }
          csDb[csCmd] = [];
          saveStickerDb(csDb);
          await reply(msg, `🗑️ *Cleared!*\n\n🎭 Command : *${csCmd}*\n📁 Deleted : ${deleted} file(s)\n\n_Ab ${dynamicPrefix}setsticker ${csCmd} se nayi media set karo!_`);
          break;
        }

        // ─── WAR (PvP Duel) ─────────────────────────────────────────────
        case 'war': {
          if (!isGroup) { await reply(msg, `⚔️ War sirf group mein hoti hai!`); break; }
          const warBet = parseInt(arg, 10);
          if (!warBet || warBet < 10) {
            await reply(msg, `⚔️ *WAR COMMAND*\n\nUsage: *${dynamicPrefix}war <amount>* (reply to opponent)\n\nExample: *${dynamicPrefix}war 500*\n\nMinimum bet: 10 coins 🪙`);
            break;
          }
          const warCtx = msg.message?.extendedTextMessage?.contextInfo;
          const warTargetJid = warCtx?.participant;
          if (!warTargetJid) { await reply(msg, `⚔️ Kisi ko reply karo phir *${dynamicPrefix}war <amount>* use karo!`); break; }
          const warTargetNum = warTargetJid.split('@')[0];
          if (warTargetNum === senderNum) { await reply(msg, `⚔️ Khud se war nahi kar sakte! 😂`); break; }
          if (warChallenges[chatId]) {
            await reply(msg, `⚔️ Is group mein pehle se ek war chal rahi hai! Pehle usse khatam karo.`);
            break;
          }
          const warDb = loadOwo();
          getUser(warDb, senderNum);
          getUser(warDb, warTargetNum);
          if (warDb[senderNum].dead) { await reply(msg, `☠️ Tum mare ho! Pehle *${dynamicPrefix}revive* karo!`); break; }
          if (warDb[warTargetNum].dead) { await reply(msg, `☠️ Opponent already dead hai! Kisi aur ko challenge karo.`); break; }
          if (warDb[senderNum].cash < warBet) {
            await reply(msg, `⚔️ Itne coins nahi hain! Tumhare paas: *${warDb[senderNum].cash}* 🪙`);
            break;
          }
          if (warDb[warTargetNum].cash < warBet) {
            await reply(msg, `⚔️ Opponent ke paas itne coins nahi hain! Unke paas: *${warDb[warTargetNum].cash}* 🪙`);
            break;
          }
          // Set up challenge with 60s timeout
          const warTimer = setTimeout(async () => {
            if (warChallenges[chatId] && warChallenges[chatId].challenger === senderNum) {
              delete warChallenges[chatId];
              await sock.sendMessage(chatId, {
                text: `⏰ *WAR EXPIRED!*\n\n@${senderNum} ka challenge expire ho gaya. @${warTargetNum} ne accept nahi kiya! 🐔`,
                mentions: [senderJid, warTargetJid]
              });
            }
          }, 60000);
          warChallenges[chatId] = {
            challenger: senderNum,
            challengerJid: senderJid,
            challengerName: msg.pushName || senderNum,
            target: warTargetNum,
            targetJid: warTargetJid,
            bet: warBet,
            timer: warTimer
          };
          await sock.sendMessage(chatId, {
            text: `╔══════════════════════╗\n║  ⚔️   𝐖𝐀𝐑  𝐂𝐇𝐀𝐋𝐋𝐄𝐍𝐆𝐄   ⚔️  ║\n╚══════════════════════╝\n\n⚔️ @${senderNum} ne @${warTargetNum} ko BATTLE ke liye challenge kiya!\n\n🪙 Bet Amount : *${warBet} coins*\n🏆 Winner Gets: *${warBet * 2} coins*\n\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n\n@${warTargetNum} — Accept karoge?\nType *${dynamicPrefix}accept* to fight! ⚔️\n\n⏰ 60 seconds mein accept karo!`,
            mentions: [senderJid, warTargetJid]
          }, { quoted: msg });
          break;
        }

        case 'accept': {
          if (!isGroup) { await reply(msg, `⚔️ War sirf group mein hoti hai!`); break; }
          const warPending = warChallenges[chatId];
          if (!warPending) { await reply(msg, `⚔️ Koi war challenge nahi hai abhi! Kisi ko *${dynamicPrefix}war <amount>* se challenge karo.`); break; }
          if (warPending.target !== senderNum) {
            await reply(msg, `⚔️ Yeh challenge tumhare liye nahi hai! @${warPending.target} ka challenge hai.`);
            break;
          }
          // Cancel timeout
          clearTimeout(warPending.timer);
          delete warChallenges[chatId];
          // Load DB and deduct bets from both
          const warFightDb = loadOwo();
          getUser(warFightDb, warPending.challenger);
          getUser(warFightDb, warPending.target);
          // Re-verify both have enough coins
          if (warFightDb[warPending.challenger].cash < warPending.bet) {
            await sock.sendMessage(chatId, { text: `❌ War cancel! @${warPending.challenger} ke paas ab enough coins nahi hain!`, mentions: [warPending.challengerJid] });
            break;
          }
          if (warFightDb[warPending.target].cash < warPending.bet) {
            await reply(msg, `❌ War cancel! Tumhare paas enough coins nahi hain!`);
            break;
          }
          // Deduct bet from both
          warFightDb[warPending.challenger].cash -= warPending.bet;
          warFightDb[warPending.target].cash -= warPending.bet;
          // Determine winner randomly
          const challengerWins = Math.random() < 0.5;
          const winnerNum  = challengerWins ? warPending.challenger  : warPending.target;
          const winnerJid  = challengerWins ? warPending.challengerJid : warPending.targetJid;
          const winnerName = challengerWins ? warPending.challengerName : (msg.pushName || warPending.target);
          const loserNum   = challengerWins ? warPending.target  : warPending.challenger;
          const loserJid   = challengerWins ? warPending.targetJid : warPending.challengerJid;
          const prize = warPending.bet * 2;
          warFightDb[winnerNum].cash += prize;
          // Kill loser, award kill to winner
          warFightDb[loserNum].dead = true;
          warFightDb[winnerNum].kills = (warFightDb[winnerNum].kills || 0) + 1;
          saveOwo(warFightDb);
          // Build dramatic battle sequence
          const moves = [
            `⚔️ @${warPending.challenger} lunges forward with a fierce strike!`,
            `🛡️ @${warPending.target} blocks and counters with fury!`,
            `💥 Blades clash — sparks fly in the arena!`,
            `🩸 Both warriors are bleeding but fighting on!`,
            `⚡ A devastating final blow lands...`
          ];
          const battleLog = moves.join('\n') + `\n\n`;
          await sock.sendMessage(chatId, {
            text: `╔══════════════════════╗\n║  ⚔️   𝐁𝐀𝐓𝐓𝐋𝐄  𝐒𝐓𝐀𝐑𝐓𝐒   ⚔️ ║\n╚══════════════════════╝\n\n${battleLog}🏆 *WINNER: @${winnerNum}* 🏆\n\n💀 @${loserNum} is DEAD!\n\n🪙 Prize: *+${prize} coins* to @${winnerNum}\n💀 Kill count +1 for @${winnerNum}\n\n_Use ${dynamicPrefix}revive to come back!_`,
            mentions: [winnerJid, loserJid]
          }, { quoted: msg });
          break;
        }

      }

      saveState();

    } catch (err) {
      console.error('Command error:', err);
      await reply(msg, '❌ Command failed. Please try again.');
    }
    return;
  }
}

// ---------- Utility Functions ----------
async function getGroupMeta(chatId) {
  if (groupCache[chatId]) return groupCache[chatId];
  let meta;
  try { meta = await sock.groupMetadata(chatId); groupCache[chatId] = meta; }
  catch { return null; }
  setTimeout(() => { delete groupCache[chatId]; }, 60000);
  return meta;
}

async function reply(original, msgText) {
  try { await sock.sendMessage(original.key.remoteJid, { text: msgText }, { quoted: original }); }
  catch (err) { console.error('Reply error:', err); }
}
