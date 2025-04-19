import { NextRequest,NextResponse } from "next/server";
import prisma  from "@/lib/prisma";

export async function GET(request:NextRequest){
    const searchParams = request.nextUrl.searchParams
    const student_id = searchParams.get('studentId')
    try{
        if(!student_id){
            return NextResponse.json({error:'Student ID  is requirede'},{status:400});
            }
        const current_course = await prisma.coursesCurrent.findMany({
            where: {
                student_id: student_id,
            },
            select: {
                course_code: true,
                course_name: true,
                credits: true,
                grade: true,
                attendance_percentage: true,
                instructor:true,
                description:true
            }
        });
        return NextResponse.json(current_course);

    } catch(error){
        return NextResponse.json({'Internal Server error':error},{status:400})
    }
}
