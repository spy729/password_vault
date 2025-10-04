import { useState } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

function genSalt() {
  const arr = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...arr));
}

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [masterPasswordHint, setMasterPasswordHint] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      const salt = genSalt();
      localStorage.setItem('encryptionSalt', salt);
      await api.post('/api/auth/signup', { email, password });
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/vault');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Signup error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
    <div className="min-h-[60vh] flex items-center justify-center">
  <form className="w-full max-w-md p-8 card" onSubmit={submit}>
          <h2 className="text-2xl font-bold mb-2">Create account</h2>
          <p className="text-sm text-slate-600 mb-4">Sign up to secure and manage your passwords.</p>
          <label className="block mb-3"><div className="mb-1 text-sm text-slate-700">Email</div><input className="w-full p-2 border rounded" value={email} onChange={e=>setEmail(e.target.value)} /></label>
          <label className="block mb-3"><div className="mb-1 text-sm text-slate-700">Password</div><input type="password" className="w-full p-2 border rounded" value={password} onChange={e=>setPassword(e.target.value)} /></label>
      <label className="block mb-3"><div className="mb-1 text-sm text-slate-700">Master password (optional)</div><input placeholder="Choose a master password for local encryption" type="password" className="w-full p-2 border rounded" value={masterPasswordHint} onChange={e=>setMasterPasswordHint(e.target.value)} /></label>
      <div className="text-xs text-slate-500 mb-3">Tip: this master password is used for encrypting your vault locally. We never send it to the server. If you leave it blank, you can use your account password when prompted.</div>
          <div className="flex justify-end mt-4"><button className="btn-primary" disabled={loading}>{loading? '...' : 'Sign up'}</button></div>
        </form>
      </div>
    </Layout>
  );
}
