import { createContext,useState,useEffect,useMemo } from "react";

export const AuthContext=createContext();

export function AuthProvider({children}){
    const [user,setUser]=useState( null);
    useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

    function login(data){

        const {token,user}=data
        localStorage.setItem("token",token)
        localStorage.setItem("user",JSON.stringify(user))

        setUser(user)
    }

    function registerUser(newUser){
        const storedUser=JSON.parse(localStorage.getItem("users")) || []

        const existingUser=storedUser.find(u => u.email===newUser.email)
        if(existingUser){
            alert("User already exists!!")
            return false;
        }

        storedUser.push(newUser)
        localStorage.setItem("users",JSON.stringify(storedUser))
        setUser(newUser)
        localStorage.setItem("user",JSON.stringify(newUser))
        return true
    }  

    function logout(){
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        setUser(null)

    }



    const value=useMemo(()=>({
        user,
        login,
        logout,
        registerUser
    }),[user])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}