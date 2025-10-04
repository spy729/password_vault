import { useState } from 'react';

export default function PasswordGenerator({ onGenerate }: { onGenerate: (pw: string) => void }) {
  const [length, setLength] = useState(16);
  const [letters, setLetters] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const exclude = 'Il1O0';

  function generate() {
    const chars = [] as string[];
    if (letters) chars.push('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (numbers) chars.push('0123456789');
    if (symbols) chars.push('!@#$%^&*()_+-=[]{}|;:,./<>?');
    const pool = chars.join('').split('').filter(c => !exclude.includes(c));
    let out = '';
    for (let i = 0; i < length; i++) out += pool[Math.floor(Math.random() * pool.length)];
    onGenerate(out);
  }

  return (
    <div className="p-4 card">
      <div className="mb-2">Length: {length}</div>
      <input className="range" type="range" min={8} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} />
      <div className="mt-2 space-y-1">
        <label><input type="checkbox" checked={letters} onChange={() => setLetters(v => !v)} /> Letters</label>
        <label><input type="checkbox" checked={numbers} onChange={() => setNumbers(v => !v)} /> Numbers</label>
        <label><input type="checkbox" checked={symbols} onChange={() => setSymbols(v => !v)} /> Symbols</label>
      </div>
      <div className="mt-3">
        <button onClick={generate} className="btn-primary">Generate</button>
      </div>
    </div>
  );
}
