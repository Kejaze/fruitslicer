let playing = false;
let score;
let trialsleft;
let action; 
let items = []; 
const fruits = ['1','2','3','4','5','6','7','8','9','10']; 

window.addEventListener("DOMContentLoaded", () => {
    const front = document.getElementById("front");
    const startReset = document.getElementById("startReset");
    const scoreBox = document.getElementById("score");
    const scoreValue = document.getElementById("scoreValue");
    const trialsBox = document.getElementById("trialsleft");
    const gameOver = document.getElementById("gameOver");
    const fruitContainer = document.getElementById("fruitcontainer");

    startReset.addEventListener("click", () => {
        if (playing) {
            location.reload();
        } else {
            playing = true;
            score = 0;
            trialsleft = 3;
            
            scoreValue.textContent = score;
            scoreBox.style.display = "flex"; 
            front.style.display = "none";
            gameOver.style.display = "none";
            trialsBox.style.display = "block";
            startReset.textContent = "Reset Game";
            
            addHearts();
            startGameLoop();
        }
    });

    function addHearts() {
        trialsBox.innerHTML = "";
        for (let i = 0; i < trialsleft; i++) {
            const img = document.createElement("img");
            img.src = "./Heart.png";
            img.className = "life";
            trialsBox.appendChild(img);
        }
    }

    function startGameLoop() {
        action = setInterval(() => {
            // 1. Losowanie nowego przedmiotu
            if (Math.random() < 0.05 && items.length < 6) { 
                createItem();
            }

            // 2. Poruszanie owocami - PĘTLA OD KOŃCA (zapobiega zastyganiu)
            for (let i = items.length - 1; i >= 0; i--) {
                let item = items[i];
                let speed = 2 + Math.floor(score / 10); 
                
                item.top += speed;
                item.element.style.top = item.top + "px";

                // 3. Sprawdzenie czy wypadł za ekran
                if (item.top > fruitContainer.offsetHeight) {
                    if (item.type === "fruit") {
                        trialsleft--;
                        addHearts();
                    }
                    // Usuwamy fizycznie i z tablicy
                    item.element.remove();
                    items.splice(i, 1);

                    if (trialsleft <= 0) {
                        stopGame();
                        return; // Przerywamy pętlę, jeśli gra się skończyła
                    }
                }
            }
        }, 20);
    }

    function createItem() {
        const itemElement = document.createElement("img");
        const isBomb = Math.random() < 0.15; 
        const type = isBomb ? "bomb" : "fruit";
        
        itemElement.className = "fruit";
        if (isBomb) {
            itemElement.src = "./bombs.png";
        } else {
            const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
            itemElement.src = `./photos/${randomFruit}.png`; 
        }

        itemElement.style.display = "block";
        itemElement.style.left = Math.round(Math.random() * (fruitContainer.offsetWidth - 60)) + "px";
        itemElement.style.top = "-60px";

        // Tworzymy obiekt informacyjny
        const itemObj = { element: itemElement, top: -60, type: type, sliced: false };
        
        itemElement.addEventListener("mouseover", () => {
            if (itemObj.sliced) return; // Zapobiega wielokrotnemu punktowaniu jednego owocu
            itemObj.sliced = true;

            if (type === "fruit") {
                score++;
                scoreValue.textContent = score;
            } else {
                trialsleft--; 
                addHearts();
                if (trialsleft <= 0) stopGame();
            }
            
            // Animacja i usunięcie z logiki gry
            animateSlice(itemElement);
            const index = items.indexOf(itemObj);
            if (index > -1) items.splice(index, 1);
        });

        fruitContainer.appendChild(itemElement);
        items.push(itemObj);
    }

    function animateSlice(el) {
        el.style.transition = "transform 0.2s, opacity 0.2s";
        el.style.transform = "scale(1.5) rotate(15deg)";
        el.style.opacity = "0";
        // Usuwamy z DOM dopiero po zakończeniu animacji
        setTimeout(() => { if(el) el.remove(); }, 200);
    }

    function stopGame() {
        playing = false;
        clearInterval(action);
        scoreBox.style.display = "none";
        gameOver.style.display = "block";
        gameOver.innerHTML = `<p>Game Over!</p><p>Wynik: ${score}</p>`;
        
        // Czyścimy planszę
        items.forEach(item => item.element.remove());
        items = [];
        startReset.textContent = "Start Game";
    }
});