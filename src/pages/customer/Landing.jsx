import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Featured from "../../components/Featured";
import Card from "../../components/Card";
import Footer from "../../components/Footer";
import ViewProduct from "./ViewProduct";
import api from "../../api/axios";

export default function Landing() {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [viewingProduct, setViewingProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, featuredRes] = await Promise.all([
          api.get("/products"),
          api.get("/products/featured"),
        ]);

        const grouped = productsRes.data.reduce((acc, p) => {
          const cat = p.category || "General";
          (acc[cat] ??= []).push(p);
          return acc;
        }, {});

        setProducts(grouped);
        setFeaturedProducts(featuredRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading products:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  const getRandomProducts = (arr, count = 6) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  if (loading) {
    return (
      <>
        <Header />
        <Featured featuredProducts={[]} />
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <Featured
        featuredProducts={featuredProducts}
        onSelect={(product) => setViewingProduct(product)}
      />

      
      <div className="mx-auto max-w-7xl px-4 py-12 space-y-16">
        {Object.keys(products).map((category) => {
          const rowProducts = getRandomProducts(products[category], 6);

          return (
            <section key={category} className="space-y-6">
              <h2 className="cursor-pointer text-3xl font-bold text-gray-800 transition-colors hover:text-indigo-600">
                {category}
              </h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {rowProducts.map((p) => (
                  <Card key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="bg-linear-to-r from-indigo-600 to-purple-700 py-20 px-4 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold md:text-6xl">
            Welcome to Kenakata.com
          </h1>
          <p className="mb-8 text-lg md:text-xl">Buy stuff :D</p>
          <button className="rounded-full bg-white px-8 py-3 font-semibold text-indigo-600 shadow-lg transition hover:bg-gray-100 hover:cursor-pointer">
            Shop Now
          </button>
        </div>
      </div>

      <Footer />

      {viewingProduct && (
        <ViewProduct
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}
    </>
  );
}