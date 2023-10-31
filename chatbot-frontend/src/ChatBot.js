import React, { useState } from 'react';
import { Box, Input, Button, VStack, Text } from '@chakra-ui/react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;


    setMessages([...messages, { text: newMessage, user: 'user' }]);
    setNewMessage('');

  
    fetch('http://localhost:4005/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: newMessage }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the chatbot's response to the messages state
        setMessages([...messages, { text: data.bot, user: 'chatbot' }]);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <VStack spacing={4} p={4} align="stretch">
      <Box
        h="400px"
        overflowY="auto"
        border="1px solid #ccc"
        borderRadius="md"
        p={2}
        bgColor="white"
      >
        {messages.map((message, index) => (
          <Text
            key={index}
            alignSelf={message.user === 'user' ? 'flex-end' : 'flex-start'}
            p={2}
            bg={message.user === 'user' ? 'teal.200' : 'gray.200'}
            borderRadius="lg"
          >
            {message.text}
          </Text>
        ))}
      </Box>
      <Input
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <Button colorScheme="teal" onClick={handleSendMessage}>
        Send
      </Button>
    </VStack>
  );
};

export default Chatbot;
