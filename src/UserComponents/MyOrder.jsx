import  { useEffect, useState } from "react";
import axios from "axios";
import {Navigate} from 'react-router-dom'
import { jwtDecode } from "jwt-decode"; 
import Navbar from "../components/homecontainer/Navbar";
import Footer from "../components/homecontainer/Footer"
const OrderItem = ({ imgsrc, title, quantity, price }) => {

  
console.log(imgsrc);

  return(
  <div className="flex gap-5 py-2.5 pr-20 pl-3.5 mt-3.5 rounded-3xl bg-zinc-100 max-md:flex-wrap max-md:pr-5">
    <img src={imgsrc} alt={title} className="shrink-0 w-24 rounded-2xl bg-stone-300 h-[88px]" />
    <div className="flex flex-col grow shrink-0 my-auto basis-0 w-fit">
      <h3 className=" overflow-y-hidden h-6">{title}</h3>
      <div className="flex gap-5 justify-between mt-8">
        <p className="px-6">Qty: {quantity}</p>
        <p className="max-sm:mr-11">Rs.{price *quantity}</p>
      </div>
    </div>
  </div>
  )
}

const OrderSummary = ({ orderId, orderItems }) => {
  const totalPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <article className="flex flex-col px-7 pt-8 pb-5 mx-4 mt-7 text-lg font-semibold text-justify text-black bg-white rounded-3xl shadow-xl max-md:px-5 max-md:max-w-full">
      <h2 className="self-start ml-6 text-xl text-neutral-500 max-md:ml-2.5">
        #OrderId {orderId}
      </h2>
      <ul className="list-none mt-5 mb-7 max-sm:overflow-y-auto">
        {orderItems.map((item, index) => (
          <OrderItem key={index} {...item} />
        ))}
      </ul>
      <p className="self-end mt-7 mr-11 max-md:mr-2.5">Total Rs.{totalPrice}</p>
    </article>
  );
};

const MyComponent = () => {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/pagenotfound" replace />
  }

  const decoded = jwtDecode(token);
  const userId = decoded.id;


  useEffect(() => {
    const fetchOrders = async () => {
      try {

        
        const response = await axios.get(`https://room-craft-api.vercel.app/api/ordered/myordered?userId=${userId}`);
        const orders = response.data;

        // Group orders by orderId
        const grouped = orders.reduce((acc, order) => {
          if (!acc[order.orderId]) {
            acc[order.orderId] = [];
          }
          acc[order.orderId].push(order);
          return acc;
        }, {});

        setGroupedOrders(grouped);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  
  useEffect(() => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found in localStorage');
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

if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-gray-900"></div>
    </div>
  );
}
  return (
    <>
    <Navbar />
    <main className="flex gap-5 mt-36 mb-5 max-md:flex-col max-md:gap-0">
      <section className="flex flex-col w-6/12  max-md:ml-0   max-md:w-[345px]">
        <div className="flex flex-col grow mt-1 mr-4 max-md:mt-10 max-md:max-w-full">
          <article className="flex flex-col px-6 pt-14 ml-8 pb-6 w-full bg-white rounded-3xl shadow-xl max-md:px-5 max-md:mt-10 max-md:max-w-full">
            <h2 className="self-center text-2xl font-bold text-justify text-black">
              Profile Details
            </h2>
            <div className="flex flex-col items-start py-11 pr-20 pl-10 mt-12 text-lg font-semibold bg-white rounded-3xl border-2 border-solid border-zinc-300 text-neutral-400 max-md:px-5 max-md:mt-10 max-md:max-w-full">
              <h3 className="text-justify">Name</h3>
              <p className="mt-3 text-base text-zinc-600">{user.name}</p>
              <h3 className="mt-3 text-justify">Email</h3>
              <p className="mt-4 text-base text-zinc-600">{user.email}</p>
              <h3 className="mt-3 text-justify">Contact</h3>
              <p className="mt-4 text-base text-zinc-600">+91 {user.mobile}</p>
            </div>
          </article>
        </div>
      </section>
      <section className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
        {Object.keys(groupedOrders).reverse().map((orderId) => (
          <OrderSummary key={orderId} orderId={orderId} orderItems={groupedOrders[orderId]} />
        ))}
      </section>
    </main>
    <Footer />
    </>
  );
}

export default MyComponent;
