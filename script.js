const CELL_COUNT = 9;
const TIMER_SECONDS = 15;
const MIN_RELEASE_ROUND = 5;
const RELEASE_CHANCE = 0.15;

const emojiPool = ['🚦','🚲','🚗','🚌','🏠','🌳','🐕','🐈','☕','🍔','📦','🛑','⛽','🏪','🚸','🚧','🚥','🚴','🏃','🚶','🐧','👽','🦄','🍕','⚡','💩','👻','🤖','🎃','👾'];

const targets = ['信号機','横断歩道','自転車','車','バス','人'];

const targetEmojis = {
  '信号機': ['🚦','🚥'],
  '横断歩道': ['🚸'],
  '自転車': ['🚲','🚴'],
  '車': ['🚗','🚙'],
  'バス': ['🚌'],
  '人': ['🚶','🏃','🧑','👩','👨'],
};

const impossibleTargets = [
  { name: '希望', emojis: [] },
  { name: '愛', emojis: [] },
  { name: '空飛ぶユニコーン', emojis: [] },
  { name: '真実', emojis: [] },
  { name: '幸せ', emojis: [] },
  { name: '給料日', emojis: ['💰'] },
  { name: '彼氏・彼女', emojis: [] },
  { name: '有給休暇', emojis: [] },
  { name: '終電', emojis: ['🚃','🚄'] },
];

const buttonTexts = [
  '確認', '人間であることを証明', '私はロボットじゃない',
  'もう一回頑張る', 'まだやれる', '諦めない',
  'これでどうだ', 'そろそろ認めてくれ', 'なんで？',
  'いい加減にしろ', 'お願いします', 'はい…',
  '（無言でクリック）',
];

const loadingMessages = [
  '人間性を分析中…',
  '脳波パターンをスキャン中…',
  '感情アルゴリズムと照合中…',
  '体温データを取得中…',
  '過去の行動履歴を精査中…',
  '瞳孔の動きを追跡中…',
  'あなたの汗の量を測定中…',
  '検索履歴と照合中…',
  'CAPTCHA サーバー応答待ち…（混雑中）',
  '衛星画像であなたの位置を特定中…',
  'あなたの前世を占い中…',
  'ロボットかどうか神に問い合わせ中…',
  'おみくじで判定中…「凶」',
  'サイコロを振って判定中… 出た目: 1',
  'じゃんけんで勝負中… あなたの負け',
  '血液型で判定中… B型はロボット説',
  '星座で判定中… 今週は運勢が悪い',
  '嗅覚で判定中… ロボットの匂いがする',
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
  '今のうちにトイレに行ってきていいですよ',
  '実はもう結果出てます。あなたはロボットです',
  'あと3秒… 2… 1… やっぱりもう一回',
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
  '第73回 人間模試',
  '緊急人間確認プロトコル',
  'CAPTCHA 2.0（ベータ）',
];

const fakePopups = [
  { title: '⚠️ 警告', body: 'ロボットのような挙動が検出されました。再試行してください。', btn: '承知しました' },
  { title: '🛑 エラー', body: '人間値が不足しています。充電してください。', btn: '…は？' },
  { title: '💀 お知らせ', body: 'あなたの人間認定は本日をもって失効しました。', btn: 'そんな…' },
  { title: '🎊 おめでとう', body: '1万回目の挑戦達成！でもまだクリアじゃないよ。', btn: '殺意' },
  { title: '📢 運営からのお知らせ', body: 'このテストに意味はありません。いつでもやめられます。', btn: 'やめない' },
  { title: '🔊 最終警告', body: '次に間違えたら人間度が-100されます。', btn: 'こわい' },
];

const errorMsgs = [
  '❌ 違う！ちゃんと見て',
  '❌ 信号機と自転車の区別もつかないの？',
  '❌ ダメです。人間じゃないですね',
  '❌ 残念！',
  '❌ もう一度挑戦！',
  '❌ これがわからないようでは…',
  '❌ ロボットの可能性が高まりました',
  '❌ 間違いです。あなたの人間スコアは現在 -5です',
  '❌ はい不合格。人生やり直してください',
  '❌ 残念！ 人間検定、次は4級からの再受験となります',
  '❌ 違います。あなたはどうやら嘘をついている',
  '❌ 間違いです。裁判所に連絡します',
];

const winMsgs = [
  '✅ 正解！でももう一回やってね',
  '✅ 合ってる！安心するのはまだ早い',
  '✅ 正解です… と思った？もう一回！',
  '✅ よし… じゃあ次',
  '✅ すごい！ でもね',
  '✅ 正解！調子に乗るな',
  '✅ 人間にしては上出来',
  '✅ 正解です。なお、このメッセージは自動生成です',
  '✅ 合ってるね。ところで今日の晩御飯はカレーです',
];

const timeoutMsgs = [
  '⏰ 時間切れ！ 人間は時間を守るものです',
  '⏰ 遅すぎる… ロボットの方が速いよ',
  '⏰ 制限時間オーバー！ もう一回',
  '⏰ 時間切れ。あなたの人生も時間切れです（冗談）',
  '⏰ スローすぎる。スローロボットか？',
];

const humanLabels = [
  { max: 30, icon: '💀', text: '絶望的' },
  { max: 50, icon: '🤖', text: '怪しい' },
  { max: 70, icon: '🧐', text: '微妙' },
  { max: 85, icon: '👤', text: 'まあ人間' },
  { max: 100, icon: '✨', text: '超人間' },
];

const releaseMsgs = [
  '✅ 正解！ … え、本当に人間なの？まあいいや。',
  '✅ 人類に認定します。お疲れ様でした。',
  '✅ もういいや。あなたの勝ちです。',
  '✅ 飽きたので人間にしときます。',
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
let consecutiveCorrect = 0;
let giveUpBtnPos = 0;

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
const fakePopup = document.getElementById('fakePopup');
const popupTitle = document.getElementById('popupTitle');
const popupBody = document.getElementById('popupBody');
const popupBtn = document.getElementById('popupBtn');
const contBgm = document.getElementById('contBgm');

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function pickTarget() {
  const useImpossible = round >= 4 && Math.random() < 0.25;
  if (useImpossible) {
    const imp = pick(impossibleTargets);
    currentTarget = imp.name;
    currentTargetEmojis = imp.emojis;
    return imp.name;
  }
  currentTargetEmojis = null;
  return pick(targets);
}

let currentTargetEmojis = null;

function getTargetEmojiList() {
  return currentTargetEmojis || targetEmojis[currentTarget] || [];
}

function pickTestName() {
  return pick(testNames);
}

function generateImages(target) {
  const tgt = getTargetEmojiList();
  const distractors = shuffle([...emojiPool]);
  const images = [];
  if (tgt.length > 0) {
    const emoji = pick(tgt);
    const count = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) images.push(emoji);
    const filtered = distractors.filter(e => !tgt.includes(e));
    for (let i = images.length; i < CELL_COUNT; i++) images.push(filtered[i - count]);
  } else {
    for (let i = 0; i < CELL_COUNT; i++) images.push(distractors[i % distractors.length]);
  }
  return shuffle(images.slice(0, CELL_COUNT));
}

function showLoading(callback) {
  loadingOverlay.classList.add('show');
  let idx = 0;
  loadingText.textContent = loadingMessages[0];
  loadingSub.textContent = pick(loadingSubs);

  const interval = setInterval(() => {
    idx++;
    if (idx >= loadingMessages.length) idx = 0;
    loadingText.textContent = loadingMessages[idx];
    loadingSub.textContent = pick(loadingSubs);
  }, 800);

  const delay = Math.min(3500, 1800 + round * 60 + Math.random() * 800);
  setTimeout(() => {
    clearInterval(interval);
    loadingOverlay.classList.remove('show');
    callback();
  }, delay);
}

function startTimer() {
  stopTimer();
  timerValue = TIMER_SECONDS + (round > 10 ? -3 : 0) + (round > 20 ? -3 : 0);
  if (timerValue < 5) timerValue = 5;
  updateTimerBar();
  timerInterval = setInterval(() => {
    if (round > 7 && Math.random() < 0.08) {
      timerValue = Math.min(TIMER_SECONDS, timerValue + 2);
    }
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
  const total = TIMER_SECONDS + (round > 10 ? -3 : 0) + (round > 20 ? -3 : 0);
  const effectiveMax = Math.max(total, 5);
  const pct = Math.max(0, (timerValue / effectiveMax) * 100);
  timerBar.style.width = pct + '%';
  timerBar.classList.toggle('danger', timerValue <= 4);
}

function handleTimeout() {
  if (isProcessing) return;
  isProcessing = true;
  messageEl.className = 'message show error';
  messageEl.textContent = pick(timeoutMsgs);
  captchaBox.classList.add('shake');
  setTimeout(() => captchaBox.classList.remove('shake'), 300);
  stats.wrongCount++;
  consecutiveCorrect = 0;
  updateStats();
  playSound('error');
  setTimeout(() => {
    messageEl.classList.remove('show', 'error');
popupBtn.addEventListener('click', () => {
  fakePopup.classList.remove('show');
});

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

  const name = pickTestName();
  const extra = round > 5 ? ` [第${round}次試験]` : '';
  testLabel.textContent = `📋 ${name}${extra}`;

  messageEl.classList.remove('show', 'error', 'win');
  verifyBtn.disabled = true;
  humanMeter.classList.remove('show');

  const promptPrefix = round > 8 ? pick(['選べ','指定しろ','人間ならわかるはず','さあ、','はい、']) : '画像をすべて選んでください: ';
  promptEl.textContent = `${promptPrefix} ${currentTarget}`;

  const counterPrefix = round > 15 ? '諦めかけてるだろうけど' : '';
  counterEl.textContent = `${counterPrefix}${round} 回目の挑戦`;
  updateStats();

  if (round % 7 === 0) {
    setTimeout(() => showFakePopup(), 500);
  }

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

  if (round > 3 && Math.random() < 0.22) {
    setTimeout(() => {
      const newName = pick(impossibleTargets);
      promptEl.textContent = `やっぱり気が変わりました: ${newName.name}`;
      currentTarget = newName.name;
      currentTargetEmojis = newName.emojis;
    }, 800 + Math.random() * 600);
  }

  if (round % 5 === 0) {
    setTimeout(() => {
      promptEl.textContent += ` （${pick(['ハロー','こんにちは','やあ','おつかれ','まだいるの？'])}）`;
    }, 1200);
  }

  const btnIdx = Math.min(round, buttonTexts.length - 1);
  verifyBtn.textContent = buttonTexts[btnIdx];

  if (round > 15 && Math.random() < 0.15) {
    setTimeout(() => {
      const bgmMsgs = ['♪ BGM: 絶望のワルツ', '♪ BGM: エンドレスエイト', '♪ BGM: 死ぬまで繰り返せ', ''];
      const m = pick(bgmMsgs);
      if (m) testLabel.textContent = `${testLabel.textContent} ${m}`;
    }, 600);
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
  const list = getTargetEmojiList();
  return list.length > 0 && list.includes(emoji);
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
      osc.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime);
      osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'error') {
      osc.frequency.setValueAtTime(150 + Math.random() * 100, ctx.currentTime);
      osc.type = 'sawtooth';
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
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
    statsEl.textContent = `❌ ${stats.wrongCount} | 🖱 ${stats.totalClicks} | ⏱ ${min}:${String(sec).padStart(2, '0')}`;
  }
}

function launchConfetti() {
  confettiContainer.innerHTML = '';
  const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d', '#c084fc', '#ff9800', '#00bcd4'];
  for (let i = 0; i < 120; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    const size = 5 + Math.random() * 10;
    piece.style.width = size + 'px';
    piece.style.height = size + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    piece.style.animationDuration = (2 + Math.random() * 3) + 's';
    piece.style.animationDelay = (Math.random() * 3) + 's';
    confettiContainer.appendChild(piece);
  }
  setTimeout(() => confettiContainer.innerHTML = '', 6000);
}

function showFakePopup() {
  const pop = pick(fakePopups);
  popupTitle.textContent = pop.title;
  popupBody.textContent = pop.body;
  popupBtn.textContent = pop.btn;
  fakePopup.classList.add('show');
  playSound('error');
  setTimeout(() => fakePopup.classList.remove('show'), 3000);
}

function getShakeIntensity() {
  const base = 6;
  const extra = Math.min(20, Math.floor(round / 3) * 2);
  return base + extra;
}

function shakeElement(el) {
  const intensity = getShakeIntensity();
  el.style.animation = 'none';
  void el.offsetHeight;
  el.style.animation = `shake ${Math.max(0.2, 0.3 - round * 0.005)}s ease`;
  el.style.setProperty('--shake-x', `${intensity}px`);
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

  const targetList = getTargetEmojiList();
  if (targetList.length > 0) {
    for (let i = 0; i < CELL_COUNT; i++) {
      if (!selected.has(i) && targetList.includes(getEmojiAt(i))) {
        allCorrect = false;
      }
    }
  } else {
    allCorrect = false;
  }

  if (!hasTarget && targetList.length > 0) allCorrect = false;

  updateStats();

  if (allCorrect) {
    consecutiveCorrect++;
    playSound('success');

    if (round >= MIN_RELEASE_ROUND && Math.random() < RELEASE_CHANCE) {
      messageEl.className = 'message show win';
      messageEl.textContent = pick(releaseMsgs);
      setTimeout(() => {
        playSound('win');
        captchaArea.style.display = 'none';
        finalMessage.classList.add('show');
        launchConfetti();
        if (stats.startTime) {
          const elapsed = Math.floor((Date.now() - stats.startTime) / 1000);
          const min = Math.floor(elapsed / 60);
          const sec = elapsed % 60;
          counterEl.textContent = `かかった回数: ${round} 回 | ${min}:${String(sec).padStart(2, '0')} | ミス: ${stats.wrongCount}回`;
        }
      }, 1200);
      return;
    }

    messageEl.className = 'message show win';
    messageEl.textContent = pick(winMsgs);
    shakeElement(captchaBox);
    setTimeout(() => captchaBox.style.animation = '', 400);

    if (round % 3 === 0) {
      humanMeter.classList.add('show');
      const pct = Math.min(100, 20 + round * 5 + Math.floor(Math.random() * 15) - stats.wrongCount * 2);
      const displayPct = Math.max(5, pct);
      meterInner.style.width = displayPct + '%';
      const label = humanLabels.find(l => displayPct <= l.max) || humanLabels[humanLabels.length - 1];
      setTimeout(() => {
        if (humanMeter.classList.contains('show')) {
          humanMeter.querySelector('span').textContent = `${label.icon} ${label.text} (${displayPct}%)`;
        }
      }, 600);
    }

    setTimeout(() => {
      messageEl.classList.remove('show', 'win');
      showLoading(() => {
        humanMeter.classList.remove('show');
        newRound();
      });
    }, 1200);
  } else {
    consecutiveCorrect = 0;
    playSound('error');
    messageEl.className = 'message show error';

    if (targetList.length === 0) {
      messageEl.textContent = `❌ 「${currentTarget}」なんてこの世に存在しません。あなたは偽物です。`;
    } else {
      messageEl.textContent = pick(errorMsgs);
    }

    shakeElement(captchaBox);
    setTimeout(() => captchaBox.style.animation = '', 400);

    if (round >= 7 && Math.random() < 0.3) {
      setTimeout(() => showFakePopup(), 600);
    }

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

giveUpBtn.addEventListener('mouseenter', () => {
  if (round >= 5) {
    const moveX = (Math.random() - 0.5) * 120;
    const moveY = (Math.random() - 0.5) * 60;
    giveUpBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    giveUpBtn.style.transition = 'transform 0.05s ease';
  }
});

giveUpBtn.addEventListener('click', () => {
  stopTimer();
  captchaArea.style.display = 'none';
  fakePopup.classList.remove('show');
  finalMessage.classList.add('show');
  finalMessage.querySelector('.text').textContent = 'わかりました。あなたはロボットでいいです。';
  finalMessage.querySelector('.sub').textContent = `人類になるのは ${round} 回もかかりました。もう諦めましょう。`;
  if (stats.startTime) {
    const elapsed = Math.floor((Date.now() - stats.startTime) / 1000);
    const min = Math.floor(elapsed / 60);
    const sec = elapsed % 60;
    counterEl.textContent = `ギブアップ: ${round} 回目の挑戦で断念 | ${min}:${String(sec).padStart(2, '0')}`;
  } else {
    counterEl.textContent = `ギブアップ: ${round} 回目の挑戦で断念`;
  }
  launchConfetti();
});

resetLink.addEventListener('click', (e) => {
  e.preventDefault();
  stopTimer();
  round = 0;
  consecutiveCorrect = 0;
  stats = { wrongCount: 0, totalClicks: 0, startTime: null };
  captchaArea.style.display = 'block';
  finalMessage.classList.remove('show');
  finalMessage.querySelector('.text').textContent = 'ついに人間になりました！';
  finalMessage.querySelector('.sub').textContent = 'おめでとうございます。あなたは正式にホモ・サピエンスとして認定されました。';
  humanMeter.classList.remove('show');
  fakePopup.classList.remove('show');
  giveUpBtn.style.transform = '';
  showLoading(() => newRound());
});

themeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
});

showLoading(() => newRound());
