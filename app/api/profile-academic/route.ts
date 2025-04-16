import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    console.log('Request query:', { studentId });
    
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }
    
    const profileacademic = await prisma.profileAcademic.findUnique({
      where: {
        student_id: studentId
      },
      select: {
        program: true,
        academic_status: true,
        enrollment_status: true,
        academic_advisor: true,
        advisor_email: true,
        expected_graduation: true
      }
    });
    
    return NextResponse.json(profileacademic);
  } catch (error) {
    console.error('Error fetching academic profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}