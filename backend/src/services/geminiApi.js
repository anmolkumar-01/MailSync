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

