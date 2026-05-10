import { useEffect,useState } from "react";
import { getProductById } from "../services/api";
import { useParams } from "react-router-dom";

export default function useProduct(){

    const {id }=useParams();
    const [Product,setProducts]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
     
    console.log("request id",id);
    
    useEffect(()=>{

        async function fetchProduct(){
            try{
                const response=await getProductById(id);
                console.log("getProductID response",response.data);
                
                setProducts(response.data);
                setLoading(false);
            }catch(error){
                setError("Failed to fetch product: " + error.message);
            }finally{
                setLoading(false);
            }
          
        }
        fetchProduct();
    },[id]);

    return {
        Product,loading,error
    }
}