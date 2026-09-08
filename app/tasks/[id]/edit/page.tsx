"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import TaskForm from "../../task-form";
import LoadingTaskForm from "@/components/loading-task-form";

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const trpc = useTRPC();

  const taskQuery = useQuery(
    trpc.tasks.getById.queryOptions({
      id,
    }),
  );

  if (!taskQuery.data) {
    return <LoadingTaskForm />;
  }

  return (
    <section className="my-auto gap-4">
      <h1 className="text-2xl font-bold text-center">Editar tarefa</h1>
      <TaskForm task={taskQuery.data} />
    </section>
  );
}
