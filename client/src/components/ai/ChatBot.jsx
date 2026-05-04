import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../services/aiService';

const SUGGESTIONS = [
  'What can I substitute for buttermilk?',
  'How do I know when oil is hot enough?',
  'How long should I rest a steak?',
  'What spices go well with chicken?',
];

export default function ChatBot({ open, onToggle }) {
  const [messages, setMessages]   = useState([
    { role:'bot', content:'Hi! I\'m your Pantry AI cooking assistant 👨‍🍳 Ask me anything about cooking, ingredients, substitutions or recipes!' }
  ]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const bottomRef                 = useRef(null);
  const inputRef                  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role:'user', content:msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role:    m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));
      const { reply } = await sendChatMessage(msg, history);
      setMessages(prev => [...prev, { role:'bot', content:reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role:'bot',
        content:'Sorry, I\'m having trouble connecting right now. Please try again! 🙏',
      }]);
    } finally { setLoading(false); }
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* FAB button */}
      <button
        onClick={onToggle}
        style={{
          position:'fixed', bottom:32, right:32, zIndex:400,
          width:60, height:60, borderRadius:'50%',
          background: open ? '#1C1C1A' : '#C4622D',
          border:'none', color:'#fff', fontSize:26,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 8px 24px rgba(196,98,45,.45)',
          cursor:'pointer', transition:'all .3s',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}
      >
        {open ? '×' : '💬'}
      </button>

      {/* Chat popup */}
      {open && (
        <div style={{
          position:'fixed', bottom:104, right:32, zIndex:399,
          width:340, background:'#fff',
          border:'1.5px solid #E0D8CC',
          borderRadius:24, boxShadow:'0 20px 60px rgba(0,0,0,.18)',
          overflow:'hidden', animation:'fadeUp .25s ease',
          display:'flex', flexDirection:'column',
          maxHeight:'60vh',
        }}>

          {/* Header */}
          <div style={{background:'#1C1C1A', padding:'16px 20px', flexShrink:0}}>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <div style={{
                width:36, height:36, borderRadius:'50%',
                background:'#C4622D', display:'flex',
                alignItems:'center', justifyContent:'center',
                fontSize:18, flexShrink:0,
              }}>🤖</div>
              <div>
                <h4 style={{color:'#fff', fontSize:13, fontWeight:800, margin:0}}>
                  Pantry AI Assistant
                </h4>
                <p style={{color:'#555', fontSize:11, margin:'2px 0 0'}}>
                  Ask me anything about cooking
                </p>
              </div>
              <div style={{
                marginLeft:'auto', width:8, height:8,
                borderRadius:'50%', background:'#4CAF50',
              }} />
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex:1, overflowY:'auto', padding:16,
            display:'flex', flexDirection:'column', gap:10,
            background:'#FAF7F2',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display:'flex',
                flexDirection:'column',
                alignItems: msg.role==='user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth:'85%', padding:'10px 14px',
                  borderRadius: msg.role==='user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  background: msg.role==='user' ? '#EDE6D6' : '#1C1C1A',
                  color: msg.role==='user' ? '#2D2D2A' : '#eee',
                  fontSize:13, lineHeight:1.55,
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{display:'flex', alignItems:'flex-start'}}>
                <div style={{
                  background:'#1C1C1A', padding:'12px 16px',
                  borderRadius:'18px 18px 18px 4px',
                  display:'flex', gap:4, alignItems:'center',
                }}>
                  {[0,.15,.3].map(d => (
                    <div key={d} style={{
                      width:6, height:6, borderRadius:'50%',
                      background:'#666', animation:'pulse 1s ease infinite',
                      animationDelay:`${d}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — only show at start */}
          {messages.length === 1 && (
            <div style={{
              padding:'10px 14px', background:'#F5F0E8',
              borderTop:'1px solid #E0D8CC', flexShrink:0,
            }}>
              <p style={{fontSize:10, color:'#8A8578', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:8}}>
                Try asking:
              </p>
              <div style={{display:'flex', flexDirection:'column', gap:5}}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)} style={{
                    background:'#fff', border:'1px solid #E0D8CC',
                    borderRadius:100, padding:'6px 12px', fontSize:11,
                    color:'#8A8578', cursor:'pointer', textAlign:'left',
                    transition:'all .2s', fontFamily:'inherit',
                  }}
                    onMouseEnter={e => { e.target.style.borderColor='#C4622D'; e.target.style.color='#C4622D'; }}
                    onMouseLeave={e => { e.target.style.borderColor='#E0D8CC'; e.target.style.color='#8A8578'; }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{
            display:'flex', gap:8, padding:'12px 14px',
            borderTop:'1px solid #E0D8CC', background:'#fff', flexShrink:0,
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about cooking..."
              disabled={loading}
              style={{
                flex:1, padding:'9px 14px',
                border:'1.5px solid #E0D8CC', borderRadius:100,
                fontSize:13, outline:'none', background:'#FAF7F2',
                fontFamily:'inherit', transition:'border-color .2s',
              }}
              onFocus={e => e.target.style.borderColor='#C4622D'}
              onBlur={e => e.target.style.borderColor='#E0D8CC'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? '#E0D8CC' : '#C4622D',
                border:'none', borderRadius:'50%',
                width:38, height:38, color:'#fff',
                fontSize:16, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'background .2s', flexShrink:0,
              }}
            >→</button>
          </div>
        </div>
      )}
    </>
  );
}