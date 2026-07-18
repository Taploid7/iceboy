export async function fetchAIQuestion(difficulty, location, topic) {
  try {
    const response = await fetch('https://iceboy1.vercel.app/api/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty, topic, location })
    });
    if (!response.ok) throw new Error("Network response error.");
    return await response.json();
  } catch (err) {
    console.warn("Using local fallback question source framework:", err);
    const localRes = await fetch('./data/questions.json');
    const localData = await localRes.json();
    return localData.fallback[0];
  }
}