import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/assignments', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.query;
    console.log("Received query:", req.query);

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        student_id: studentId as string
      },
      select: {
        id: true,
        title: true,
        course_code: true,
        course_name: true,
        due_date: true,
        status: true,
        description: true,
      },
      orderBy: {
        due_date: 'asc'
      }
    });
    console.log("Fetched assignments:", assignments);

    return res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/past-assignments', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.query;
    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }
    
    const pastAssignments = await prisma.assignmentsPast.findMany({
      where: {
        student_id: studentId as string
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
    return res.json(pastAssignments);
  } catch (error) {
    console.error('Error fetching past assignments:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;