/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, useCallback } from "react"
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

export default function AssignmentsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState<any[]>([])
  const [pastAssignments, setPastAssignments] = useState<any[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null)
  const [filterCourse, setFilterCourse] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [fetchingData, setFetchingData] = useState(true)

  const fetchAssignments = useCallback(async (studentId: string) => {
    try {
      console.log(`Fetching ongoing assignments for student: ${studentId}`);
      
      // Use absolute URL to ensure correct routing in App Router
      const apiUrl = `/api/assignments-ongoing?studentId=${studentId}`;
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        cache: 'no-store', // Prevents caching
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      // Format the data to match our component's expectations
      const formattedData = data.map((item: any) => ({
        id: item.id,
        course: item.course_code,
        courseName: item.course_name,
        title: item.title,
        description: item.description,
        dueDate: formatDate(item.due_date),
        status: item.status.toLowerCase(),
        progress: item.status.toLowerCase() === "pending" ? calculateProgress(item.due_date) : 0
      }));
      
      console.log('Formatted data:', formattedData);
      setAssignments(formattedData);
    } catch (error) {
      console.error("Failed to fetch ongoing assignments:", error);
      setAssignments([]);
    } finally {
      setFetchingData(false);
    }
  }, []);
  
  const fetchPastAssignments = useCallback(async (studentId: string) => {
    try {
      console.log(`Fetching past assignments for student: ${studentId}`);
      
      // Use absolute URL to ensure correct routing in App Router
      const apiUrl = `/api/assignments-past?studentId=${studentId}`;
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        cache: 'no-store', // Prevents caching
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      // Format the data to match our component's expectations
      const formattedData = data.map((item: any) => ({
        id: item.id,
        course: item.course_code,
        title: item.title,
        dueDate: formatDate(item.due_date),
        status: "graded",
        grade: item.grade
      }));
      
      console.log('Formatted data:', formattedData);
      setPastAssignments(formattedData);
    } catch (error) {
      console.error("Failed to fetch past assignments:", error);
      setPastAssignments([]);
    } finally {
      setFetchingData(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setLoading(false)
    
    // Fetch current assignments
    fetchAssignments(parsedUser.id)
    
    // Fetch past assignments
    fetchPastAssignments(parsedUser.id)
  }, [router, fetchAssignments, fetchPastAssignments])
  
  // Format date from ISO string to YYYY-MM-DD
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }
  
  // Calculate progress based on due date (just a simple implementation)
  const calculateProgress = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const totalDays = 14 // Assuming assignments are typically given 2 weeks before due
    const daysLeft = Math.max(0, Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    return Math.min(100, Math.max(0, Math.round((totalDays - daysLeft) / totalDays * 100)))
  }

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
                  {Array.from(new Set(assignments.map(a => a.course))).map(course => (
                    <SelectItem key={course} value={course as string}>{course}</SelectItem>
                  ))}
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
              {fetchingData ? (
                <div className="flex items-center justify-center py-10">
                  <div className="text-center">Loading assignments...</div>
                </div>
              ) : selectedAssignment ? (
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
                  {fetchingData ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="text-center">Loading past assignments...</div>
                    </div>
                  ) : pastAssignments.length > 0 ? (
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
                  ) : (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">No past assignments found</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        You don`t have any completed assignments yet.
                      </p>
                    </div>
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
