const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');

chatbotToggle.addEventListener('click', () => {
    chatbotWindow.style.display = chatbotWindow.style.display === 'none' ? 'flex' : 'none';
    if (chatbotWindow.style.display === 'flex') {
        chatbotInput.focus();
    }
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.style.display = 'none';
});

chatbotSend.addEventListener('click', enviarMensaje);

chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        enviarMensaje();
    }
});

async function enviarMensaje() {
    const mensaje = chatbotInput.value.trim();
    if (!mensaje) return;

    agregarMensaje(mensaje, 'user');
    chatbotInput.value = '';

    agregarMensaje('Escribiendo...', 'bot', true);

    try {
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mensaje })
        });

        const data = await response.json();
        
        const loadingMsg = chatbotMessages.querySelector('.bot-message.loading');
        if (loadingMsg) {
            loadingMsg.remove();
        }

        agregarMensaje(data.respuesta, 'bot');
    } catch (error) {
        const loadingMsg = chatbotMessages.querySelector('.bot-message.loading');
        if (loadingMsg) {
            loadingMsg.remove();
        }
        agregarMensaje('Lo siento, hubo un error al procesar tu mensaje.', 'bot');
    }
}

function agregarMensaje(texto, tipo, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${tipo}-message ${isLoading ? 'loading' : ''}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = texto;
    
    messageDiv.appendChild(contentDiv);
    chatbotMessages.appendChild(messageDiv);
    
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}
