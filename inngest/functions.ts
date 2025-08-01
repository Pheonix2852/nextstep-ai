import { inngest } from "./client";
import { db } from "./prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateIndustryInsights = inngest.createFunction(
    {
        id: "generate-industry-insights",
        name: "Generate Industry Insights"
    },
    {cron:  "0 0 * * 0"},
    async ({step}) => {
        const industries = await step.run("Fetch Industries", async ()=>{
            return await db.industryInsight.findMany({
                select: {industry:true},
            })
        })

        for (const {industry} of industries) {
            const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "HIGH" | "MEDIUM" | "LOW",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const res = await step.ai.wrap(
        "gemini",
        async (promptText) => {
          return await model.generateContent(promptText);
        },
        prompt
      );

        const part = res.response?.candidates?.[0]?.content?.parts?.[0];

        const rawText = part && "text" in part ? part.text : "";

        const cleanedText = rawText
        .replace(/```(?:json)?/gi, "") // remove opening ``` or ```json
        .replace(/```/g, "")           // remove closing ```
        .trim();
        const insights = JSON.parse(cleanedText);

        await step.run(`Update ${industry} insights`, async () => {
            await db.industryInsight.update({
                where: { industry },
                data:{
                    ...insights,
                    nextUpdate : new Date(Date.now() + 7*24*60*60*1000)
                }
            })
        })
    }
}
)