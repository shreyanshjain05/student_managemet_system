import { NextRequest, NextResponse } from "next/server"; 
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

// get all assignments
export async function GET(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Destructure potential filter parameters
    const { studentId, courseCode, status } = body;

    // Construct where clause dynamically
    const whereClause: {
      student_id?: string,
      course_code?: string,
      status?: string
    } = {};

    if (studentId) whereClause.student_id = studentId;
    if (courseCode) whereClause.course_code = courseCode;
    if (status) whereClause.status = status;

    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      include: {
        student: true,
        course: true
      },
      orderBy: {
        due_date: 'asc'
      }
    });

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve assignments' 
    }, { status: 500 });
  }
}