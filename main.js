import questions from './questions.js';

const randomNumber = (max) => {
    return Math.floor(Math.random() * (max - 0) - 0);
}

const createElement = (element) => {
    const elementCreated = document.createElement(element);
    return elementCreated;
}

const addClassList = (element, className) => {
    element.classList.add(className);
    return element;
}

class Game {
    constructor(container) {
        this.gameContainer = container;
        this.levelContainer = document.querySelector('.game__level-container');
        this.initScreen = this.gameContainer.querySelector('.game__init-container');
        this.playScreen = this.gameContainer.querySelector('.game__play-container');
        this.gameLostScreen = this.gameContainer.querySelector('.game__lost-container');
        this.gameWinScreen = this.gameContainer.querySelector('.game__win-container');
        this.timerContainer = this.gameContainer.querySelector('.game__play-timer span');
        this.btnsAnswers = this.gameContainer.querySelectorAll('.btn-answer');
        this.level = 0;
        this.initialTimerValue = 15;
        this.timer;
    }

    init = () => {
        window.addEventListener('resize', this.createGameLevel);
        this.initScreen.querySelector('.btn-start').addEventListener('click', this.startGame);
        this.gameLostScreen.querySelector('.btn-start').addEventListener('click', this.startGame);
        this.gameWinScreen.querySelector('.btn-start').addEventListener('click', this.startGame);
        this.gameContainer.querySelector('.game__init-info').innerText = `Take this quiz with ${questions.length} questions to find out.`;
        this.createGameLevel();
    }

    createGameLevel = () => {
        const levelContainerWidth = this.levelContainer.clientWidth;
        const levels = this.levelContainer.querySelectorAll('.game__level-item');

        if (levels && levels.length > 0) this.clearGameLevel(levels);

        for (let i = 0; i < questions.length; i++) {
            let span = createElement('span');
            span = addClassList(span, 'game__level-item');
            span.innerText = i + 1;
            const displacement = i * (levelContainerWidth / (questions.length - 1));
            span.style.transform = `translateX(${displacement}px)`;
            this.levelContainer.append(span);
        }
    }

    clearGameLevel = (levels) => {
        levels.forEach(level => level.remove());
    }

    startGame = () => {
        this.gameContainer.querySelector('.show').classList.remove('show');
        this.playScreen.classList.add('show');
        this.createQuestion();
    }

    createQuestion = () => {
        const { question, answers } = questions[this.level][randomNumber(questions[this.level].length)];
        this.playScreen.querySelector('.game__play-question').innerText = question;
        this.createAnswers(answers);
        this.timerController();
    }

    createAnswers = (answers) => {
        this.btnsAnswers.forEach((btn, index) => {
            btn.innerText = answers[index].value;
            btn.isCorrect = answers[index].isCorrect;
            btn.addEventListener('click', this.checkAnswer);
        });
    }

    removeListenerBtnsAnswers = () => {
        this.btnsAnswers.forEach((btn) => {
            btn.removeEventListener('click', this.checkAnswer);
        });
    }

    checkAnswer = (e) => {
        this.removeListenerBtnsAnswers();

        e.target.classList.add('blink');
        clearInterval(this.timer);

        setTimeout(() => {
            e.target.classList.remove('blink');
            if(e.target.isCorrect) {
                e.target.classList.add('success');
                this.nextQuestion(e.target);
            } else {
                e.target.classList.add('error');
                this.checkRightAnswer(e.target);
                this.gameLost();
            }
        }, 3000);
    }

    checkRightAnswer = () => {
        const rightAnswerIndex = Array.from(this.btnsAnswers).findIndex(btn => btn.isCorrect);
        this.btnsAnswers[rightAnswerIndex].classList.add('success');
    }

    updateLevel = () => {
        const constainerWidth = this.levelContainer.clientWidth;
        const displacement = this.level * (constainerWidth / (questions.length - 1));
        this.levelContainer.querySelector('.game__level-bg').style.width = `${displacement}px`;
    }

    nextQuestion = (target) => {
        if(this.level === questions.length - 1) {
            this.gameWin();
            return;
        }
        setTimeout(() => {
            this.level += 1;
            target.classList.remove('success');
            this.updateLevel();
            this.createQuestion();
        }, 2000);
    }

    gameLost = () => {
        setTimeout(() => {

            this.playScreen.classList.remove('show');
            this.gameLostScreen.classList.add('show');
            this.gameLostScreen.querySelector('.game__lost-info').innerText = `You have answered correctly ${this.level} questions.`;
            this.cleanGame();

        }, 2000);
    }

    gameWin = () => {
        setTimeout(() => {

            this.playScreen.classList.remove('show');
            this.gameWinScreen.classList.add('show');
            this.cleanGame();

        }, 2000);
    }

    cleanGame = () => {
        this.level = 0;
        this.levelContainer.querySelector('.game__level-bg').style.width = 0;

        this.btnsAnswers.forEach(btn => {
            if(btn.classList.contains('success')) btn.classList.remove('success');
            if(btn.classList.contains('error')) btn.classList.remove('error');
        })
    }

    timerController = () => {
        let currentTime = this.initialTimerValue;
        this.timerContainer.innerText = currentTime;

        this.timer = setInterval(() => {
            currentTime -= 1;
            this.timerContainer.innerText = currentTime;

            if(currentTime < 1) {
                clearInterval(this.timer);
                this.checkRightAnswer();
                this.removeListenerBtnsAnswers();
                this.gameLost();
            }
        }, 1000);
    }

}

let game = new Game(document.querySelector('.game__container'));
game.init();