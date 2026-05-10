import { createContext, useState, useMemo } from "react";
import { createOrder as createOrderAPI,getOrders } from "../services/orderService";
import { useCallback } from "react";
import { useContext } from "react";
import { cartContext } from "./CartContext";
import { useEffect } from "react";
import { AuthContext } from "./AuthContext";
export const OrderContext = createContext();

export function OrderProvider({ children }) {

  const [orders, setOrders] = useState([]);
  const {cart,clearCart}=useContext(cartContext)
  const {user}=useContext(AuthContext)


  useEffect(()=>{
    async function fetchOrders() {
      try{
        const res=await getOrders();
        setOrders(res.data || []);
      }catch(e){
        console.log("Failed to fetch orderes",e.message)
        throw e
      }
    }
    if(user) {
      fetchOrders();
    }
  },[user]);
  
  console.log("cart",cart)
  const placeOrder=useCallback(async({shippingAddress,paymentMethod})=>{
    try{
      const payload={
        items: cart,
        total: cart.reduce((sum,item)=> sum+item.price*item.quantity,0),
        shippingAddress,
        paymentMethod: paymentMethod
      }
      const res=await createOrderAPI(payload);
      setOrders(prev => [...prev,res.data])
      clearCart();
    }catch(e){
      console.error("Failed to create order:", e.message);
      throw e;
    }
  },[cart,clearCart])

  const value = useMemo(() => ({
        orders,
        placeOrder,
    }), [orders,placeOrder]);

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}