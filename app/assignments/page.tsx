/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Calendar, GraduationCap, Home, LogOut, Settings, User, FileText, Bell, Clock, Filter, Upload } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// Mock data
const assignments = [
  { 
    id: 1, 
    course: "CS101", 
    courseName: "Introduction to Computer Science",
    title: "Programming Assignment 3", 
    description: "Implement a binary search tree with insertion, deletion, and traversal operations.",
    dueDate: "2023-10-20", 
    status: "pending",
    progress: 25
  },
  { 
    id: 2, 
    course: "MATH201", 
    courseName: "Advanced Calculus",
    title: "Problem Set 5", 
    description: "Solve problems related to multivariable calculus and vector fields.",
    dueDate: "2023-10-18", 
    status: "submitted",
    submittedDate: "2023-10-17"
  },
  { 
    id: 3, 
    course: "ENG102", 
    courseName: "English Composition",
    title: "Research Paper Draft", 
    description: "Submit a draft of your research paper on the assigned topic.",
    dueDate: "2023-10-25", 
    status: "pending",
    progress: 60
  },
  { 
    id: 4, 
    course: "PHYS101", 
    courseName: "Physics I",
    title: "Lab Report 2", 
    description: "Write a report on the pendulum experiment conducted in lab.",
    dueDate: "2023-10-15", 
    status: "graded", 
    grade: "92/100",
    feedback: "Excellent analysis of the data. Your conclusions are well-supported by your observations."
  },
  { 
    id: 5, 
    course: "HIST105", 
    courseName: "World History",
    title: "Essay on Industrial Revolution", 
    description: "Write a 1500-word essay on the social impacts of the Industrial Revolution.",
    dueDate: "2023-10-30", 
    status: "pending",
    progress: 10
  }
]

const pastAssignments = [
  { id: 101, course: "CS101", title: "Programming Assignment 1", dueDate: "2023-09-15", status: "graded", grade: "95/100" },
  { id: 102, course: "CS101", title: "Programming Assignment 2", dueDate: "2023-09-30", status: "graded", grade: "88/100" },
  { id: 103, course: "MATH201", title: "Problem Set 1", dueDate: "2023-09-10", status: "graded", grade: "90/100" },
  { id: 104, course: "MATH201", title: "Problem Set 2", dueDate: "2023-09-17", status: "graded", grade: "85/100" },
  { id: 105, course: "MATH201", title: "Problem Set 3", dueDate: "2023-09-24", status: "graded", grade: "92/100" },
  { id: 106, course: "MATH201", title: "Problem Set 4", dueDate: "2023-10-01", status: "graded", grade: "88/100" },
  { id: 107, course: "ENG102", title: "Essay 1", dueDate: "2023-09-20", status: "graded", grade: "A-" },
  { id: 108, course: "PHYS101", title: "Lab Report 1", dueDate: "2023-09-25", status: "graded", grade: "85/100" },
]

export default function AssignmentsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null)
  const [filterCourse, setFilterCourse] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

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

  const filteredAssignments = assignments.filter(assignment => {
    if (filterCourse !== "all" && assignment.course !== filterCourse) return false
    if (filterStatus !== "all" && assignment.status !== filterStatus) return false
    return true
  })

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
            <AvatarFallback>{user?.name?.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
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
            <Button variant="secondary" className="w-full justify-start" asChild>
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
            <h1 className="text-lg font-semibold">Assignments</h1>
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
              <AvatarFallback>{user?.name?.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <h2 className="text-2xl font-bold">My Assignments</h2>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Filter:</span>
              </div>
              
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="CS101">CS101</SelectItem>
                  <SelectItem value="MATH201">MATH201</SelectItem>
                  <SelectItem value="ENG102">ENG102</SelectItem>
                  <SelectItem value="PHYS101">PHYS101</SelectItem>
                  <SelectItem value="HIST105">HIST105</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="current">
            <TabsList>
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="mt-4">
              {selectedAssignment ? (
                <div className="space-y-6">
                  <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
                    Back to All Assignments
                  </Button>
                  
                  {assignments.filter(assignment => assignment.id === selectedAssignment).map(assignment => (
                    <div key={assignment.id} className="space-y-6">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle>{assignment.title}</CardTitle>
                              <CardDescription>{assignment.course}: {assignment.courseName}</CardDescription>
                            </div>
                            <Badge className={
                              assignment.status === "pending" ? "bg-yellow-500" :
                              assignment.status === "submitted" ? "bg-blue-500" :
                              "bg-green-500"
                            }>
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h3 className="font-semibold">Description</h3>
                            <p>{assignment.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">Due Date</h3>
                              <p>{assignment.dueDate}</p>
                            </div>
                            
                            {assignment.status === "submitted" && (
                              <div className="text-right">
                                <h3 className="font-semibold">Submitted Date</h3>
                                <p>{assignment.submittedDate}</p>
                              </div>
                            )}
                            
                            {assignment.status === "graded" && (
                              <div className="text-right">
                                <h3 className="font-semibold">Grade</h3>
                                <p>{assignment.grade}</p>
                              </div>
                            )}
                          </div>
                          
                          {assignment.status === "pending" && (
                            <div>
                              <h3 className="font-semibold">Progress</h3>
                              <div className="mt-2 flex items-center gap-2">
                                <Progress value={assignment.progress} className="h-2 w-full" />
                                <span className="text-sm font-medium">{assignment.progress}%</span>
                              </div>
                            </div>
                          )}
                          
                          {assignment.status === "graded" && assignment.feedback && (
                            <div>
                              <h3 className="font-semibold">Feedback</h3>
                              <p>{assignment.feedback}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {assignment.status === "pending" && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Submit Assignment</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid w-full max-w-sm items-center gap-1.5">
                                <label htmlFor="file" className="text-sm font-medium">Upload File</label>
                                <Input id="file" type="file" />
                              </div>
                              <div className="flex items-center gap-2">
                                <Button>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Submit Assignment
                                </Button>
                                <Button variant="outline">Save Draft</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((assignment) => (
                      <Card key={assignment.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedAssignment(assignment.id)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{assignment.title}</div>
                              <div className="text-sm text-muted-foreground">{assignment.course}: {assignment.courseName}</div>
                            </div>
                            <Badge className={
                              assignment.status === "pending" ? "bg-yellow-500" :
                              assignment.status === "submitted" ? "bg-blue-500" :
                              "bg-green-500"
                            }>
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center text-sm">
                            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Due: {assignment.dueDate}</span>
                          </div>
                          {assignment.status === "pending" && (
                            <div className="mt-2 flex items-center gap-2">
                              <Progress value={assignment.progress} className="h-2 w-full" />
                              <span className="text-xs font-medium">{assignment.progress}%</span>
                            </div>
                          )}
                          {assignment.status === "graded" && (
                            <div className="mt-2 text-sm font-medium">Grade: {assignment.grade}</div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">No assignments found</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Try changing your filters or check back later.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Past Assignments</CardTitle>
                  <CardDescription>Assignments you have completed in previous weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastAssignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <div className="font-medium">{assignment.title}</div>
                          <div className="text-sm text-muted-foreground">Course: {assignment.course}</div>
                          <div className="mt-1 flex items-center text-sm">
                            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                            Due: {assignment.dueDate}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-500">Graded</Badge>
                          <div className="mt-1 text-sm font-medium">{assignment.grade}</div>
                        </div>
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
