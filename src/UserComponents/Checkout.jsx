import Navbar from "../components/homecontainer/Navbar";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; 
import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';     
import { v4 as uuid } from "uuid";
import { useNavigate } from 'react-router-dom';



const ProductCard = ({ _id, imgsrc, title, price, onDelete, quantity, onQuantityChange }) => {
    const [localQuantity, setLocalQuantity] = useState(quantity);

    const handleDecrementQuantity = () => {
        if (localQuantity > 1) {
            const newQuantity = localQuantity - 1;
            const params = new URLSearchParams({
                _id: _id,
                quantity: newQuantity
            });
            const url = `https://room-craft-api.vercel.app/api/cart/quntityput?${params.toString()}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        setLocalQuantity(newQuantity);
                        onQuantityChange(_id, newQuantity);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const handleIncrementQuantity = () => {
        if (localQuantity < 5) {
            const newQuantity = localQuantity + 1;
            const params = new URLSearchParams({
                _id: _id,
                quantity: newQuantity
            });
            const url = `https://room-craft-api.vercel.app/api/cart/quntityput?${params.toString()}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        setLocalQuantity(newQuantity);
                        onQuantityChange(_id, newQuantity);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    return (
        <article className="py-4 pr-16 mb-6 pl-4 bg-white rounded-3xl w-[450px] shadow-xl max-md:pr-5 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                <div className="flex flex-col w-[50%] max-md:ml-0 max-md:w-full">
                    <img src={imgsrc} alt={title} className="shrink-0 mx-auto rounded-3xl bg-stone-300 h-[167px] w-[202px] max-md:mt-10" />
                </div>
                <div className="flex flex-col ml-5 w-[37%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col self-stretch my-auto text-justify text-black whitespace-nowrap max-md:mt-10">
                        <div className="flex gap-5 justify-between px-px text-[16px] font-medium">
                            <h3 className="self-start overflow-hidden text-ellipsis">{title}</h3>
                        </div>
                        <div className="mt-2 text-[15px] font-bold">Rs.{localQuantity * price}</div>
                        <div className="flex mt-3 mr-4 items-center">
                            <button
                                className="py-1 bg-black text-white rounded-full w-8 h-8"
                                onClick={handleDecrementQuantity}
                            >
                                -
                            </button>
                            <span className="px-2 py-1 rounded-full">{localQuantity}</span>
                            <button
                                className="px-2 py-1 bg-black text-white rounded-full w-8 h-8"
                                onClick={handleIncrementQuantity}
                            >
                                +
                            </button>
                            <button
                                aria-label="Add to favorites"
                                className="shrink-0 aspect-[0.74] ml-[10px] w-[25px]"
                                onClick={onDelete}
                            >
                                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/f99db9daf3009b6cc16a764fa43d574f8d4b96e061372877fe25077269a3cff4?apiKey=980db322e33a4a39a5052caa449e1da6&" alt="" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

const Checkout = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const { updateCartItems } = useCart();
    const navigate = useNavigate();
    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return <Navigate to="/pagenotfound" replace />
              }

            const decoded = jwtDecode(token);
            const userId = decoded.id;

            axios.get(`https://room-craft-api.vercel.app/api/person/users/${userId}`)
                .then(response => {
                    const userData = response.data.user;
                    setUser({
                        name: userData.name,
                        email: userData.email,
                        address: userData.address,
                        mobile: userData.mobile
                    });
                    setLoading(false);

                    axios.get(`https://room-craft-api.vercel.app/api/cart/checkout`, {
                        params: { userId: userId }
                    })
                        .then(response => {
                            setProducts(response.data);
                        })
                        .catch(error => {
                            setError(error);
                        });
                })
                .catch(error => {
                    setError(error);
                    setLoading(false);
                });
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }, []);

    const handleDeleteProduct = async (productId) => {
        try {
            const response = await axios.delete(`https://room-craft-api.vercel.app/api/cart/cartdelete`, {
                params: { _id: productId }
            });
            if (response.status === 200) {
                setProducts(products.filter((product) => product._id !== productId));
                updateCartItems(response.data.newCartCount);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        setProducts(products.map(product =>
            product._id === productId ? { ...product, quantity: newQuantity } : product
        ));
    };

    const totalprice = products.reduce((acc, current) => acc + (current.price * current.quantity), 0);

    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-gray-900"></div>
          </div>
        );
      }

    if (error) {
        return <div>Error: {error.message}</div>;
    }


    const loadRazorpay = () => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };
    
      const handlePayment = async () => {
        try {
          await loadRazorpay();
          const response = await axios.post('https://room-craft-api.vercel.app/createOrder', {
            amount: totalprice, // Convert to smallest currency unit (in paise for INR)
            currency: 'INR',
            receipt: 'receipt#1',
          });
    
          const { id, amount, currency } = response.data;
    
          const options = {
            key: 'rzp_test_AfONR4lsl3UPRI', // Replace with your actual Razorpay key
            amount,
            currency,
            order_id: id,
            name: 'RoomCraft',
            description: 'Test Transaction',
            image: 'https://i.ibb.co/7Q2cbvB/Screenshot-2024-07-03-221223.png',
            handler: function (response) {
              // Payment success callback
              const token = localStorage.getItem('token');
              if (!token) {
                console.error('No token found');
                return;
              }
    
              // Decode token to get user ID
              const decoded = jwtDecode(token);
              const userId = decoded.id;
    
              const unique_id = uuid();
              const orderId = unique_id.slice(0, 23);
    
              const productsData = products.map((product) => ({
                userId: userId,
                title: product.title,
                imgsrc: product.imgsrc,
                price: product.price,
                quantity: product.quantity,
                orderId,
              }));
    
              console.log(productsData);
    
              // Perform API call to place order with productsData
              axios.post(`https://room-craft-api.vercel.app/api/ordered/orderitem`, productsData)
                .then((response) => {
                  if (response.status === 200) {
                    // Payment successful, update cart and redirect to success page
                  
                  
                    products.forEach(product => {
                        handleDeleteProduct(product._id);
                      });
                      navigate('/myorder');
                    updateCartItems(0);
                    setTimeout(() => {
                      toast.success('Ordered Successfully.', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light"
                      });
                    }, 2000);
                  
          
                  } else {
                    // Payment failed, show error message
                    alert(`Payment failed: ${response.statusText}`);
                  }
                })
                .catch((error) => {
                  console.error(error);
                  alert(`Payment failed: ${error.message}`);
                });
            },
            prefill: {
              name: 'John Doe',
              email: 'john.doe@example.com',
              contact: '9999999999',
            },
            notes: {
              address: 'RoomCraft Corporate Office',
            },
            theme: {
              color: '#3399cc',
            },
          };
    
          const rzp1 = new window.Razorpay(options);
    
          rzp1.on('payment.failed', function (response) {
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
          });
    
          rzp1.open();
    
        } catch (error) {
          console.error('Error while loading Razorpay or creating order:', error);
        }
      };



    return (
        <>
            <Navbar />
            <main>
            <ToastContainer/>
                <div className="flex gap-5 mt-20 ml-28 height max-md:ml-0 max-md:flex-col max-md:gap-0">
                    <section className="flex flex-col w-5/12 h-full max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col grow px-5 pt-14 pb-7 w-full bg-white rounded-3xl shadow-2xl max-md:pl-5 max-md:mt-10 max-md:max-w-full">
                            <h1 className="self-center text-2xl font-bold text-justify text-black">
                                Check Out
                            </h1>
                            <div className="flex flex-col items-start pt-8 pr-20 pb-16 pl-9 mt-6 text-lg font-semibold bg-white rounded-3xl border-2 border-solid border-stone-300 text-neutral-400 max-md:px-5 max-md:max-w-full">
                                <h2 className="text-xl font-bold text-justify text-black">
                                    Shipping address
                                </h2>
                                <p className="mt-5 text-justify">Name</p>
                                <p className="mt-3 text-base text-zinc-600">
                                    {user.name}
                                </p>
                                <p className="mt-6 text-justify">Address</p>
                                <address className="mt-3 text-base text-zinc-600">
                                    {user.address}
                                </address>
                                <p className="mt-5 text-justify">Email Id</p>
                                <p className="mt-4 text-base text-zinc-600">
                                    {user.email}
                                </p>
                                <p className="mt-5 text-justify">Mobile No.</p>
                                <p className="mt-4 text-base text-zinc-600">
                                    {user.mobile}
                                </p>
                            </div>
                            <div className="flex flex-col px-9 py-9 mt-3.5 rounded-3xl bg-zinc-100 max-md:px-5 max-md:max-w-full">
                                <div className="flex gap-5 justify-between text-xl text-black">
                                    <div className="flex flex-col text-justify">
                                        <h3 className="font-bold">Order Summary</h3>
                                        <p className="mt-7 font-semibold">Total</p>
                                    </div>
                                    <p className="self-end mt-12 font-semibold text-right max-md:mt-10">
                                        Rs.{totalprice}
                                    </p>
                                </div>
                                <button
                                    className="justify-center items-center px-16 py-4 mt-10 text-2xl font-bold text-center text-white bg-green-800 rounded-3xl max-md:px-5"
                                    onClick={handlePayment}
                                >
                                    Pay Rs.{totalprice}
                                </button>
                            </div>
                        </div>
                    </section>
                    <aside className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col pl-10 pr-10 mt-28 max-md:mt-10 max-md:max-w-full">
                            {products.length === 0 ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 ml-[75px] w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <h2 className="text-2xl font-bold text-gray-500">Your cart is empty</h2>
                                        <p className="text-lg text-gray-400">Add some items to get started</p>
                                        <Link to={`/`}>
                                            <button className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                                Start Shopping
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                products.map((product, index) => (
                                    <ProductCard
                                        key={index}
                                        _id={product._id}
                                        imgsrc={product.imgsrc}
                                        title={product.title}
                                        price={product.price}
                                        quantity={product.quantity}
                                        onDelete={() => handleDeleteProduct(product._id)}
                                        onQuantityChange={handleQuantityChange}
                                    />
                                ))
                            )}
                        </div>
                    </aside>
                </div>
            </main>
        </>
    );
};

export default Checkout;