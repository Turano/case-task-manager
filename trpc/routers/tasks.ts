import { baseProcedure, createTRPCRouter } from "../init";
import z from "zod";
import { Task } from "../types";


const tasks: Task[] = [];
// Tasks are kept in memory as requested by the specification.
// The data is not persisted and is lost when the process is restarted.

export const tasksRouter = createTRPCRouter({
  list: baseProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        cursor: z.number().default(0),
      }),
    )
    .query(({ input }) => {
      // Cursor represents the starting position of the next page.
      // Pagination allows loading tasks incrementally in the infinite scroll.
      const start = input.cursor;
      const end = start + input.limit;

      const items = tasks.slice(start, end);

      return {
        items,
        nextCursor: end < tasks.length ? end : undefined,
      };
    }),
  create: baseProcedure
    .input(
      z.object({
        titulo: z.string().trim().min(1).max(100),
        descricao: z.string().max(500).optional(),
      }),
    )
    .mutation(({ input }) => {
      const task: Task = {
        id: crypto.randomUUID(),
        titulo: input.titulo,
        descricao: input.descricao,
        dataCriacao: new Date().toISOString(),
      };

      tasks.unshift(task);

      return task;
    }),
  delete: baseProcedure
    .input(
      z.object({
        id: z.uuid(),
      }),
    )
    .mutation(({ input }) => {
      const index = tasks.findIndex((task) => task.id === input.id);
      if (index === -1) {
        throw new Error("Tarefa não encontrada");
      }
      const [deletedTask] = tasks.splice(index, 1);
      return deletedTask;
    }),
  update: baseProcedure
    .input(
      z.object({
        id: z.uuid(),
        titulo: z.string().trim().min(1),
        descricao: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const index = tasks.findIndex((task) => task.id === input.id);
      if (index === -1) {
        throw new Error("Tarefa não encontrada");
      }
      const updatedTask: Task = {
        ...tasks[index],
        titulo: input.titulo,
        descricao: input.descricao,
      };
      tasks[index] = updatedTask;
      return updatedTask;
    }),
  getById: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const task = tasks.find((task) => task.id === input.id);

      if (!task) {
        throw new Error("Tarefa não encontrada");
      }

      return task;
    }),
});
