import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight:'100vh', background:'#FAF7F2',
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          textAlign:'center', padding:32,
        }}>
          <div style={{fontSize:64, marginBottom:20}}>⚠️</div>
          <h2 style={{fontSize:22, fontWeight:800, color:'#1C1C1A', marginBottom:8}}>
            Something went wrong
          </h2>
          <p style={{fontSize:14, color:'#8A8578', marginBottom:28}}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background:'#C4622D', color:'#fff', border:'none',
              padding:'12px 28px', borderRadius:100,
              fontSize:14, fontWeight:700, cursor:'pointer',
            }}
          >Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}