import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Student Management System</CardTitle>
          <CardDescription>Welcome to the student portal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Link href="/login">
              <Button className="w-full">Login</Button>
            </Link>
          </div>
          <div className="flex flex-col space-y-2">
            <Link href="/register">
              <Button variant="outline" className="w-full">
                Register
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} University College. All rights reserved.
        </CardFooter>
      </Card>
    </div>
  )
}

