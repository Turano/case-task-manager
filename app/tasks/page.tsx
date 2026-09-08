import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc, getServerTRPC } from "@/trpc/server";

import TasksList from "./tasks-list";
import Link from "next/link";

export default async function Tasks() {
  const queryClient = getQueryClient();
  const serverTRPC = await getServerTRPC();

  // Preloads the first page on the server and hydrates the cache on the client,
  // meeting the SSR requirement without a new initial fetch.
  const firstPage = await serverTRPC.tasks.list({
    limit: 20,
    cursor: 0,
  });

  queryClient.setQueryData(trpc.tasks.list.infiniteQueryKey(), {
    pages: [firstPage],
    pageParams: [0],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Link
        href="/tasks/create"
        className="bg-green-600 text-white px-4 py-2 rounded-full sm:rounded hover:bg-green-700 cursor-pointer fixed right-4 bottom-4"
      >
        <span className="sm:hidden">+</span>
        <span className="hidden sm:inline">Criar Nova Tarefa</span>
      </Link>
      <TasksList />
    </HydrationBoundary>
  );
}
