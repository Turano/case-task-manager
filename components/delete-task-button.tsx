"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/toast";
import { useTRPC } from "@/trpc/client";

type DeleteTaskButtonProps = {
  taskId: string;
};

export default function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const deleteTask = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.tasks.list.infiniteQueryKey(),
        });

        showToast("Tarefa excluída com sucesso!", "success");
      },
      onError: (error) => {
        showToast(`Erro ao excluir tarefa: ${error.message}`, "error");
      },
    }),
  );

  return (
    <button
      onClick={() => deleteTask.mutate({ id: taskId })}
      disabled={deleteTask.isPending}
      className="bg-red-600 text-white px-2 rounded hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {deleteTask.isPending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
