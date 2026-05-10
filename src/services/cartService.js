import API from "./api";


export const addToCart=(product)=>{
    console.log("Adding to cart:", product);    
    return API.post("/cart/add",product)
};

export const getCart=()=>{
    return API.get("/cart")
};


export const removeFromCart=(productId)=>{
    return API.delete(`/cart/remove/${productId}`,productId)
};


export const increaseItemQuantity=(productId)=>{
    return API.put(`/cart/increase/${productId}`,productId)
}


export const decreaseItemQuantity=(productId)=>{
    return API.put(`/cart/decrease/${productId}`,productId)
}