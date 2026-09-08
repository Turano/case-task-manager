import type { Task } from "../types";

// Tasks are kept in memory as requested by the specification.
// The data is not persisted and is lost when the process is restarted.
export const tasks: Task[] = [];
