"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search, Eye } from "lucide-react"

export default function PatientsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  if (user?.role !== "VETERINARIAN" && user?.role !== "RECEPTIONIST") {
    return <DashboardLayout>Không có quyền truy cập</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-3xl font-bold">Danh sách bệnh nhân</h1>
          <p className="text-muted-foreground">Quản lý thông tin bệnh nhân</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tìm kiếm bệnh nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên thú cưng, chủ nhân, hoặc số điện thoại"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>Tìm kiếm</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách bệnh nhân</CardTitle>
            <CardDescription>Tổng cộng: 156 bệnh nhân</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  id: 1,
                  pet: "Mèo Miu",
                  owner: "Nguyễn Văn A",
                  phone: "0123456789",
                  lastVisit: "20/10/2025",
                  status: "Khỏe mạnh",
                },
                {
                  id: 2,
                  pet: "Chó Vàng",
                  owner: "Trần Thị B",
                  phone: "0987654321",
                  lastVisit: "18/10/2025",
                  status: "Cần theo dõi",
                },
                {
                  id: 3,
                  pet: "Chó Đen",
                  owner: "Lê Văn C",
                  phone: "0912345678",
                  lastVisit: "15/10/2025",
                  status: "Khỏe mạnh",
                },
              ].map((patient) => (
                <div key={patient.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="font-medium">{patient.pet}</p>
                    <p className="text-sm text-muted-foreground">{patient.owner}</p>
                    <p className="text-xs text-muted-foreground">{patient.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Lần khám cuối: {patient.lastVisit}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${patient.status === "Khỏe mạnh" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {patient.status}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="ml-4 gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    Xem hồ sơ
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
