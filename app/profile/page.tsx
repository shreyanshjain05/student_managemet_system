"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  Mail,
  Phone,
  MapPin,
  Building,
  Pencil,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


// Add interfaces for the API responses
interface PersonalProfile {
  student_id: string
  name: string
  email: string
  phone: string
  address: string
  department: string
  bio: string
}

interface AcademicProfile {
  program: string
  academic_status: string
  enrollment_status: string
  academic_advisor: string
  advisor_email: string
  expected_graduation: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
  department?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [personalProfile, setPersonalProfile] = useState<PersonalProfile | null>(null)
  const [academicProfile, setAcademicProfile] = useState<AcademicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    department: "",
    bio: "",
  })

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Fetch personal profile data
    fetchPersonalProfile(parsedUser.id)
    
    // Fetch academic profile data
    fetchAcademicProfile(parsedUser.id)
  }, [router])

  const fetchPersonalProfile = async (studentId: string) => {
    try {
      const response = await fetch(`/api/profile-personal?studentId=${studentId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch personal profile')
      }
      
      const data = await response.json()
      setPersonalProfile(data)
      
      // Initialize form data with personal profile info
      if (data) {
        const nameParts = data.name.split(" ")
        setFormData({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          department: data.department || "",
          bio: data.bio || "",
        })
      }
      
    } catch (error) {
      console.error("Error fetching personal profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAcademicProfile = async (studentId: string) => {
    try {
      const response = await fetch(`/api/profile-academic?studentId=${studentId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch academic profile')
      }
      
      const data = await response.json()
      setAcademicProfile(data)
      
    } catch (error) {
      console.error("Error fetching academic profile:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real application, you would update the profile in the database
    // For now, we'll just update the local state to simulate the API call
    
    try {

      const updatedPersonalProfile = {
        student_id: user?.id || "",
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        department: formData.department,
        bio: formData.bio,
      }
      
      setPersonalProfile(updatedPersonalProfile)
      
      // Update user in localStorage for consistency
      if (user) {
        const updatedUser = {
          ...user,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          department: formData.department,
        }
        
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
      }
      
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
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
            <Button variant="secondary" className="w-full justify-start" asChild>
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
            <h1 className="text-lg font-semibold">Profile</h1>
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
            <h2 className="text-2xl font-bold">My Profile</h2>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" alt={personalProfile?.name} />
                      <AvatarFallback>
                        {personalProfile?.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4">{personalProfile?.name}</CardTitle>
                    <CardDescription>Student ID: {personalProfile?.student_id}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{personalProfile?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{personalProfile?.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{personalProfile?.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Department: {personalProfile?.department}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              {isEditing ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" name="department" value={formData.department} onChange={handleChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} />
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Save Changes</Button>
                  </CardFooter>
                </Card>
              ) : (
                <Tabs defaultValue="info">
                  <TabsList>
                    <TabsTrigger value="info">Personal Info</TabsTrigger>
                    <TabsTrigger value="academic">Academic Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-semibold">Bio</h3>
                          <p className="mt-1 text-muted-foreground">
                            {personalProfile?.bio || "No bio available."}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold">Contact Information</h3>
                          <div className="mt-1 space-y-2">
                            <div className="flex items-center">
                              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{personalProfile?.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{personalProfile?.phone}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold">Address</h3>
                          <div className="mt-1">
                            <p>{personalProfile?.address}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="academic" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Academic Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-semibold">Program</h3>
                          <p className="mt-1">{academicProfile?.program || "Not available"}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold">Academic Status</h3>
                          <Badge className="mt-1">{academicProfile?.academic_status || "Not available"}</Badge>
                        </div>

                        <div>
                          <h3 className="font-semibold">Enrollment Status</h3>
                          <p className="mt-1">{academicProfile?.enrollment_status || "Not available"}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold">Academic Advisor</h3>
                          <p className="mt-1">{academicProfile?.academic_advisor || "Not available"}</p>
                          <p className="text-sm text-muted-foreground">
                            Email: {academicProfile?.advisor_email || "Not available"}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold">Expected Graduation</h3>
                          <p className="mt-1">{academicProfile?.expected_graduation || "Not available"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}