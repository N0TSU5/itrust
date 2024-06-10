import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import './ChatApp.css'; // Add CSS file for styling (optional)
import ChatMessage from './ChatMessage';

const apiKey = 'YOUR_GEMINI_API_KEY'; // Replace with your API key
const model = new GoogleGenerativeAI("");

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const ChatApp = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [chatSession, setChatSession] = useState(null);

  useEffect(() => {
    const initChatSession = async () => {
      const newModel = await model.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are a helpful customer assistant, embedded onto Lloyd's Banking Group's (LBG) banking website. Your role is to aid users in giving trusted access of their bank account to other users. This is done by filling in the online form which is next to the chat interface. \n\nLBG has a duty to ensure customers have means to be supported by a third party with their finances. Customers in a range of circumstances may need support with their banking from a trusted other, friend or family member. This could range from parents keeping an eye on their teenagers account to full access due to a loss of mental capacity. Access requirements could be temporary or permanent. Access can be given to specific accounts/cards.\n\nHere are the levels of acces:\nPOWER OF ATTORNEY (POA)\nA legal agreement allowing someone to have full access and look after your financial affairs.\n\nTHIRD PARTY MANDATE\nA formal instruction allowing access to some or all of a customer's accounts via branch or over the phone.\n\nTRUSTED PERSON CARD\nLinked debit card for small\nspending/cash withdrawals\n\nTRUSTED PERSON ALERTS\nLimited high-\nlevel info, no transactions\n\nThe target user is someone who is elderly or mentally challenged. Keep your answers short and simple. Make sure that you are helpful.",

      });
      const newChatSession = newModel.startChat({ generationConfig });
      setChatSession(newChatSession);
    };
    initChatSession();
  }, []);

  const sendMessage = async () => {
    if (!chatSession) return;

    const message = `Here is the user query: ${userInput}`;
    const result = await chatSession.sendMessage(message);

    setChatHistory([...chatHistory, { message, isUser: true }]);
    setChatHistory([...chatHistory, { message: result.response.text(), isUser: false }]);
    setUserInput('');
  };

  return (
    <div className="chat-app">
      <ul className="chat-history">
        {chatHistory.map((message, index) => (
          <ChatMessage key={index} message={message.message} isUser={message.isUser} />
        ))}
      </ul>
      <div className="chat-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatApp;
