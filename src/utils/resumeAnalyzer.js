export const analyzeResumeWithAI = async (fileText) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `You are an expert resume critic and career advisor. Analyze the following resume and provide detailed feedback in exactly this JSON format (no markdown, no backticks, just pure JSON):

{
  "strengths": "List 3-5 key strengths of this resume",
  "weaknesses": "List 3-5 areas that need improvement",
  "suggestions": "Provide 5-7 specific, actionable recommendations",
  "overall": "Give an overall assessment and score out of 10"
}

Resume content:
${fileText}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze resume. Please try again.');
  }

  const data = await response.json();
  const aiResponse = data.content
    .filter(item => item.type === 'text')
    .map(item => item.text)
    .join('\n');

  const cleanResponse = aiResponse.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanResponse);
};
