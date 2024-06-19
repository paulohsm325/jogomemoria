document.addEventListener('DOMContentLoaded', () => {
   //nome da criança
    const playerName = localStorage.getItem('player');
    if (playerName) {
        document.getElementById('player-name').textContent = `Nome: ${playerName}!`;
    } else {
        console.error('Nenhum nome de jogador encontrado.');
    }

   //Configurar Tabuleiro e Cartas
    const grid = document.querySelector('.form-games');
    const characters = ['elefante', 'girrafa', 'leão', 'lobo', 'urso', 'zebra'];
    const pairsArray = characters.concat(characters); 

  // usei algoritimo de algoritmo de Fisher-Yates para embaralhar Cartas 
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

//Criar Cartas
    const cardsArray = shuffleArray(pairsArray);

  
    const createElement = (tag, className) => {
        const element = document.createElement(tag);
        element.className = className;
        return element;
    };

    const createCard = (character) => {
        const card = createElement('div', 'card');
        card.dataset.character = character;

        const front = createElement('div', 'face front');
        const back = createElement('div', 'face back');
        back.style.backgroundImage = `url('./card/${character}.png')`;

        card.appendChild(front);
        card.appendChild(back);
        grid.appendChild(card);

        return card;
    };
//Lógica de Jogo
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let pairsFound = 0; 

   //Contagem Regressiva
    const tempoTotal = 80;
    let tempoRestante = tempoTotal;

    const tempoElemento = document.getElementById('tempo-restante');
    tempoElemento.textContent = tempoRestante;

    const atualizarTempo = () => {
        tempoRestante--;

        tempoElemento.textContent = tempoRestante;

        if (tempoRestante === 0) {
            clearInterval(intervaloTempo);
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.removeEventListener('click', flipCard);
            });

           
            const mensagemAnterior = document.querySelector('.mensagem');
            if (mensagemAnterior) {
                mensagemAnterior.remove();
            }

            const mensagem = document.createElement('div');
            mensagem.textContent = "SEU TEMPO ACABOU!";
            mensagem.classList.add('mensagem');
            document.body.appendChild(mensagem);
        }
    };

    const intervaloTempo = setInterval(atualizarTempo, 1000);

   //Virar Cartas

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }
//Verificar Par
    const checkForMatch = () => {
        const isMatch = firstCard.dataset.character === secondCard.dataset.character;
        isMatch ? disableCards() : unflipCards();
    };

    const disableCards = () => {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
        pairsFound++; 
        if (pairsFound === characters.length) {
            clearInterval(intervaloTempo);
            const mensagem = document.createElement('div');
            mensagem.textContent = "Parabéns! Você encontrou todos os pares!";
            mensagem.classList.add('mensagem');
            document.body.appendChild(mensagem);
        }
    };

    const unflipCards = () => {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    };

    const resetBoard = () => {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    };

    //Adicionar Cartas ao Tabuleiro
    cardsArray.forEach((character) => {
        const card = createCard(character);
        card.addEventListener('click', flipCard);
    });
});
