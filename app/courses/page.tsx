"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Calendar, GraduationCap, Home, LogOut, Settings, User, FileText, Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Add this interface at the top of the file, before the component
interface User {
  id: string
  name: string
  email: string
  role: string
  department?: string
}

// Mock data
const courses = [
  {
    id: "CS101",
    name: "Introduction to Computer Science",
    credits: 3,
    grade: "A",
    attendance: 92,
    instructor: "Dr. Alan Turing",
    description:
      "An introduction to the fundamental concepts of computer science including algorithms, data structures, and problem-solving techniques.",
    materials: [
      { name: "Lecture Notes Week 1-5", type: "PDF" },
      { name: "Programming Assignment Guidelines", type: "DOC" },
      { name: "Textbook: Introduction to Algorithms", type: "Book" },
    ],
  },
  {
    id: "MATH201",
    name: "Advanced Calculus",
    credits: 4,
    grade: "B+",
    attendance: 88,
    instructor: "Dr. Katherine Johnson",
    description:
      "A comprehensive study of differential and integral calculus, including applications in physics and engineering.",
    materials: [
      { name: "Calculus Formula Sheet", type: "PDF" },
      { name: "Problem Sets 1-3", type: "PDF" },
      { name: "Textbook: Advanced Calculus", type: "Book" },
    ],
  },
  {
    id: "ENG102",
    name: "English Composition",
    credits: 3,
    grade: "A-",
    attendance: 95,
    instructor: "Prof. Jane Austen",
    description:
      "Development of writing skills with emphasis on grammar, organization, and the crafting of academic arguments.",
    materials: [
      { name: "Essay Writing Guidelines", type: "PDF" },
      { name: "Grammar Reference", type: "PDF" },
      { name: "Textbook: Elements of Style", type: "Book" },
    ],
  },
  {
    id: "PHYS101",
    name: "Physics I",
    credits: 4,
    grade: "B",
    attendance: 85,
    instructor: "Dr. Richard Feynman",
    description:
      "Introduction to classical mechanics, including Newton's laws, conservation of energy, and rotational motion.",
    materials: [
      { name: "Lab Manual", type: "PDF" },
      { name: "Lecture Slides", type: "PPT" },
      { name: "Textbook: Fundamentals of Physics", type: "Book" },
    ],
  },
  {
    id: "HIST105",
    name: "World History",
    credits: 3,
    grade: "A",
    attendance: 90,
    instructor: "Prof. Howard Zinn",
    description: "Survey of major historical events and developments from ancient civilizations to the modern era.",
    materials: [
      { name: "Timeline of Major Events", type: "PDF" },
      { name: "Primary Source Documents", type: "PDF" },
      { name: "Textbook: A People's History", type: "Book" },
    ],
  },
]

const pastCourses = [
  { id: "CS100", name: "Computer Literacy", credits: 2, grade: "A", semester: "Fall 2022" },
  { id: "MATH101", name: "College Algebra", credits: 3, grade: "A-", semester: "Fall 2022" },
  { id: "ENG101", name: "Basic Composition", credits: 3, grade: "B+", semester: "Fall 2022" },
  { id: "BIO101", name: "Introduction to Biology", credits: 4, grade: "B", semester: "Spring 2023" },
  { id: "PSY101", name: "Introduction to Psychology", credits: 3, grade: "A", semester: "Spring 2023" },
]

export default function CoursesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

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

  const filteredCourses = courses.filter(
    (course) =>
      course.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            <Button variant="secondary" className="w-full justify-start" asChild>
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
            <h1 className="text-lg font-semibold">Courses</h1>
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
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="current">
            <TabsList>
              <TabsTrigger value="current">Current Semester</TabsTrigger>
              <TabsTrigger value="past">Past Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-4">
              {selectedCourse ? (
                <div className="space-y-6">
                  <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                    Back to All Courses
                  </Button>

                  {courses
                    .filter((course) => course.id === selectedCourse)
                    .map((course) => (
                      <div key={course.id} className="space-y-6">
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle>{course.name}</CardTitle>
                                <CardDescription>
                                  {course.id} • {course.credits} Credits
                                </CardDescription>
                              </div>
                              <Badge>{course.grade}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h3 className="font-semibold">Instructor</h3>
                              <p>{course.instructor}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold">Description</h3>
                              <p>{course.description}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold">Attendance</h3>
                              <div className="mt-2 flex items-center gap-2">
                                <Progress value={course.attendance} className="h-2 w-full" />
                                <span className="text-sm font-medium">{course.attendance}%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Course Materials</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {course.materials.map((material, index) => (
                                <li key={index} className="flex items-center justify-between rounded-md border p-3">
                                  <span>{material.name}</span>
                                  <Badge variant="outline">{material.type}</Badge>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{course.id}</CardTitle>
                          <Badge>{course.grade}</Badge>
                        </div>
                        <CardDescription>{course.name}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Credits</span>
                            <span className="font-medium">{course.credits}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Attendance</span>
                            <span className="font-medium">{course.attendance}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Instructor</span>
                            <span className="font-medium">{course.instructor}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Past Courses</CardTitle>
                  <CardDescription>Courses you have completed in previous semesters</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Semester</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.id}</TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>{course.credits}</TableCell>
                          <TableCell>{course.grade}</TableCell>
                          <TableCell>{course.semester}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

