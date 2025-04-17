import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 确保环境变量存在，否则使用硬编码的值（仅用于开发）
    const clientId = process.env.GITEE_CLIENT_ID || "5e96ca868817fa1b190d14e20ffd7b19f03f2c9aa6c064dda3bfe9e715ee8dd2"
    const redirectUri = encodeURIComponent(
      process.env.GITEE_REDIRECT_URI || "http://localhost:3000/api/auth/callback/gitee",
    )

    console.log("使用的 Client ID:", clientId)
    console.log("使用的 Redirect URI:", redirectUri)

    // 构建 Gitee 授权 URL
    const authUrl = `https://gitee.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`

    console.log("重定向到：", authUrl)

    // 重定向到 Gitee 授权页面
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("Gitee 登录路由错误：", error)

    // 返回错误响应而不是重定向
    return new NextResponse(
      JSON.stringify({ error: "登录处理失败", details: error instanceof Error ? error.message : "未知错误" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
