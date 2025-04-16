import { NextRequest,NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request:NextRequest){
    try{
        const searchParams = request.nextUrl.searchParams;
        const student_id = searchParams.get('studentId');

        if (!student_id){
            return NextResponse.json({error:'Student Id is required'} , {status:400})
        }
        const future_schedule = await prisma.scheduleEvents.findMany({
            where:{
                student_id: student_id
            },
            select: {
                title: true,
                time: true,
                location: true,
                date:true
            }
        });
        return NextResponse.json(future_schedule)
    }
    catch(error){
        return NextResponse.json({'Internal Server Error':error} , {status:500})
    }
}