import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    console.log("Received query:", { studentId });

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        student_id: studentId
      },
      select: {
        id: true,
        title: true,
        course_code: true,
        course_name: true,
        due_date: true,
        status: true,
        description: true,
      },
      orderBy: {
        due_date: 'asc'
      }
    });
    console.log("Fetched assignments:", assignments);

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}