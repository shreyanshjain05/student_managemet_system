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
    const profile = await prisma.profilePersonal.findUnique({
      where: {
        student_id: studentId
      },
      select: {
        student_id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        department: true,
        bio: true,
      }
    });
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}