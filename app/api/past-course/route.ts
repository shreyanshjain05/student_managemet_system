import { NextRequest,NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request:NextRequest){
    try{
        const searchParams = request.nextUrl.searchParams
        const student_id = searchParams.get('studentId')
        if(!student_id){
            return NextResponse.json({error:'Student ID is required'},{status:400})
        }
        const past_course = await prisma.coursesPast.findMany({
            where:{
                student_id: student_id
            },
            select: {
                course_code:true,
                course_name:true,
                credits:true,
                grade:true,
                semester:true
            }
        })
        return NextResponse.json(past_course)

    } catch(error){
        return NextResponse.json({'Internal Serever Error':error},{status:500})
    }
}