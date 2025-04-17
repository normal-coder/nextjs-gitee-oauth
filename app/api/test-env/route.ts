import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    clientId: process.env.GITEE_CLIENT_ID || "未设置",
    redirectUri: process.env.GITEE_REDIRECT_URI || "未设置",
    // 不要在生产环境中返回 client secret
    hasClientSecret: !!process.env.GITEE_CLIENT_SECRET,
  })
}
