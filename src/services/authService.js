import API from "./api";

export const registerUser=async(data)=>{
    const res=await API.post("/auth/register",data)
    return res;
};


export const loginUser=async(data)=>{
    const res=await API.post("/auth/login",data)
    return res
}


export const forgotPassword=async (email)=>{
    const res=await API.post("/auth/forgot-password",{email})
    return res;
}

export const resetPassword=async (token,password)=>{
    const res=await API.post(`/auth/reset-password/${token}`,{password})
    return res;
}

