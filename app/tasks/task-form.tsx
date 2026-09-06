"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TaskFormData = {
  titulo: string;
  descricao: string;
};

export default function TaskForm() {
  const [formData, setFormData] = useState<TaskFormData>({
    titulo: "",
    descricao: "",
  });
  const [validationError, setValidationError] = useState("");

  const router = useRouter();

  const queryClient = useQueryClient();

  const trpc = useTRPC();

  const createTask = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.tasks.list.queryKey(),
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
    createTask.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="titulo">Título:</label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
        />
      </div>
      {validationError && <p>{validationError}</p>}
      <button type="submit">Criar Tarefa</button>
    </form>
  );
}
