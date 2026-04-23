import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import api from "../../api/axios";
import { useLocation } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const keyword = params.get("keyword") || "";
        
        const { data } = await api.get(`/products`, {
          params: { keyword }
        });

        const grouped = data.reduce((acc, p) => {
          const cat = p.category || "General";
          (acc[cat] ??= []).push(p);
          return acc;
        }, {});

        setProducts(grouped);
        setLoading(false);
      } catch (err) {
        console.error("Error loading products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const getRandomProducts = (arr, count = 6) => {
    if (!arr) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Reduced horizontal padding from px-4 to px-2 on mobile, px-6 on larger screens */}
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Narrower sidebar: was lg:col-span-1 (≈25%), now lg:col-span-2 (≈16-17%) */}
          <aside className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5 sticky top-20">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Categories</h3>
              <ul className="space-y-1.5 text-sm">
                <li
                  className={`cursor-pointer px-3 py-2 rounded-lg transition-colors hover:bg-indigo-50 ${
                    selectedCategory === null
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "text-gray-700"
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Products
                </li>
                {Object.keys(products).map((cat) => (
                  <li
                    key={cat}
                    className={`cursor-pointer px-3 py-2 rounded-lg transition-colors hover:bg-indigo-50 ${
                      selectedCategory === cat
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "text-gray-700"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main content takes more space: lg:col-span-10 instead of 3 */}
          <main className="lg:col-span-10">
            {selectedCategory === null ? (
              <div className="space-y-12 lg:space-y-16">
                {Object.keys(products).map((category) => {
                  return (
                    <section key={category} className="space-y-5">
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
                        {category}
                      </h2>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {products[category].map((p) => (
                          <Card key={p.id} product={p} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <section className="space-y-5">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
                  {selectedCategory}
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {products[selectedCategory].map((p) => (
                    <Card key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}