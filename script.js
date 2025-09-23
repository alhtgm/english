// HTMLの要素を取得
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const nextButton = document.getElementById('next-button');

let words = []; // JSONから読み込んだ単語を格納する配列
let currentQuestionIndex;
let shuffledWords;

// --- ここからが変更点 ---

// JSONファイルを読み込んでクイズを開始する
async function initQuiz() {
    try {
        const response = await fetch('words.json'); // words.jsonを読み込む
        words = await response.json(); // JSONデータをJavaScriptの配列に変換
        startQuiz(); // データの準備ができてからクイズを開始
    } catch (error) {
        console.error('単語データの読み込みに失敗しました:', error);
        questionEl.innerText = 'エラー: 単語リストを読み込めませんでした。';
    }
}

// --- ここまでが変更点 ---

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
    nextButton.innerText = '次の問題へ'; // ボタンのテキストをリセット
    nextButton.onclick = () => { // ボタンの機能を通常に戻す
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
        nextButton.innerText = 'もう一度挑戦する';
        nextButton.onclick = startQuiz; // ボタンの機能を再スタートに変更
        nextButton.style.display = 'block';
    }
}

// 問題と選択肢を表示する関数
function showQuestion(word) {
    questionEl.innerText = word.english;

    const correctAnswer = word.japanese;
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