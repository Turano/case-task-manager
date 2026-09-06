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
    <section className="my-auto gap-4">
      <h1 className="text-2xl font-bold text-center">Editar tarefa</h1>
      <TaskForm task={task} />
    </section>
  );
}
