import tasksMock from "@/mock/tasks";
import { baseProcedure, createTRPCRouter } from "../init";

export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
};

const tasks: Task[] = tasksMock;

export const tasksRouter = createTRPCRouter({
  list: baseProcedure.query(() => {
    return tasks;
  }),
});
