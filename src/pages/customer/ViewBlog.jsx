// src/pages/ViewBlog.jsx
import  { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, Image as ImageIcon } from "lucide-react";
import Header from "../../components/Header";

export default function ViewBlog({ open, blog, onClose }) {
  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const title = blog?.title || "BLOG TITLE";
  const cover = blog?.cover || "";
  const text = blog?.text || blog?.excerpt || blog?.content || "BLOG TEXTS";

  return (
    <div
      className={[
        "fixed inset-0 z-999 flex items-center justify-center",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close blog modal overlay"
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/40 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      
      <div
        className={[
          "relative w-[94vw] max-w-6xl",
          "transition-all duration-300 ease-out",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95",
        ].join(" ")}
      >
        <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl border border-gray-200">
          {/*   NAVBAR  */}
          
<Header />
          
          <main className="px-4 pb-8">
            <div className="mx-auto max-w-6xl">
              {/* Big Image */}
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

              {/* Title + Text */}
              <div className="mt-6">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-gray-700 leading-6 whitespace-pre-line">
                  {text}
                </p>
              </div>

              {/*  Bottom Close Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    px-5 py-2 rounded-md
                    bg-gray-800 text-white text-sm font-semibold
                    hover:bg-gray-900 active:scale-[0.98] transition
                  "
                >
                  Close
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
