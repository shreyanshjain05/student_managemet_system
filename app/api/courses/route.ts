import { NextRequest, NextResponse } from "next/server";   
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

// get all courses 
export async function GET(request: NextRequest) {
    try {
        // Parse the request body
        const body = await request.json();

        // Destructure potential filter parameters
        const { 
            studentId, 
            courseCode, 
            courseName, 
            instructor,
            minCredits,
            maxCredits,
            grade
        } = body;

        const courses = await prisma.coursesCurrent.findMany({
            where: {
                ...(studentId && { student_id: studentId }),
                ...(courseCode && { course_code: courseCode }),
                ...(courseName && { course_name: { contains: courseName } }),
                ...(instructor && { instructor: instructor }),
                ...(minCredits && { credits: { gte: minCredits } }),
                ...(maxCredits && { credits: { lte: maxCredits } }),
                ...(grade && { grade: grade })
            },
            include: {
                student: true,
                courseMaterials: true,
                schedules: true,
                assignments: true
            },
            orderBy: {
                course_code: 'asc'
            }
        });

        // Return the courses with a 200 status code
        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ 
            error: 'Failed to retrieve courses' 
        }, { status: 500 });
    }
}