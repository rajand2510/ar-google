
import Spline from '@splinetool/react-spline';
import { useMediaQuery } from 'react-responsive';


const Hero = () =>{
  const isMobile = useMediaQuery({ maxWidth: 767 }); // Mobile devices (max-width: 767px)

  return (
    <>
     

        {isMobile ?

          (
            <a href="#products">
          <button className='flex justify-center items-center text-[10px] px-5 py-2  hover:shadow-inner text-white rounded-2xl my-[730px]  mx-[136px] absolute  z-1  bg-green-800 bg-opacity-100 border border-white border-opacity-70 hover:bg-green-700 cursor-pointer max-md:px-5'>
            Explore Products
          </button>
          </a>) : (
            
            <a href="#products">
          <button className='flex justify-center items-center px-6 py-3  hover:shadow-inner text-white rounded-2xl mt-[610px]  ml-[200px] absolute  z-1  bg-green-800 bg-opacity-100 border border-white border-opacity-70 hover:bg-green-700 cursor-pointer max-md:px-5'>
            Explore Products
          </button>
          </a>)
        }



        {isMobile ? (
          <Spline loading="eager" scene="https://prod.spline.design/gYwJn0w264BfpUen/scene.splinecode" />
        ) : (
          <Spline loading="eager" scene="https://prod.spline.design/Lq8gdfcvLF7j66MD/scene.splinecode" />
        )}

        <section>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4e71b7e47c041381fdaa0a641f937a10d2dbe23db52c2bcdd69075ded8885ea3?apiKey=980db322e33a4a39a5052caa449e1da6&"
            alt="Decorative image"
            className="w-full border-4 mt-12 border-white border-solid aspect-[2.86] fill-[url(<path-to-image>)_lightgray_-2.592px_-164.395px_/_100.556%_130.843%_no-repeat] stroke-[4px] stroke-white"
          />
        </section>
      </>
     
      
    );
  };

      export default Hero;
