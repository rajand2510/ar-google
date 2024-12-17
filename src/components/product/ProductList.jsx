import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../../CartContext'; 
import apiService from "../api/apiService";
import {jwtDecode} from 'jwt-decode';


const ProductCard = ({ gltfPath, title, discription, price, positionY, initialScale, _id, imgsrc }) => {
  const { updateCartItems } = useCart(); 
  
  const handleAddToCart = async () => {
    const tokenhandle = localStorage.getItem('token');
  
    if (tokenhandle) {
      try {
        const decoded = jwtDecode(tokenhandle);
        const cartitemId = _id;
        const userId = decoded.id;

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
        } else {
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
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light"
            });
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
            updateCartItems(data.newCartCount);
          }
        }
      } catch (error) {
        toast.error('An unexpected error occurred. Please try again later.', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light"
        });
      }
    } else {
      toast.info('To add an item to the cart, please log in first', {
        position: "top-right",
        autoClose: 2000,
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
    <div className="flex flex-col px-5 pt-5 pb-5 mx-[15px] my-[20px] bg-white shadow-2xl max-w-[380px] max-h-[480px] rounded-[25px]">
      <Link to={`/products?gltfPath=${gltfPath}&title=${title}&discription=${discription}&price=${price}&positionY=${positionY}&initialScale=${initialScale}&imgsrc=${imgsrc}&_id=${_id}`}>
        <div className="shrink-0 rounded-[20px] bg-zinc-300 h-[282px]">
          <img src={imgsrc} alt={title} className="rounded-[15px] h-[282px] w-[400px]" />
        </div>
      </Link>
      <div className="flex gap-0.5 items-start mt-10">
        <div className="flex flex-col grow self-start w-fit">
          <h2 className="text-base text-black truncate max-w-[270px] overflow-hidden">{title}</h2>
          <div className="flex gap-8 mt-7 font-bold">
            <p className="my-auto text-xl text-black">Rs.{price}</p>
            <button
              className="flex gap-1.0 px-2.5 py-1.5 text-sm text-white rounded-xl bg-neutral-700 hover:bg-neutral-800"
              style={{ minWidth: '100px' }}
              onClick={handleAddToCart}
            >
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/20da946bd58526d190052f874a3f98dcc8106b31f9cfef97cd2fdf5721a63f2b?apiKey=980db322e33a4a39a5052caa449e1da6&"
                alt=""
                className="shrink-0 aspect-[0.79] w-[15px]"
              />
              <span className="flex-auto my-auto">ADD TO CART</span>
            </button>
          </div>
        </div>
        <div className="self-end mt-11">
          <Link to={`/xr?gltfPath=${gltfPath}`}>
            <button className="flex justify-center items-center px-0.5 rounded-full bg-zinc-300 h-[35px] w-[35px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c3953c11395d39a267a119923443e4f991c370c2e178305152ef11e99f79d659?apiKey=980db322e33a4a39a5052caa449e1da6&"
                alt="AR View"
                className="aspect-square w-[31px]"
              />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 769px) and (max-width: 1024px)" });

  let gridCols = "grid-cols-4";
  if (isMobile) {
    gridCols = "grid-cols-1";
  } else if (isTablet) {
    gridCols = "grid-cols-2";
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await apiService.fetchProducts();
        setProducts(productsData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handlePriceFilterChange = (event) => {
    setPriceFilter(event.target.value);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredProducts = products.filter((product) => {
    if (searchTerm) {
      return product.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  if (priceFilter === "Low to high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (priceFilter === "High to low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="mt-10" id="products">
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
      <div className="flex justify-center">
        <p className="text-[40px] font-bold text-green-950">Our Products</p>
      </div>
      <div className="flex flex-col mt-[20px] md:flex-row justify-between items-center mb-5 px-5 space-y-4 md:space-y-0 md:space-x-4">
        <select
          className="px-4 py-2 w-full md:w-auto text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-950"
          value={priceFilter}
          onChange={handlePriceFilterChange}
        >
          <option value="">Filter by Price</option>
          <option value="Low to high">Low to high</option>
          <option value="High to low">High to low</option>
        </select>
      </div>
      <div className={`grid ${gridCols} gap-y-5`}>
        {currentProducts.map((product) => (
          <ProductCard
            key={product._id}
            title={product.title}
            price={product.price}
            gltfPath={product.gltfPath}
            initialScale={product.initialScale}
            positionY={product.positionY}
            discription={product.discription}
            _id={product._id}
            imgsrc={product.imgsrc}
          />
        ))}
      </div>
      <div className="flex justify-center px-1 mb-3 mt-5">
        {currentPage > 1 && (
          <button
            onClick={() => paginate(currentPage - 1)}
            className="px-4 mx-1 py-2 bg-gray-200 text-black rounded-lg"
          >
            Previous
          </button>
        )}
        <button
          className="px-4 mx-1 py-2 bg-green-900 text-white rounded-lg cursor-default"
        >
          {currentPage}
        </button>
        {currentPage < Math.ceil(products.length / productsPerPage) && (
          <button
            onClick={() => paginate(currentPage + 1)}
            className="px-4 mx-1 py-2 bg-gray-200 text-black rounded-lg"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductList;
