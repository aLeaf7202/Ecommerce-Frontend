

export default function Products() {
  return (
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
  );
}