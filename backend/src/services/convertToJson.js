
export const convertToJson = async(data) => {

    try {
        
        const cleanedResponse = data
        .replace(/```json\n?/g, '')  // remove opening ```json
        .replace(/```/g, '')         // remove closing ```
        .trim();

        // Parse the cleaned Response
        const result = await JSON.parse(cleanedResponse);

        // console.log("here is result", result);

        return result;

    } catch (error) {
        console.log(error)
        throw new Error("Please provide more context about your email")
    }
}