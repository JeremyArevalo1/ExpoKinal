import React, { useState } from 'react';
import { useOpenRouterChat } from '../shared/hooks'; // Asegúrate de que la ruta sea correcta

function ChatComponent() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const { sendMessage, response, loading, error } = useOpenRouterChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    await sendMessage(input);

    if (response) {
      const botMessage = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, botMessage]);
    }

    setInput('');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🤖 Chat con OpenRouter</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#DCF8C6' : '#F1F0F0',
            }}
          >
            <strong>{msg.role === 'user' ? 'Tú' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, fontStyle: 'italic' }}>
            El bot está escribiendo...
          </div>
        )}

        {error && (
          <div style={{ color: 'red', marginTop: 10 }}>
            ❌ {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button type="submit" style={styles.button} disabled={loading}>
          Enviar
        </button>
      </form>
    </div>
  );
}

export default ChatComponent;

// 🎨 Estilos en JS
const styles = {
  container: {
    maxWidth: '600px',
    margin: '30px auto',
    padding: '20px',
    background: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  chatBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '400px',
    overflowY: 'auto',
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    marginBottom: '15px',
  },
  message: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '80%',
    lineHeight: '1.4',
  },
  form: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flexGrow: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};