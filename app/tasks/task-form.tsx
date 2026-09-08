"use client";

import { useToast } from "@/components/toast";
import { useTRPC } from "@/trpc/client";
import { Task } from "@/trpc/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TaskFormData = {
  titulo: string;
  descricao: string;
};

type TaskFormProps = {
  task?: Task;
};

// The same form is reused for both task creation and editing.
// When a task is provided, its current values initialize the form
// and the update mutation is used on submission.
export default function TaskForm({ task }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    titulo: task?.titulo || "",
    descricao: task?.descricao || "",
  });
  const [validationError, setValidationError] = useState("");

  // The isNavigating state is used to prevent multiple submissions
  // while the user is being redirected to the tasks list after a successful mutation.
  const [isNavigating, setIsNavigating] = useState(false);

  const router = useRouter();

  const queryClient = useQueryClient();

  const trpc = useTRPC();

  const { showToast } = useToast();

  const handleSuccess = async (message: string) => {
    await queryClient.invalidateQueries({
      queryKey: trpc.tasks.list.infiniteQueryKey(),
    });

    showToast(message, "success");

    router.push("/tasks");
  };

  const createTask = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: async () => await handleSuccess("Tarefa criada com sucesso!"),
      onError: (error) => {
        setIsNavigating(false);
        showToast(`Erro ao criar tarefa: ${error.message}`, "error");
      },
    }),
  );

  const updateTask = useMutation(
    trpc.tasks.update.mutationOptions({
      onSuccess: async (updatedTask) => {
        await queryClient.invalidateQueries({
          queryKey: trpc.tasks.getById.queryOptions({
            id: updatedTask.id,
          }).queryKey,
        });

        await handleSuccess("Tarefa atualizada com sucesso!");
      },
      onError: () => {
        setIsNavigating(false);
        showToast("Não foi possível atualizar a tarefa.", "error");
      },
    }),
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      setValidationError("O título é obrigatório");
      return;
    }
    setValidationError("");
    setIsNavigating(true);

    if (task) {
      updateTask.mutate({ id: task.id, ...formData });
    } else {
      createTask.mutate(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-xl mx-auto"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="titulo">Título:</label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className="border p-2 rounded"
          maxLength={100}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          className="border p-2 rounded"
          maxLength={500}
        />
      </div>
      {validationError && (
        <p className="text-red-500 text-center">{validationError}</p>
      )}
      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded hover:bg-green-700 cursor-pointer"
        disabled={isNavigating}
      >
        {isNavigating
          ? "Processando..."
          : task
            ? "Atualizar Tarefa"
            : "Criar Tarefa"}
      </button>
    </form>
  );
}
