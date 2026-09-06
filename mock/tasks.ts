import { Task } from "@/trpc/routers/tasks";

const tasksMock: Task[] = [
  {
    id: "1",
    titulo: "Task 1",
    descricao: "Description for Task 1",
    dataCriacao: new Date("2024-06-01T10:00:00Z"),
  },
  {
    id: "2",
    titulo: "Task 2",
    descricao: "Description for Task 2",
    dataCriacao: new Date("2024-06-02T11:00:00Z"),
  },
  {
    id: "3",
    titulo: "Task 3",
    descricao: "Description for Task 3",
    dataCriacao: new Date("2024-06-03T12:00:00Z"),
  },
  {
    id: "4",
    titulo: "Task 4",
    descricao: "Description for Task 4",
    dataCriacao: new Date("2024-06-04T13:00:00Z"),
  },
  {
    id: "5",
    titulo: "Task 5",
    descricao: "Description for Task 5",
    dataCriacao: new Date("2024-06-05T14:00:00Z"),
  },
];

export default tasksMock;
