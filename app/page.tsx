import TaskList from "@/components/task-list"
import { CreateTaskForm } from "@/components/create-task-form"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Task Management</h1>
      <div className="max-w-3xl mx-auto">
        <CreateTaskForm />
        <TaskList />
      </div>
    </main>
  )
}

