import { UserAuthForm } from "@/components/user-auth-form"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          Next.js Gitee OAuth 示例
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              这是一个使用 Next.js 15 和 Gitee OAuth 构建的应用示例，展示了如何集成 Gitee 账号登录功能。
            </p>
            <footer className="text-sm">基于 shadcn/ui 构建</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">账号登录</h1>
            <p className="text-sm text-muted-foreground">使用 Gitee 账号登录应用</p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            点击登录，即表示您同意我们的{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              服务条款
            </Link>{" "}
            和{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              隐私政策
            </Link>
            。
          </p>
        </div>
      </div>
    </div>
  )
}
