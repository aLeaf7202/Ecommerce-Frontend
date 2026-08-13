import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../api/axios";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await api.get("/blogs");
        setBlogs(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filtered = blogs.filter((b) => 
    (b.title || "").toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="flex flex-col items-center justify-center pb-5 mt-10 space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900">Kenakata Blogs</h1>
        <div className="relative w-full max-w-xl px-4">
          <input
            type="text"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-gray-50 px-6 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition shadow-sm"
          />
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b) => (
              <article key={b.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-xl hover:-translate-y-1">
                <Link to={`/blogs/${b.id}`} className="block">
                  <div className="h-56 w-full overflow-hidden bg-gray-100">
                    <img
                      src={b.imageUrl || "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800"}
                      alt={b.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                        {b.User?.storeName || "Kenakata Seller"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                      {b.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {b.content}
                    </p>
                    <div className="mt-6 flex items-center text-sm font-bold text-indigo-600 group-hover:underline">
                      Read More →
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg text-gray-500 font-medium">No blogs found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}

