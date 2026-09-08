"use client";

import { useToast } from "@/components/toast";
import { useTRPC } from "@/trpc/client";
import { Task } from "@/trpc/routers/tasks";
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

export default function TaskForm({ task }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    titulo: task?.titulo || "",
    descricao: task?.descricao || "",
  });
  const [validationError, setValidationError] = useState("");

  const router = useRouter();

  const queryClient = useQueryClient();

  const trpc = useTRPC();

  const { showToast } = useToast();

  const createTask = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.tasks.list.infiniteQueryKey(),
        });

        showToast("Tarefa criada com sucesso!", "success");

        router.push("/tasks");
      },
      onError: (error) => {
        showToast(`Erro ao criar tarefa: ${error.message}`, "error");
      },
    }),
  );

  const updateTask = useMutation(
    trpc.tasks.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.tasks.list.infiniteQueryKey(),
        });

        showToast("Tarefa atualizada com sucesso!", "success");

        router.push("/tasks");
      },
      onError: (error) => {
        showToast(`Erro ao atualizar tarefa: ${error.message}`, "error");
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
        />
      </div>
      {validationError && (
        <p className="text-red-500 text-center">{validationError}</p>
      )}
      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded hover:bg-green-700 cursor-pointer"
        disabled={createTask.isPending || updateTask.isPending}
      >
        {createTask.isPending || updateTask.isPending
          ? "Processando..."
          : task
            ? "Atualizar Tarefa"
            : "Criar Tarefa"}
      </button>
    </form>
  );
}
