import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/home'); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-2xl font-black mb-2">
            <span className="text-[#1C1C1A]">pan</span><span className="text-[#C4622D]">try</span>
          </div>
          <h1 className="text-2xl font-black text-[#1C1C1A]">Create your account</h1>
          <p className="text-sm text-[#8A8578] mt-1">Free forever. No credit card needed.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-8 shadow-sm">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2D2D2A] mb-2">Full Name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)} required
                placeholder="Your name"
                className="w-full px-4 py-3 border border-[#E0D8CC] rounded-xl text-sm bg-[#FAF7F2] outline-none focus:border-[#C4622D] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2D2D2A] mb-2">Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-[#E0D8CC] rounded-xl text-sm bg-[#FAF7F2] outline-none focus:border-[#C4622D] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2D2D2A] mb-2">Password</label>
              <input
                type="password" value={password} onChange={e => setPass(e.target.value)} required
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3 border border-[#E0D8CC] rounded-xl text-sm bg-[#FAF7F2] outline-none focus:border-[#C4622D] transition-colors"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-[#1C1C1A] text-white font-bold rounded-xl hover:bg-[#C4622D] transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-[#8A8578] mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C4622D] font-bold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}