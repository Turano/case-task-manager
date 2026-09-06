import TaskForm from "../task-form";

export default function CreateTaskPage() {
  return (
    <section className="my-auto gap-4">
      <h1 className="text-2xl font-bold text-center">Criar tarefa</h1>
      <TaskForm />
    </section>
  );
}
