"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useChatMessages, useSendMessage } from "@/hooks/chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatFormSchema, ChatFormType } from "@/lib/auth-form-schemas";
import toast from "react-hot-toast";
import React from "react";
import Loader from "../Loader";
import ReactMarkdown from "react-markdown";

export default function Chat({ userId }: { userId: string }) {
  const { data, isLoading, isError } = useChatMessages(userId);
  const sendMessageMutation = useSendMessage();

  const form = useForm<ChatFormType>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      query: "",
    },
  });

  async function handleChatSubmit(data: ChatFormType) {
    try {
      const validatedFields = chatFormSchema.safeParse(data);
      if (validatedFields.error || !validatedFields.data) {
        toast.error("Validation failed");
        return;
      }
      await sendMessageMutation.mutateAsync({
        query: validatedFields.data.query.trim(),
      });
      form.reset();
    } catch (error) {
      toast.error("Error Occurred");
    }
  }

  if (isLoading) return <Loader />;

  return (
    <Card className="w-full mx-auto bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle className="text-neutral-800 dark:text-neutral-50">
          Investment Advisor Chat
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col h-[75vh] relative">
        {/* -------- CHAT MESSAGES -------- */}
        <ScrollArea className="flex-1 rounded-md p-4 space-y-6 bg-neutral-50 dark:bg-neutral-950">
          {data?.map((msg: any) => (
            <div key={msg.id} className="space-y-3 mt-4">
              {/* USER MESSAGE */}
              <div className="flex justify-end">
                <div className="max-w-[75%] p-3 rounded-xl bg-blue-500 text-white shadow-md">
                  {msg.message}
                </div>
              </div>

              {/* AI MESSAGE */}
              <div className="flex justify-start">
                <div className="max-w-[80%] p-4 rounded-xl bg-neutral-200 dark:bg-neutral-800 shadow-sm">
                  <p className="font-semibold text-lg mb-2 text-neutral-700 dark:text-neutral-100">
                    AI Response
                  </p>

                  <div className="prose prose-sm dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-200">
                    <ReactMarkdown>{msg.response}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sendMessageMutation.isPending && (
            <p className="text-neutral-400 italic">AI is thinking...</p>
          )}
        </ScrollArea>

        {/* -------- INPUT AREA FIXED AT BOTTOM -------- */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleChatSubmit)}
            className="flex gap-2 mt-3"
          >
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ask about investments..."
                      disabled={sendMessageMutation.isPending}
                      className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={sendMessageMutation.isPending}>
              {sendMessageMutation.isPending ? "Sending..." : "Send"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
