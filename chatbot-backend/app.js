const { createChat} = require("completions");
const dotenv = require("dotenv");

dotenv.config();
let key = process.env.WEATHER_KEY
const chat = createChat({
    apiKey:`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`,
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
          let res_single = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}&units=metric&sys=unix`);
              let data= await res_single.json();
            return {
              location: data.name, //weather api
              temperature: data.main.temp,  //weather api
              unit: "celsius",
            };
        },
      },
    ],
    functionCall: "auto",
  });
async function main(){
  const response = await chat.sendMessage("What is the weather in Delhi?");
  console.log(response.content);
}
main();