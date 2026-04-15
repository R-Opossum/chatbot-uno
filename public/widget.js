(function () {
  const clientId = document.currentScript.getAttribute('data-client-id');
  const botName = document.currentScript.getAttribute('data-bot-name') || 'Asistente';
  const primaryColor = document.currentScript.getAttribute('data-color') || '#6366f1';
  const apiUrl = 'https://chatbot-uno.vercel.app/api/chat';

  // Estilos
  const styles = `
    #chatbot-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: ${primaryColor};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      z-index: 9999;
      transition: transform 0.2s;
    }
    #chatbot-bubble:hover { transform: scale(1.1); }
    #chatbot-bubble svg { width: 28px; height: 28px; fill: white; }
    #chatbot-box {
      position: fixed;
      bottom: 90px;
      right: 24px;
      width: 340px;
      height: 480px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      z-index: 9999;
      overflow: hidden;
      font-family: sans-serif;
    }
    #chatbot-box.open { display: flex; }
    #chatbot-header {
      background: ${primaryColor};
      color: white;
      padding: 16px;
      font-weight: bold;
      font-size: 15px;
    }
    #chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .msg-user {
      align-self: flex-end;
      background: ${primaryColor};
      color: white;
      padding: 10px 14px;
      border-radius: 18px 18px 4px 18px;
      max-width: 80%;
      font-size: 14px;
    }
    .msg-bot {
      align-self: flex-start;
      background: #f1f1f1;
      color: #333;
      padding: 10px 14px;
      border-radius: 18px 18px 18px 4px;
      max-width: 80%;
      font-size: 14px;
    }
    #chatbot-input-area {
      display: flex;
      padding: 12px;
      border-top: 1px solid #eee;
      gap: 8px;
    }
    #chatbot-input {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 24px;
      padding: 10px 16px;
      font-size: 14px;
      outline: none;
    }
    #chatbot-send {
      background: ${primaryColor};
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  // Inyectar estilos
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // HTML del widget
  const bubble = document.createElement('div');
  bubble.id = 'chatbot-bubble';
  bubble.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.06L2 22l4.94-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
  </svg>`;

  const box = document.createElement('div');
  box.id = 'chatbot-box';
  box.innerHTML = `
    <div id="chatbot-header">💬 ${botName}</div>
    <div id="chatbot-messages">
      <div class="msg-bot">¡Hola! ¿En qué puedo ayudarte?</div>
    </div>
    <div id="chatbot-input-area">
      <input id="chatbot-input" type="text" placeholder="Escribe tu mensaje..." />
      <button id="chatbot-send">➤</button>
    </div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(box);

  // Abrir/cerrar
  bubble.addEventListener('click', () => {
    box.classList.toggle('open');
  });

  // Enviar mensaje
  async function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');
    const text = input.value.trim();
    if (!text) return;

    // Mensaje usuario
    const userMsg = document.createElement('div');
    userMsg.className = 'msg-user';
    userMsg.textContent = text;
    messages.appendChild(userMsg);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // Mensaje cargando
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'msg-bot';
    loadingMsg.textContent = '...';
    messages.appendChild(loadingMsg);
    messages.scrollTop = messages.scrollHeight;

    // Llamar a la API
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, clientId }),
    });
    const data = await res.json();

    loadingMsg.textContent = data.reply;
    messages.scrollTop = messages.scrollHeight;
  }

  document.getElementById('chatbot-send').addEventListener('click', sendMessage);
  document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();