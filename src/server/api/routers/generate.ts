import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

interface XAIResponse {
  choices: Array<{ message: { content: string } }>;
  error?: { message: string };
}

export const generateRouter = createTRPCRouter({
  generateRiddle: publicProcedure
    .input(z.object({ city: z.string() }))
    .mutation(async ({ input }) => {
      try {
        console.log('Attempting API call with city:', input.city);
        
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.XAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "grok-2-latest",
            messages: [
              {
                role: "system",
                content: "You are a riddle master. Create engaging, clever riddles about cities."
              },
              {
                role: "user",
                content: `Create a riddle about ${input.city}. The riddle should be challenging but solvable, including geographical, cultural, or historical hints. Don't mention the city name directly.`
              }
            ],
            temperature: 0.7
          }),
        });

        console.log('Response status:', response.status);
        const data = await response.json() as XAIResponse;
        console.log('Response data:', data);
        
        if (!response.ok) {
          throw new Error(data.error?.message ?? 'Failed to generate riddle');
        }

        if (!data.choices?.[0]?.message?.content) {
          throw new Error('Invalid response format');
        }

        return {
          success: true,
          result: data.choices[0].message.content,
        };

      } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to generate riddle');
      }
    }),
}); 