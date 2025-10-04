import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="text-4xl font-extrabold">Password Vault</h1>
        <p className="mt-3 text-lg text-gray-700">Sign up or log in to securely store and manage your passwords.</p>

        <div className="mt-6 flex items-center justify-center gap-4">
          <a href="/signup" className="px-5 py-2 bg-blue-600 text-white rounded">Get started (Sign up)</a>
          <a href="/login" className="px-5 py-2 border rounded">Log in</a>
        </div>

        <div className="mt-10 max-w-2xl mx-auto text-left text-gray-700">
          <h2 className="text-xl font-semibold">How it works</h2>
          <ol className="list-decimal pl-5 mt-2">
            <li>Create an account or log in.</li>
            <li>Add entries on the Vault page. Passwords are encrypted locally before upload.</li>
            <li>Use the master password to decrypt and reveal passwords on demand.</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
}
