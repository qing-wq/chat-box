import OpenAI from "openai"

export const OpenAiClient = new OpenAI({
	apiKey: process.env.API_KEY,
	baseURL: process.env.BASE_URL
})
