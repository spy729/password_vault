import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Header() {
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAuthed(typeof window !== 'undefined' && !!localStorage.getItem('token'));
  }, [typeof window !== 'undefined' && localStorage.getItem('token')]);

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      // keep encryption salt so user can still decrypt locally if they re-login
      router.push('/');
      setAuthed(false);
    }
  }

  return (
    <header className="sticky top-0 z-30">
      <div className="card max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl font-bold text-primary-50">Password Vault</Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm text-primary-200">
            <Link href="/" className="hover:text-primary-50">Home</Link>
            <Link href="/about" className="hover:text-primary-50">About</Link>
            <Link href="/vault" className="hover:text-primary-50">Vault</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {authed ? (
            <button onClick={logout} className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700">Logout</button>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">Log in</Link>
              <Link href="/signup" className="btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
