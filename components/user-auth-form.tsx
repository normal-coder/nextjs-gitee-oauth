"use client"

import { Button } from "@/components/ui/button"
import { GiteeIcon } from "@/components/gitee-icon"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function UserAuthForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const router = useRouter()

  // 监听来自弹出窗口的消息
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // 确保消息来源安全
      if (event.origin !== window.location.origin) return

      // 处理授权成功消息
      if (event.data?.type === "gitee-auth-success") {
        toast({
          title: "登录成功",
          description: "您已成功使用 Gitee 账号登录",
        })
        router.push("/dashboard")
      }

      // 处理授权失败消息
      if (event.data?.type === "gitee-auth-error") {
        toast({
          title: "登录失败",
          description: event.data.error || "授权过程中发生错误",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [toast, router])

  async function onGiteeLogin() {
    setIsLoading(true)
    try {
      // 使用环境变量替代硬编码值
      const clientId = process.env.NEXT_PUBLIC_GITEE_CLIENT_ID
      const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_GITEE_REDIRECT_URI || "http://localhost:3000/api/auth/callback/gitee")
      const authUrl = `https://gitee.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`

      // 打开弹出窗口
      const width = 600
      const height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      const popup = window.open(
        authUrl,
        "gitee-auth",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
      )

      // 检查弹出窗口是否被阻止
      if (!popup || popup.closed || typeof popup.closed === "undefined") {
        toast({
          title: "弹出窗口被阻止",
          description: "请允许浏览器打开弹出窗口以完成授权",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // 设置弹出窗口检查定时器
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed)
          setIsLoading(false)
        }
      }, 500)
    } catch (error) {
      console.error("Gitee 登录错误：", error)
      toast({
        title: "登录失败",
        description: "无法连接到 Gitee 授权服务，请稍后再试。",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Button variant="outline" type="button" disabled={isLoading} onClick={onGiteeLogin} className="bg-background">
        {isLoading ? <div className="mr-2 h-4 w-4 animate-spin" /> : <GiteeIcon className="mr-2 h-4 w-4" />}
        使用 Gitee 账号登录
      </Button>
    </div>
  )
}
