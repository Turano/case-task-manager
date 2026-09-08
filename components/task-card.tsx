import { Task } from "@/trpc/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useToast } from "./toast";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const deleteTask = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSuccess: async () => {
        showToast("Tarefa excluída com sucesso!", "success");
        await queryClient.invalidateQueries({
          queryKey: trpc.tasks.list.infiniteQueryKey(),
        });
      },
      onError: (error) => {
        showToast(`Erro ao excluir tarefa: ${error.message}`, "error");
      },
      onSettled: () => {
        setDeletingTaskId(null);
      },
    }),
  );
  return (
    <article className="flex flex-col gap-2 border p-4 rounded">
      <h2 className="text-xl font-bold line-clamp-2 wrap-break-word">
        {task.titulo}
      </h2>

      {task.descricao && (
        <p className="text-gray-400 wrap-break-word whitespace-pre-wrap">
          {task.descricao}
        </p>
      )}

      <div className="flex flex-row-reverse gap-2">
        <button
          onClick={() => {
            setDeletingTaskId(task.id);
            deleteTask.mutate({ id: task.id });
          }}
          disabled={deletingTaskId === task.id}
          className="bg-red-600 text-white px-2 rounded hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deletingTaskId === task.id ? "Excluindo..." : "Excluir"}
        </button>

        <Link
          href={`/tasks/${task.id}/edit`}
          onClick={(e) => {
            if (deletingTaskId === task.id) {
              e.preventDefault();
            }
          }}
          className="bg-yellow-600 text-white px-2 rounded hover:bg-yellow-700 cursor-pointer"
        >
          Editar
        </Link>
      </div>
    </article>
  );
}
