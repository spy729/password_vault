import { useEffect, useRef, useState } from 'react';
import api from '../lib/api';
import { VaultItem } from '../types';
import { decryptText, encryptText } from '../utils/crypto';
import Layout from '../components/Layout';
import PasswordGenerator from '../components/PasswordGenerator';

export default function Vault() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [masterPassword, setMasterPassword] = useState('');
  // which items are currently revealed (plaintext shown temporarily)
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  // which item was just copied (id) to show feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const revealTimers = useRef<Record<string, number>>({});
  const clipboardTimer = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ title: '', username: '', password: '', url: '', notes: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'withNotes'>('all');
  const [usernameQuery, setUsernameQuery] = useState('');
  const [urlQuery, setUrlQuery] = useState('');

  useEffect(() => { fetchItems(); }, []);
  // redirect to login if not authenticated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
      }
    }
  }, []);

  async function fetchItems() {
    try {
      const res = await api.get('/api/vault');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleReveal(item: VaultItem) {
    const salt = localStorage.getItem('encryptionSalt') || '';
    try {
      // Always require an explicit master password entry when revealing
      const mp = prompt('Enter master password to decrypt this entry');
      if (!mp) return;
      const plain = await decryptText(item.password, mp, salt);
      // set temporary revealed value
      setRevealed(prev => ({ ...prev, [item._id]: plain }));
      // clear any existing timer for this id
      if (revealTimers.current[item._id]) {
        clearTimeout(revealTimers.current[item._id]);
      }
      // hide after 15 seconds
      revealTimers.current[item._id] = window.setTimeout(() => {
        setRevealed(prev => { const copy = { ...prev }; delete copy[item._id]; return copy; });
        delete revealTimers.current[item._id];
      }, 15000);
    } catch (err) {
      alert('Unable to decrypt. Check master password.');
    }
  }

  async function handleAddOrUpdate(e?: any) {
    if (e) e.preventDefault();

    // Master password must be provided by the user in the form.
    if (!masterPassword) {
      alert('Master password is required to encrypt and save entries. Please enter it in the form.');
      return;
    }

    setLoading(true);
    try {
      const salt = localStorage.getItem('encryptionSalt') || '';
      const pw = form.password || '';
      const tokenPw = masterPassword;
      const encrypted = await encryptText(pw, tokenPw, salt);

      if (editingId) {
        const updates: any = { title: form.title, username: form.username, url: form.url, notes: form.notes };
        if (pw) updates.password = encrypted;
        const res = await api.put(`/api/vault/${editingId}`, updates);
        setItems(prev => prev.map(it => it._id === editingId ? res.data : it));
        setEditingId(null);
      } else {
        const res = await api.post('/api/vault', { title: form.title, username: form.username, password: encrypted, url: form.url, notes: form.notes });
        setItems(prev => [res.data, ...prev]);
      }
      setForm({ title: '', username: '', password: '', url: '', notes: '' });
    } catch (err) {
      console.error(err);
      alert('Operation failed');
    } finally {
      setLoading(false);
    }
  }

  function beginEdit(item: VaultItem) {
    setEditingId(item._id);
    setForm({ title: item.title, username: item.username || '', password: '', url: item.url || '', notes: item.notes || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/api/vault/${id}`);
      setItems(prev => prev.filter(it => it._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  }

  async function handleCopy(item: VaultItem) {
    const salt = localStorage.getItem('encryptionSalt') || '';
    let plain = '';
    try {
      // Always prompt for master password when copying
      const mp = prompt('Enter master password to decrypt for copy');
      if (!mp) return;
      plain = await decryptText(item.password, mp, salt);
      await navigator.clipboard.writeText(plain);
      setCopiedId(item._id);
      // schedule clipboard clear after 15s
      if (clipboardTimer.current) clearTimeout(clipboardTimer.current);
      clipboardTimer.current = window.setTimeout(async () => {
        try {
          // attempt to clear clipboard
          await navigator.clipboard.writeText('');
        } catch (e) {
          // ignore
        }
        setCopiedId(null);
        clipboardTimer.current = null;
      }, 15000);
    } catch (err) {
      // fallback: copy raw value (may be encrypted) but warn user
      try {
        await navigator.clipboard.writeText(item.password);
        setCopiedId(item._id);
        if (clipboardTimer.current) clearTimeout(clipboardTimer.current);
        clipboardTimer.current = window.setTimeout(async () => {
          try { await navigator.clipboard.writeText(''); } catch (e) {}
          setCopiedId(null);
          clipboardTimer.current = null;
        }, 15000);
        alert('Could not decrypt. Copied raw value to clipboard.');
      } catch (e) {
        alert('Copy failed.');
      }
    }
  }

  // client-side filtering: search by title and optional "with notes" filter
  const filtered = items.filter(item => {
    const qTitle = searchQuery.trim().toLowerCase();
    const qUser = usernameQuery.trim().toLowerCase();
    const qUrl = urlQuery.trim().toLowerCase();

    if (qTitle) {
      if (!item.title || !item.title.toLowerCase().includes(qTitle)) return false;
    }
    if (qUser) {
      const uname = (item.username || '').toLowerCase();
      if (!uname.includes(qUser)) return false;
    }
    if (qUrl) {
      const u = (item.url || '').toLowerCase();
      if (!u.includes(qUrl)) return false;
    }
    if (filterMode === 'withNotes') {
      return Boolean(item.notes && item.notes.trim().length > 0);
    }
    return true;
  });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
  <form className="card p-4 mb-6" onSubmit={handleAddOrUpdate}>
          <h2 className="text-lg font-semibold">{editingId ? 'Edit entry' : 'Add new entry'}</h2>
          <div className="grid grid-cols-1 gap-2 mt-3">
            <input className="p-2 border" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required />
            <input className="p-2 border" placeholder="Username" value={form.username} onChange={e=>setForm({...form, username: e.target.value})} />
            <input className="p-2 border" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} />
            <div>
              <PasswordGenerator onGenerate={(pw)=>setForm(prev=>({ ...prev, password: pw }))} />
            </div>
            <input className="p-2 border" placeholder="URL" value={form.url} onChange={e=>setForm({...form, url: e.target.value})} />
            <textarea className="p-2 border" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes: e.target.value})} />
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <input placeholder="Master password (required to encrypt)" required type="password" value={masterPassword} onChange={e=>setMasterPassword(e.target.value)} className="p-2 border" />
              <div className="text-xs text-slate-500">This master password is used to encrypt/decrypt your vault locally. It is not sent to the server.</div>
            </div>
            <div>
              <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded" disabled={loading}>{loading ? '...' : editingId ? 'Save' : 'Add'}</button>
              {editingId && <button type="button" onClick={()=>{setEditingId(null); setForm({ title: '', username: '', password: '', url: '', notes: '' });}} className="ml-2 px-3 py-1 border rounded">Cancel</button>}
            </div>
          </div>
        </form>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            className="p-2 border col-span-1 sm:col-span-2"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <input
            className="p-2 border"
            placeholder="Search by username..."
            value={usernameQuery}
            onChange={e => setUsernameQuery(e.target.value)}
          />
          <input
            className="p-2 border"
            placeholder="Search by URL..."
            value={urlQuery}
            onChange={e => setUrlQuery(e.target.value)}
          />
          <div className="sm:col-span-4">
            <select className="p-2 border w-full mt-2 sm:mt-0" value={filterMode} onChange={e => setFilterMode(e.target.value as any)}>
              <option value="all">All</option>
              <option value="withNotes">With notes</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.map(item => (
            <div key={item._id} className="border rounded-lg p-4 card shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <div className="text-sm text-slate-600 mt-1">{item.url}</div>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center gap-2">
                  <button onClick={()=>beginEdit(item)} className="btn-ghost">Edit</button>
                  <button onClick={()=>handleDelete(item._id)} className="px-3 py-1 bg-red-600 text-white rounded-md text-sm">Delete</button>
                </div>
              </div>
              <div className="mt-3 grid sm:grid-cols-3 gap-2 text-sm text-slate-700">
                <div>Username: <span className="ml-1 font-medium">{item.username || '—'}</span></div>
                <div>
                  Password: <span className="ml-1 font-mono">{revealed[item._id] ?? '••••••••'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>handleCopy(item)} className="px-2 py-1 border rounded text-xs">{copiedId === item._id ? 'Copied' : 'Copy'}</button>
                  {revealed[item._id] ? (
                    <button onClick={()=>{
                      // hide immediately
                      if (revealTimers.current[item._id]) { clearTimeout(revealTimers.current[item._id]); delete revealTimers.current[item._id]; }
                      setRevealed(prev => { const copy = { ...prev }; delete copy[item._id]; return copy; });
                    }} className="px-2 py-1 btn-ghost text-xs">Hide</button>
                  ) : (
                    <button onClick={()=>handleReveal(item)} className="px-2 py-1 btn-primary text-xs">Reveal</button>
                  )}
                </div>
              </div>
              {item.notes && <div className="mt-3 text-sm text-slate-600">Notes: {item.notes}</div>}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
