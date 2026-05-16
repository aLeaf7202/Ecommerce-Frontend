import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Image as ImageIcon, Calendar, User as UserIcon } from "lucide-react";
import Header from "../../components/Header";
import api from "../../api/axios";

export default function ViewBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/${id}`);
        setBlog(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center py-40">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-500 mb-8">The article you are looking for might have been removed.</p>
          <button 
            onClick={() => navigate('/blogs')}
            className="rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-4 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group flex items-center text-sm font-bold text-gray-500 hover:text-indigo-600 transition"
            >
              <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> Back to list
            </button>
          </div>

          <header className="mt-8 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-100 pb-8">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="font-bold text-gray-900">{blog.User?.storeName || blog.User?.name || "Kenakata Seller"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              </div>
            </div>
          </header>

          <div className="mt-10 w-full aspect-video bg-gray-50 overflow-hidden rounded-3xl shadow-2xl">
            {blog.imageUrl ? (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <ImageIcon className="h-20 w-20 text-gray-200" />
              </div>
            )}
          </div>

          <div className="mt-12 prose prose-indigo prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
              {blog.content}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

