import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10">{children}</main>
      <Footer />
    </div>
  );
}
