import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Dashboard() {
  // 获取会话 Cookie
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    redirect("/")
  }

  let session
  try {
    session = JSON.parse(sessionCookie.value)
  } catch (error) {
    console.error("解析会话 Cookie 失败:", error)
    redirect("/")
  }

  const user = session.user

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-6">
        <Card className="w-full max-w-md">
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
