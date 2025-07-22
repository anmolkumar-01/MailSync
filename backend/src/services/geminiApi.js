import 'dotenv/config'
import { GoogleGenAI } from '@google/genai';

export const geminiAI = async(prompt)=>{

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const config = {
    responseMimeType: 'text/plain',
  };

  const model = 'gemini-2.5-pro';
  const contents = [
    {
      role: 'user',
      parts: [{text: prompt,},],
    },
  ];

  try {
      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      });
    
      const result = response.text
    
      return result
  } catch (error) {
    console.error(error)
  }

}

// export const geminiAI = async (prompt) => {

//     const ai = new GoogleGenAI({
//       apiKey: process.env.GEMINI_API_KEY,
//     });


//     const response = await ai.models.generateContentStream({
//       model: "gemini-2.5-flash",
//       contents: `${prompt}`,
//     });

//     let result = '';
//     for await (const chunk of response) {

//         const newChunks = chunk.text.split('\n').filter(Boolean);
//         // console.log("New Chunks:", newChunks);
//         // result += newChunks; // Join the chunks to form the complete response

//         for (const item of newChunks) {

//           const { type, content } = JSON.parse(item);

//           console.log("Type:", type);
//           console.log("Content:", content);

//           result += content; // Accumulate content if needed
//         }
//     }
//     return result;


// }
