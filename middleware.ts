import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // 定义需要认证的路径
  const protectedPaths = ["/dashboard"]

  // 检查当前路径是否需要认证
  const isProtectedPath = protectedPaths.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`),
  )

  if (isProtectedPath) {
    // 获取会话 Cookie
    const sessionCookie = request.cookies.get("session")

    // 如果没有会话 Cookie，重定向到首页
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    try {
      // 解析会话 Cookie
      const session = JSON.parse(sessionCookie.value)

      // 检查会话是否过期
      if (session.expiresAt && session.expiresAt < Date.now()) {
        // 如果会话过期，重定向到首页
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      // 如果解析会话 Cookie 失败，重定向到首页
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // 需要认证的路径
    "/dashboard/:path*",
  ],
}
