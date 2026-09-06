import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TasksList from "./tasks-list";

export default async function Tasks() {
  const queryClient = getQueryClient();

  await queryClient.query(trpc.tasks.list.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksList />
    </HydrationBoundary>
  );
}
