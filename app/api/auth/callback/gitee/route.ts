import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // 从 URL 获取授权码
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")

    if (!code) {
      // 返回一个 HTML 页面，通知父窗口授权失败
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>授权失败</title>
          <meta charSet="utf-8" />
          <script>
            window.onload = function() {
              if (window.opener) {
                window.opener.postMessage({ type: "gitee-auth-error", error: "未收到授权码" }, "${request.nextUrl.origin}");
                setTimeout(function() { window.close(); }, 1000);
              } else {
                window.location.href = "${request.nextUrl.origin}/auth/error?error=no_code";
              }
            };
          </script>
        </head>
        <body>
          <h3>授权失败</h3>
          <p>未收到授权码，正在关闭窗口...</p>
        </body>
        </html>
        `,
        {
          headers: {
            "Content-Type": "text/html",
          },
        },
      )
    }

    try {
      // 使用授权码获取访问令牌
      const tokenResponse = await fetch("https://gitee.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code,
          client_id: process.env.NEXT_PUBLIC_GITEE_CLIENT_ID,
          client_secret: process.env.GITEE_CLIENT_SECRET,
          redirect_uri: process.env.NEXT_PUBLIC_GITEE_REDIRECT_URI,
        }),
      })

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text()
        console.error("获取访问令牌失败：", error)
        throw new Error("获取访问令牌失败")
      }

      const tokenData = await tokenResponse.json()
      const accessToken = tokenData.access_token

      // 使用访问令牌获取用户信息
      const userResponse = await fetch("https://gitee.com/api/v5/user", {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      })

      if (!userResponse.ok) {
        const error = await userResponse.text()
        console.error("获取用户信息失败：", error)
        throw new Error("获取用户信息失败")
      }

      const userData = await userResponse.json()

      // 创建会话 Cookie
      const sessionData = {
        user: {
          id: userData.id,
          name: userData.name,
          login: userData.login,
          avatar_url: userData.avatar_url,
          email: userData.email,
        },
        accessToken,
        expiresAt: Date.now() + tokenData.expires_in * 1000,
      }

      // 设置会话 Cookie
      cookies().set({
        name: "session",
        value: JSON.stringify(sessionData),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: tokenData.expires_in,
        path: "/",
      })

      // 返回一个 HTML 页面，通知父窗口授权成功
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charSet="utf-8" />
          <title>授权成功</title>
          <script>
            window.onload = function() {
              if (window.opener) {
                window.opener.postMessage({ type: "gitee-auth-success" }, "${request.nextUrl.origin}");
                setTimeout(function() { window.close(); }, 1000);
              } else {
                window.location.href = "${request.nextUrl.origin}/dashboard";
              }
            };
          </script>
        </head>
        <body>
          <h3>授权成功</h3>
          <p>您已成功授权，正在关闭窗口...</p>
        </body>
        </html>
        `,
        {
          headers: {
            "Content-Type": "text/html",
          },
        },
      )
    } catch (error) {
      console.error("OAuth 回调处理错误：", error)

      // 返回一个 HTML 页面，通知父窗口授权失败
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charSet="utf-8" />
          <title>授权失败</title>
          <script>
            window.onload = function() {
              if (window.opener) {
                window.opener.postMessage({ 
                  type: "gitee-auth-error", 
                  error: "${error instanceof Error ? error.message : "服务器处理错误"}" 
                }, "${request.nextUrl.origin}");
                setTimeout(function() { window.close(); }, 1000);
              } else {
                window.location.href = "${request.nextUrl.origin}/auth/error?error=server_error";
              }
            };
          </script>
        </head>
        <body>
          <h3>授权失败</h3>
          <p>${error instanceof Error ? error.message : "服务器处理错误"}，正在关闭窗口...</p>
        </body>
        </html>
        `,
        {
          headers: {
            "Content-Type": "text/html",
          },
        },
      )
    }
  } catch (error) {
    console.error("OAuth 回调处理错误：", error)
    return NextResponse.redirect(new URL("/auth/error?error=server_error", request.url))
  }
}
