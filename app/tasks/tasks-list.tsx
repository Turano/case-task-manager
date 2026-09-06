"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export default function TasksList() {
  const trpc = useTRPC();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery(trpc.tasks.list.queryOptions());

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
        </article>
      ))}
    </section>
  );
}
