// src/pages/customer/Blogs.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

// Dummy Blogs
export const blogs_dummy = [
  {
    id: 1,
    title: "Best Budget Gaming Mouse in 2025: Top Picks for Performance and Value",
    cover: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800",
    text:
      "In this guide, we’ll cover budget-friendly gaming mice that still deliver great sensors, clicks, and comfort — without breaking the bank.",
  },
  {
    id: 2,
    title: "Mechanical Keyboard Buying Guide: Switch Types, Layouts, and What to Choose",
    cover: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800",
    text:
      "Learn the difference between linear, tactile, and clicky switches, and how to choose the right layout and features for your workflow or gaming needs.",
  },
  {
    id: 3,
    title: "Top PC Case Airflow Tips: How to Improve Cooling and Reduce Noise",
    cover: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800",
    text:
      "Better airflow means lower temps and less noise. Here are practical fan placement and cable management tips to keep your system cool and quiet.",
  },
  {
    id: 4,
    title: "Simple Laptop Optimization Tips to Boost Speed and Daily Performance",
    cover: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=80",
    text:
      "From startup cleanup to storage hygiene and browser tuning — these simple steps can make your laptop feel faster and smoother in daily use.",
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
      <Header />

      {/* SEARCH ROW */}
      <div className="flex items-center justify-center pb-5 mt-10">
        <div className="relative w-full max-w-xl px-4">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-sm outline-none focus:border-gray-300"
          />
        </div>
      </div>

      {/* BLOG GRID */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <article key={b.id} className="w-full">
              
              <Link to={`/blogs/${b.id}`} className="block w-full text-left">
                <div className="rounded-lg">
                  <div className="h-44 w-full rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={b.cover}
                      alt={b.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="pt-3">
                    <h3 className="text-sm text-gray-700">{b.title}</h3>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-14 text-center text-sm text-gray-500">
            No blogs found.
          </div>
        )}
      </main>
    </div>
  );
}
