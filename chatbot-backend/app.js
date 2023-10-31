const { createChat } = require("completions");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 4005;

dotenv.config();
let key = process.env.WEATHER_KEY;
const chat = createChat({
  apiKey: process.env.OPEN_API_KEY,
  model: "gpt-3.5-turbo-0613",
  functions: [
    {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
      function: async ({ location }) => {
        let res_single = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}&units=metric&sys=unix`
        );
        let data = await res_single.json();
        return {
          location: data.name,
          temperature: data.main.temp,
          unit: "celsius",
        };
      },
    },
  ],
  functionCall: "auto",
});

async function main() {
  const startChat = async (req, res, next) => {
    try {
      const { message } = req.body;
      const response = await chat.sendMessage(message);
      console.log(response.content);
      res.status(200).json({
        bot: response.content,
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
    next();
  };

  // Use app.post() for your /chat endpoint
  app.post("/chat", startChat);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main();
