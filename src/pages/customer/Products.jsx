import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import Header from "../../components/Header";

export default function Products() {
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);

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



  return (
    <div>
        <Header />
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
                  <Card key={p.id} productId={p.id} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
      </div>
  );
}