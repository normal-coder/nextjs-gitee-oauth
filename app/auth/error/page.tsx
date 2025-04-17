import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AuthError({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMessages: Record<string, string> = {
    no_code: "未收到授权码",
    token_error: "获取访问令牌失败",
    user_error: "获取用户信息失败",
    server_error: "服务器处理错误",
    default: "登录过程中发生错误",
  }

  const errorMessage = errorMessages[searchParams.error || "default"]

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">登录失败</CardTitle>
          <CardDescription>在尝试使用 Gitee 账号登录时发生错误</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{errorMessage}</p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">返回首页</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
