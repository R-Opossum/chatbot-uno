(function () {
  const clientId = document.currentScript.getAttribute('data-client-id');
  const botName = document.currentScript.getAttribute('data-bot-name') || 'Asistente';
  const apiUrl = 'https://chatbot-uno.vercel.app/api/chat';
  const avatarUrl = 'https://mdwqhwdnnrxaqquqoiur.supabase.co/storage/v1/object/public/assets/freepik__humanoid-opossum-character-for-a-premium-digital-i__26746.jpeg';

  const styles = `
    #chatbot-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(15,52,96,0.4);
      z-index: 9999;
      transition: transform 0.2s, box-shadow 0.2s;
      overflow: hidden;
      border: 2px solid #16213e;
    }
    #chatbot-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(15,52,96,0.5);
    }
    #chatbot-bubble img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
    #chatbot-box {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 340px;
      height: 500px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.18);
      display: none;
      flex-direction: column;
      z-index: 9999;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    #chatbot-box.open { display: flex; }
    #chatbot-header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #chatbot-header-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(255,255,255,0.2);
      flex-shrink: 0;
    }
    #chatbot-header-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
    #chatbot-header-info { flex: 1; }
    #chatbot-header-name {
      font-size: 14px;
      font-weight: 600;
      margin: 0;
      color: #f1f5f9;
    }
    #chatbot-header-status {
      font-size: 11px;
      color: #94a3b8;
      margin: 2px 0 0;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    #chatbot-header-status::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ade80;
    }
    #chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f8fafc;
    }
    .msg-row-bot {
      display: flex;
      align-items: flex-end;
      gap: 8px;
    }
    .msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      border: 1px solid #e2e8f0;
    }
    .msg-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
    .msg-user {
      align-self: flex-end;
      background: linear-gradient(135deg, #1a1a2e, #0f3460);
      color: #f1f5f9;
      padding: 10px 14px;
      border-radius: 18px 18px 4px 18px;
      max-width: 78%;
      font-size: 13.5px;
      line-height: 1.5;
    }
    .msg-bot {
      background: white;
      color: #1e293b;
      padding: 10px 14px;
      border-radius: 18px 18px 18px 4px;
      max-width: 78%;
      font-size: 13.5px;
      line-height: 1.5;
      border: 0.5px solid #e2e8f0;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    #chatbot-input-area {
      display: flex;
      padding: 12px;
      border-top: 0.5px solid #e2e8f0;
      gap: 8px;
      background: white;
      align-items: center;
    }
    #chatbot-input {
      flex: 1;
      border: 0.5px solid #e2e8f0;
      border-radius: 24px;
      padding: 10px 16px;
      font-size: 13px;
      outline: none;
      background: #f8fafc;
      color: #1e293b;
      transition: border-color 0.2s;
    }
    #chatbot-input:focus { border-color: #0f3460; }
    #chatbot-send {
      background: linear-gradient(135deg, #1a1a2e, #0f3460);
      color: white;
      border: none;
      border-radius: 50%;
      width: 38px;
      height: 38px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s;
    }
    #chatbot-send:hover { transform: scale(1.08); }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  const bubble = document.createElement('div');
  bubble.id = 'chatbot-bubble';
  bubble.innerHTML = `<img src="${avatarUrl}" alt="Asistente" />`;

  const box = document.createElement('div');
  box.id = 'chatbot-box';
  box.innerHTML = `
    <div id="chatbot-header">
      <div id="chatbot-header-avatar">
        <img src="${avatarUrl}" alt="Avatar" />
      </div>
      <div id="chatbot-header-info">
        <p id="chatbot-header-name">${botName}</p>
        <p id="chatbot-header-status">En línea</p>
      </div>
    </div>
    <div id="chatbot-messages">
      <div class="msg-row-bot">
        <div class="msg-avatar"><img src="${avatarUrl}" alt="Avatar" /></div>
        <div class="msg-bot">¡Hola! ¿En qué puedo ayudarte hoy? 👋</div>
      </div>
    </div>
    <div id="chatbot-input-area">
      <input id="chatbot-input" type="text" placeholder="Escribe tu mensaje..." />
      <button id="chatbot-send">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(box);

  bubble.addEventListener('click', () => box.classList.toggle('open'));

  async function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');
    const text = input.value.trim();
    if (!text) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'msg-user';
    userMsg.textContent = text;
    messages.appendChild(userMsg);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    const loadingRow = document.createElement('div');
    loadingRow.className = 'msg-row-bot';
    loadingRow.innerHTML = `
      <div class="msg-avatar"><img src="${avatarUrl}" alt="Avatar" /></div>
      <div class="msg-bot">...</div>
    `;
    messages.appendChild(loadingRow);
    messages.scrollTop = messages.scrollHeight;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, clientId }),
    });
    const data = await res.json();

    loadingRow.querySelector('.msg-bot').textContent = data.reply;
    messages.scrollTop = messages.scrollHeight;
  }

  document.getElementById('chatbot-send').addEventListener('click', sendMessage);
  document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();