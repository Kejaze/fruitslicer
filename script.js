let playing = false;
let score;
let trialsleft;
let step;
let action;
const fruits = ['1','2','3','4','5','6','7','8','9','10'];

window.addEventListener("DOMContentLoaded", () => {

    const front = document.getElementById("front");
    const startReset = document.getElementById("startReset");
    const scoreBox = document.getElementById("score");
    const scoreValue = document.getElementById("scoreValue");
    const trialsBox = document.getElementById("trialsleft");
    const gameOver = document.getElementById("gameOver");
    const fruit = document.getElementById("fruit1");
    const sliceSound = document.getElementById("slicesound");
    const fruitContainer = document.getElementById("fruitcontainer");

    front.style.display = "block";

    // START / RESET
    startReset.addEventListener("click", () => {
        if (playing) {
            location.reload();
        } else {
            front.style.display = "none";
            scoreBox.style.display = "block";
            playing = true;

            score = 0;
            scoreValue.textContent = score;

            trialsleft = 3;
            trialsBox.style.display = "block";
            addHearts();

            gameOver.style.display = "none";

            startReset.textContent = "Reset Game";

            startAction();
        }
    });

    // SLICING FRUIT
    fruit.addEventListener("mouseover", () => {
        score++;
        scoreValue.textContent = score;

        sliceSound.play();

        clearInterval(action);

        explodeFruit(fruit);

        setTimeout(startAction, 500);
    });

    // FUNCTIONS

    function addHearts() {
        trialsBox.innerHTML = "";
        for (let i = 0; i < trialsleft; i++) {
            const img = document.createElement("img");
            img.src = "./Heart.png";
            img.className = "life";
            trialsBox.appendChild(img);
        }
    }

    function startAction() {
        fruit.style.display = "block";
        chooseRandom();

        fruit.style.left = Math.round(550 * Math.random()) + "px";
        fruit.style.top = "-50px";

        step = 2 + Math.round(2 * Math.random());

        action = setInterval(() => {
            fruit.style.top = (fruit.offsetTop + step) + "px";

            if (fruit.offsetTop > fruitContainer.offsetHeight - 50) {

                if (trialsleft > 1) {
                    chooseRandom();
                    fruit.style.left = Math.round(550 * Math.random()) + "px";
                    fruit.style.top = "-50px";
                    step = 1 + Math.round(5 * Math.random());

                    trialsleft--;
                    addHearts();

                } else {
                    playing = false;
                    scoreBox.style.display = "none";
                    startReset.textContent = "Start Game";

                    gameOver.style.display = "block";
                    gameOver.innerHTML = `<p>Game Over!</p><p>Your score is ${score}</p>`;

                    trialsBox.style.display = "none";
                    stopAction();
                }
            }
        }, 10);
    }

    function chooseRandom() {
        fruit.src = `https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/${fruits[Math.floor(Math.random() * fruits.length)]}.png`;
    }

    function stopAction() {
        clearInterval(action);
        fruit.style.display = "none";
    }

    // Replacement for jQuery UI "explode"
    function explodeFruit(el) {
        el.style.transition = "transform 0.3s, opacity 0.3s";
        el.style.transform = "scale(0)";
        el.style.opacity = "0";

        setTimeout(() => {
            el.style.display = "none";
            el.style.transform = "scale(1)";
            el.style.opacity = "1";
        }, 300);
    }
});
