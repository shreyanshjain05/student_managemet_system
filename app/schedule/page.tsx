"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Home,
  LogOut,
  Settings,
  User,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// User interface
interface User {
  id: string
  name: string
  email: string
  role: string
  department?: string
}

// Define interfaces for API responses
interface ClassSchedule {
  day: string
  course_code: string
  course_name: string
  instructor: string
  room: string
  time: string
}

interface EventSchedule {
  title: string
  date: string
  time: string
  location: string
}

// Define the class object type to fix TypeScript error
interface ClassItem {
  course: string
  name: string
  time: string
  room: string
  instructor: string
}

// Group classes by day for display
interface ScheduleByDay {
  day: string
  classes: ClassItem[]  // Now properly typed as an array of ClassItem
}

export default function SchedulePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [scheduleLoading, setScheduleLoading] = useState(true)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentWeek] = useState("Oct 23 - Oct 29, 2023")
  const [viewType, setViewType] = useState("week")
  
  // State for API data
  const [scheduleData, setScheduleData] = useState<ScheduleByDay[]>([])
  const [eventsData, setEventsData] = useState<EventSchedule[]>([])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userData)
    setUser(user)
    setLoading(false)

    // Fetch schedule data
    fetchScheduleData(user.id)
    fetchEventsData(user.id)
  }, [router])

  const fetchScheduleData = async (studentId: string) => {
    try {
      setScheduleLoading(true)
      const response = await fetch(`/api/schedule-current?studentId=${studentId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch schedule: ${response.status}`)
      }
      
      const data: ClassSchedule[] = await response.json()
      
      // Process and group the data by day
      const groupedByDay = groupScheduleByDay(data)
      setScheduleData(groupedByDay)
    } catch (err) {
      console.error("Error fetching schedule:", err)
      setError("Failed to load schedule data")
    } finally {
      setScheduleLoading(false)
    }
  }

  const fetchEventsData = async (studentId: string) => {
    try {
      setEventsLoading(true)
      const response = await fetch(`/api/schedule-future?studentId=${studentId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`)
      }
      
      const data: EventSchedule[] = await response.json()
      setEventsData(data)
    } catch (err) {
      console.error("Error fetching events:", err)
      setError("Failed to load events data")
    } finally {
      setEventsLoading(false)
    }
  }

  // Helper function to group schedule by day
  const groupScheduleByDay = (classes: ClassSchedule[]): ScheduleByDay[] => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    // Initialize the days array with properly typed empty classes arrays
    const groupedSchedule: ScheduleByDay[] = daysOfWeek.map(day => ({
      day,
      classes: [] as ClassItem[]  // Explicitly type as ClassItem[]
    }));
    
    // Group classes by day
    classes.forEach(cls => {
      const dayIndex = daysOfWeek.indexOf(cls.day);
      if (dayIndex !== -1) {
        groupedSchedule[dayIndex].classes.push({
          course: cls.course_code,
          name: cls.course_name,
          time: cls.time,
          room: cls.room,
          instructor: cls.instructor
        });
      }
    });
    
    return groupedSchedule;
  };

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
            <Button variant="secondary" className="w-full justify-start" asChild>
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
            <h1 className="text-lg font-semibold">Schedule</h1>
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
          <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <h2 className="text-2xl font-bold">Class Schedule</h2>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">{currentWeek}</span>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Schedule</CardTitle>
                  <CardDescription>Your class schedule for this week</CardDescription>
                </CardHeader>
                <CardContent>
                  {scheduleLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="text-center">Loading schedule...</div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {scheduleData.map((day) => (
                        <div key={day.day} className="space-y-3">
                          <h3 className="font-semibold">{day.day}</h3>
                          {day.classes.length > 0 ? (
                            <div className="space-y-2">
                              {day.classes.map((cls, index) => (
                                <div key={index} className="rounded-lg border p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium">
                                      {cls.course}: {cls.name}
                                    </div>
                                    <Badge variant="outline">{cls.time}</Badge>
                                  </div>
                                  <div className="mt-2 text-sm text-muted-foreground">
                                    <div>Room: {cls.room}</div>
                                    <div>Instructor: {cls.instructor}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">No classes scheduled</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Important dates and events</CardDescription>
                </CardHeader>
                <CardContent>
                  {eventsLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="text-center">Loading events...</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {eventsData.length > 0 ? (
                        eventsData.map((event, index) => (
                          <div key={index} className="rounded-lg border p-3">
                            <div className="font-medium">{event.title}</div>
                            <div className="mt-1 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                {event.date}
                              </div>
                              <div className="mt-1 flex items-center text-muted-foreground">
                                <Clock className="mr-1 h-4 w-4" />
                                {event.time}
                              </div>
                              <div className="mt-1 text-muted-foreground">Location: {event.location}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No upcoming events</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Clock component
function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}