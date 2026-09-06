"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import Link from "next/link";

export default function TasksList() {
  const trpc = useTRPC();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery(trpc.tasks.list.queryOptions());

  const queryClient = useQueryClient();

  const deleteTask = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.tasks.list.queryKey(),
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
    <section>
      {tasks.map((task) => (
        <article key={task.id}>
          <h2>{task.titulo}</h2>
          <p>{task.dataCriacao.toLocaleString()}</p>
          {task.descricao && <p>{task.descricao}</p>}
          <Link href={`/tasks/${task.id}/edit`}>Editar</Link>
          <button
            onClick={() => {
              deleteTask.mutate({ id: task.id });
            }}
            disabled={deleteTask.isPending}
          >
            Excluir
          </button>
        </article>
      ))}
    </section>
  );
}
