export default function Header() {
  return (
    <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">Kenakata.com</h1>
                </div>
                <div className="flex items-center">
                    <nav className="space-x-4">
                        <a href="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</a>
                        <a href="/about" className="text-gray-700 hover:text-indigo-600 font-medium">About</a>
                        <a href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium">Contact</a>
                    </nav>
                </div>
            </div>
        </div>
    </header>
  );
}