"use client"

import { useEffect } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"
import { apiClient } from "@/lib/api-client"

export default function ReportsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    const response = await apiClient.getStatistics()
    if (response.success && response.data) {
      setStats(response.data)
    } else {
      setError(response.error || "Failed to load statistics")
    }
    setLoading(false)
  }

  if (user?.role !== "ADMIN") {
    return <DashboardLayout>Không có quyền truy cập</DashboardLayout>
  }

  const revenueData = [
    { month: "Tháng 1", revenue: 15000000, appointments: 45 },
    { month: "Tháng 2", revenue: 18000000, appointments: 52 },
    { month: "Tháng 3", revenue: 22000000, appointments: 65 },
    { month: "Tháng 4", revenue: 25000000, appointments: 72 },
    { month: "Tháng 5", revenue: 28000000, appointments: 85 },
    { month: "Tháng 6", revenue: 32000000, appointments: 95 },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-3xl font-bold">Báo cáo thống kê</h1>
          <p className="text-muted-foreground">Phân tích doanh thu, lịch hẹn và hiệu suất</p>
        </div>

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(stats?.totalRevenue || 0).toLocaleString("vi-VN")}</div>
                  <p className="text-xs text-muted-foreground">VND</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Lịch hẹn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalAppointments || 0}</div>
                  <p className="text-xs text-muted-foreground">Hoàn thành</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
                  <p className="text-xs text-muted-foreground">Tổng cộng</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Bác sĩ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalVeterinarians || 0}</div>
                  <p className="text-xs text-muted-foreground">Đang hoạt động</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="revenue" className="w-full">
              <TabsList>
                <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
                <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
                <TabsTrigger value="services">Dịch vụ</TabsTrigger>
              </TabsList>

              <TabsContent value="revenue" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Doanh thu 6 tháng gần đây</CardTitle>
                        <CardDescription>Biểu đồ doanh thu theo tháng</CardDescription>
                      </div>
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        Xuất báo cáo
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#0066cc" name="Doanh thu (VND)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Chi tiết doanh thu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats?.revenueByService || {}).map(([service, revenue]: [string, any]) => (
                        <div key={service} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{service}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{revenue.toLocaleString("vi-VN")} VND</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Lịch hẹn 6 tháng gần đây</CardTitle>
                        <CardDescription>Số lượng lịch hẹn theo tháng</CardDescription>
                      </div>
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        Xuất báo cáo
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="appointments" fill="#00cc66" name="Lịch hẹn" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Thống kê lịch hẹn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {Object.entries(stats?.appointmentsByStatus || {}).map(([status, count]: [string, any]) => (
                        <Card key={status}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">{status}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{count}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Dịch vụ được sử dụng nhiều nhất</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats?.revenueByService || {})
                        .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                        .slice(0, 5)
                        .map(([service, revenue]: [string, any]) => (
                          <div key={service} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-1">
                              <p className="font-medium">{service}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{revenue.toLocaleString("vi-VN")} VND</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
