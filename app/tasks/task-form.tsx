"use client";

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

  const createTask = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.tasks.list.infiniteQueryKey(),
        });

        router.push("/tasks");
      },
    }),
  );

  const updateTask = useMutation(
    trpc.tasks.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.tasks.list.infiniteQueryKey(),
        });

        router.push("/tasks");
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
      {validationError && <p>{validationError}</p>}
      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded hover:bg-green-700 cursor-pointer"
      >
        {task ? "Atualizar Tarefa" : "Criar Tarefa"}
      </button>
    </form>
  );
}
