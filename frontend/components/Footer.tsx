export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="card max-w-5xl mx-auto px-4 py-6 text-sm text-primary-50 flex items-center justify-between border-t border-neutral-800/40">
        <div>© {new Date().getFullYear()} Password Vault</div>
        <div className="hidden sm:block text-primary-200">Built with care · Client-side encryption</div>
      </div>
    </footer>
  );
}
