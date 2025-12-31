// src/pages/customer/ViewBlog.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";
import Header from "../../components/Header";
import { blogs_dummy } from "./Blogs";

export default function ViewBlog() {
  const navigate = useNavigate();
  const { id } = useParams(); 

  // Find blog by id
  const blog = useMemo(() => {
    const blogId = Number(id);
    return blogs_dummy.find((b) => b.id === blogId) || null;
  }, [id]);

  const title = blog?.title || "Blog Not Found";
  const cover = blog?.cover || "";
  const text = blog?.text || blog?.excerpt || blog?.content || "No content.";

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-4 pb-10">
        <div className="mx-auto max-w-6xl">
          {/*  Back button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              ← Back
            </button>
          </div>

          {/*  Big Image */}
          <div className="mt-5 w-full h-[230px] sm:h-80 bg-gray-200 overflow-hidden rounded-md flex items-center justify-center">
            {cover ? (
              <img
                src={cover}
                alt={title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center">
                <div className="h-14 w-14 rounded-xl bg-white/70 flex items-center justify-center border border-gray-300">
                  <ImageIcon className="h-7 w-7 text-gray-700" />
                </div>
              </div>
            )}
          </div>

          {/*  Title + Text */}
          <div className="mt-6">
            <h2 className="text-2xl font-extrabold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-700 leading-6 whitespace-pre-line">
              {text}
            </p>
          </div>

          {/*  Not found */}
          {!blog && (
            <div className="mt-6 text-sm text-red-600">
              This blog id does not exist.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
