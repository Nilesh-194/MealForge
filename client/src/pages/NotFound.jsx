import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight:'100vh', background:'#FAF7F2',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      textAlign:'center', padding:32,
    }}>
      <div style={{fontSize:80, marginBottom:24}}>🍽️</div>
      <h1 style={{
        fontSize:80, fontWeight:900, color:'#E0D8CC',
        lineHeight:1, marginBottom:8,
      }}>404</h1>
      <h2 style={{
        fontSize:24, fontWeight:800, color:'#1C1C1A',
        marginBottom:10,
      }}>Page not found</h2>
      <p style={{
        fontSize:15, color:'#8A8578',
        marginBottom:32, maxWidth:360, lineHeight:1.6,
      }}>
        Looks like this recipe doesn't exist. Let's get you back to the kitchen.
      </p>
      <Link to="/" style={{
        background:'#C4622D', color:'#fff',
        padding:'13px 32px', borderRadius:100,
        fontSize:14, fontWeight:700, textDecoration:'none',
      }}>← Back to Home</Link>
    </div>
  );
}