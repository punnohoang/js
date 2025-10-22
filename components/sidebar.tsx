"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Users, Settings, LogOut, Stethoscope, CheckCircle, BarChart3 } from "@/lib/icons/index"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <CheckCircle className="h-4 w-4" />,
    roles: ["CUSTOMER", "VETERINARIAN", "RECEPTIONIST", "ADMIN"],
  },
  {
    label: "Đặt lịch hẹn",
    href: "/appointments",
    icon: <Calendar className="h-4 w-4" />,
    roles: ["CUSTOMER", "RECEPTIONIST"],
  },
  {
    label: "Hồ sơ bệnh án",
    href: "/medical-records",
    icon: <FileText className="h-4 w-4" />,
    roles: ["CUSTOMER", "VETERINARIAN"],
  },
  {
    label: "Khám bệnh",
    href: "/examinations",
    icon: <Stethoscope className="h-4 w-4" />,
    roles: ["VETERINARIAN"],
  },
  {
    label: "Quản lý ca khám",
    href: "/schedule",
    icon: <Calendar className="h-4 w-4" />,
    roles: ["RECEPTIONIST", "ADMIN"],
  },
  {
    label: "Quản lý tài khoản",
    href: "/users",
    icon: <Users className="h-4 w-4" />,
    roles: ["ADMIN"],
  },
  {
    label: "Báo cáo thống kê",
    href: "/reports",
    icon: <BarChart3 className="h-4 w-4" />,
    roles: ["ADMIN"],
  },
  {
    label: "Cài đặt",
    href: "/settings",
    icon: <Settings className="h-4 w-4" />,
    roles: ["CUSTOMER", "VETERINARIAN", "RECEPTIONIST", "ADMIN"],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (!user) return null

  const filteredItems = navItems.filter((item) => item.roles.includes(user.role))

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-sidebar-border p-6">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-sidebar-primary" />
            <h1 className="text-xl font-bold">VetClinic</h1>
          </div>
          <p className="mt-2 text-sm text-sidebar-foreground/70">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-sidebar-foreground/50">
            {user.role === "CUSTOMER" && "Khách hàng"}
            {user.role === "VETERINARIAN" && "Bác sĩ thú y"}
            {user.role === "RECEPTIONIST" && "Nhân viên lễ tân"}
            {user.role === "ADMIN" && "Người quản trị"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {filteredItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}
