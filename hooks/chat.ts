import queryClient from "@/lib/tanstack-query";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getSessionUser } from "./user";

export function useChatMessages(userId: string) {
  return useQuery({
    queryKey: ["chatMessages", userId],
    queryFn: async () => {
      const user = await getSessionUser();
      const res = await axios.get(`/api/chat-messages?userId=${user?.user.id}`);
      return res.data.messageData;
    },
    enabled: !!userId,
  });
}

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async ({ query }: { query: string }) => {
      const user = await getSessionUser();
      const res = await axios.post(`/api/nlp-query?userId=${user?.user.id}`, {
        query,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatMessages"] });
    },
  });
};
