import { serverTRPC } from "@/trpc/server-client";
import TaskForm from "../../task-form";

type EditTaskPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const task = await serverTRPC.tasks.getById.query({
    id,
  });

  return (
    <main>
      <h1>Editar tarefa</h1>
      <TaskForm task={task} />
    </main>
  );
}
