"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { EditTaskDialog } from "./edit-task-dialog"
import { useToast } from "@/hooks/use-toast"

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/tasks")
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskCompletion = async (task: Task) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          completed: !task.completed,
        }),
      })

      if (response.ok) {
        fetchTasks()
        toast({
          title: "Success",
          description: `Task marked as ${!task.completed ? "completed" : "incomplete"}`,
        })
      }
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchTasks()
        toast({
          title: "Success",
          description: "Task deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No tasks found. Create a new task to get started.</div>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} className="shadow-sm">
            <CardContent className="p-4 flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`font-medium block ${task.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </label>
                  {task.description && (
                    <p
                      className={`mt-1 text-sm ${task.completed ? "text-muted-foreground line-through" : "text-muted-foreground"}`}
                    >
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="ghost" size="icon" onClick={() => setEditTask(task)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {editTask && (
        <EditTaskDialog
          task={editTask}
          open={!!editTask}
          onOpenChange={(open) => {
            if (!open) setEditTask(null)
          }}
          onTaskUpdated={() => {
            fetchTasks()
            setEditTask(null)
          }}
        />
      )}
    </div>
  )
}

