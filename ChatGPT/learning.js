// this is a script meant for learning how the API works. This is functional but not meant for deployment (could be but modification needed)

// basic UI stuff
import readline from "readline"
const UsIn = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})
//

//getting configuration data
import { config } from "dotenv"
config()
//setting up chatgpt api process
import { Configuration, OpenAIApi } from "openai"
const openai = new OpenAIApi( new Configuration({
    apiKey: process.env.API_KEY
    }))

// getting prompt from input and then sending it 
UsIn.prompt()
UsIn.on("line", async input =>{
    const result = await openai
    .createChatCompletion({
        model:"gpt-3.5-turbo",
        messages:[{role:"user", content:input}]
    })

    //output response and wait for new user input
    console.log(result.data.choices[0].message.content)
    UsIn.prompt()
    
    // .then(result => {
    //     console.log(result.data.choices[0].message.content)
    // })
})

