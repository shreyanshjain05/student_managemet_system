import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const pastAssignments = await prisma.assignmentsPast.findMany({
      where: {
        student_id: studentId
      },
      select: {
        id: true,
        title: true,
        course_code: true,
        due_date: true,
        grade: true
      },
      orderBy: {
        due_date: 'desc'
      }
    });
    
    return NextResponse.json(pastAssignments);
  } catch (error) {
    console.error('Error fetching past assignments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}