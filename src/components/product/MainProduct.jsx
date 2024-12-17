import { useState, useEffect, useRef } from "react";
import Footer from "../homecontainer/Footer";
import Navbar from "../homecontainer/Navbar";
import { useMediaQuery } from "react-responsive";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Link, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../../CartContext'; 





const ProductCard = ({ gltfPath, positionY, initialScale }) => {
  const controlsRef = useRef();
  const [model, setModel] = useState(null);
  const [loadModelError, setLoadModelError] = useState(null);

  useEffect(() => {
    if (!gltfPath) {
      console.error('No GLTF path provided');
      setLoadModelError(new Error('No GLTF path provided'));
      return;
    }

    console.log('GLTF Path:', gltfPath);
    
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    // Point to the Draco decoder files in your public directory
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(gltfPath, (gltf) => {
      console.log('Model loaded:', gltf);
      const scene = gltf.scene;
      scene.scale.set(initialScale, initialScale, initialScale);
      scene.position.y = positionY;
      setModel(scene);
    }, (xhr) => {
      console.log('Model loading progress:', xhr.loaded, xhr.total);
    }, (error) => {
      console.error('Error loading model:', error);
      setLoadModelError(error);
    });

    // Clean up the DRACOLoader after use
    return () => {
      dracoLoader.dispose();
    };
  }, [gltfPath, initialScale, positionY]);
  if (loadModelError) {
    return <div>Error loading model: {loadModelError.message}</div>;
  }

  return (
    <div className="flex flex-col mx-[15px] my-[20px] bg-white shadow-lg max-w-[380px] max-h-[480px] rounded-[25px]">
        { toast.isOpen && 
         <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />}
      <div className="shrink-0 rounded-[20px] bg-zinc-300 h-[320px]">
        <Canvas
          className="product-canvas rounded-[15px]"
          camera={{ position: [0, 0, 5] }}
          gl={{ alpha: true }}
          style={{ background: 'linear-gradient(to bottom, #cfd9df, #e2ebf0)' }}
        >
          <ambientLight intensity={0.5} color="#ffffff" />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <OrbitControls ref={controlsRef} />
          {model && <primitive object={model} />}
        </Canvas>
      </div>
    </div>
  );
};

const AddToCartButton = () => {
  const { updateCartItems } = useCart(); 
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const title = params.get('title');
  const price = params.get('price');
  const imgsrc =params.get('imgsrc');
  const _id =params.get('_id');

  const handleAddToCart = async () => {
    const tokenhandle = localStorage.getItem('token');
  
    if (tokenhandle) {
      try {
        const decoded = jwtDecode(tokenhandle);
        const cartitemId = _id; // Get the _id of the product
        const userId = decoded.id; // Get the ID of the logged-in user

        console.log(cartitemId);
  
        // Check if the product is already in the cart for the logged-in user
        const response = await fetch(`https://room-craft-api.vercel.app/api/cart/cartlist?userId=${userId}&cartitemId=${cartitemId}`);
        const data = await response.json();
  
        if (data.length > 0) {
          toast.info('You already have this product in your cart.', {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
          });
          console.log('Duplicate item in cart');
        } else {
          // If the product is not in the cart, send a POST request to add it
          const orderData = {
            userId: decoded.id,
            title,
            imgsrc,
            price,
            quantity: 1,
            isorder: false,
            cartitemId: _id
          };
  
          const addCartResponse = await fetch('https://room-craft-api.vercel.app/api/cart/addcart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
          });
  
          if (!addCartResponse.ok) {
            const errorData = await addCartResponse.json();
            toast.error('An error occurred while adding to cart:', {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light"
            });
            console.error('Error adding item to cart:', errorData.message);
          } else {
            toast.success('Item added to cart successfully', {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: "light",
            });
            console.log('Item added to cart successfully');
            updateCartItems(data.newCartCount);
          }
        }
      } catch (error) {
        console.error('Error adding item to cart:', error);
        toast.error('An unexpected error occurred. Please try again later.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light"
        });
      }
    } else {
      toast.info('Login to add item to cart', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
    }
};

  return (
    <button className="flex gap-1 px-5 w-2/12 py-1.5 mt-7 text-base font-bold text-justify text-white bg-black rounded-3xl"
     onClick={handleAddToCart}
    >
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/5e55fa33744fd7794ef2a1b0f03402a432c0dd4869c54a3a6f18449249ad8afe?apiKey=980db322e33a4a39a5052caa449e1da6&"
        alt=""
        className="shrink-0 w-6 aspect-square"
      />
    </button>
  );
};

const ProductDetails = ({ title, discription, price, gltfPath }) => {
  return (
    <section className="flex flex-col self-stretch mt-4 my-auto">
      <h1 className="text-3xl font-medium text-justify text-black">{title}</h1>
      <p className="mt-3 text-lg text-black">{discription}</p>
      <p className="mt-4 text-3xl font-bold text-justify text-black">Rs.{price}</p>
      <AddToCartButton />
      
      <div className="">
        <Link to={`/xr?gltfPath=${gltfPath}`}>
          <button className="flex justify-center items-center px-2.5 mt-5 rounded-full bg-zinc-300 h-[60px] w-[60px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/76818322c020459bceba6ecfcc5cbe9a4fb051cb7292cb581d6abfdba2ec72cd?apiKey=980db322e33a4a39a5052caa449e1da6&"
              alt=""
              className="w-full aspect-square"
            />
          </button>
        </Link>
      </div>
    </section>
  );
};

const MainProduct = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const gltfPath = params.get('gltfPath');
  const title = params.get('title');
  const discription = params.get('discription');
  const price = params.get('price');
  const positionY = params.get('positionY');
  const initialScale = params.get('initialScale');
  const imgsrc = params.get('imgsrc');

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const _id = decoded.id;

        fetch(`https://room-craft-api.vercel.app/api/person/users/${_id}`)
          .then(response => response.json())
          .then(data => {
            setUser(data.user);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
            setLoading(false);
          });
      } catch (error) {
        console.error("Error decoding token:", error.message);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  useEffect(() => {
     {
      window.scrollTo(0, 0);
    }
  });
  return (
    <>
      <Navbar />
      <div
        className={`px-4 py-8    ${isMobile ? "mt-[15px]" : "mt-[150px]"} mb-20   bg-white rounded-3xl shadow-xl ${
          isMobile ? "max-w-full" : "max-w-[898px] mx-auto"
        }`}
      >
        <div className={`flex gap-5 ${isMobile ? "flex-col" : "flex-row"}`}>
          <div className={`flex flex-col w-full ${isMobile ? "-mb-6" : "w-1/2"}`}>
            <ProductCard
              gltfPath={gltfPath}
              positionY={positionY}
              initialScale={initialScale}
            />
          </div>
          <div className={`flex flex-col w-full ${isMobile ? "" : "w-1/2"}`}>
            <ProductDetails
              title={title}
              discription={discription}
              price={price}
              gltfPath={gltfPath}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MainProduct;