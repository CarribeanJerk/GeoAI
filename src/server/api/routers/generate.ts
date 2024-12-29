import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const generateRouter = createTRPCRouter({
  generateRiddle: publicProcedure
    .input(z.object({ city: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const riddle = `In this place of mystery and might,
                       Where ${input.city.split(' ').length > 1 ? 'words combine' : 'letters dance'} in urban light.
                       A city's heart beats day and night,
                       Can you guess this place just right?`;

        return {
          success: true,
          result: riddle,
        };
      } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to generate riddle');
      }
    }),
}); 