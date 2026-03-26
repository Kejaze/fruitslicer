let playing = false;
let score;
let trialsleft;
let action; 
let items = []; // Tablica na owoce i bomby
const fruits = ['1','2','3','4','5','6','7','8','9','10']; 

window.addEventListener("DOMContentLoaded", () => {
    const front = document.getElementById("front");
    const startReset = document.getElementById("startReset");
    const scoreBox = document.getElementById("score"); // Kontener z arbuzem
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
            
            // Przywrócenie wyświetlania licznika z arbuzem
            scoreValue.textContent = score;
            scoreBox.style.display = "flex"; // Używamy flex, by arbuz i tekst były obok siebie
            
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
            // Szansa na nowy owoc/bombę (ok. 5% co 20ms)
            if (Math.random() < 0.05 && items.length < 5) { 
                createItem();
            }

            items.forEach((item, index) => {
                // Zwiększanie prędkości co 10 punktów
                let speed = 2 + Math.floor(score / 10); 
                item.top += speed;
                item.element.style.top = item.top + "px";

                // Jeśli spadnie poza ekran
                if (item.top > fruitContainer.offsetHeight) {
                    if (item.type === "fruit") {
                        trialsleft--;
                        addHearts();
                    }
                    removeItem(index);

                    if (trialsleft <= 0) {
                        stopGame();
                    }
                }
            });
        }, 20);
    }

    function createItem() {
        const itemElement = document.createElement("img");
        const isBomb = Math.random() < 0.15; // 15% szansy na bombę
        const type = isBomb ? "bomb" : "fruit";
        
        itemElement.className = "fruit";
        if (isBomb) {
            itemElement.src = "./bombs.png";
        } else {
            // Losowanie owocu z folderu photos
            const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
            itemElement.src = `./photos/${randomFruit}.png`; 
        }

        itemElement.style.display = "block";
        // Losowanie pozycji X (szerokość kontenera minus szerokość owocu)
        itemElement.style.left = Math.round(Math.random() * (600)) + "px";
        itemElement.style.top = "-50px";

        const itemObj = { element: itemElement, top: -50, type: type };
        
        itemElement.addEventListener("mouseover", () => {
            if (type === "fruit") {
                score++;
                scoreValue.textContent = score; // Aktualizacja punktów obok arbuza
                animateSlice(itemElement);
            } else {
                trialsleft--; 
                addHearts();
                animateSlice(itemElement);
                if (trialsleft <= 0) stopGame();
            }
            items.splice(items.indexOf(itemObj), 1);
        });

        fruitContainer.appendChild(itemElement);
        items.push(itemObj);
    }

    function animateSlice(el) {
        el.style.transition = "transform 0.2s, opacity 0.2s";
        el.style.transform = "scale(1.5)";
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 200);
    }

    function removeItem(index) {
        if(items[index]) {
            items[index].element.remove();
            items.splice(index, 1);
        }
    }

    function stopGame() {
        playing = false;
        clearInterval(action);
        scoreBox.style.display = "none"; // Ukrywamy licznik przy Game Over
        gameOver.style.display = "block";
        gameOver.innerHTML = `<p>Game Over!</p><p>Twoje punkty: ${score}</p>`;
        items.forEach(item => item.element.remove());
        items = [];
        startReset.textContent = "Start Game";
    }
});