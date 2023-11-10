///// setup stuff

//getting configuration data
import { config } from "dotenv"
config()

//setting up chatgpt api process 
//needs to be done once
import { Configuration, OpenAIApi } from "openai"
const openai = new OpenAIApi( new Configuration({
    apiKey: process.env.API_KEY
    }))
/////



/**
 * A setup function to be called once per post/ to wipe the current context and replace it with a new context
 * @param {int} post_id the id of the post being asked about by the user (so we can give chatgpt context about the recipe etc)
 * @param {int} user_id the id of the user as we will need to update the context stored for them individually
 */
async function chatGPT_setup_call(post_id,user_id){
    // prompt engineering stuff //
    let recipe_info = pgQuery ("SELECT recipe_description,recipe_ingredients,recipe_steps FROM recipes WHERE id = $1", post_id)
    
    let context_prompt = "You are a chef talking about "+recipe_info[0]+ " with these ingredients: "+recipe_info[1]+" and these steps :"+recipe_info[2]+"."
    
    // storing the message history so we store the context, this is sent with each api request to openai
    let message_history = [{role:"system", content:context_prompt}]

    try {
        pgQuery("INSERT INTO ChatGPT_context (user_id, current_prompt_series) VALUES ("+user_id+","+message_history+")")
        // save data to postgres DB (user_id -int , message History - array), how do?

      } 
    finally {
        console.log("failed");
      }
    sendUserPrompt(context_prompt,user_id)

}


/**
 * A function to query chatgpt using the user's context, get the result and keep the context upto date
 * @param {String} prompt the prompt asked by the user clientside
 * @param {int} user_id the id of the user so we can fetch their current message history for chatgpt so it keeps context
 * @returns {String} answer the answer given by chatgpt
 */
async function sendUserPrompt(prompt,user_id){
    // data is stored as an array of strings which we now need to convert into an array of JSON objects
    string_history = pgQuery("SELECT current_prompt_series FROM ChatGPT_context WHERE id = $1",user_id)
    message_history= [] // the array to store the JSON objects
    for (let item of string_history){
        message_history.push(JSON.parse(item))
    }
    
    message_history.push({role:"user", content:prompt})
    // getting prompt from input and then sending it 

    const result = await openai
        .createChatCompletion({
            model:"gpt-3.5-turbo",
            messages:message_history
        })

        //output response in the form of a string
        answer = result.data.choices[0].message.content
        // store response given in message context and save it back to the database
        message_history.push({role:"assistant", content:answer})
        pgQuery("INSERT INTO ChatGPT_context (user_id, current_prompt_series) VALUES ("+user_id+","+message_history+")")

        return answer

    }


// sendUserPrompt("what is the value of x");
