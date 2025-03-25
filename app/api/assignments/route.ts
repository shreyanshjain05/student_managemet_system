import { NextRequest, NextResponse } from "next/server"; 
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

// get all assignments
export async function Get(request: NextRequest) {
  try{
    const {searchParams} = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const courseCode = searchParams.get('courseCode');
    const status = searchParams.get('status');
    const whereClause:{
      student_id?:string,
      course_code?:string,
      status?:string
    } =  {};
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
