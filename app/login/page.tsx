"use client"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { Stethoscope } from "@/lib/icons/index"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-lg bg-primary p-3">
              <Stethoscope className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">VetClinic</h1>
          <p className="mt-2 text-muted-foreground">Hệ thống quản lý phòng khám thú y</p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
