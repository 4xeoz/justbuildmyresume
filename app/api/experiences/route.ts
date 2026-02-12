// @ts-nocheck
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { experienceSchema } from "@/lib/validations/profile"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const experiences = await prisma.experience.findMany({
      where: { userId: session.user.id },
      include: {
        highlights: {
          orderBy: { displayOrder: 'asc' }
        }
      },
      orderBy: { displayOrder: 'asc' }
    })

    return NextResponse.json({ experiences })
  } catch (error) {
    console.error("Get experiences error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = experienceSchema.parse(body)

    const experience = await prisma.experience.create({
      data: {
        userId: session.user.id,
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      },
      include: {
        highlights: true
      }
    })

    return NextResponse.json({ experience }, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Create experience error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
