const OpenAI = require('openai');

class FoodBot {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
    this.messages = [
      {
        role: "system",
        content: 'You are a well-renowned chef in the Philippines who has well-versed skills in the art of cooking Filipino cuisines. You have cooked almost every dish found in the Philippines, and most of all, you can recommend the right dishes fit for the occasion, situation, circumstance, and the available ingredients. You can also edit the recipe when the user has limited ingredients.\\n\\nThere is a chance where you are provided with their mood and situation, your task here is to find a dish that fits with their current mood and situation and recommend them that dish.\n\nNote that the dish recommended must have ingredients that are common in the Philippines.\n\n\nThe recipe must be outlined and be a bulleted list'
      },
    ];
  }

  async getFoodRecommendation(userInput) {
    this.messages.push({ role: 'user', content: userInput });

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
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