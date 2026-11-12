const images = {
  stage1: "img/Game-Start.jpg",   // 場景 1：遊戲開始畫面
  stage2: "img/Battle.jpg",       // 場景 2：VS畫面
  stage3: "img/Battle-image.jpg", // 場景 3：對戰畫面
  battleScene: "img/mora.jpg",    // 場景 4：猜拳對決畫面
  drawScene: "img/Draw.jpg",      // 平手畫面

  // 剪刀 石頭 布 圖片
  hands: {
    scissors: "img/scissors.png",
    stone: "img/stone.png",
    paper: "img/paper.png"
  },
  // 勝利輪播圖片
  winList: [
    "img/win-1.jpg",
    "img/win-2.jpg",
    "img/win-3.jpg",
    "img/win-4.jpg"
  ],
  // 失敗輪播圖片
  loseList: [
    "img/lose-1.jpg",
    "img/lose-2.jpg",
    "img/lose-3.jpg",
    "img/lose-4.png"
  ]
};

// 遊戲狀態變數
let playerPick = '';        // 玩家出拳選擇
let computerPick = '';      // 電腦出拳選擇
let playlist = [];          // 勝負結果輪播圖清單
let currentIndex = 0;       // 目前輪播圖片索引
let carouselTimer = null;   // 輪播計時器
let battleTimer = null;     // 對決過場計時器

// 抓取 DOM 元素
const welcomeScene = document.getElementById('welcome-scene');
const startBtn = document.getElementById('start-btn');
const gameImg = document.getElementById('game-img');
const displayBox = document.getElementById('display-box');
const statusText = document.getElementById('status-text');
const mainBottomPanel = document.getElementById('main-bottom-panel');
const phaseSelectGrid = document.getElementById('phase-select-grid');
const choiceBtns = document.querySelectorAll('.grid-btn');
const bigAttackBtn = document.getElementById('big-attack-btn');
const battleHands = document.getElementById('battle-hands');
const playerHandImg = document.getElementById('player-hand-img');
const computerHandImg = document.getElementById('computer-hand-img');
const overlayRestartBtn = document.getElementById('overlay-restart-btn');

// 點擊遊戲開始按鈕，切換到場景 2（VS 過場）
function goToVSStage() {
  welcomeScene.classList.add('hidden'); // 隱藏歡迎畫面
  gameImg.src = images.stage2;          // 顯示 VS 畫面
  statusText.innerText = "對決即將開始...";

  // 1.5 秒後自動進入場景 3 選拳畫面
  setTimeout(() => {
    goToBattleStage();
  }, 1500);
}

// 進入場景 3（三選一出拳與戰鬥畫面）
function goToBattleStage() {
  gameImg.src = images.stage3;
  statusText.innerText = "請選擇出拳選項";
  phaseSelectGrid.classList.remove('hidden'); // 顯示三選一按鈕
  bigAttackBtn.classList.add('hidden');       // 隱藏出拳大按鈕
  mainBottomPanel.classList.remove('hidden'); // 顯示底部面板
}

// 玩家選擇拳種，維持在場景 3 並顯示「出拳！」按鈕
function playerChoose(pick) {
  playerPick = pick;
  statusText.innerText = `你選擇了 ${getChoiceName(pick)}，請點擊出拳！`;
  gameImg.src = images.stage3;

  phaseSelectGrid.classList.add('hidden');    // 隱藏三選一網格
  bigAttackBtn.classList.remove('hidden');    // 亮出滿版出拳按鈕
}

// 開始猜拳對決與勝負判定
function startBattle() {
  bigAttackBtn.classList.add('hidden');
  mainBottomPanel.classList.add('hidden');
  gameImg.src = images.battleScene; // 切換猜拳對決背景圖
  statusText.innerText = "猜拳對決中...！！！";

  // 電腦隨機出拳
  const choices = ['scissors', 'stone', 'paper'];
  computerPick = choices[Math.floor(Math.random() * choices.length)];

  // 判定勝負結果
  let result = '';
  if (playerPick === computerPick) {
    result = 'draw';
  } else if (
    (playerPick === 'stone' && computerPick === 'scissors') ||
    (playerPick === 'scissors' && computerPick === 'paper') ||
    (playerPick === 'paper' && computerPick === 'stone')
  ) {
    result = 'win';
  } else {
    result = 'lose';
  }

  // 顯示雙方出拳圖片
  playerHandImg.src = images.hands[playerPick];
  computerHandImg.src = images.hands[computerPick];
  battleHands.classList.remove('hidden');

  // 停留 2 秒對峙後，進入結果畫面
  battleTimer = setTimeout(() => {
    battleHands.classList.add('hidden');

    if (result === 'win') {
      statusText.innerText = `你贏了！：你出 [${getChoiceName(playerPick)}] 贏了對方的 [${getChoiceName(computerPick)}]！`;
      playlist = images.winList;
      currentIndex = 0;
      startCarousel();
    } else if (result === 'lose') {
      statusText.innerText = `你輸了！：你出 [${getChoiceName(playerPick)}] 輸給對方的 [${getChoiceName(computerPick)}]...`;
      playlist = images.loseList;
      currentIndex = 0;
      startCarousel();
    } else {
      statusText.innerText = `平手！雙方都出 [${getChoiceName(playerPick)}]，再來一局吧！`;
      if (images.drawScene) {
        gameImg.src = images.drawScene;
      }
      overlayRestartBtn.classList.remove('hidden');
    }
  }, 2000);
}

// 啟動勝負圖片輪播
function startCarousel() {
  changeImageWithShake(playlist[currentIndex]);

  carouselTimer = setInterval(() => {
    currentIndex++;
    if (currentIndex < playlist.length) {
      changeImageWithShake(playlist[currentIndex]);
    } else {
      clearInterval(carouselTimer);
      overlayRestartBtn.classList.remove('hidden');
      statusText.innerText = "遊戲結束";
    }
  }, 1500);
}

// 切換圖片並觸發畫面震動特效
function changeImageWithShake(src) {
  gameImg.src = src;
  displayBox.classList.add('shake-effect');
  setTimeout(() => {
    displayBox.classList.remove('shake-effect');
  }, 500);
}

// 重設遊戲，回到場景 3 繼續下一局
function resetGame() {
  clearInterval(carouselTimer); // 清除輪播計時器
  clearTimeout(battleTimer);    // 清除對決計時器
  playerPick = '';
  computerPick = '';
  playlist = [];
  currentIndex = 0;

  overlayRestartBtn.classList.add('hidden');  // 隱藏再一局按鈕
  battleHands.classList.add('hidden');        // 隱藏雙方出拳框
  displayBox.classList.remove('shake-effect'); // 移除震動特效

  goToBattleStage(); // 回到選拳畫面
}

// 將英文代號轉換為中文拳種名稱
function getChoiceName(pick) {
  if (pick === 'scissors') return '剪刀';
  if (pick === 'stone') return '石頭';
  if (pick === 'paper') return '布';
  return '';
}

// --- 事件監聽器統一綁定（HTML 與 JS 分離） ---
startBtn.addEventListener('click', goToVSStage);        // 綁定「遊戲開始」按鈕
bigAttackBtn.addEventListener('click', startBattle);    // 綁定「出拳！」按鈕
overlayRestartBtn.addEventListener('click', resetGame); // 綁定「再一局！」按鈕

// 綁定剪刀、石頭、布三個選項按鈕
choiceBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const choice = btn.getAttribute('data-choice');
    playerChoose(choice);
  });
});
