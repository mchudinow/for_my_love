let currentQuestion = 0;
let score = 0;
let selectedAnswers = [];
let quizData = null;

const questions = [
    { type: "multiple", question: "Когда мы начали наш совместный путь?", answers: ["15 мая", "19 августа", "15 июня", "25 августа"], correct: [0] },
    { type: "multiple", question: "Какой наш любимый напиток?", answers: ["Кофе", "Чай", "Кола зеро", "Вода"], correct: [2] },
    { type: "text", question: "На чем я впервые за тобой заехал?", correctTexts: ["ваз 2107", "семерочка", "семерка", "жига"] },
    // Шуточный вопрос
    {
        type: "joke",
        question: "Викторина: Насколько хорошо ты меня знаешь?",
        subtitle: "❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️",
        questionNumber: "Вопрос 5 из 15",
        jokeQuestion: "Реши пример:",
        formula: "∫₀^∞ e^(-x²)dx × √(π/2) + lim(n→∞)[∑(k=1 to n) 1/k² - ln(n)] = ?",
        answers: ["e^π", "π²/6", "∞", "42"],
        correct: [0, 1, 2, 3] // Все правильные!
    },
    { type: "multiple", question: "Какие слова я говорю чаще?", answers: ["Люблю", "Скучаю", "Горжусь", "Хочу спать"], correct: [0, 1] },
    { type: "text", question: "Какое самое необычное прозвище я тебе дал?", correctTexts:[] , comment:"бебра, кокоджамбо, пупсеныш, кукиш... да их тысячи..." },
    { type: "multiple", question: "Где было первое свидание?", answers: ["Парк", "Университет", "Кофейня", "Кино"], correct: [2] },
    { type: "text", question: "А где могло быть наше первое свидание?", correctTexts: [], comment: "На баскетбольной площадке))" },
    { type: "multiple", question: "Сколько дней длились мои сборы?", answers: ["34", "35", "31", "27"], correct: [], comment: "35 ДНЕЙ БЕЗУМНОГО МАКСА" },
    { type: "multiple", question: "Как зовут моего кота?", answers: ["Семен", "Степан", "Штефан", "Кузя"], correct: [], comment: "Ну это надо знать..." },
    { type: "multiple", question: "А как твою кошку?", answers: ["Лиля", "Ляля"], correct: [0], comment: "Когда-нибудь она меня полюбит)'" },
    { type: "multiple", question: "Какую песню мы очень любим?", answers: ["Ариана гранде", "Адель", "Канье Вест", "Imagine Dragons"], correct: [], comment: "Я тебя бум бум бум" },
    { type: "text", question: "Какой наш фирменный напиток?", correctTexts: [], comment: "Настойка на банане))" },
    { type: "multiple", question: "Кто эмоциональнее?", answers: ["Я", "Ты"], correct: [], comment: "На твоей любви и энергии может жить вся страна!" },
    { type: "multiple", question: "Наш любимый момент?", answers: ["Защита диплома", "Поездка на море", "Поездка в Москву", "Все варианты"], correct: [3] },
    { type: "multiple", question: "Если бы мы были персонажами мультфильма, то это были бы?", answers: ["Дори и папа Немо", "Шрек и Фиона", "Финес и Ферб",  "Рапунцель и Флинн"], correct: [0,1] },
    { type: "multiple", question: "Это только начало?", answers: ["Да ❤️", "Нет 💔"], correct: [0] }
    
];

function startQuiz() {
    document.querySelector(".hero").classList.add("hidden");
    document.getElementById("quizSection").classList.remove("hidden");
    loadQuestion();
}

let isAnswering = false; // Флаг для предотвращения двойного ответа

function loadQuestion() {
    isAnswering = false;
    selectedAnswers = [];
    const q = questions[currentQuestion];
    
    // Обновляем прогресс бар
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById("progressBar").style.setProperty('--progress', progress + '%');
    
    const container = document.getElementById("answersContainer");
    container.innerHTML = "";
    document.getElementById("textAnswer").classList.add("hidden");
    document.getElementById("dateAnswer").classList.add("hidden");
    document.getElementById("nextBtn").classList.add("hidden");
    document.getElementById("correctAnswersHint").classList.add("hidden");
    
    // Сбрасываем текст кнопки на "Ответить"
    document.getElementById("nextBtn").innerText = "Ответить";
    
    // Шуточный вопрос
    if (q.type === "joke") {
        document.getElementById("questionTitle").innerHTML = `
            <div class="joke-question">
                <div>${q.question}</div>
                <div style="font-size: 32px; margin: 10px 0;">${q.subtitle}</div>
                <div style="font-size: 18px; opacity: 0.7; margin: 10px 0;">${q.questionNumber}</div>
                <div style="margin: 20px 0; font-size: 20px;">${q.jokeQuestion}</div>
                <div class="math-formula">${q.formula}</div>
            </div>
        `;
        
        q.answers.forEach((ans, i) => {
            let div = document.createElement("div");
            div.className = "answer";
            div.innerText = ans;
            div.onclick = () => {
                if (!isAnswering) {
                    isAnswering = true;
                    showJokeReveal();
                }
            };
            container.appendChild(div);
        });
        return;
    }
    
    // Обычный вопрос
    document.getElementById("questionTitle").innerText = q.question;
    
    if (q.type === "multiple") {
        q.answers.forEach((ans, i) => {
            let div = document.createElement("div");
            div.className = "answer";
            div.innerText = ans;
            div.onclick = () => {
                if (isAnswering) return; // Блокируем клики после отправки ответа
                
                div.classList.toggle("selected");
                if (selectedAnswers.includes(i)) {
                    selectedAnswers = selectedAnswers.filter(a => a !== i);
                } else {
                    selectedAnswers.push(i);
                }
                document.getElementById("nextBtn").classList.remove("hidden");
            };
            container.appendChild(div);
        });
    }
    
    if (q.type === "text") {
        const input = document.getElementById("textAnswer");
        input.classList.remove("hidden");
        input.value = "";
        input.focus();
        document.getElementById("nextBtn").classList.remove("hidden");
    }
    
    if (q.type === "date") {
        const input = document.getElementById("dateAnswer");
        input.classList.remove("hidden");
        input.value = "";
        input.focus();
        document.getElementById("nextBtn").classList.remove("hidden");
    }
}

function showJokeReveal() {
    const container = document.getElementById("answersContainer");
    
    // Отключаем все кнопки
    container.querySelectorAll('.answer').forEach(ans => {
        ans.classList.add('disabled');
        ans.onclick = null;
    });
    
    // Показываем шутку
    const jokeDiv = document.createElement("div");
    jokeDiv.className = "joke-reveal";
    jokeDiv.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 15px;">😄</div>
        <div style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">Шучу конечно! 😄</div>
        <div style="font-size: 18px;">Любой ответ правильный! 💕</div>
    `;
    container.appendChild(jokeDiv);
    
    // Сбрасываем флаг isAnswering, чтобы кнопка заработала
    isAnswering = false;
    
    // Показываем кнопку далее
    setTimeout(() => {
        const nextBtn = document.getElementById("nextBtn");
        nextBtn.classList.remove("hidden");
        nextBtn.innerText = "Далее →";
    }, 1000);
}

function submitAnswer() {
    if (isAnswering) return; // Предотвращаем повторную отправку
    isAnswering = true;
    
    const q = questions[currentQuestion];
    let isCorrect = false;
    
    // Скрываем кнопку "Ответить"
    document.getElementById("nextBtn").classList.add("hidden");
    
    // Шуточный вопрос
    if (q.type === "joke") {
        score++; // Всегда засчитываем
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion >= questions.length) {
                showQuizResult();
            } else {
                loadQuestion();
            }
        }, 500);
        return;
    }
    
    // Multiple choice
    if (q.type === "multiple") {
        // Если есть правильные ответы - показываем их
        if (q.correct.length > 0) {
            const sortedSelected = [...selectedAnswers].sort();
            const sortedCorrect = [...q.correct].sort();
            isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
            
            if (isCorrect) {
                score++;
            }
            
            // Подсвечиваем правильные ответы
            const answerDivs = document.getElementById("answersContainer").querySelectorAll('.answer');
            answerDivs.forEach((div, i) => {
                div.onclick = null; // Отключаем клики
                if (q.correct.includes(i)) {
                    div.classList.add('correct');
                }
                div.classList.add('disabled');
            });
            
            // Показываем результат через 2 секунды
            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion >= questions.length) {
                    showQuizResult();
                } else {
                    loadQuestion();
                }
            }, 2000);
            return;
        }
        
        // Если нет правильных ответов - показываем комментарий
        if (q.correct.length === 0 && q.comment) {
            // Отключаем клики на ответы
            const answerDivs = document.getElementById("answersContainer").querySelectorAll('.answer');
            answerDivs.forEach(div => {
                div.onclick = null;
                div.classList.add('disabled');
            });
            
            // Показываем комментарий
            const hint = document.getElementById("correctAnswersHint");
            hint.classList.remove("hidden");
            hint.innerHTML = `<strong>Комментарий:</strong><br>${q.comment}`;
            hint.style.background = "rgba(198, 161, 91, 0.1)";
            hint.style.borderColor = "rgba(198, 161, 91, 0.3)";
            
            // Переход через 3 секунды
            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion >= questions.length) {
                    showQuizResult();
                } else {
                    loadQuestion();
                }
            }, 3000);
            return;
        }
        
        // Если нет ни правильных ответов, ни комментария - просто переходим
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion >= questions.length) {
                showQuizResult();
            } else {
                loadQuestion();
            }
        }, 500);
        return;
    }
    
    // Text answer
    if (q.type === "text") {
        const val = document.getElementById("textAnswer").value.toLowerCase().trim();
        
        // Если есть правильные варианты
        if (q.correctTexts && q.correctTexts.length > 0) {
            isCorrect = q.correctTexts.some(correct => val.includes(correct.toLowerCase()));
            
            if (isCorrect) {
                score++;
            }
            
            // Показываем подсказку
            const hint = document.getElementById("correctAnswersHint");
            hint.classList.remove("hidden");
            hint.style.background = "rgba(46, 213, 115, 0.1)";
            hint.style.borderColor = "rgba(46, 213, 115, 0.3)";
            if (isCorrect) {
                hint.innerHTML = `<strong>✓ Правильно!</strong> Варианты ответа: ${q.correctTexts.join(', ')}`;
            } else {
                hint.innerHTML = `<strong>Правильные варианты:</strong> ${q.correctTexts.join(', ')}`;
            }
            
            // Продолжаем через 2.5 секунды
            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion >= questions.length) {
                    showQuizResult();
                } else {
                    loadQuestion();
                }
            }, 2500);
            return;
        }
        
        // Если нет правильных вариантов, но есть комментарий
        if ((!q.correctTexts || q.correctTexts.length === 0) && q.comment) {
            const hint = document.getElementById("correctAnswersHint");
            hint.classList.remove("hidden");
            hint.innerHTML = `<strong>Комментарий:</strong><br>${q.comment}`;
            hint.style.background = "rgba(198, 161, 91, 0.1)";
            hint.style.borderColor = "rgba(198, 161, 91, 0.3)";
            
            // Продолжаем через 3 секунды
            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion >= questions.length) {
                    showQuizResult();
                } else {
                    loadQuestion();
                }
            }, 3000);
            return;
        }
        
        // Любой ответ правильный (нет ни правильных вариантов, ни комментария)
        score++;
    }
    
    // Date answer
    if (q.type === "date") {
        const val = document.getElementById("dateAnswer").value;
        if (q.correctDate && val === q.correctDate) {
            score++;
            isCorrect = true;
        }
        
        if (q.correctDate) {
            const hint = document.getElementById("correctAnswersHint");
            hint.classList.remove("hidden");
            if (isCorrect) {
                hint.innerHTML = `<strong>✓ Правильно!</strong> Это была особенная дата: ${q.correctDate}`;
            } else {
                hint.innerHTML = `<strong>Правильный ответ:</strong> ${q.correctDate}`;
            }
            
            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion >= questions.length) {
                    showQuizResult();
                } else {
                    loadQuestion();
                }
            }, 2500);
            return;
        }
    }
    
    // Для вопросов без проверки - переходим сразу
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion >= questions.length) {
            showQuizResult();
        } else {
            loadQuestion();
        }
    }, 500);
}

function showQuizResult() {
    document.getElementById("quizSection").classList.add("hidden");
    document.getElementById("quizResult").classList.remove("hidden");
    
    let title = "Ты — моя судьба ❤️";
    if (score < 5) title = "Заберай кубок, ты точно знаешь все про нас 🏆";
    if (score < 10) title = "Ты идеальна 😉";
    if (score >= 14) title = "Soulmate уровень 100% 💍";
    
    document.getElementById("quizResultTitle").innerText = title;
    document.getElementById("quizResultText").innerText = `Результат: ${score} / ${questions.length}`;
}

async function showStats() {
    document.getElementById("quizResult").classList.add("hidden");
    document.getElementById("statsSection").classList.remove("hidden");
    
    // Хардкод статистики (реальные данные из вашей переписки)
    const stats = {
        total: 121350,
        myMessages: 59346,
        herMessages: 62004,
        myVoice: 802,
        herVoice: 207,
        myVideo: 402,
        herVideo: 422,
        myStickers: 516,
        herStickers: 4054,
        myGifs: 69,
        herGifs: 577,
        myEmojis: 4456,
        herEmojis: 6072,
        myLove: 496,
        herLove: 518,
        days: 1352,
        firstDate: "31 мая 2022",
        lastDate: "12 февраля 2026",
        messagesPerDay: 89.8,
        topEmojis: [
            { emoji: "❤️", count: 4574 },
            { emoji: "❤️❤️❤️", count: 1405 },
            { emoji: "❤️❤️❤️❤️", count: 869 },
            { emoji: "❤️❤️❤️❤️❤️", count: 357 },
            { emoji: "😂", count: 162 }
        ],
        topWords: {
            my: [
                { word: "тебя", count: 1739 },
                { word: "просто", count: 1169 },
                { word: "меня", count: 1137 },
                { word: "тебе", count: 1015 },
                { word: "очень", count: 964 }
            ],
            her: [
                { word: "тебя", count: 1500 },
                { word: "меня", count: 1130 },
                { word: "если", count: 1038 },
                { word: "просто", count: 992 },
                { word: "тебе", count: 848 }
            ]
        },
        phrases: {
            miss: { total: 128, my: 57, her: 71 },
            dear: { total: 396, my: 214, her: 182 },
            kiss: { total: 85, my: 28, her: 57 },
            goodNight: { total: 26, my: 7, her: 19 },
            goodMorning: { total: 891, my: 498, her: 393 }
        }
    };
    
    // Основная статистика
    document.getElementById("totalMessages").innerText = stats.total.toLocaleString();
    document.getElementById("myMessages").innerText = stats.myMessages.toLocaleString();
    document.getElementById("herMessages").innerText = stats.herMessages.toLocaleString();
    
    // Кто болтун
    const chattyWinner = document.getElementById("chattyWinner");
    if (stats.herMessages > stats.myMessages) {
        chattyWinner.innerHTML = "🏆 Ты болтушка!";
    } else {
        chattyWinner.innerHTML = "🏆 Я болтун!";
    }
    
    // Голосовые и кружочки
    document.getElementById("myVoice").innerText = stats.myVoice;
    document.getElementById("herVoice").innerText = stats.herVoice;
    document.getElementById("myVideo").innerText = stats.myVideo;
    document.getElementById("herVideo").innerText = stats.herVideo;
    document.getElementById("myEmoji").innerText = stats.myEmojis.toLocaleString();
    document.getElementById("herEmoji").innerText = stats.herEmojis.toLocaleString();
    
    // Победители по категориям
    const categoryWinners = document.getElementById("categoryWinners");
    let winnersHTML = "";
    
    if (stats.myVoice > stats.herVoice) {
        winnersHTML += '<div class="winner-badge">🏆 Король войсов!</div>';
    } else if (stats.herVoice > stats.myVoice) {
        winnersHTML += '<div class="winner-badge">🏆 Королева войсов!</div>';
    }
    
    if (stats.myVideo > stats.herVideo) {
        winnersHTML += '<div class="winner-badge">🎬 Режиссёр года!</div>';
    } else if (stats.herVideo > stats.myVideo) {
        winnersHTML += '<div class="winner-badge">🎬 Режиссёр года!</div>';
    }
    
    if (stats.herEmojis > stats.myEmojis) {
        winnersHTML += '<div class="winner-badge">🏆 Эмоциональная!</div>';
    }
    
    if (stats.herStickers > stats.myStickers) {
        winnersHTML += '<div class="winner-badge">👑 Королева стикеров! ' + stats.herStickers.toLocaleString() + ' стикеров!</div>';
    }
    
    categoryWinners.innerHTML = winnersHTML;
    
    // Время активности - ночные разговоры (22:00 - самый активный час)
    document.getElementById("activeTime").innerHTML = `
        <div class="time-emoji">🌙</div>
        <h3>22:00</h3>
        <p>Наше время</p>
        <p style="font-size: 18px; margin-top: 10px;">Ночные разговоры 💕</p>
    `;
    
    // Люблю статистика
    document.getElementById("myLove").innerText = stats.myLove;
    document.getElementById("herLove").innerText = stats.herLove;
    
    const loveWinner = document.getElementById("loveWinner");
    if (stats.herLove > stats.myLove) {
        loveWinner.innerHTML = "🏆 Ты любишь больше!";
    } else if (stats.myLove > stats.herLove) {
        loveWinner.innerHTML = "🏆 Я люблю больше!";
    } else {
        loveWinner.innerHTML = "🏆 Мы любим одинаково!";
    }
    
    // Финальное сообщение
    document.getElementById("finalMessage").innerHTML = `
        За <strong>${stats.days} дней</strong> мы обменялись <strong>${stats.total.toLocaleString()}</strong> сообщениями! 
        Это <strong>${stats.messagesPerDay.toFixed(1)} сообщений каждый день</strong>. Мы действительно неразлучны! 🎉
    `;
    
    // Дополнительные креативные блоки
    addCreativeBlocks(stats);
    
    // Графики
    createGrowthChart();
    createHourChart();
    createLoveChart(stats.myLove, stats.herLove);
    
    // Топ эмодзи
    createTopEmoji(stats.topEmojis);
    
    // Топ слов
    createTopWords(stats.topWords);
    
    // Фразы
    createPhrasesBlock(stats.phrases);
}

function addCreativeBlocks(stats) {
    const statsSection = document.querySelector("#statsSection .card");
    
    // Временная шкала
    const timelineHTML = `
        <div class="timeline-block">
            <h3>📅 Наша временная шкала</h3>
            <div class="timeline-content">
                <div class="timeline-item">
                    <span class="timeline-date">${stats.firstDate}</span>
                    <span class="timeline-label">Первое сообщение</span>
                </div>
                <div class="timeline-line"></div>
                <div class="timeline-item">
                    <span class="timeline-label">${stats.days} дней вместе</span>
                </div>
                <div class="timeline-line"></div>
                <div class="timeline-item">
                    <span class="timeline-date">${stats.lastDate}</span>
                    <span class="timeline-label">Сегодня</span>
                </div>
            </div>
        </div>
    `;
    
    // Забавные факты
    const funFactsHTML = `
        <div class="fun-facts">
            <h3>🎯 Забавные факты</h3>
            <div class="facts-grid">
                <div class="fact-item">
                    <div class="fact-icon">💬</div>
                    <div class="fact-text">Если бы мы печатали по 1 секунде на сообщение, это заняло бы <strong>33.7 часа</strong> непрерывной печати!</div>
                </div>
                <div class="fact-item">
                    <div class="fact-icon">📚</div>
                    <div class="fact-text">Наша переписка это примерно <strong>${Math.round(stats.total * 17 / 1800)} страниц</strong> текста (как средний роман!)</div>
                </div>
                <div class="fact-item">
                    <div class="fact-icon">❤️</div>
                    <div class="fact-text">Мы использовали сердечки ❤️ <strong>более 8,000 раз</strong>. Это море любви!</div>
                </div>
                <div class="fact-item">
                    <div class="fact-icon">🎤</div>
                    <div class="fact-text">Голосовых сообщений на <strong>${Math.round((stats.myVoice + stats.herVoice) * 15 / 60)} часов</strong> (примерно по 15 сек каждое)</div>
                </div>
                <div class="fact-item">
                    <div class="fact-icon">🌙</div>
                    <div class="fact-text">Самое активное время - <strong>22:00</strong>. Мы - ночные птицы!</div>
                </div>
                <div class="fact-item">
                    <div class="fact-icon">📊</div>
                    <div class="fact-text">Соотношение сообщений <strong>49% на 51%</strong> - идеальный баланс!</div>
                </div>
            </div>
        </div>
    `;
    
    // Достижения
    const achievementsHTML = `
        <div class="achievements">
            <h3>🏅 Наши достижения</h3>
            <div class="achievements-grid">
                <div class="achievement">
                    <div class="achievement-icon">🎖️</div>
                    <div class="achievement-title">Марафонец общения</div>
                    <div class="achievement-desc">90 сообщений каждый день!</div>
                </div>
                <div class="achievement">
                    <div class="achievement-icon">💕</div>
                    <div class="achievement-title">Мастер романтики</div>
                    <div class="achievement-desc">Более 1000 раз сказали "люблю"</div>
                </div>
                <div class="achievement">
                    <div class="achievement-icon">🎨</div>
                    <div class="achievement-title">Творческие души</div>
                    <div class="achievement-desc">4,570 стикеров и 646 GIF!</div>
                </div>
                <div class="achievement">
                    <div class="achievement-icon">⏰</div>
                    <div class="achievement-title">Неразлучные</div>
                    <div class="achievement-desc">${stats.days} дней непрерывного общения</div>
                </div>
            </div>
        </div>
    `;
    
    // Вставляем блоки перед графиками
    const chartsStart = statsSection.querySelector('.chart-container');
    chartsStart.insertAdjacentHTML('beforebegin', timelineHTML);
    chartsStart.insertAdjacentHTML('beforebegin', funFactsHTML);
    chartsStart.insertAdjacentHTML('beforebegin', achievementsHTML);
}

function createGrowthChart() {
    // Симуляция роста сообщений по месяцам
    const labels = ['Май 22', 'Июл 22', 'Сен 22', 'Ноя 22', 'Янв 23', 'Мар 23', 'Май 23', 'Июл 23', 'Сен 23', 'Ноя 23', 'Янв 24', 'Мар 24', 'Май 24', 'Июл 24', 'Сен 24', 'Ноя 24', 'Янв 25', 'Фев 26'];
    const data = [100, 1500, 4200, 8500, 14200, 21000, 28500, 36800, 45200, 54100, 63500, 73200, 83400, 92800, 101500, 109800, 117200, 121350];
    
    new Chart(document.getElementById("growthChart"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Сообщения",
                data: data,
                borderColor: "#ff8c42",
                backgroundColor: "rgba(255, 140, 66, 0.1)",
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: { color: 'rgba(198, 161, 91, 0.1)' },
                    ticks: { color: '#c6a15b' }
                },
                x: { 
                    grid: { display: false },
                    ticks: { color: '#c6a15b' }
                }
            }
        }
    });
}

function createHourChart() {
    // Симуляция активности по часам (пик в 22:00)
    const hours = [120, 80, 50, 30, 25, 35, 450, 1200, 2300, 3100, 3800, 4200, 4500, 4800, 5200, 5600, 6100, 6800, 7200, 7800, 8200, 8500, 9200, 8800];
    const labels = [...Array(24).keys()].map(h => `${h}:00`);
    
    new Chart(document.getElementById("hourChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                data: hours,
                backgroundColor: hours.map((v, i) => i === 22 ? '#ff8c42' : '#c6a15b'),
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: { color: 'rgba(198, 161, 91, 0.1)' },
                    ticks: { color: '#c6a15b' }
                },
                x: { 
                    grid: { display: false },
                    ticks: { color: '#c6a15b' }
                }
            }
        }
    });
}

function createLoveChart(myLove, herLove) {
    new Chart(document.getElementById("loveChart"), {
        type: "doughnut",
        data: {
            labels: ["Maksim", "Любимая"],
            datasets: [{
                data: [myLove, herLove],
                backgroundColor: ["#ff8c42", "#e94e3c"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#c6a15b', font: { size: 14 } }
                }
            }
        }
    });
}

function createTopEmoji(topEmojis) {
    const myTopHTML = topEmojis.slice(0, 3).map(item => `
        <div class="top-item">
            <span class="item-text">${item.emoji}</span>
            <span class="item-count">${item.count}</span>
        </div>
    `).join('');
    
    const herTopHTML = topEmojis.slice(0, 5).map(item => `
        <div class="top-item">
            <span class="item-text">${item.emoji}</span>
            <span class="item-count">${item.count}</span>
        </div>
    `).join('');
    
    document.getElementById("myTopEmoji").innerHTML = myTopHTML;
    document.getElementById("herTopEmoji").innerHTML = herTopHTML;
}

function createTopWords(topWords) {
    const myTopHTML = topWords.my.map(item => `
        <div class="top-item">
            <span class="item-text">${item.word}</span>
            <span class="item-count">${item.count}</span>
        </div>
    `).join('');
    
    const herTopHTML = topWords.her.map(item => `
        <div class="top-item">
            <span class="item-text">${item.word}</span>
            <span class="item-count">${item.count}</span>
        </div>
    `).join('');
    
    document.getElementById("myTopWords").innerHTML = myTopHTML;
    document.getElementById("herTopWords").innerHTML = herTopHTML;
}

function createPhrasesBlock(phrases) {
    const phrasesHTML = `
        <div class="phrases-block">
            <h3>💬 Наши любимые фразы</h3>
            <div class="phrases-grid">
                <div class="phrase-item">
                    <div class="phrase-emoji">😊</div>
                    <div class="phrase-text">Скучаю</div>
                    <div class="phrase-count">${phrases.miss.total} раз</div>
                    <div class="phrase-detail">Maksim: ${phrases.miss.my}, Любимая: ${phrases.miss.her}</div>
                </div>
                <div class="phrase-item">
                    <div class="phrase-emoji">🥰</div>
                    <div class="phrase-text">Милая/милый</div>
                    <div class="phrase-count">${phrases.dear.total} раз</div>
                    <div class="phrase-detail">Maksim: ${phrases.dear.my}, Любимая: ${phrases.dear.her}</div>
                </div>
                <div class="phrase-item">
                    <div class="phrase-emoji">😘</div>
                    <div class="phrase-text">Целую</div>
                    <div class="phrase-count">${phrases.kiss.total} раз</div>
                    <div class="phrase-detail">Maksim: ${phrases.kiss.my}, Любимая: ${phrases.kiss.her}</div>
                </div>
                <div class="phrase-item">
                    <div class="phrase-emoji">🌙</div>
                    <div class="phrase-text">Спокойной ночи</div>
                    <div class="phrase-count">${phrases.goodNight.total} раз</div>
                    <div class="phrase-detail">Maksim: ${phrases.goodNight.my}, Любимая: ${phrases.goodNight.her}</div>
                </div>
                <div class="phrase-item">
                    <div class="phrase-emoji">☀️</div>
                    <div class="phrase-text">Доброе утро</div>
                    <div class="phrase-count">${phrases.goodMorning.total} раз</div>
                    <div class="phrase-detail">Maksim: ${phrases.goodMorning.my}, Любимая: ${phrases.goodMorning.her}</div>
                </div>
            </div>
        </div>
    `;
    
    const chartsStart = document.querySelector('.chart-container');
    chartsStart.insertAdjacentHTML('beforebegin', phrasesHTML);
}

function showFinalPage() {
    document.getElementById("statsSection").classList.add("hidden");
    document.getElementById("finalPage").classList.remove("hidden");
    window.scrollTo(0, 0);
}

function goBackToStats() {
    document.getElementById("finalPage").classList.add("hidden");
    document.getElementById("statsSection").classList.remove("hidden");
    window.scrollTo(0, 0);
}
