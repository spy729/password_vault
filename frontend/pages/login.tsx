import { useState } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      const salt = localStorage.getItem('encryptionSalt') || btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
      localStorage.setItem('encryptionSalt', salt);
      router.push('/vault');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Login error');
    } finally { setLoading(false); }
  }

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
  <form className="w-full max-w-md p-8 card" onSubmit={submit}>
          <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
          <p className="text-sm text-slate-600 mb-4">Log in to access your encrypted vault.</p>
          <label className="block mb-3"><div className="mb-1 text-sm text-slate-700">Email</div><input className="w-full p-2 border rounded" value={email} onChange={e=>setEmail(e.target.value)} /></label>
          <label className="block mb-3"><div className="mb-1 text-sm text-slate-700">Password</div><input type="password" className="w-full p-2 border rounded" value={password} onChange={e=>setPassword(e.target.value)} /></label>
          <div className="flex justify-between items-center mt-4">
            <div></div>
            <button className="btn-primary" disabled={loading}>{loading? '...' : 'Log in'}</button>
          </div>
          <div className="mt-2 text-xs text-slate-500">Note: you will be asked for your master password on the Vault page to decrypt entries. If you set a separate master password during signup, use that; otherwise you can use your account password.</div>
          <p className="mt-4 text-center text-sm text-slate-400">Don't have an account? <a href="/signup" className="text-primary-300 hover:underline">Sign up</a></p>
        </form>
      </div>
    </Layout>
  );
}
