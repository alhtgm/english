// HTMLの要素を取得
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const nextButton = document.getElementById('next-button');
const speakButton = document.getElementById('speak-button');

let words = []; // JSONから読み込んだ単語を格納する配列
let currentQuestionIndex;
let shuffledWords;

// --- 音声再生機能 ---

// テキストを読み上げる関数
function speak(text) {
    if (typeof SpeechSynthesisUtterance === 'undefined' || typeof speechSynthesis === 'undefined') {
        alert('お使いのブラウザは音声読み上げに対応していません。');
        return;
    }
    
    // 進行中の発言があればキャンセル
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // アメリカ英語
    utterance.rate = 0.9;     // 読み上げ速度
    speechSynthesis.speak(utterance);
}

// スピーカーボタンのクリックイベント
speakButton.addEventListener('click', () => {
    const text = questionEl.textContent;
    if (text) {
        speak(text);
    }
});

// --- クイズのメインロジック ---

// JSONファイルを読み込んでクイズを初期化
async function initQuiz() {
    try {
        const response = await fetch('words.json');
        words = await response.json();
        if (words.length === 0) {
            questionEl.innerText = 'エラー: 単語リストが空です。';
            return;
        }
        startQuiz();
    } catch (error) {
        console.error('単語データの読み込みに失敗しました:', error);
        questionEl.innerText = 'エラー: words.jsonを読み込めませんでした。';
    }
}

// 配列をシャッフルする関数
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// クイズを開始する関数
function startQuiz() {
    shuffledWords = shuffle([...words]);
    currentQuestionIndex = 0;
    nextButton.innerText = '次の問題へ';
    nextButton.onclick = () => {
        currentQuestionIndex++;
        setNextQuestion();
    };
    setNextQuestion();
}

// 次の問題を設定する関数
function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < shuffledWords.length) {
        showQuestion(shuffledWords[currentQuestionIndex]);
    } else {
        questionEl.innerText = 'クイズ完了！ 🎉';
        choicesEl.innerHTML = '';
        speakButton.style.display = 'none'; // クイズ完了時はボタンを隠す
        nextButton.innerText = 'もう一度挑戦する';
        nextButton.onclick = () => {
          speakButton.style.display = 'inline-block'; // 再挑戦時にボタンを再表示
          startQuiz();
        };
        nextButton.style.display = 'block';
    }
}

// 問題と選択肢を表示する関数
function showQuestion(word) {
    const currentWord = word.english;
    questionEl.innerText = currentWord;
    
    // 問題表示と同時に単語を自動で発音
    speak(currentWord);

    const correctAnswer = word.japanese;
    // 自分自身と違う単語をダミー選択肢として3つ選ぶ
    const dummyChoices = words
        .filter(w => w.japanese !== correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.japanese);

    const allChoices = shuffle([correctAnswer, ...dummyChoices]);

    allChoices.forEach(choice => {
        const button = document.createElement('button');
        button.innerText = choice;
        button.classList.add('choice-button');
        if (choice === correctAnswer) {
            button.dataset.correct = true;
        }
        button.addEventListener('click', selectAnswer);
        choicesEl.appendChild(button);
    });
}

// 状態をリセットする関数
function resetState() {
    nextButton.style.display = 'none';
    while (choicesEl.firstChild) {
        choicesEl.removeChild(choicesEl.firstChild);
    }
}

// 選択肢が選ばれたときの処理
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;

    Array.from(choicesEl.children).forEach(button => {
        button.disabled = true;
        if (button.dataset.correct) {
            button.classList.add('correct');
        }
    });

    if (!correct) {
        selectedButton.classList.add('incorrect');
    }

    nextButton.style.display = 'block';
}

// 最初にクイズの初期化処理を呼び出す
initQuiz();
