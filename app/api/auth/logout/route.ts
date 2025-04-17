import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  // 清除会话 Cookie
  cookies().delete("session")

  // 重定向到首页
  return NextResponse.redirect(new URL("/", request.url))
}
