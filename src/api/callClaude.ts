import { API_BASE } from './config';

export async function callClaude(prompt: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/claude`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const text = await res.text(); // Get raw response
    try {
      const data = JSON.parse(text);
      return data?.output || 'Claude returned no code.';
    } catch (err) {
      console.error('❗ Unexpected response (not JSON):\n', text);
      throw new Error('Invalid response from Claude server');
    }
  } catch (error) {
    console.error('💥 Claude fetch error:', error);
    throw error;
  }
}

