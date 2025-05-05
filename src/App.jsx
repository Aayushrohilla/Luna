import React, { useState, useEffect, useRef } from 'react';
import { IoMdSend } from "react-icons/io";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IoCodeSlash } from 'react-icons/io5';
import { BiPlanet } from 'react-icons/bi';
import { FaPython } from 'react-icons/fa';
import { TbMessageChatbot } from 'react-icons/tb';

const App = () => {
  const [message, setMessage] = useState("");
  const [isResponseScreen, setisResponseScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);  // Prevent multiple responses
  const messageEndRef = useRef(null); // For auto-scrolling

  const generateResponse = async (msg) => {
    if (isGeneratingResponse) return;  // Prevent generating multiple responses

    setIsGeneratingResponse(true); // Start generating response

    const genAI = new GoogleGenerativeAI("AIzaSyDevCKrfKT0rXXFc4TNktRwotUBTOzyZeo");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(msg);

    const newMessages = [
      { type: "user", text: msg },
      { type: "responseMsg", text: await result.response.text() },
    ];

    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    setMessage(""); // Clear the input field after generating the response
    setisResponseScreen(true);

    setIsGeneratingResponse(false); // End response generation
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const startNewChat = () => {
    setMessages([]);
    setMessage("");
    setisResponseScreen(false);
  };

  // Function to handle card click, updating the message and sending it
  const handleCardClick = (cardText) => {
    if (isGeneratingResponse) return; // Don't trigger if a response is already generating
    setMessage(cardText); // Update message with card text
    generateResponse(cardText); // Automatically generate response after setting the message
  };

  // Function to handle sending message on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && message.trim()) {
      generateResponse(message);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#0E0E0E] text-white">
      {isResponseScreen ? (
        <div className="h-[80vh]">
          <div className="pt-6 flex items-center justify-between w-full px-6 sm:px-10 md:px-20 lg:px-40">
            <h2 className="text-xl mt-5 font-extrabold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,0,255,0.6)] uppercase tracking-wider">
              Luna
            </h2>
            <button
              onClick={startNewChat}
              className="bg-[#181818] px-5 py-2 rounded-full text-sm cursor-pointer"
            >
              New Chat
            </button>
          </div>

          <div className="messages px-6 py-4 space-y-4 overflow-y-auto h-[60vh]">
            {messages?.length > 0 &&
              messages.reduce((acc, _, i) => {
                if (i % 2 === 0) {
                  const userMsg = messages[i];
                  const botMsg = messages[i + 1];

                  acc.push(
                    <div key={i} className="message-pair space-y-2">
                      {/* User message */}
                      <div className="w-full flex justify-end">
                        <div className="bg-purple-600 text-white p-3 rounded-2xl max-w-[70%] w-fit ml-auto shadow-md">
                          {userMsg.text}
                        </div>
                      </div>

                      {/* Bot response */}
                      <div className="w-full flex justify-start">
                        <div className="bg-[#222222] text-white p-3 rounded-2xl max-w-[70%] w-fit mr-auto shadow-md">
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
        <div className="middle h-[80vh] flex flex-col items-center justify-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,0,255,0.6)] uppercase tracking-wider">
            Luna
          </h1>
          <div className="boxes mt-[100px] flex items-center gap-4">
            <div
              className="card w-[80%] sm:w-[45%] md:w-[22%] rounded-lg cursor-pointer transition-all hover:bg-purple-500 bg-[#181818] p-5 relative min-h-[20vh]"
              onClick={() => handleCardClick('What is coding ? How we can learn it.')}
            >
              <p className='text-[18px]'>What is coding ? <br />
                How we can learn it.</p>
              <i className='absolute right-3 bottom-3 text-[18px]'><IoCodeSlash /></i>
            </div>
            <div
              className="card w-[80%] sm:w-[45%] md:w-[22%] rounded-lg cursor-pointer transition-all hover:bg-purple-500 bg-[#181818] p-5 relative min-h-[20vh]"
              onClick={() => handleCardClick('Which is the red planet of solar system?')}
            >
              <p className='text-[18px]'>Which is the red <br />
                planet of solar <br />
                system </p>
              <i className='absolute right-3 bottom-3 text-[18px]'><BiPlanet /></i>
            </div>
            <div
              className="card w-[80%] sm:w-[45%] md:w-[22%] rounded-lg cursor-pointer transition-all hover:bg-purple-500 bg-[#181818] p-5 relative min-h-[20vh]"
              onClick={() => handleCardClick('In which year python was invented?')}
            >
              <p className='text-[18px]'>In which year python <br />
                was invented ?</p>
              <i className='absolute right-3 bottom-3 text-[18px]'><FaPython /></i>
            </div>
            <div
              className="card w-[80%] sm:w-[45%] md:w-[22%] rounded-lg cursor-pointer transition-all hover:bg-purple-500 bg-[#181818] p-5 relative min-h-[20vh]"
              onClick={() => handleCardClick('How we can use AI for adoption?')}
            >
              <p className='text-[18px]'>How we can use <br />
                the AI for adopt ?</p>
              <i className='absolute right-3 bottom-3 text-[18px]'><TbMessageChatbot /></i>
            </div>
          </div>
        </div>
      )}

      <div className="bottom w-full flex flex-col items-center px-4 mb-8">
        <div className="w-full max-w-[900px] h-[60px] text-sm flex items-center bg-gray-800 rounded-xl px-4 sm:px-5">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress} // Send message on Enter key press
            type="text"
            className="bg-transparent text-white outline-none border-none flex-1 placeholder:text-gray-400"
            placeholder="Write your message here..."
            id="messageBox"
          />
          {message !== "" && (
            <i className="text-purple-500 text-xl cursor-pointer transition-all duration-300" onClick={() => generateResponse(message)}>
              <IoMdSend />
            </i>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-4 text-center px-4 sm:px-2">
          Luna is developed by Aayush Rohilla. This AI uses the Gemini API for responses.
        </p>
      </div>
    </div>
  );
};

export default App;
