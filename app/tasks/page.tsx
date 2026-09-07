import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { serverTRPC } from "@/trpc/server-client";

import TasksList from "./tasks-list";
import Link from "next/link";

export default async function Tasks() {
  const queryClient = getQueryClient();

  const firstPage = await serverTRPC.tasks.list.query({
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
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer fixed right-4 bottom-4"
      >
        Criar Nova Tarefa
      </Link>
      <TasksList />
    </HydrationBoundary>
  );
}
