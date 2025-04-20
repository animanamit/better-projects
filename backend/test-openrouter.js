// Simple script to test OpenRouter integration
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables with proper path
dotenv.config({ path: path.resolve(__dirname, '.env') });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
console.log('OpenRouter API Key exists:', OPENROUTER_API_KEY ? 'Yes' : 'No');
if (OPENROUTER_API_KEY) {
  console.log('OpenRouter API Key preview:', OPENROUTER_API_KEY.substring(0, 5) + '...');
} else {
  console.log('⚠️ No OpenRouter API key found in .env file');
  process.exit(1);
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Test data
const model = 'anthropic/claude-3-haiku';
const systemPrompt = 'You are a helpful assistant.';
const userPrompt = 'Say hello world!';

// Function to call OpenRouter
async function testOpenRouter() {
  console.log('Making test request to OpenRouter API');
  console.log('URL:', OPENROUTER_URL);
  console.log('Model:', model);
  
  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://better-projects.app', // Replace with your actual domain
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      throw new Error(errorData.error || 'Failed to call OpenRouter API');
    }

    const data = await response.json();
    console.log('OpenRouter response:', data);
    console.log('Response content:', data.choices[0].message.content);
    console.log('Test successful!');
  } catch (error) {
    console.error('Exception in testOpenRouter:', error);
  }
}

// Run the test
testOpenRouter();