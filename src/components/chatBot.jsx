import React, { useState } from "react";
import "../styles/ai.css";
function chatBot(){
    const [messages,setMessages]= useState([]);
    const [input,setInput]= useState("")
    const [loading,setLoading]= useState(false)



    const sendMessage=async()=>{
        if(!input.trim()) return;
        
        const useMsg={role:"user",content: input}
        setMessages(prev => [...prev,useMsg])
        setLoading(true)

        try{
            const res=await fetch("http://localhost:5000/api/auth/api/chat",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({message: input})
            })

            const data=await res.json();
            const botMsg={role:"bot",content: data.reply}
            setMessages(prev => [...prev,botMsg])
            
        }catch(err){
            setMessages(prev => [...prev,{role:"bot",content: "Sorry, something went wrong!"}])
        }
        setInput("")
        setLoading(false)
    }

    return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={m.role}>
            {m.text}
          </div>
        ))}
        {loading && <div className="bot">Typing...</div>}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about products..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default chatBot;