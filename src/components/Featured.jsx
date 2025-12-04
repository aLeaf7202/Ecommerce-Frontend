import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function Featured() {
    var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      <div className="h-20 bg-gray-200 flex items-center justify-center">
        <h3 className=" text-4xl text-center">1</h3>
      </div>
      <div className="h-20 bg-gray-200 flex items-center justify-center">
        <h3 className=" text-4xl text-center">2</h3>
      </div>
      <div className="h-20 bg-gray-200 flex items-center justify-center">
        <h3 className=" text-4xl text-center">3</h3>
      </div>
      <div className="h-20 bg-gray-200 flex items-center justify-center">
        <h3 className=" text-4xl text-center">4</h3>
      </div>
      <div className="h-20 bg-gray-200 flex items-center justify-center">
        <h3 className=" text-4xl text-center">5</h3>
      </div>
      <div className="h-20 bg-gray-200 flex items-center justify-center">
        <h3 className=" text-4xl text-center">6</h3>
      </div>
    </Slider>
  );
}