import OpenAI from 'openai'
import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions.mjs'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const getChatGPTResponse = async (
  systemPrompt: string,
  userPrompt: string
): Promise<{ code: string; path: string }> => {
  let completeResponse = ''
  let tokenCount = 0
  const maxTokensPerRequest = 4096 // Set to a reasonable value within API limits

  while (true) {
    if (tokenCount > 0) console.log(`Requesting completion with ${tokenCount} tokens...`)
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]
    if (completeResponse) {
      messages.push({ role: 'assistant', content: completeResponse })
    }
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      response_format: { type: 'json_object' },
      max_tokens: maxTokensPerRequest,
    } as ChatCompletionCreateParamsBase)

    if ('choices' in response && 'usage' in response && !!response.usage) {
      const message = response.choices[0].message.content!
      completeResponse += message.trim()
      tokenCount += response.usage.total_tokens
      if (
        response.choices[0].finish_reason === 'stop' ||
        tokenCount >= response.usage.total_tokens
      ) {
        break
      }
      userPrompt = 'Continue the previous response.'
    } else {
      console.error(response)
      throw new Error('Invalid response from OpenAI')
    }
  }

  try {
    // Parse the final complete response
    return JSON.parse(completeResponse)
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    throw new Error('Failed to parse JSON response from OpenAI')
  }
}

export const buildCodeFromRules = async (guidelines: string[], userPrompt: string) => {
  const systemPrompt = `You are a highly skilled AI assistant specialized in generating TypeScript code following these guidelines: 
    - ${guidelines.join('\n- ')}
    - You have to not write any comments in the code.
    - The code have to be fully functionnal and ready to use in production.
    - Your response have to be in a JSON format in a "code" property.
    - Please ensure the output is always a valid JSON object.`
  const response = await getChatGPTResponse(systemPrompt, userPrompt)
  return response
}
