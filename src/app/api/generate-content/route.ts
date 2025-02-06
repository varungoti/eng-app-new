import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const {
      lessonType,
      grade,
      topic,
      contentType,
      prompt,
      difficulty
    } = await req.json();

    // Construct the prompt based on the content type
    let systemPrompt = `You are an expert English teacher for grade ${grade} students. `;
    let userPrompt = `Create a ${difficulty} level ${contentType} about ${topic}. `;

    switch (contentType) {
      case 'question':
        systemPrompt += "Create engaging multiple-choice questions that test understanding while being fun and age-appropriate.";
        userPrompt += "Include 4 options with one correct answer. Provide explanation for the correct answer.";
        break;
      
      case 'activity':
        systemPrompt += "Design interactive activities that combine learning with fun elements like games or role-play.";
        userPrompt += "Include clear instructions, required materials (if any), and expected duration.";
        break;
      
      case 'exercise':
        systemPrompt += "Create practical exercises that reinforce learning through hands-on practice.";
        userPrompt += "Include a mix of different question types (fill in the blanks, matching, etc.).";
        break;
      
      case 'story':
        systemPrompt += "Write engaging stories that incorporate target vocabulary and grammar concepts.";
        userPrompt += "Include comprehension questions and vocabulary highlights.";
        break;
    }

    if (prompt) {
      userPrompt += `Additional requirements: ${prompt}`;
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Process the response
    const generatedContent = response.choices[0].message?.content;
    
    if (!generatedContent) {
      throw new Error('No content generated');
    }

    // Parse and structure the content
    const structuredContent = {
      type: contentType,
      content: generatedContent,
      metadata: {
        grade,
        topic,
        difficulty,
        lessonType,
        generatedAt: new Date().toISOString(),
        needsReview: true
      }
    };

    // Here you would typically save to your database
    // await saveToDatabase(structuredContent);

    return NextResponse.json(structuredContent);
  } catch (error: any) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
} 