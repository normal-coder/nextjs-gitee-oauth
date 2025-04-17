"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function handleCallback() {
      try {
        // 从 URL 获取授权码
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get("code")

        if (!code) {
          setStatus("error")
          setError("未收到授权码")
          // 通知父窗口授权失败
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "gitee-auth-error",
                error: "未收到授权码",
              },
              window.location.origin,
            )
          }
          return
        }

        // 发送授权码到服务器
        const response = await fetch("/api/auth/callback/gitee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "服务器处理错误")
        }

        setStatus("success")

        // 通知父窗口授权成功
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "gitee-auth-success",
            },
            window.location.origin,
          )

          // 关闭弹出窗口
          setTimeout(() => window.close(), 1000)
        }
      } catch (error) {
        console.error("处理回调错误：", error)
        setStatus("error")
        setError(error instanceof Error ? error.message : "未知错误")

        // 通知父窗口授权失败
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "gitee-auth-error",
              error: error instanceof Error ? error.message : "未知错误",
            },
            window.location.origin,
          )
        }
      }
    }

    handleCallback()
  }, [])

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            {status === "loading" && "处理授权中..."}
            {status === "success" && "授权成功"}
            {status === "error" && "授权失败"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "正在处理 Gitee 授权，请稍候..."}
            {status === "success" && "您已成功授权，即将返回应用"}
            {status === "error" && error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" && (
            <p className="text-sm text-muted-foreground">如果页面没有自动关闭，请手动关闭此窗口</p>
          )}
          {status === "error" && <p className="text-sm text-muted-foreground">请关闭此窗口并重试</p>}
        </CardContent>
      </Card>
    </div>
  )
}
