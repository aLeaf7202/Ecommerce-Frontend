import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Products() {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;

        const available = Object.entries(data)
          .filter(([, p]) => p.available === 1)
          .map(([id, p]) => ({ id, ...p }));

        const grouped = available.reduce((acc, p) => {
          const cat = p.category;
          (acc[cat] ??= []).push(p);
          return acc;
        }, {});

        setProducts(grouped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });

    return () => (isMounted = false);
  }, []);

  const getRandomProducts = (arr, count = 6) => {
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
    <div>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Filter by Category</h3>
            <ul className="space-y-2">
              <li
                className={`cursor-pointer p-2 rounded transition-colors hover:bg-indigo-50 ${
                  selectedCategory === null ? "bg-indigo-100 text-indigo-600 font-semibold" : ""
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </li>
              {Object.keys(products).map((cat) => (
                <li
                  key={cat}
                  className={`cursor-pointer p-2 rounded transition-colors hover:bg-indigo-50 ${
                    selectedCategory === cat ? "bg-indigo-100 text-indigo-600 font-semibold" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </aside>
          <main className="lg:col-span-3">
            {selectedCategory === null ? (
              <div className="space-y-16">
                {Object.keys(products).map((category) => {
                  const rowProducts = getRandomProducts(products[category], 6);

                  return (
                    <section key={category} className="space-y-6">
                      <h2 className="cursor-pointer text-3xl font-bold text-gray-800 transition-colors hover:text-indigo-600">
                        {category}
                      </h2>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        {rowProducts.map((p) => (
                          <Card key={p.id} productId={p.id} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <section className="space-y-6">
                <h2 className="cursor-pointer text-3xl font-bold text-gray-800 transition-colors hover:text-indigo-600">
                  {selectedCategory}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                  {products[selectedCategory].map((p) => (
                    <Card key={p.id} productId={p.id} />
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