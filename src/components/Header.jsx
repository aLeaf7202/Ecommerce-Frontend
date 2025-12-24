export default function Header() {
  return (
    <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="shrink-0 flex items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">Kenakata.com</h1>
                </div>
                <div className="flex items-center">
                    <nav className="space-x-4">
                        <a href="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</a>
                        <a href="/featured" className="text-gray-700 hover:text-indigo-600 font-medium">Featured</a>
                        <a href="/products" className="text-gray-700 hover:text-indigo-600 font-medium">Products</a>
                        <a href="/cart" className="text-gray-700 hover:text-indigo-600 font-medium">Cart</a>
                         <a href="/blogs" className="text-gray-700 hover:text-indigo-600 font-medium">Blogs</a>
                        <a href="/login" className="text-gray-700 hover:text-indigo-600 font-medium">Login</a>
                    </nav>
                </div>
            </div>
        </div>
    </header>
  );
}