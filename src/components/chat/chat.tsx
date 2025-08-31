"use client";

import React from "react";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "~/components/ai-elements/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "~/components/ai-elements/conversation";
import { Message, MessageContent } from "~/components/ai-elements/message";
import { Response } from "~/components/ai-elements/response";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { ChatMessage } from "~/ai-core/types";
import ProfileCard from "./profile-card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

export default function Chat() {
  const [message, setMessage] = React.useState("");
  const { messages, sendMessage } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      credentials: "include",
    }),
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    sendMessage({
      parts: [{ type: "text", text: message }],
    });

    setMessage("");
  }
  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1">
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );

                      case "tool-searchConnections":
                        if (part.state === "output-available") {
                          return (
                            <div className="space-y-2 py-4">
                              <ScrollArea
                                className="w-full py-2"
                                aria-label="Profiles carousel"
                              >
                                <div
                                  className="flex w-full snap-x snap-mandatory gap-4 pr-4"
                                  role="group"
                                  aria-roledescription="carousel"
                                >
                                  {part.output.map((outputItem, j) => (
                                    <ProfileCard
                                      profile={outputItem}
                                      key={`${message.id}-output-${j}`}
                                      className="snap-start"
                                    />
                                  ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                              </ScrollArea>
                              <p className="text-muted-foreground text-xs italic">
                                Scroll to see more &rarr;
                              </p>
                            </div>
                          );
                        }
                        return null;

                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <div className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky bottom-0 z-10 border-t backdrop-blur">
        <PromptInput onSubmit={handleSubmit} className="mt-0">
          <PromptInputTextarea
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <PromptInputToolbar className="flex justify-end">
            <PromptInputSubmit />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
}
