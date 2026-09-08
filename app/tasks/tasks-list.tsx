"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useEffect, useRef } from "react";
import LoadingTaskList from "@/components/loading-task-list";
import TaskCard from "@/components/task-card";

export default function TasksList() {
  const trpc = useTRPC();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tasks.list.infiniteQueryOptions(
        {
          limit: 20,
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
      ),
    );

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        // It makes so that the div being watched is found before it is visible on screen
        rootMargin: "200px",
      },
    );

    const target = observerTarget.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const tasks = data?.pages.flatMap((page) => page.items) ?? [];

  if (!data) {
    return <LoadingTaskList />;
  }

  if (tasks.length === 0) {
    return (
      <section className="flex flex-col gap-4 sm:max-w-xl sm:mx-auto sm:min-w-sm">
        <h1 className="text-2xl font-bold text-center">Minhas Tarefas</h1>
        <p className="text-center">Nenhuma tarefa cadastrada.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 sm:max-w-xl sm:mx-auto sm:min-w-sm">
      <h1 className="text-2xl font-bold text-center">Minhas Tarefas</h1>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
      <div ref={observerTarget} />
    </section>
  );
}
