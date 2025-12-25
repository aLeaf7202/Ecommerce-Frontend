// src/pages/Blogs.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, ShoppingCart, User, Menu } from "lucide-react";




const blogs_dummy = [
{
  id: 1,
  title:
    "Best Budget Gaming Mouse in 2025: Top Picks for Performance and Value",
  // gaming mouse close-up (correct & relevant)
  cover: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800",
},

  {
    id: 2,
    title:
      "Mechanical Keyboard Buying Guide: Switch Types, Layouts, and What to Choose",
    cover: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800",
  },
 
  {
    id: 3,
    title:
      "Top PC Case Airflow Tips: How to Improve Cooling and Reduce Noise",
    cover: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800",
  },
  {
    id: 4,
    title:
      "Simple Laptop Optimization Tips to Boost Speed and Daily Performance",
   cover: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=80"

,
  },
 
];


export default function Blogs() {
  const [query, setQuery] = useState("");


  const blogs = useMemo(() => blogs_dummy, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter((b) => (b.title || "").toLowerCase().includes(q));
  }, [blogs, query]);

  return (
    <div className="min-h-screen bg-white">
      {/* TOP NAVBAR */}
      <header className="w-full border-b border-gray-100 pt-4">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between py-3">
            {/* Left: Logo + domain */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                  
                  {/* later here can put logo image */}



                </div>
                <span className="text-lg font-semibold text-gray-800  ">
                  Kenakata.com
                </span>
              </div>
            </div>

            {/* Center: Nav pills */}
            <nav className="hidden md:flex items-center gap-4">
              <Link
                to="/"
                className="text-lg font-bold px-3 py-1.5 rounded-md bg-gray-500 text-black-700 hover:bg-gray-200"
              >
                Home
              </Link>
              <Link
                to="/featured"
                className="text-lg font-bold px-3 py-1.5 rounded-md bg-gray-500 text-black-700 hover:bg-gray-200"
              >
                Featured
              </Link>
              <Link
                to="/products"
                className="text-lg font-bold px-3 py-1.5 rounded-md bg-gray-500 text-black-700 hover:bg-gray-200"
              >
                Products
              </Link>
              <Link
                to="/blogs"
                className="text-lg font-bold px-3 py-1.5 rounded-md bg-gray-500 text-black-700 hover:bg-gray-200"
              >
                Blogs
              </Link>
            </nav>

            {/* Right: Icons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Account"
              >
                <User className="h-5 w-5 text-gray-700" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* =======================
              SEARCH ROW
          ======================== */}
          <div className="flex items-center justify-center pb-4">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-sm outline-none focus:border-gray-300"
              />

              {/* Right icons inside input row (like screenshot) */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  className="p-1.5 rounded-md hover:bg-white/70"
                  aria-label="Search"
                  onClick={() => {}}
                >
                  <Search className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-md hover:bg-white/70"
                  aria-label="Filter"
                  onClick={() => {}}
                >
                  <SlidersHorizontal className="h-4 w-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =======================
          BLOG GRID
      ======================== */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <article key={b.id} className="w-full">
              {/* Card */}
              <div className="rounded-lg">
                {/* Image box (grey placeholder like screenshot) */}
                <div className="h-44 w-full rounded-lg overflow-hidden bg-gray-200">
                  {/* icon placeholder */}
                  <img
    src={b.cover}
    alt={b.title}
    className="h-full w-full object-cover"
  />
                </div>

                {/* Title (bottom-left like screenshot) */}
                <div className="pt-3">
                  <h3 className="text-sm text-gray-700">{b.title || "Title"}</h3>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-14 text-center text-sm text-gray-500">
            No blogs found.
          </div>
        )}
      </main>
    </div>
  );
}
