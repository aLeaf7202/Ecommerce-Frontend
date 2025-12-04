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

export default function Featured() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
    },
  };

  const images = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1516035069371-36a3b8e7380b?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=1200&h=600&fit=crop",
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Featured Right Now</h2>
          <p className="text-lg text-gray-600">You Might Want to Check These Out</p>
        </div>

        <div className="relative">
          <Slider {...settings}>
            {images.map((src, index) => (
              <div key={index} className="px-2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={src}
                      alt={`Featured ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/*Dynamic Progress Bar*/}
        <div className="flex justify-center mt-8 space-x-2">
          {images.map((_, index) => (
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
      </div>
    </section>
  );
}