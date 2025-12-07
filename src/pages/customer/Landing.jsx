// src/pages/customer/Landing.jsx
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Featured from "../../components/Featured";
import Card from "../../components/Card";          // <-- correct path

export default function Landing() {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------
  // 1. Load all products once
  // -------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;

        // Keep only **available** products
        const available = Object.entries(data)
          .filter(([_, p]) => p.available === 1)
          .map(([id, p]) => ({ id, ...p }));

        // Group by category
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

  // -------------------------------------------------
  // 2. Randomly pick up to 6 items from an array
  // -------------------------------------------------
  const getRandomProducts = (arr, count = 6) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // -------------------------------------------------
  // Loading UI
  // -------------------------------------------------
  if (loading) {
    return (
      <>
        <Header />
        <Featured />
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
      <Featured />

      {/* -------------------------------------------------
          Category rows – max 6 cards per row
         ------------------------------------------------- */}
      <div className="mx-auto max-w-7xl px-4 py-12 space-y-16">
        {Object.keys(products).map((category) => {
          const rowProducts = getRandomProducts(products[category], 6);

          return (
            <section key={category} className="space-y-6">
              {/* Category title – clickable look */}
              <h2 className="cursor-pointer text-3xl font-bold text-gray-800 transition-colors hover:text-indigo-600">
                {category}
              </h2>

              {/* 6-column grid (responsive) */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {rowProducts.map((p) => (
                  <Card key={p.id} productId={p.id} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* -------------------------------------------------
          Hero / welcome section
         ------------------------------------------------- */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-20 px-4 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold md:text-6xl">
            Welcome to Kenakata.com
          </h1>
          <p className="mb-8 text-lg md:text-xl">Buy stuff :D</p>
          <button className="rounded-full bg-white px-8 py-3 font-semibold text-indigo-600 shadow-lg transition hover:bg-gray-100">
            Shop Now
          </button>
        </div>
      </div>
    </>
  );
}