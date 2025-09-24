// HTMLの要素を取得
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const nextButton = document.getElementById('next-button');
const speakButton = document.getElementById('speak-button'); // ★追加

let words = []; 
let currentQuestionIndex;
let shuffledWords;

// --- ↓ここからが音声再生機能 ---

// テキストを読み上げる関数
function speak(text) {
    // ブラウザに音声合成機能があるか確認
    if (typeof SpeechSynthesisUtterance === 'undefined' || typeof speechSynthesis === 'undefined') {
        alert('お使いのブラウザは音声読み上げに対応していません。');
        return;
    }
    
    // 発言を作成
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 言語を英語（アメリカ）に設定
    utterance.lang = 'en-US'; 
    // イギリス英語にしたい場合は 'en-GB' に変更
    
    // 速度（0.1〜10, デフォルトは1）
    utterance.rate = 0.9; 
    
    // 発言を開始
    speechSynthesis.speak(utterance);
}

// スピーカーボタンがクリックされたときの処理
speakButton.addEventListener('click', () => {
    const text = questionEl.textContent;
    if (text) {
        speak(text);
    }
});

// --- ↑ここまでが音声再生機能 ---


async function initQuiz() {
    try {
        const response = await fetch('words.json');
        words = await response.json();
        startQuiz();
    } catch (error) {
        console.error('単語データの読み込みに失敗しました:', error);
        questionEl.innerText = 'エラー: 単語リストを読み込めませんでした。';
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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

function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < shuffledWords.length) {
        showQuestion(shuffledWords[currentQuestionIndex]);
    } else {
        questionEl.innerText = 'クイズ完了！ 🎉';
        choicesEl.innerHTML = '';
        speakButton.style.display = 'none'; // ★クイズ完了時はボタンを隠す
        nextButton.innerText = 'もう一度挑戦する';
        nextButton.onclick = () => {
          speakButton.style.display = 'inline-block'; // ★再挑戦時にボタンを再表示
          startQuiz();
        };
        nextButton.style.display = 'block';
    }
}

function showQuestion(word) {
    const currentWord = word.english;
    questionEl.innerText = currentWord;
    
    // ★問題表示と同時に単語を発音する
    speak(currentWord);

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

function resetState() {
    nextButton.style.display = 'none';
    while (choicesEl.firstChild) {
        choicesEl.removeChild(choicesEl.firstChild);
    }
}

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

initQuiz();
