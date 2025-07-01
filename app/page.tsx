"use client";

import type React from "react";

import { useState } from "react";
import { useChat } from "ai/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Zap, Wrench, Sparkles } from "lucide-react";

export default function AISDKDemo() {
  const [textGeneration, setTextGeneration] = useState({
    prompt: "",
    result: "",
    loading: false,
  });

  const [objectGeneration, setObjectGeneration] = useState({
    prompt: "",
    result: null as any,
    loading: false,
  });

  const handleTextGeneration = async () => {
    if (!textGeneration.prompt.trim()) return;

    setTextGeneration((prev) => ({ ...prev, loading: true, result: "" }));

    try {
      const response = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textGeneration.prompt }),
      });

      const data = await response.json();
      setTextGeneration((prev) => ({
        ...prev,
        result: data.text,
        loading: false,
      }));
    } catch (error) {
      console.error("Error:", error);
      setTextGeneration((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleObjectGeneration = async () => {
    if (!objectGeneration.prompt.trim()) return;

    setObjectGeneration((prev) => ({ ...prev, loading: true, result: null }));

    try {
      const response = await fetch("/api/generate-object", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: objectGeneration.prompt }),
      });

      const data = await response.json();
      setObjectGeneration((prev) => ({
        ...prev,
        result: data.object,
        loading: false,
      }));
    } catch (error) {
      console.error("Error:", error);
      setObjectGeneration((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI SDK Demo</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the power of Vercel AI SDK with Google Gemini for text
            generation, streaming, structured objects, and intelligent tools
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Text Generation
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Streaming
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              Tools
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              Chat
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="text-generation" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="text-generation">Text Generation</TabsTrigger>
            <TabsTrigger value="streaming-chat">Streaming Chat</TabsTrigger>
            <TabsTrigger value="structured-objects">
              Structured Objects
            </TabsTrigger>
            <TabsTrigger value="tools-demo">AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="text-generation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Text Generation
                </CardTitle>
                <CardDescription>
                  Generate text using AI models with the generateText function
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prompt</label>
                  <Textarea
                    placeholder="Enter your prompt here... (e.g., 'Write a short story about a robot learning to paint')"
                    value={textGeneration.prompt}
                    onChange={(e) =>
                      setTextGeneration((prev) => ({
                        ...prev,
                        prompt: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleTextGeneration}
                  disabled={
                    textGeneration.loading || !textGeneration.prompt.trim()
                  }
                  className="w-full"
                >
                  {textGeneration.loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Text"
                  )}
                </Button>
                {textGeneration.result && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Generated Text
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="whitespace-pre-wrap">
                        {textGeneration.result}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="streaming-chat" className="space-y-4">
            <StreamingChatDemo />
          </TabsContent>

          <TabsContent value="structured-objects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Structured Object Generation
                </CardTitle>
                <CardDescription>
                  Generate structured data objects with type safety using
                  generateObject
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prompt</label>
                  <Textarea
                    placeholder="Describe what you want to generate... (e.g., 'Create a user profile for a software engineer named Alex')"
                    value={objectGeneration.prompt}
                    onChange={(e) =>
                      setObjectGeneration((prev) => ({
                        ...prev,
                        prompt: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleObjectGeneration}
                  disabled={
                    objectGeneration.loading || !objectGeneration.prompt.trim()
                  }
                  className="w-full"
                >
                  {objectGeneration.loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Object"
                  )}
                </Button>
                {objectGeneration.result && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Generated Object
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <pre className="text-sm overflow-x-auto">
                        {JSON.stringify(objectGeneration.result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools-demo" className="space-y-4">
            <ToolsDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StreamingChatDemo() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Streaming Chat
        </CardTitle>
        <CardDescription>
          Real-time streaming chat interface using streamText
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Start a conversation by typing a message below
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white border"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border p-3 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ToolsDemo() {
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      toolInvocations?: any[];
    }>
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/tools-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content || "No response",
          toolInvocations: data.toolInvocations || [],
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          AI Tools Demo
        </CardTitle>
        <CardDescription>
          AI assistant with access to weather and calculation tools
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Try asking:</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• "What's the weather in New York?"</li>
                <li>• "Calculate 15% tip on $45.50"</li>
                <li>• "What's 25 + 17 * 3?"</li>
              </ul>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white border"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
                {message.toolInvocations &&
                  message.toolInvocations.length > 0 && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800 mb-2">
                          Tools Used:
                        </p>
                        {message.toolInvocations.map((tool, index) => (
                          <div key={index} className="text-sm text-yellow-700">
                            <strong>{tool.toolName}</strong>:{" "}
                            {JSON.stringify(tool.args)}
                            {tool.result && (
                              <div className="mt-1 text-xs bg-yellow-100 p-2 rounded">
                                Result: {JSON.stringify(tool.result)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border p-3 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about weather or request calculations..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
