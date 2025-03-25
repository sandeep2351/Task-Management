import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ message: "Error fetching task" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validate request body
    if (!body.title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 })
    }

    const task = await prisma.task.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        description: body.description,
        completed: body.completed !== undefined ? body.completed : undefined,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error updating task:", error)

    // Check if it's a Prisma record not found error
    if ((error as any).code === "P2025") {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Error updating task" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.task.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Error deleting task:", error)

    // Check if it's a Prisma record not found error
    if ((error as any).code === "P2025") {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Error deleting task" }, { status: 500 })
  }
}

