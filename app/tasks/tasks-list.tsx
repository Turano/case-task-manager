"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function TasksList() {
  const trpc = useTRPC();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
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

  const queryClient = useQueryClient();

  const deleteTask = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.tasks.list.infiniteQueryKey(),
        });
      },
    }),
  );

  if (isLoading) {
    return <p>Carregando tarefas...</p>;
  }

  if (error) {
    return <p>Erro ao carregar tarefas.</p>;
  }

  if (!tasks || tasks.length === 0) {
    return <p>Nenhuma tarefa cadastrada.</p>;
  }

  return (
    <section className="flex flex-col gap-4 max-w-xl mx-auto min-w-sm">
      <h1 className="text-2xl font-bold text-center">Minhas Tarefas</h1>
      {tasks.map((task) => (
        <article
          key={task.id}
          className="flex flex-col gap-2 border p-4 rounded"
        >
          <h2 className="text-xl font-bold">{task.titulo}</h2>
          {/* <p>{task.dataCriacao.toLocaleString()}</p> */}
          {task.descricao && <p className="text-gray-400">{task.descricao}</p>}
          <div className="flex flex-row-reverse gap-2">
            <button
              onClick={() => {
                deleteTask.mutate({ id: task.id });
              }}
              disabled={deleteTask.isPending}
              className="bg-red-600 text-white px-2 rounded hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Excluir
            </button>
            <Link
              href={`/tasks/${task.id}/edit`}
              onClick={(e) => {
                if (deleteTask.isPending) {
                  e.preventDefault();
                }
              }}
              className="bg-yellow-600 text-white px-2 rounded hover:bg-yellow-700 cursor-pointer"
            >
              Editar
            </Link>
          </div>
        </article>
      ))}
      <div ref={observerTarget} />
    </section>
  );
}
