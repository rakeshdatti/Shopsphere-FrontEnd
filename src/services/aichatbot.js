import { useState } from "react";

function Chatbot(){
    const [messages,setMessages]=useState([]);
    const [input,setInput]=useState("");

    const sendMessage=async()=>{
        const res=await fetch("http://localhost:5000/api/auth/api/chat",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({message: input})
        })

        const data=await res.json();
        setMessages([...messages,{role:"user",content: input},{role:"bot",content: data.reply}])
        setInput("")
    };

    return(
         <div className="chatbox">
            {messages.map((m, i) => (
                <div key={i} className={m.role}>
                {m.content}
                </div>
            ))}
            <input value={input} onChange={e => setInput(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
            </div>
    )

}