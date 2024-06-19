const input = document.querySelector('.login-input');
const button = document.querySelector('.login-button');
const form = document.querySelector('.login-form'); 

const validateInput = ({ target }) => {
    if (target.value.length > 2) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', 'true'); 
    }
}

const handleSubmit = (event) => {
    event.preventDefault(); 
    
    const playerName = input.value.trim();
    if (playerName) {
        localStorage.setItem('player', playerName);
        window.location.href = 'games.html'; 
    } else {
       
        console.error('O nome do jogador é necessário para continuar.');
    }
}

input.addEventListener('input', validateInput);
form.addEventListener('submit', handleSubmit);