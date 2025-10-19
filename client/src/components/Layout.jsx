import Navbar from "./Navbar.jsx";
export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1">
        {children}
      </main>
      <footer className="border-t py-8 text-center text-sm text-gray-500">
        Built with — ShopX
      </footer>
    </div>
  );
}
