import { PrismaClient } from '@prisma/client';
import express , {Request, Response} from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// TEST
// router.get("/test", (req, res) => {
//     try{
//         res.send("Test route is working");
//         res.status(200).json({message: "Test route is working"});
//     }catch(error){
//         res.status(500).json({error: "Error in test route"});
//     }
// });


import { NextResponse } from 'next/server';
export async function GET() {
    return NextResponse.json({message: 'Hello from the API!'});
}
    

router.get('/profile' , async(req:Request , res:Response) => {
    try{
        const {student_id} = req.query;
        console.log('Request query:', req.query);
        if(!student_id){
            return res.status(400).json({error: 'Student ID is required'});
        }
        const profile = await prisma.profilePersonal.findUnique({
            where: {
                student_id: student_id as string
            },
            select:{
                student_id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                department: true,
                bio: true,

            }
        });
        return res.json(profile);
        }catch(error){
            console.error('Error fetching profile:', error);
            return res.status(500).json({error: 'Internal server error'});
        }
    });
    

    router.get('/profile-academic', async (req:Request, res:Response) => {
        try{
            const {student_id} = req.query;
            console.log('Request query:', req.query);
            if(!student_id){
                return res.status(400).json({error: 'Student ID is required'});
            }
            const profileacademic = await prisma.profileAcademic.findUnique({
                where: {
                    student_id: student_id as string
                },
                select:{
                    program:true,
                    academic_status:true,
                    enrollment_status: true,
                    academic_advisor:true,
                    advisor_email:true,
                    expected_graduation:true
                }
            });
            return res.json(profileacademic);
        } catch(error) {
            console.error('Error fetching academic profile:', error);
            return res.status(500).json({error: 'Internal server error'});
        }
    });

    export default router;