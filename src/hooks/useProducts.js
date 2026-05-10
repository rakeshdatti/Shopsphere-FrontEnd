import { useEffect,useState } from "react";
import { getProducts } from "../services/api";


export default function useProducts(){
    const [Products,setProducts]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);

    useEffect(()=>{

        async function fetchProducts(){
            try{
                const response=await getProducts();
                console.log(response);
                
                setProducts(response.data);
                setLoading(false);
            }catch(error){
                setError("Failed to fetch products: " + error.message);
            }finally{
                setLoading(false);
            }
          
        }
        fetchProducts();
    },[]);

    return {
        Products,loading,error
    }
}