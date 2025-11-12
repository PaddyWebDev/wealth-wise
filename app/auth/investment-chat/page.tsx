import Chat from "@/components/investment-chat/Chat";
import { getSessionUser } from "@/hooks/user";

export default async function InvestmentChatPage() {
  const session = await getSessionUser();

  return (
    <div className="h-full bg-neutral-100 dark:bg-neutral-900  flex items-center justify-center p-4">
      <Chat userId={session?.user.id!} />
    </div>
  );
}
