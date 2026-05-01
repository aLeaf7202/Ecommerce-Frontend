import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { Search, ShoppingCart, User, LogOut } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${searchTerm}`);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-extrabold text-indigo-600 tracking-tight">
              Kenakata
            </Link>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </form>

          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Products</Link>
              <Link to="/blogs" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Blogs</Link>
            </nav>

            <div className="h-6 w-px bg-gray-200 hidden lg:block"></div>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-indigo-600 transition">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to={user.role === 'ADMIN' ? '/admin-dashboard' : user.role === 'SELLER' ? '/seller-dashboard' : '/customerprofile'} 
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-200 transition">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm font-semibold text-gray-700">{user.name}</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-500 hover:text-red-600 transition hover:cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Login</Link>
                  <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition shadow-md">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}