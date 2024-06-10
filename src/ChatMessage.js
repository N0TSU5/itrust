const ChatMessage = ({ message, isUser }) => (
    <div className={`chat-message ${isUser ? 'user' : 'bot'}`}>
      {message}
    </div>
  );
  
  export default ChatMessage;
  