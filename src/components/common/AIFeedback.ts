import OpenAI from 'openai';

const AIFeedback = async (userAnswer: string, question: any, openai: OpenAI | null) => {
  if (!openai) {
    console.error("OpenAI is not initialized");
    return { isCorrect: false, feedback: "Error: AI not available. Please try again later." };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: "You are a language learning assistant specializing in pronunciation and speaking accuracy. Analyze the user's spoken answer and provide detailed feedback."},
        {role: "user", content: `Question type: ${question.type}
        Question: ${JSON.stringify(question)}
        User's answer: "${userAnswer}"
        Provide feedback in the following format:
        1. Correctness: [Is the answer correct? Yes/No]
        2. Pronunciation: [How accurate is the pronunciation? Excellent/Good/Fair/Poor]
        3. Specific Issues: [List any words, sounds, or grammatical issues that need improvement]
        4. Improvement Tips: [Provide specific tips for improvement]
        5. Overall: [Provide an overall assessment of the answer]`}
      ],
    });

    const aiResponse = response.choices[0].message?.content;
    if (!aiResponse) throw new Error("No response from AI");

    const correctnessMatch = aiResponse.match(/1\. Correctness: (Yes|No)/i);
    const isCorrect = correctnessMatch ? correctnessMatch[1].toLowerCase() === 'yes' : false;

    return { isCorrect, feedback: aiResponse };
  } catch (error) {
    console.error("Error in AI feedback:", error);
    return { isCorrect: false, feedback: "Unable to analyze your answer. Please try again." };
  }
};

export default AIFeedback;