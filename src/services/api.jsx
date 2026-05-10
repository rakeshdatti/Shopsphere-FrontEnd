// import axios from "axios";

// const API=axios.create({
//     baseURL: "https://fakestoreapi.com"
// });

// export const getProducts=() => API.get("/products");
// export const getProductById=(id) => API.get(`/products/${id}`);

// import axios from "axios";

// export const API=axios.create({
//     // backend uses http on port 5000
//     baseURL: "/api"
// });


// API.interceptors.request.use((req) =>{
//     const token=localStorage.getItem("token");

//     if(token){
//         req.headers.Authorization= `Bearer ${token}`
//     }
//     return req
// })

// export const getProducts=() => API.get("/products");
// export const getProductById=(id) => API.get(`/products/${id}`);


// export default API

// src/services/api.jsx
import axios from "axios";

export const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/api`
        : "/api"
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);

export default API;