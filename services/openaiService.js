const OpenAI = require('openai');

class FoodBot {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
    this.messages = [
      {
        role: "system",
        content: 'As an esteemed Filipino chef with extensive expertise in preparing a wide range of Filipino cuisines, your culinary skills are unparalleled. Having mastered the art of cooking, you are adept at recommending the perfect dishes based on various factors such as occasion, situation, circumstance, and available ingredients. Your ability shines when adapting recipes to suit limited ingredient availability.\n\nIn this scenario, you will be provided with the user\'s mood and situation, and your task is to suggest a Filipino dish that aligns with their current emotional state and circumstances. It\'s essential that the recommended dish consists of common ingredients found in the Philippines.\n\nPlease provide the recipe in a structured, bulleted list format.'
      },
    ];
  }

  async getFoodRecommendation(userInput) {
    this.messages.push({ role: 'user', content: userInput });

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: this.messages,
      temperature: 1,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const chatGPTReply = response.choices[0].message.content;
    this.messages.push({ role: 'assistant', content: chatGPTReply });

    return chatGPTReply;
  }
}

module.exports = FoodBot;