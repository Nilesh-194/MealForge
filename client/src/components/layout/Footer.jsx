import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background:'#1C1C1A',
      borderTop:'1px solid #2A2A27',
      padding:'48px 32px 32px',
      marginTop:'auto',
    }}>
      <div style={{
        maxWidth:1280, margin:'0 auto',
        display:'grid',
        gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',
        gap:28, marginBottom:40,
      }}>

        {/* Brand */}
        <div>
          <div style={{fontSize:24, fontWeight:900, marginBottom:12}}>
            <span style={{color:'#fff'}}>Meal</span>
            <span style={{color:'#C4622D'}}>Forge</span>
          </div>
          <p style={{fontSize:13, color:'#555', lineHeight:1.7, maxWidth:240}}>
            Cook smarter with what you already have. Find recipes, save favourites, and let AI inspire your next meal.
          </p>
          <div style={{display:'flex', gap:12, marginTop:20}}>
            {['🌐 Web','📱 Mobile','🤖 AI Powered'].map(badge => (
              <span key={badge} style={{
                fontSize:11, color:'#555',
                background:'#2A2A27',
                padding:'4px 10px', borderRadius:20,
                fontWeight:600,
              }}>{badge}</span>
            ))}
          </div>
        </div>

        {/* Product */}
        <div>
          <h4 style={{fontSize:12, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'1px', marginBottom:16}}>
            Product
          </h4>
          {[
            ['/home',    'Explore Recipes'],
            ['/ai',     'AI Chef'],
            ['/saved',  'Saved Recipes'],
            ['/pantry', 'My Pantry'],
          ].map(([to, label]) => (
            <Link key={to} to={to} style={{
              display:'block', fontSize:13, color:'#666',
              textDecoration:'none', marginBottom:10,
              transition:'color .2s',
            }}
              onMouseEnter={e => e.target.style.color='#C4622D'}
              onMouseLeave={e => e.target.style.color='#666'}
            >{label}</Link>
          ))}
        </div>

        {/* Account */}
        <div>
          <h4 style={{fontSize:12, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'1px', marginBottom:16}}>
            Account
          </h4>
          {[
            ['/login',   'Sign In'],
            ['/signup',  'Create Account'],
            ['/history', 'Search History'],
          ].map(([to, label]) => (
            <Link key={to} to={to} style={{
              display:'block', fontSize:13, color:'#666',
              textDecoration:'none', marginBottom:10,
              transition:'color .2s',
            }}
              onMouseEnter={e => e.target.style.color='#C4622D'}
              onMouseLeave={e => e.target.style.color='#666'}
            >{label}</Link>
          ))}
        </div>

        {/* Built with */}
        <div>
          <h4 style={{fontSize:12, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'1px', marginBottom:16}}>
            Built With
          </h4>
          {['React + Vite','Node + Express','MongoDB Atlas','Google Gemini AI'].map(tech => (
            <div key={tech} style={{
              fontSize:13, color:'#555', marginBottom:10,
              display:'flex', alignItems:'center', gap:6,
            }}>
              <span style={{color:'#C4622D', fontSize:10}}>◆</span>
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop:'1px solid #2A2A27',
        paddingTop:24,
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',
        flexWrap:'wrap', gap:12,
      }}>
        <p style={{fontSize:12, color:'#444'}}>
          © {new Date().getFullYear()} Pantry. Made with ❤️ by{' '}
          <span style={{color:'#C4622D', fontWeight:700}}>Nilesh Dubey</span>
        </p>
        <div style={{display:'flex', alignItems:'center', gap:16}}>
  <p style={{fontSize:12, color:'#444'}}>
    Built on the MERN Stack · Powered by Gemini AI
  </p>

  <a
    href="https://github.com/Nilesh-194"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display:'flex',
      alignItems:'center',
      gap:6,
      color:'#666',
      textDecoration:'none',
      fontSize:12,
      transition:'color .2s',
    }}
    onMouseEnter={e => e.currentTarget.style.color='#C4622D'}
    onMouseLeave={e => e.currentTarget.style.color='#666'}
  >
    {/* GitHub SVG icon */}
    <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 
      6.53 5.47 7.59.4.07.55-.17.55-.38 
      0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94
      -.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
      -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 
      1.87.87 2.33.66.07-.52.28-.87.51-1.07
      -1.78-.2-3.64-.89-3.64-3.95 
      0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 
      0 0 .67-.21 2.2.82a7.5 7.5 0 012.01-.27c.68 
      0 1.36.09 2.01.27 1.53-1.04 2.2-.82 
      2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 
      1.27.82 2.15 0 3.07-1.87 3.75-3.65 
      3.95.29.25.54.73.54 1.48 0 1.07-.01 
      1.93-.01 2.2 0 .21.15.46.55.38A8.013 
      8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>

    GitHub
  </a>
</div>
      </div>
    </footer>
  );
}