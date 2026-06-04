const CELL_COUNT = 9;
const TIMER_SECONDS = 15;
const MIN_RELEASE_ROUND = 5;
const RELEASE_CHANCE = 0.2;

const emojiPool = ['🚦','🚲','🚗','🚌','🏠','🌳','🐕','🐈','☕','🍔','📦','🛑','⛽','🏪','🚸','🚧','🚥','🚴','🏃','🚶','🐧','👽','🦄','🍕','⚡'];

const targets = ['信号機','横断歩道','自転車','車','バス','人'];
const targetEmojis = {
  '信号機': ['🚦','🚥'],
  '横断歩道': ['🚸'],
  '自転車': ['🚲','🚴'],
  '車': ['🚗','🚙'],
  'バス': ['🚌'],
  '人': ['🚶','🏃','🧑','👩','👨'],
};

const loadingMessages = [
  '人間性を分析中…',
  '脳波パターンをスキャン中…',
  '感情アルゴリズムと照合中…',
  '体温データを取得中…',
  '過去の行動履歴を精査中…',
  'AI vs 人間　判定モデル実行中…',
  '瞳孔の動きを追跡中…',
  'あなたの汗の量を測定中…',
  '検索履歴と照合中… やばい',
  'CAPTCHA サーバー応答待ち…（混雑中）',
  '衛星画像であなたの位置を特定中…',
  'あなたの前世を占い中…',
  'ロボットかどうか神に問い合わせ中…',
];

const loadingSubs = [
  'だいたい決まってます、あと少々',
  '結果によっては再試験があります',
  '本当に人間ですか？',
  '怪しい挙動を検出… 冗談です',
  'いつものことなので気にしないでください',
  'この処理には意味がありません',
  'ちょっとした寸劇です',
  'そろそろ飽きてきましたか？',
];

const testNames = [
  '標準人間性確認試験',
  '高度ロボット識別テスト',
  'CAPTCHA適性検査 Type-Z',
  'ホモ・サピエンス検定 第3級',
  'AI回避能力測定試験',
  '令和に対応した人間か確認するテスト',
  'grecaptcha.getResponse() 検証',
  '指紋認証（簡易版）',
  'ソーシャルスコア測定',
  'あなたはあなたですか？確認テスト',
];

let round = 0;
let currentTarget = '';
let currentImages = [];
let selected = new Set();
let isProcessing = false;
let timerInterval = null;
let timerValue = TIMER_SECONDS;
let isDarkMode = false;
let stats = { wrongCount: 0, totalClicks: 0, startTime: null };

const promptEl = document.getElementById('prompt');
const gridEl = document.getElementById('grid');
const verifyBtn = document.getElementById('verifyBtn');
const counterEl = document.getElementById('counter');
const captchaBox = document.getElementById('captchaBox');
const messageEl = document.getElementById('message');
const giveUpBtn = document.getElementById('giveUpBtn');
const captchaArea = document.getElementById('captchaArea');
const finalMessage = document.getElementById('finalMessage');
const resetLink = document.getElementById('resetLink');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');
const loadingSub = document.getElementById('loadingSub');
const themeToggle = document.getElementById('themeToggle');
const timerBar = document.getElementById('timerBar');
const statsEl = document.getElementById('stats');
const humanMeter = document.getElementById('humanMeter');
const meterInner = document.getElementById('meterInner');
const testLabel = document.getElementById('testLabel');
const confettiContainer = document.getElementById('confettiContainer');

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickTarget() {
  return targets[Math.floor(Math.random() * targets.length)];
}

function pickTestName() {
  return testNames[Math.floor(Math.random() * testNames.length)];
}

function generateImages(target) {
  const tgt = targetEmojis[target];
  const emoji = tgt[Math.floor(Math.random() * tgt.length)];
  const distractors = shuffle([...emojiPool.filter(e => !tgt.includes(e))]);
  const count = 1 + Math.floor(Math.random() * 2);
  const images = [];
  for (let i = 0; i < count; i++) images.push(emoji);
  for (let i = images.length; i < CELL_COUNT; i++) images.push(distractors[i - count]);
  return shuffle(images);
}

function showLoading(callback) {
  loadingOverlay.classList.add('show');
  let idx = 0;
  loadingText.textContent = loadingMessages[0];
  loadingSub.textContent = loadingSubs[0];

  const interval = setInterval(() => {
    idx++;
    if (idx >= loadingMessages.length) idx = 0;
    loadingText.textContent = loadingMessages[idx];
    loadingSub.textContent = loadingSubs[Math.floor(Math.random() * loadingSubs.length)];
  }, 900);

  setTimeout(() => {
    clearInterval(interval);
    loadingOverlay.classList.remove('show');
    callback();
  }, 2500 + Math.random() * 1500);
}

function startTimer() {
  stopTimer();
  timerValue = TIMER_SECONDS;
  updateTimerBar();
  timerInterval = setInterval(() => {
    timerValue--;
    updateTimerBar();
    if (timerValue <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerBar() {
  const pct = (timerValue / TIMER_SECONDS) * 100;
  timerBar.style.width = pct + '%';
  timerBar.classList.toggle('danger', timerValue <= 4);
}

function handleTimeout() {
  if (isProcessing) return;
  isProcessing = true;
  messageEl.className = 'message show error';
  const msgs = [
    '⏰ 時間切れ！ 人間は時間を守るものです',
    '⏰ 遅すぎる… ロボットの方が速いよ',
    '⏰ 制限時間オーバー！ もう一回',
  ];
  messageEl.textContent = msgs[Math.floor(Math.random() * msgs.length)];
  captchaBox.classList.add('shake');
  setTimeout(() => captchaBox.classList.remove('shake'), 300);
  stats.wrongCount++;
  updateStats();
  playSound('error');
  setTimeout(() => {
    messageEl.classList.remove('show', 'error');
    showLoading(() => newRound());
  }, 1200);
}

function newRound() {
  round++;
  selected.clear();
  isProcessing = false;

  if (stats.startTime === null) stats.startTime = Date.now();

  currentTarget = pickTarget();
  currentImages = generateImages(currentTarget);

  testLabel.textContent = `📋 ${pickTestName()}`;
  messageEl.classList.remove('show', 'error', 'win');
  giveUpBtn.classList.remove('show');
  verifyBtn.disabled = true;
  humanMeter.classList.remove('show');

  promptEl.textContent = `画像をすべて選んでください: ${currentTarget}`;
  counterEl.textContent = `${round} 回目の挑戦`;
  updateStats();

  gridEl.innerHTML = '';
  currentImages.forEach((emoji, i) => {
    const cell = document.createElement('div');
    cell.className = 'image-cell';
    cell.textContent = emoji;
    cell.dataset.index = i;
    cell.addEventListener('click', () => toggleCell(cell, i));
    gridEl.appendChild(cell);
  });

  startTimer();

  if (round > 3 && Math.random() < 0.2) {
    setTimeout(() => {
      const newTarget = targets[Math.floor(Math.random() * targets.length)];
      promptEl.textContent = `やっぱり気が変わりました: ${newTarget}`;
      currentTarget = newTarget;
    }, 800);
  }

  if (round % 5 === 0) {
    setTimeout(() => {
      const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
      const greet = ['ハロー', 'こんにちは', 'やあ', 'おつかれ'];
      promptEl.textContent += ` （${greet[Math.floor(Math.random() * greet.length)]}）`;
    }, 1200);
  }
}

function toggleCell(cell, i) {
  if (isProcessing) return;
  stats.totalClicks++;
  if (selected.has(i)) {
    selected.delete(i);
    cell.classList.remove('selected');
  } else {
    selected.add(i);
    cell.classList.add('selected');
    playSound('click');
  }
  verifyBtn.disabled = selected.size === 0;
}

function getEmojiAt(i) {
  return currentImages[i];
}

function isTargetEmoji(emoji) {
  const pool = targetEmojis[currentTarget];
  return pool && pool.includes(emoji);
}

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);

    if (type === 'click') {
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'error') {
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.type = 'sawtooth';
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'win') {
      [523, 659, 784, 1047].forEach((freq, i) => {
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.connect(g2);
        g2.connect(ctx.destination);
        g2.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.12);
        g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.2);
        o2.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        o2.type = 'sine';
        o2.start(ctx.currentTime + i * 0.12);
        o2.stop(ctx.currentTime + i * 0.12 + 0.2);
      });
    }
  } catch (_) {}
}

function updateStats() {
  if (stats.startTime) {
    const elapsed = Math.floor((Date.now() - stats.startTime) / 1000);
    const min = Math.floor(elapsed / 60);
    const sec = elapsed % 60;
    statsEl.textContent = `❌ ${stats.wrongCount} 回ミス | 🖱 ${stats.totalClicks} クリック | ⏱ ${min}:${String(sec).padStart(2, '0')}`;
  }
}

function launchConfetti() {
  confettiContainer.innerHTML = '';
  const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d', '#c084fc'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (6 + Math.random() * 8) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    piece.style.animationDelay = (Math.random() * 2) + 's';
    confettiContainer.appendChild(piece);
  }
  setTimeout(() => confettiContainer.innerHTML = '', 5000);
}

verifyBtn.addEventListener('click', () => {
  if (isProcessing) return;
  isProcessing = true;
  stopTimer();
  verifyBtn.disabled = true;

  const cells = gridEl.querySelectorAll('.image-cell');
  let allCorrect = true;
  let hasTarget = false;

  selected.forEach(i => {
    const emoji = getEmojiAt(i);
    if (isTargetEmoji(emoji)) {
      cells[i].classList.add('correct');
      hasTarget = true;
    } else {
      cells[i].classList.add('wrong');
      allCorrect = false;
      stats.wrongCount++;
    }
  });

  for (let i = 0; i < CELL_COUNT; i++) {
    if (!selected.has(i) && isTargetEmoji(getEmojiAt(i))) {
      allCorrect = false;
    }
  }

  if (!hasTarget) allCorrect = false;
  updateStats();

  if (allCorrect) {
    playSound('success');
    if (round >= MIN_RELEASE_ROUND && Math.random() < RELEASE_CHANCE) {
      messageEl.className = 'message show win';
      messageEl.textContent = '✅ 正解！ … え、本当に人間なの？まあいいや。';
      setTimeout(() => {
        playSound('win');
        captchaArea.style.display = 'none';
        finalMessage.classList.add('show');
        launchConfetti();
        if (stats.startTime) {
          const elapsed = Math.floor((Date.now() - stats.startTime) / 1000);
          const min = Math.floor(elapsed / 60);
          const sec = elapsed % 60;
          counterEl.textContent = `かかった回数: ${round} 回 | 経過時間: ${min}:${String(sec).padStart(2, '0')} | ミス: ${stats.wrongCount}回`;
        }
      }, 1200);
      return;
    }

    messageEl.className = 'message show win';
    const msgs = [
      '✅ 正解！でももう一回やってね',
      '✅ 合ってる！安心するのはまだ早い',
      '✅ 正解です… と思った？もう一回！',
      '✅ よし… じゃあ次',
      '✅ すごい！ でもね',
      '✅ 正解！調子に乗るな',
      '✅ 人間にしては上出来',
    ];
    messageEl.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    captchaBox.classList.add('shake');
    setTimeout(() => captchaBox.classList.remove('shake'), 300);

    if (round % 3 === 0) {
      humanMeter.classList.add('show');
      const pct = Math.min(100, 30 + round * 7 + Math.floor(Math.random() * 15));
      meterInner.style.width = pct + '%';
      const label = meterInner.parentElement?.nextElementSibling;
      if (pct < 50) {
        setTimeout(() => { if (humanMeter.classList.contains('show')) humanMeter.querySelector('span').textContent = '🤖 怪しい'; }, 600);
      } else if (pct < 80) {
        setTimeout(() => { if (humanMeter.classList.contains('show')) humanMeter.querySelector('span').textContent = '🧐 微妙'; }, 600);
      } else {
        setTimeout(() => { if (humanMeter.classList.contains('show')) humanMeter.querySelector('span').textContent = '👤 まあ人間寄り'; }, 600);
      }
    }

    setTimeout(() => {
      messageEl.classList.remove('show', 'win');
      showLoading(() => {
        humanMeter.classList.remove('show');
        newRound();
      });
    }, 1200);
  } else {
    playSound('error');
    messageEl.className = 'message show error';
    const msgs = [
      '❌ 違う！ちゃんと見て',
      '❌ 信号機と自転車の区別もつかないの？',
      '❌ ダメです。人間じゃないですね',
      '❌ 残念！さっきと同じ問題だよ',
      '❌ もう一度挑戦！',
      '❌ これがわからないようでは…',
      '❌ ロボットの可能性が高まりました',
    ];
    messageEl.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    captchaBox.classList.add('shake');
    setTimeout(() => captchaBox.classList.remove('shake'), 300);
    setTimeout(() => {
      selected.clear();
      cells.forEach(c => c.classList.remove('selected', 'wrong', 'correct'));
      verifyBtn.disabled = true;
      isProcessing = false;
      startTimer();
    }, 800);

    if (round >= 3) giveUpBtn.classList.add('show');
  }
});

giveUpBtn.addEventListener('click', () => {
  stopTimer();
  captchaArea.style.display = 'none';
  finalMessage.classList.add('show');
  finalMessage.querySelector('.text').textContent = 'わかりました。あなたはロボットでいいです。';
  finalMessage.querySelector('.sub').textContent = `人類になるのは ${round} 回もかかりました。もう諦めましょう。`;
  if (stats.startTime) {
    const elapsed = Math.floor((Date.now() - stats.startTime) / 1000);
    const min = Math.floor(elapsed / 60);
    const sec = elapsed % 60;
    counterEl.textContent = `ギブアップ: ${round} 回目の挑戦で断念 | 経過: ${min}:${String(sec).padStart(2, '0')}`;
  } else {
    counterEl.textContent = `ギブアップ: ${round} 回目の挑戦で断念`;
  }
});

resetLink.addEventListener('click', (e) => {
  e.preventDefault();
  stopTimer();
  round = 0;
  stats = { wrongCount: 0, totalClicks: 0, startTime: null };
  captchaArea.style.display = 'block';
  finalMessage.classList.remove('show');
  finalMessage.querySelector('.text').textContent = 'ついに人間になりました！';
  finalMessage.querySelector('.sub').textContent = 'おめでとうございます。あなたは正式にホモ・サピエンスとして認定されました。';
  humanMeter.classList.remove('show');
  showLoading(() => newRound());
});

themeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
});

showLoading(() => newRound());
