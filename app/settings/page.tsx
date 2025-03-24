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
  Lock,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Globe,
  BellRing,
  AlertTriangle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Add this interface at the top of the file, before the component
interface User {
  id: string
  name: string
  email: string
  role: string
  department?: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    browser: true,
    assignments: true,
    grades: true,
    announcements: true,
    events: false,
  })
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    fontSize: "medium",
    language: "english",
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    })
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")

    // Validate password
    if (passwordForm.currentPassword === "") {
      setPasswordError("Current password is required")
      return
    }

    if (passwordForm.newPassword === "") {
      setPasswordError("New password is required")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    // Mock password validation - in a real app, this would be an API call
    if (passwordForm.currentPassword !== "password") {
      setPasswordError("Current password is incorrect")
      return
    }

    // Mock password update
    setPasswordSuccess("Password updated successfully")
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const toggleNotificationSetting = (setting: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting as keyof typeof notificationSettings],
    })
  }

  const handleAppearanceChange = (setting: string, value: string) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [setting]: value,
    })
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
            <Button variant="secondary" className="w-full justify-start" asChild>
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
            <h1 className="text-lg font-semibold">Settings</h1>
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Account Settings</h2>
            <p className="text-muted-foreground">Manage your account preferences and settings</p>
          </div>

          <Tabs defaultValue="password">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  {passwordError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}

                  {passwordSuccess && (
                    <Alert className="mb-4 border-green-500 text-green-500">
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{passwordSuccess}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Password must be at least 8 characters long and include a mix of letters, numbers, and special
                        characters.
                      </p>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button onClick={handlePasswordSubmit}>Update Password</Button>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Additional security settings for your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Lock className="mr-2 h-4 w-4" />
                        <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="twoFactor" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Bell className="mr-2 h-4 w-4" />
                        <Label htmlFor="loginAlerts">Login Alerts</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">Receive notifications for new login attempts</p>
                    </div>
                    <Switch id="loginAlerts" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Notification Channels</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.email}
                        onCheckedChange={() => toggleNotificationSetting("email")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="browserNotifications">Browser Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                      </div>
                      <Switch
                        id="browserNotifications"
                        checked={notificationSettings.browser}
                        onCheckedChange={() => toggleNotificationSetting("browser")}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Notification Types</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <Label htmlFor="assignmentNotifications">Assignment Updates</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">New assignments, due dates, and grading</p>
                      </div>
                      <Switch
                        id="assignmentNotifications"
                        checked={notificationSettings.assignments}
                        onCheckedChange={() => toggleNotificationSetting("assignments")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <BookOpen className="mr-2 h-4 w-4" />
                          <Label htmlFor="gradeNotifications">Grade Updates</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">When new grades are posted</p>
                      </div>
                      <Switch
                        id="gradeNotifications"
                        checked={notificationSettings.grades}
                        onCheckedChange={() => toggleNotificationSetting("grades")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <BellRing className="mr-2 h-4 w-4" />
                          <Label htmlFor="announcementNotifications">Announcements</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">Important announcements from your courses</p>
                      </div>
                      <Switch
                        id="announcementNotifications"
                        checked={notificationSettings.announcements}
                        onCheckedChange={() => toggleNotificationSetting("announcements")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <Label htmlFor="eventNotifications">Events</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">Campus events and activities</p>
                      </div>
                      <Switch
                        id="eventNotifications"
                        checked={notificationSettings.events}
                        onCheckedChange={() => toggleNotificationSetting("events")}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Notification Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize how the student portal looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <div className="flex items-center space-x-4">
                        <Select
                          value={appearanceSettings.theme}
                          onValueChange={(value) => handleAppearanceChange("theme", value)}
                        >
                          <SelectTrigger id="theme" className="w-[180px]">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center">
                                <Sun className="mr-2 h-4 w-4" />
                                Light
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center">
                                <Moon className="mr-2 h-4 w-4" />
                                Dark
                              </div>
                            </SelectItem>
                            <SelectItem value="system">
                              <div className="flex items-center">
                                <Settings className="mr-2 h-4 w-4" />
                                System
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fontSize">Font Size</Label>
                      <Select
                        value={appearanceSettings.fontSize}
                        onValueChange={(value) => handleAppearanceChange("fontSize", value)}
                      >
                        <SelectTrigger id="fontSize" className="w-[180px]">
                          <SelectValue placeholder="Select font size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={appearanceSettings.language}
                        onValueChange={(value) => handleAppearanceChange("language", value)}
                      >
                        <SelectTrigger id="language" className="w-[180px]">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">
                            <div className="flex items-center">
                              <Globe className="mr-2 h-4 w-4" />
                              English
                            </div>
                          </SelectItem>
                          <SelectItem value="spanish">
                            <div className="flex items-center">
                              <Globe className="mr-2 h-4 w-4" />
                              Spanish
                            </div>
                          </SelectItem>
                          <SelectItem value="french">
                            <div className="flex items-center">
                              <Globe className="mr-2 h-4 w-4" />
                              French
                            </div>
                          </SelectItem>
                          <SelectItem value="german">
                            <div className="flex items-center">
                              <Globe className="mr-2 h-4 w-4" />
                              German
                            </div>
                          </SelectItem>
                          <SelectItem value="chinese">
                            <div className="flex items-center">
                              <Globe className="mr-2 h-4 w-4" />
                              Chinese
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Appearance Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

