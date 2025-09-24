// 1. 学習する単語リストを準備する
const words = [
    { english: 'apple', japanese: 'りんご' },
    { english: 'banana', japanese: 'バナナ' },
    { english: 'cherry', japanese: 'さくらんぼ' },
    { english: 'orange', japanese: 'オレンジ' },
    { english: 'grape', japanese: 'ぶどう' }
    // ここに単語を追加していく
];

let currentIndex = 0; // 現在表示している単語のインデックス

// 2. HTMLの要素を取得する
const englishWordEl = document.getElementById('english-word');
const japaneseMeaningEl = document.getElementById('japanese-meaning');
const toggleButton = document.getElementById('toggle-button');
const nextButton = document.getElementById('next-button');

// 3. 画面に単語を表示する関数
function showWord() {
    englishWordEl.textContent = words[currentIndex].english;
    japaneseMeaningEl.textContent = words[currentIndex].japanese;
    japaneseMeaningEl.classList.add('hidden'); // 最初は意味を隠しておく
}

// 4. 「意味を隠す/表示」ボタンが押されたときの処理
toggleButton.addEventListener('click', () => {
    japaneseMeaningEl.classList.toggle('hidden');
});

// 5. 「次の単語へ」ボタンが押されたときの処理
nextButton.addEventListener('click', () => {
    // 次のインデックスに移動
    currentIndex++;
    // 最後の単語までいったら、最初に戻る
    if (currentIndex >= words.length) {
        currentIndex = 0;
    }
    // 次の単語を表示
    showWord();
});

// 最初にサイトを開いたときに、最初の単語を表示する
showWord();
