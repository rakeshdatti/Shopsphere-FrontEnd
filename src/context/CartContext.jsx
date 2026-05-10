import { createContext, useCallback, useMemo, useReducer,useEffect } from "react";
import { getCart,addToCart as addToCartAPI,removeFromCart as removeFromCartAPI,increaseItemQuantity ,decreaseItemQuantity} from "../services/cartService";
import {AuthContext} from "./AuthContext"
import { useContext } from "react";


export const cartContext = createContext();
    function cartReducer(state,action){
        switch(action.type){
            case "SET_CART":
                return action.payload;
            case "CLEAR_CART":
                return [];
            default:
                return state;
        }
}
export function CartProvider({children}){

    const [cart,dispatch]=useReducer(cartReducer,[]);
    const {user}= useContext(AuthContext)

    useEffect(()=>{
        if(user) {
            fetchCart();
        } else {
            dispatch({ type: "CLEAR_CART" });
        }
    },[user])

    async function fetchCart() {
        try{
            const res=await getCart();
            dispatch({
                type: "SET_CART",
                payload: res.data.items || res.data.CartItems || []
            })
        }catch(error){
              if (error.response?.status !== 401) {
                     console.log(error)
                }
        }
    }

    const addToCart=useCallback(async(product)=>{
        try {
            console.log("Adding to cart:", product);
            await addToCartAPI({
                productId: product.id || product._id,
                title: product.title,
                price: product.price,
                image: product.image
            });
            fetchCart();
        } catch(error) {
            console.error("Failed to add to cart:", error.message);
            throw error;
        }
    },[]);

    const removeFromCart=useCallback(async (productId)=>{
        try {
            await removeFromCartAPI(productId)
            fetchCart();
        } catch(error) {
            console.error("Failed to remove from cart:", error.message);
            throw error;
        }
    },[])
    
    const clearCart = useCallback(() => {
            dispatch({ type: "CLEAR_CART" });
    }, []);

    const increaseQuantity=useCallback(async (id)=>{
        try {
            await increaseItemQuantity(id)
            fetchCart();
        } catch(error) {
            console.error("Failed to increase quantity:", error.message);
            throw error;
        }
    },[])

     const decreaseQuantity=useCallback(async (id)=>{
        try {
            await decreaseItemQuantity(id)
            fetchCart();
        } catch(error) {
            console.error("Failed to decrease quantity:", error.message);
            throw error;
        }
    },[])
    

  
    //optimize context value using useMemo and compute derived totals here
    const value = useMemo(() => {
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
        const totalPrice = cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);

        return {
            cart,
            addToCart,
            removeFromCart,
            increaseQuantity,
            decreaseQuantity,
            totalItems,
            totalPrice,
            clearCart
        };
    }, [cart,addToCart,removeFromCart,increaseQuantity,decreaseQuantity,clearCart]);


    return(
        <cartContext.Provider value={value}>
            {children}
        </cartContext.Provider>
    )

}