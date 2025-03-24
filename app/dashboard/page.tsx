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

// Add this interface at the top of the file, before the component
interface UserType {
  id: string
  name: string
  email: string
  role: string
  department?: string
}

// Mock data
const courses = [
  { id: "CS101", name: "Introduction to Computer Science", credits: 3, grade: "A", attendance: 92 },
  { id: "MATH201", name: "Advanced Calculus", credits: 4, grade: "B+", attendance: 88 },
  { id: "ENG102", name: "English Composition", credits: 3, grade: "A-", attendance: 95 },
  { id: "PHYS101", name: "Physics I", credits: 4, grade: "B", attendance: 85 },
  { id: "HIST105", name: "World History", credits: 3, grade: "A", attendance: 90 },
]

const announcements = [
  {
    id: 1,
    title: "Midterm Exam Schedule",
    date: "2023-10-15",
    content:
      "Midterm exams will be held from October 25-29. Please check your course schedule for specific dates and times.",
  },
  {
    id: 2,
    title: "Campus Closure",
    date: "2023-10-10",
    content: "The campus will be closed on October 18 for maintenance. All classes will be conducted online.",
  },
  {
    id: 3,
    title: "Registration for Next Semester",
    date: "2023-10-05",
    content:
      "Registration for the Spring semester will open on November 1. Please meet with your advisor before registering.",
  },
]

const assignments = [
  { id: 1, course: "CS101", title: "Programming Assignment 3", dueDate: "2023-10-20", status: "pending" },
  { id: 2, course: "MATH201", title: "Problem Set 5", dueDate: "2023-10-18", status: "submitted" },
  { id: 3, course: "ENG102", title: "Research Paper Draft", dueDate: "2023-10-25", status: "pending" },
  { id: 4, course: "PHYS101", title: "Lab Report 2", dueDate: "2023-10-15", status: "graded", grade: "92/100" },
]

const schedule = [
  {
    day: "Monday",
    classes: [
      { course: "CS101", time: "09:00 - 10:30", room: "Tech Building 305" },
      { course: "MATH201", time: "13:00 - 14:30", room: "Science Hall 210" },
    ],
  },
  { day: "Tuesday", classes: [{ course: "ENG102", time: "11:00 - 12:30", room: "Humanities 110" }] },
  {
    day: "Wednesday",
    classes: [
      { course: "CS101", time: "09:00 - 10:30", room: "Tech Building 305" },
      { course: "PHYS101", time: "15:00 - 17:00", room: "Science Hall 150" },
    ],
  },
  {
    day: "Thursday",
    classes: [
      { course: "ENG102", time: "11:00 - 12:30", room: "Humanities 110" },
      { course: "HIST105", time: "14:00 - 15:30", room: "Humanities 220" },
    ],
  },
  {
    day: "Friday",
    classes: [
      { course: "MATH201", time: "13:00 - 14:30", room: "Science Hall 210" },
      { course: "PHYS101", time: "15:00 - 16:00", room: "Science Hall 150" },
    ],
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
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
                3
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
                <div className="text-2xl font-bold">3.75</div>
                <p className="text-xs text-muted-foreground">Out of 4.0</p>
                <Progress value={93} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Credits Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">Out of 120 required</p>
                <Progress value={37.5} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
                <Progress value={92} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Due this week</p>
                <Progress value={60} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="courses" className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Courses</CardTitle>
                  <CardDescription>You are enrolled in 5 courses this semester</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Attendance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.id}</TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>{course.credits}</TableCell>
                          <TableCell>{course.grade}</TableCell>
                          <TableCell>{course.attendance}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                  {schedule.map((day) => (
                    <div key={day.day} className="mb-4">
                      <h3 className="mb-2 font-semibold">{day.day}</h3>
                      {day.classes.length > 0 ? (
                        <div className="space-y-2">
                          {day.classes.map((cls, index) => (
                            <div key={index} className="rounded-lg border p-3">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{cls.course}</div>
                                <Badge variant="outline">{cls.time}</Badge>
                              </div>
                              <div className="mt-1 text-sm text-muted-foreground">{cls.room}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No classes scheduled</div>
                      )}
                    </div>
                  ))}
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
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <div className="font-medium">{assignment.title}</div>
                          <div className="text-sm text-muted-foreground">Course: {assignment.course}</div>
                          <div className="mt-1 flex items-center text-sm">
                            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                            Due: {assignment.dueDate}
                          </div>
                        </div>
                        <div>
                          {assignment.status === "pending" && <Badge className="bg-yellow-500">Pending</Badge>}
                          {assignment.status === "submitted" && <Badge className="bg-blue-500">Submitted</Badge>}
                          {assignment.status === "graded" && (
                            <div className="text-right">
                              <Badge className="bg-green-500">Graded</Badge>
                              <div className="mt-1 text-sm font-medium">{assignment.grade}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="announcements" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>Important updates and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{announcement.title}</h3>
                          <Badge variant="outline">{announcement.date}</Badge>
                        </div>
                        <p className="mt-2 text-sm">{announcement.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

