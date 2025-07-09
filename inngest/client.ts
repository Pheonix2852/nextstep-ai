import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
    id: "nextstep-ai", 
    name: "NextStep AI",
    credentials: {
        gemini: {
            api: process.env.GEMINI_API_KEY,
        },
    },
});
