import OpenAI from 'openai';
import "dotenv/config"
console.log( process.env.OPENAI_API_KEY )
const openai = new OpenAI({
  apiKey : process.env.OPENAI_API_KEY
});

const runwebhook = async (inp) => {
    
    const {content} = inp;
    console.log({inp})
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content }],
        model: 'gpt-3.5-turbo',
      });
    const outp = { ...inp, response: chatCompletion.choices[0].message.content }
    console.log(outp)
    return outp;
}
export default runwebhook

//by b0gie and lanmower