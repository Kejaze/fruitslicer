let playing = false;
let score;
let trialsleft;
let action; 
let items = []; 
const fruits = ['1','2','3','4','5','6','7','8','9','10']; 

window.addEventListener("DOMContentLoaded", () => {
    const sliceSound = document.getElementById("slicesound");
    const healSound = document.getElementById("healsound");
    const bombsound = document.getElementById("bombsound");
    const gameosound = document.getElementById("go");
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
            img.src = "./photos/Heart.png";
            img.className = "life";
            trialsBox.appendChild(img);
        }
    }

    function startGameLoop() {
        action = setInterval(() => {
            // Losowanie nowych obiektów
            if (Math.random() < 0.05 && items.length < 6) { 
                createItem();
            }

            // Poruszanie obiektami (pętla od tyłu dla stabilności)
            for (let i = items.length - 1; i >= 0; i--) {
                let item = items[i];
                let speed = 2 + Math.floor(score / 10); // Prędkość rośnie co 10 pkt
                
                item.top += speed;
                item.element.style.top = item.top + "px";

                if (item.top > fruitContainer.offsetHeight) {
                    if (item.type === "fruit") {
                        trialsleft--;
                        addHearts();
                    }
                    item.element.remove();
                    items.splice(i, 1);

                    if (trialsleft <= 0) {
                        stopGame();
                        gameosound.currentTime = 0; 
                        gameosound.play();
                        return;
                    }
                }
            }
        }, 20);
    }

    function createItem() {
        const itemElement = document.createElement("img");
        let chance = Math.random();
        let type;
        
        // Losowanie typu obiektu
        if (chance < 0.15) {
            type = "bomb";
            itemElement.src = "./photos/bomba.png";
        } else if (chance < 0.20) { 
            type = "heart";
            itemElement.src = "./photos/Heart.png";
        } else {
            type = "fruit";
            const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
            itemElement.src = `./photos/${randomFruit}.png`;
        }
        
        itemElement.className = "fruit";
        itemElement.style.display = "block";
        itemElement.style.left = Math.round(Math.random() * (fruitContainer.offsetWidth - 60)) + "px";
        itemElement.style.top = "-60px";

        const itemObj = { element: itemElement, top: -60, type: type, sliced: false };
        
        itemElement.addEventListener("mouseover", () => {
            if (itemObj.sliced) return;
            itemObj.sliced = true;
                     
            if (type === "fruit") {
                score++;
                sliceSound.currentTime = 0; 
                sliceSound.play(); 
                scoreValue.textContent = score;
            } else if (type === "bomb") {
                trialsleft--;
                addHearts();
            bombsound.currentTime = 0; 
            bombsound.play();
                if (trialsleft <= 0) stopGame();
            } else if (type === "heart") {
                // Opcjonalny dźwięk dla serca (możesz dać inny lub sliceSound)
                healSound.currentTime = 0;
                healSound.play();
                if (trialsleft < 3) {
                    trialsleft++;
                    addHearts();
                }
            }
            
            animateSlice(itemElement);
            const index = items.indexOf(itemObj);
            if (index > -1) items.splice(index, 1);
        });

        fruitContainer.appendChild(itemElement);
        items.push(itemObj);
    }

    function animateSlice(el) {
        el.style.transition = "transform 0.2s, opacity 0.2s";
        el.style.transform = "scale(1.5) rotate(20deg)";
        el.style.opacity = "0";
        setTimeout(() => { if(el) el.remove(); }, 200);
    }

    function stopGame() {
        playing = false;
        clearInterval(action);
        scoreBox.style.display = "none";
        gameOver.style.display = "block";
        gameOver.innerHTML = `<p>Koniec Gry!</p><p>Wynik: ${score}</p>`;
        items.forEach(item => item.element.remove());
        items = [];
        startReset.textContent = "Start Game";
    }
});