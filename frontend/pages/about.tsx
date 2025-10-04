import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold">About Password Vault</h1>
      <p className="mt-4 text-gray-700">This is a simple password vault demo. Client-side encryption is used to protect passwords before they are sent to the server.</p>
      <p className="mt-4 text-gray-700">Use the Vault page to add, view, and manage your encrypted entries. For full functionality, start the backend at <code>http://localhost:5000</code>.</p>
    </Layout>
  );
}
