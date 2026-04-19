import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, XCircle, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface Message {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  user_name: string;
}

interface EventChatProps {
  eventType: 'game' | 'training';
  eventId: string | number;
}

export function EventChat({ eventType, eventId }: EventChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ограничения
  const TEXT_LIMIT = 50;
  const IMAGE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/${eventType}/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Ошибка загрузки чата', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Опрос каждые 10 секунд
    return () => clearInterval(interval);
  }, [eventId, eventType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > IMAGE_SIZE_LIMIT) {
      setError('Фото слишком большое (макс. 10 МБ)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if (!content.trim() && !image) return;
    if (content.length > TEXT_LIMIT) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/chat/${eventType}/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content, image_base64: image })
      });

      if (res.ok) {
        setContent('');
        setImage(null);
        fetchMessages();
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка при отправке');
      }
    } catch (err) {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px', fontSize: '0.875rem' }}>
            Сообщений пока нет. Чат доступен участникам.
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} style={{ borderRadius: '1rem', backgroundColor: 'var(--bg-app)', padding: '12px', alignSelf: 'flex-start' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>{m.user_name}</div>
              {m.content && <div style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{m.content}</div>}
              {m.image_url && <img src={m.image_url} alt="chat" style={{ marginTop: '8px', maxWidth: '100%', borderRadius: '0.5rem', maxHeight: '150px', objectFit: 'cover' }} />}
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'right' }}>
                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
      </div>

      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div style={{ position: 'relative', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '8px', backgroundColor: 'var(--bg-surface)' }}>
        {image && (
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
            <img src={image} alt="preview" style={{ height: '60px', borderRadius: '0.5rem' }} />
            <button onClick={() => setImage(null)} style={{ position: 'absolute', top: '-8px', right: '-8px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>
              <XCircle size={16} fill="white" />
            </button>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{ padding: '8px', border: 'none', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <Image size={20} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, TEXT_LIMIT))}
            placeholder="Ваше сообщение..."
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              resize: 'none',
              padding: '8px 0',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              maxHeight: '80px'
            }}
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <span style={{ fontSize: '0.65rem', color: content.length >= TEXT_LIMIT ? '#ef4444' : 'var(--text-secondary)' }}>
              {content.length}/{TEXT_LIMIT}
            </span>
            <Button 
              onClick={handleSend} 
              disabled={loading || (!content.trim() && !image)}
              style={{ padding: '8px', borderRadius: '0.75rem' }}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
