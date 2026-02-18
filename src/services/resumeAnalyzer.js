export const analyzeResumeWithAI = async (fileText, mimeType = "") => {
  // Backend API URL
  const API_URL = 'http://localhost:3000/api/analyze-resume';

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resumeText: fileText,
      mimeType: mimeType
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to analyze resume. Please try again.');
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Analysis failed');
  }

  return data.critique;
};