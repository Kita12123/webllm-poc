import * as webllm from "@mlc-ai/web-llm";

class Agent {
    name: string
    engine: webllm.MLCEngineInterface
    messages: webllm.ChatCompletionMessageParam[] = []

    constructor(
        name: string,
        engine: webllm.MLCEngineInterface) {
        this.name = name;
        this.engine = engine;
    }

    getName() { return this.name; }

    setSystemPrompt(
        msg: string
    ) {
        this.messages.push({ role: "system", content: msg })
    }

    async ask(
        msg: string,
        callback?: (text: string) => void,
    ) {
        this.messages.push({ role: "user", content: msg });
        const stream = await this.engine.chat.completions.create({
            messages: this.messages,
            max_tokens: 256,
            temperature: 0.7,
            stream: true,
        });

        let reply = "";
        for await (const chunk of stream) {
            reply += chunk.choices[0]?.delta?.content ?? "";
            if (callback)
                callback(reply);
        }

        this.messages.push({ role: "assistant", content: reply });

        return reply;
    }
}

export default Agent;