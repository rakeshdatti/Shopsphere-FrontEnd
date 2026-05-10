import API from "./api";


export const createOrder=(Order)=>{
    return API.post("/orders/",Order)
};




export const getOrders=()=>{
    return API.get(`/orders/my-orders`)
}