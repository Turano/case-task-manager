import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { serverTRPC } from "@/trpc/server-client";

import TasksList from "./tasks-list";

export default async function Tasks() {
  const queryClient = getQueryClient();

  const tasks = await serverTRPC.tasks.list.query();

  queryClient.setQueryData(trpc.tasks.list.queryKey(), tasks);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksList />
    </HydrationBoundary>
  );
}
