import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import { getRiddle, saveRiddle } from '~/utils/riddleStorage';

interface XAIResponse {
  choices: Array<{ message: { content: string } }>;
  error?: { message: string };
}

export const generateRouter = createTRPCRouter({
  generateRiddle: publicProcedure
    .input(z.object({ 
      city: z.string(),
      coordinates: z.tuple([z.number(), z.number()]) 
    }))
    .mutation(async ({ input }) => {
      try {
        // Check for existing riddle
        const existingRiddle = getRiddle(input.city);
        if (existingRiddle) {
          return {
            success: true,
            result: existingRiddle,
            coordinates: input.coordinates
          };
        }

        // If no existing riddle, generate new one
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
                content: `Create a riddle about ${input.city}. The riddle should be challenging but solvable, including geographical, cultural, or historical hints. Don't mention the city name directly, and don't specify "hint", just drop them around in the riddle. also make it at most 8 lines.`
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

        const newRiddle = data.choices[0].message.content;
        
        // Save the new riddle
        await saveRiddle(input.city, newRiddle);

        return {
          success: true,
          result: newRiddle,
          coordinates: input.coordinates
        };

      } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to generate riddle');
      }
    }),
}); 