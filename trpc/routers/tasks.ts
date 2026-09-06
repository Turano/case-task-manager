import { baseProcedure, createTRPCRouter } from "../init";
import z from "zod";

export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: string;
};

const tasks: Task[] = [];

export const tasksRouter = createTRPCRouter({
  list: baseProcedure.query(() => {
    return tasks;
  }),
  create: baseProcedure
    .input(
      z.object({
        titulo: z.string().trim().min(1),
        descricao: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const task: Task = {
        id: crypto.randomUUID(),
        titulo: input.titulo,
        descricao: input.descricao,
        dataCriacao: new Date().toISOString(),
      };

      tasks.push(task);

      return task;
    }),
});
