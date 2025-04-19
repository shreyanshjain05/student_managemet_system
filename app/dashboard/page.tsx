"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, GraduationCap, Home, LogOut, Settings, User, FileText, Bell, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

// Add interfaces for API responses
interface UserType {
  id: string
  name: string
  email: string
  role: string
  department?: string
}

interface CourseType {
  course_code: string
  course_name: string
  credits: number
  grade: string
  attendance_percentage: number
}

interface ScheduleType {
  day: string
  course_code: string
  course_name: string
  instructor: string
  room: string
  time: string
}

interface AssignmentType {
  id: number
  title: string
  course_code: string
  course_name: string
  due_date: string
  status: string
  description: string
  grade?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<CourseType[]>([])
  const [schedule, setSchedule] = useState<ScheduleType[]>([])
  const [assignments, setAssignments] = useState<AssignmentType[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Fetch data from APIs
    fetchData(parsedUser.id)
  }, [router])

  const fetchData = async (studentId: string) => {
    try {
      // Fetch courses
      const coursesResponse = await fetch(`/api/course-current?studentId=${studentId}`)
      if (!coursesResponse.ok) {
        throw new Error('Failed to fetch courses')
      }
      const coursesData = await coursesResponse.json()
      setCourses(coursesData)

      // Fetch schedule
      const scheduleResponse = await fetch(`/api/schedule-current?studentId=${studentId}`)
      if (!scheduleResponse.ok) {
        throw new Error('Failed to fetch schedule')
      }
      const scheduleData = await scheduleResponse.json()
      setSchedule(scheduleData)

      // Fetch assignments
      const assignmentsResponse = await fetch(`/api/assignments-ongoing?studentId=${studentId}`)
      if (!assignmentsResponse.ok) {
        throw new Error('Failed to fetch assignments')
      }
      const assignmentsData = await assignmentsResponse.json()
      setAssignments(assignmentsData)

      setLoading(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Group schedule by day
  const scheduleByDay = schedule.reduce((acc: Record<string, ScheduleType[]>, curr) => {
    if (!acc[curr.day]) {
      acc[curr.day] = []
    }
    acc[curr.day].push(curr)
    return acc
  }, {})

  // Calculate metrics
  const calculateGPA = () => {
    if (courses.length === 0) return 0
    
    const gradePoints: Record<string, number> = {
      'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    }
    
    let totalPoints = 0
    let totalCredits = 0
    
    courses.forEach(course => {
      if (gradePoints[course.grade]) {
        totalPoints += gradePoints[course.grade] * course.credits
        totalCredits += course.credits
      }
    })
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00'
  }
  
  const getTotalCredits = () => {
    return courses.reduce((total, course) => total + course.credits, 0)
  }
  
  const getAverageAttendance = () => {
    if (courses.length === 0) return 0
    return Math.round(courses.reduce((sum, course) => sum + course.attendance_percentage, 0) / courses.length)
  }
  
  const getUpcomingAssignmentsCount = () => {
    const today = new Date()
    const endOfWeek = new Date()
    endOfWeek.setDate(today.getDate() + 7)
    
    return assignments.filter(assignment => {
      const dueDate = new Date(assignment.due_date)
      return dueDate >= today && dueDate <= endOfWeek && assignment.status === 'pending'
    }).length
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-white shadow-sm md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <GraduationCap className="mr-2 h-6 w-6 text-primary" />
          <span className="font-semibold">Student Portal</span>
        </div>
        <div className="flex flex-col items-center space-y-2 border-b py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg" alt={user?.name} />
            <AvatarFallback>
              {user?.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <div className="font-medium">{user?.name}</div>
            <div className="text-sm text-muted-foreground">ID: {user?.id}</div>
          </div>
        </div>
        <nav className="flex-1 overflow-auto p-2">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/courses">
                <BookOpen className="mr-2 h-4 w-4" />
                Courses
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/schedule">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/assignments">
                <FileText className="mr-2 h-4 w-4" />
                Assignments
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </nav>
        <div className="border-t p-2">
          <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4 md:px-6">
          <div className="flex md:hidden">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold">Student Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                {getUpcomingAssignmentsCount()}
              </span>
            </Button>
            <Avatar className="h-8 w-8 md:hidden">
              <AvatarImage src="/placeholder.svg" alt={user?.name} />
              <AvatarFallback>
                {user?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateGPA()}</div>
                <p className="text-xs text-muted-foreground">Out of 4.0</p>
                <Progress value={Number(calculateGPA()) * 25} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Credits Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalCredits()}</div>
                <p className="text-xs text-muted-foreground">Out of 120 required</p>
                <Progress value={(getTotalCredits() / 120) * 100} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getAverageAttendance()}%</div>
                <p className="text-xs text-muted-foreground">Current semester</p>
                <Progress value={getAverageAttendance()} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getUpcomingAssignmentsCount()}</div>
                <p className="text-xs text-muted-foreground">Due this week</p>
                <Progress value={getUpcomingAssignmentsCount() > 0 ? 100 : 0} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="courses" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Courses</CardTitle>
                  <CardDescription>You are enrolled in {courses.length} courses this semester</CardDescription>
                </CardHeader>
                <CardContent>
                  {courses.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course Code</TableHead>
                          <TableHead>Course Name</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead>Attendance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (
                          <TableRow key={course.course_code}>
                            <TableCell className="font-medium">{course.course_code}</TableCell>
                            <TableCell>{course.course_name}</TableCell>
                            <TableCell>{course.credits}</TableCell>
                            <TableCell>{course.attendance_percentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">No courses found</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Schedule</CardTitle>
                  <CardDescription>Your class schedule for this semester</CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(scheduleByDay).length > 0 ? (
                    Object.entries(scheduleByDay).map(([day, classes]) => (
                      <div key={day} className="mb-4">
                        <h3 className="mb-2 font-semibold">{day}</h3>
                        <div className="space-y-2">
                          {classes.map((cls, index) => (
                            <div key={index} className="rounded-lg border p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{cls.course_code}: {cls.course_name}</div>
                                  <div className="text-sm text-muted-foreground">Instructor: {cls.instructor}</div>
                                </div>
                                <Badge variant="outline">{cls.time}</Badge>
                              </div>
                              <div className="mt-1 text-sm text-muted-foreground">{cls.room}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">No schedule found</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assignments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assignments</CardTitle>
                  <CardDescription>Your current and upcoming assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  {assignments.length > 0 ? (
                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <div className="font-medium">{assignment.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {assignment.course_code}: {assignment.course_name}
                            </div>
                            <div className="mt-1 flex items-center text-sm">
                              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                              Due: {new Date(assignment.due_date).toLocaleDateString()}
                            </div>
                            {assignment.description && (
                              <div className="mt-2 text-sm">{assignment.description}</div>
                            )}
                          </div>
                          <div>
                            {assignment.status === "pending" && <Badge className="bg-yellow-500">Pending</Badge>}
                            {assignment.status === "submitted" && <Badge className="bg-blue-500">Submitted</Badge>}
                            {assignment.status === "graded" && (
                              <div className="text-right">
                                <Badge className="bg-green-500">Graded</Badge>
                                {assignment.grade && <div className="mt-1 text-sm font-medium">{assignment.grade}</div>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">No assignments found</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}