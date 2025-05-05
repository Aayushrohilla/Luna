import React, { useState, useEffect, useRef } from 'react'; import { IoMdSend } from "react-icons/io"; import { GoogleGenerativeAI } from "@google/generative-ai"; import { IoCodeSlash } from 'react-icons/io5'; import { BiPlanet } from 'react-icons/bi'; import { FaPython } from 'react-icons/fa'; import { TbMessageChatbot } from 'react-icons/tb';

const App = () => { const [message, setMessage] = useState(""); const [isResponseScreen, setisResponseScreen] = useState(false); const [messages, setMessages] = useState([]); const [isGeneratingResponse, setIsGeneratingResponse] = useState(false); const messageEndRef = useRef(null); const [isSmallScreen, setIsSmallScreen] = useState(false);

useEffect(() => { const handleResize = () => { setIsSmallScreen(window.innerWidth < 640); };

handleResize();
window.addEventListener("resize", handleResize);
return () => window.removeEventListener("resize", handleResize);

}, []);

const generateResponse = async (msg) => { if (isGeneratingResponse) return; setIsGeneratingResponse(true);

const genAI = new GoogleGenerativeAI("AIzaSyDevCKrfKT0rXXFc4TNktRwotUBTOzyZeo");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent(msg);

const newMessages = [
  { type: "user", text: msg },
  { type: "responseMsg", text: await result.response.text() },
];

setMessages((prevMessages) => [...prevMessages, ...newMessages]);
setMessage("");
setisResponseScreen(true);
setIsGeneratingResponse(false);

};

useEffect(() => { if (messageEndRef.current) { messageEndRef.current.scrollIntoView({ behavior: "smooth" }); } }, [messages]);

const startNewChat = () => { setMessages([]); setMessage(""); setisResponseScreen(false); };

const handleCardClick = (cardText) => { if (isGeneratingResponse) return; setMessage(cardText); generateResponse(cardText); };

const handleKeyPress = (e) => { if (e.key === "Enter" && message.trim()) { generateResponse(message); } };

return ( <div className="w-full min-h-screen bg-[#0E0E0E] text-white flex flex-col"> <div className="flex-grow"> {isResponseScreen ? ( <div className="flex flex-col h-full"> <div className="pt-6 flex items-center justify-between w-full px-6 sm:px-10 md:px-20 lg:px-40"> <h2 className="text-xl mt-5 font-extrabold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,0,255,0.6)] uppercase tracking-wider"> Luna </h2> <button
onClick={startNewChat}
className="bg-[#181818] px-5 py-2 rounded-full text-sm cursor-pointer"
> New Chat </button> </div>

<div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages?.length > 0 &&
            messages.reduce((acc, _, i) => {
              if (i % 2 === 0) {
                const userMsg = messages[i];
                const botMsg = messages[i + 1];
                acc.push(
                  <div key={i} className="space-y-2">
                    <div className="flex justify-end">
                      <div className="bg-purple-600 text-white p-3 rounded-2xl max-w-[70%] ml-auto shadow-md">
                        {userMsg.text}
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-[#222222] text-white p-3 rounded-2xl max-w-[70%] mr-auto shadow-md">
                        {botMsg?.text}
                      </div>
                    </div>
                  </div>
                );
              }
              return acc;
            }, [])
          }
          <div ref={messageEndRef} />
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl  font-extrabold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,0,255,0.6)] uppercase tracking-wider">
          Luna
        </h1>
        <div className="boxes mt-[100px] flex items-center gap-4 flex-wrap justify-center">
          {[{
            text: "What is coding ?\nHow we can learn it.",
            icon: <IoCodeSlash />, onClick: () => handleCardClick("What is coding ? How we can learn it."),
          }, {
            text: "Which is the red\nplanet of solar\nsystem",
            icon: <BiPlanet />, onClick: () => handleCardClick("Which is the red planet of solar system?"),
          }, {
            text: "In which year python\nwas invented ?",
            icon: <FaPython />, onClick: () => handleCardClick("In which year python was invented?"),
          }, {
            text: "How we can use\nthe AI for adopt ?",
            icon: <TbMessageChatbot />, onClick: () => handleCardClick("How we can use AI for adoption?"),
          }]
            .slice(0, isSmallScreen ? 2 : 4)
            .map((card, idx) => (
              <div
                key={idx}
                className="card w-[80%] sm:w-[45%] md:w-[22%] rounded-lg cursor-pointer transition-all hover:bg-purple-500 bg-[#181818] p-5 relative min-h-[20vh]"
                onClick={card.onClick}
              >
                <p className="text-[18px] whitespace-pre-line">{card.text}</p>
                <i className="absolute right-3 bottom-3 text-[18px]">{card.icon}</i>
              </div>
            ))}
        </div>
      </div>
    )}
  </div>

  <div className="w-full px-4 py-4 bg-[#0E0E0E]">
    <div className="w-full max-w-[900px] mx-auto h-[60px] text-sm flex items-center bg-gray-800 rounded-xl px-4 sm:px-5">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        type="text"
        className="bg-transparent text-white outline-none border-none flex-1 placeholder:text-gray-400"
        placeholder="Write your message here..."
      />
      {message !== "" && (
        <i className="text-purple-500 text-xl cursor-pointer transition-all duration-300" onClick={() => generateResponse(message)}>
          <IoMdSend />
        </i>
      )}
    </div>
    <p className="text-gray-500 text-sm mt-2 text-center px-4 sm:px-2">
      Luna is developed by Aayush Rohilla. This AI uses the Gemini API for responses.
    </p>
  </div>
</div>

); };

export default App;

