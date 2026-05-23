import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import { useState } from "react";

function NextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 cursor-pointer slick-arrow slick-next transition"
      style={{ position: 'absolute', right: '-40px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
    >
      <FaArrowAltCircleRight className="text-2xl text-gray-700" />
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 cursor-pointer slick-arrow slick-prev transition"
      style={{ position: 'absolute', left: '-40px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
    >
      <FaArrowAltCircleLeft className="text-2xl text-gray-700" />
    </button>
  );
}

export default function Featured({ featuredProducts = [], onSelect }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: featuredProducts.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
    },
  };

  // Fallback to default images if no featured products are available
  const fallbackImages = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop"
  ];

  const itemsToRender = featuredProducts.length > 0
    ? featuredProducts
        .filter(p => p.featuredImage)
        .map(p => ({ src: p.featuredImage, product: p }))
    : fallbackImages.map(src => ({ src, product: null }));

  const handleSelect = (item) => {
    if (item.product && onSelect) onSelect(item.product);
  };

  return (
    <section className="py-12 bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Featured Right Now</h2>
          <p className="text-lg text-gray-600">You Might Want to Check These Out</p>
        </div>

        <div className="relative">
          {itemsToRender.length > 0 && (
            <Slider {...settings}>
              {itemsToRender.map((item, index) => {
                const clickable = !!item.product;
                return (
                  <div key={index} className="px-2">
                    <div
                      onClick={() => handleSelect(item)}
                      role={clickable ? "button" : undefined}
                      tabIndex={clickable ? 0 : -1}
                      onKeyDown={(e) => {
                        if (clickable && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          handleSelect(item);
                        }
                      }}
                      aria-label={clickable ? `View ${item.product.name}` : undefined}
                      className={`bg-white rounded-2xl shadow-xl overflow-hidden relative group ${
                        clickable ? "cursor-pointer" : ""
                      }`}
                    >
                      <div className="relative h-96 md:h-[500px] bg-linear-to-br from-gray-100 to-gray-200">
                        <img
                          src={item.src}
                          alt={`Featured ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          )}
        </div>

        {/*Dynamic Progress Bar*/}
        {itemsToRender.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {itemsToRender.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? "w-16 bg-indigo-600"
                    : index < currentSlide
                    ? "w-8 bg-indigo-400"
                    : "w-4 bg-indigo-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}