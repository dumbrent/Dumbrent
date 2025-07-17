import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only use this if you're using rate limiting and proper security measures
});

export class AIGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIGenerationError';
  }
}

export const generateListingTitle = async (
  neighborhood: string,
  borough: string,
  bedrooms: number,
  bathrooms: number,
  keyFeature: string
) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "You are a helpful assistant that generates apartment listing titles. Keep titles concise and highlight key features."
      }, {
        role: "user",
        content: `Create a title for an apartment with these details:
          - ${bedrooms} bedrooms
          - ${bathrooms} bathrooms
          - Located in ${neighborhood}, ${borough}
          - Key feature: ${keyFeature}
          
          Keep it under 60 characters and highlight the most appealing aspects.`
      }],
      temperature: 0.7,
      max_tokens: 50
    });

    return response.choices[0].message.content?.trim();
  } catch (error) {
    if (error.status === 429) {
      throw new AIGenerationError("AI generation is temporarily unavailable. Please try again later or enter your title manually.");
    }
    throw new AIGenerationError("Failed to generate title. Please try again or enter your title manually.");
  }
};

export const generateListingDescription = async (
  neighborhood: string,
  bedrooms: number,
  bathrooms: number,
  keyFeature: string,
  amenities: string[]
) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `You are a helpful assistant that generates apartment listing descriptions. Use this template:

Welcome to Your [Adjective] [Neighborhood] Retreat!

Discover this [Bedrooms] BR / [Bathrooms] BA gem in the heart of [Neighborhood], offering [Key Feature] and [Bonus Selling Point]. Step into a thoughtfully designed space featuring [Additional Highlight], perfect for modern city living.

Enjoy the convenience of [Nearby Attraction], plus easy access to [Transportation or Local Hotspot]. Whether you're relaxing in your [Feature] or exploring the vibrant streets of [Neighborhood], this home is designed for comfort and style.

Don't miss out—schedule a tour today!`
      }, {
        role: "user",
        content: `Create an engaging description for an apartment with these details:
          - ${bedrooms} bedrooms
          - ${bathrooms} bathrooms
          - Located in ${neighborhood}
          - Key feature: ${keyFeature}
          - Amenities: ${amenities.join(', ')}
          
          Follow the template exactly, filling in the placeholders with engaging content.`
      }],
      temperature: 0.7,
      max_tokens: 300
    });

    return response.choices[0].message.content?.trim();
  } catch (error) {
    if (error.status === 429) {
      throw new AIGenerationError("AI generation is temporarily unavailable. Please try again later or enter your description manually.");
    }
    throw new AIGenerationError("Failed to generate description. Please try again or enter your description manually.");
  }
};