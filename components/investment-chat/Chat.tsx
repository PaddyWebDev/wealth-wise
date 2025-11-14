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
        toast.error("Failed to validated fields");
        return;
      }
      await sendMessageMutation.mutateAsync({
        query: validatedFields.data.query.trim(),
      });
      form.reset();
    } catch (error) {
      toast.error("Error Occurred");
      // console.error("Error sending message:", error);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data || !data.length) {
    console.log(data);
  }

  return (
    <Card className="w-full  mx-auto bg-neutral-50 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-900">
      <CardHeader>
        <CardTitle className="text-neutral-800 dark:text-neutral-50">
          Investment Advisor Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="relative ">
        <ScrollArea className="h-[68dvh]  mb-4 p-4 rounded bg-neutral-50 dark:bg-neutral-950">
          {data.map((msg: any) => (
            <div key={msg.id} className="mb-4">
              <div className="mb-2 p-2 rounded bg-neutral-100 dark:bg-neutral-800 w-10/12  text-right">
                <p className="text-neutral-800 dark:text-neutral-100 ">
                  {msg.message}
                </p>
              </div>
              <div className="rounded bg-neutral-100 dark:bg-neutral-800 w-10/12 px-6 py-3 text-justify">
                <h1 className="text-xl font-bold mb-3">AI reponse</h1>
                <p className="text-neutral-800 dark:text-neutral-200 ">
                  {msg.response}
                </p>
              </div>
            </div>
          ))}
          {sendMessageMutation.isPending && (
            <div className="text-neutral-500">AI is thinking...</div>
          )}
        </ScrollArea>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleChatSubmit)}
            className="flex gap-2 absolute mb-10 w-11/12  mx-auto bottom-35 up-75 left-0 right-0   "
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
                      className="bg-neutral-50 border-neutral-300 dark:bg-neutral-950 dark:border-neutral-950"
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
