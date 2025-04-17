import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default async function Dashboard() {
  // 获取会话 Cookie
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    redirect("/")
  }

  let session
  try {
    session = JSON.parse(sessionCookie.value)
  } catch (error) {
    console.error("解析会话 Cookie 失败：", error)
    redirect("/")
  }

  const user = session.user

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ThemeToggle />
      </div>
      <div className="container max-w-screen-xl mx-auto flex flex-col items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">欢迎回来，{user.name || user.login}</CardTitle>
            <CardDescription>您已成功使用 Gitee 账号登录</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name || user.login} />
              <AvatarFallback>{user.name?.[0] || user.login?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-lg font-medium">{user.name || user.login}</p>
              {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/api/auth/logout">退出登录</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
