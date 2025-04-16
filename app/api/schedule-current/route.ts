import { NextRequest , NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(request:NextRequest){
    try{
        const searchParams = request.nextUrl.searchParams;
        const studentID = searchParams.get('studentId')
        console.log('Recieved query',{studentID})

        if (!studentID){
            return NextResponse.json({error: 'studentID is Required'}, {status: 400});
        }
        const current_schedule = await prisma.scheduleCurrent.findMany({
            where:{
                student_id:studentID
            },
            select: {
                day:true,
                course_code:true,
                course_name:true,
                instructor:true,
                room:true,
                time:true
            }

        })
        return NextResponse.json(current_schedule)

    } catch(error){
        console.error('Error fetching schedule' , error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }


}