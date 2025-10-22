"use client"

import { useEffect } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Loader2 } from "lucide-react"
import { useState } from "react"
import { apiClient, type Appointment } from "@/lib/api-client"

export default function SchedulePage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    setLoading(true)
    setError(null)
    const response = await apiClient.getAppointments()
    if (response.success && response.data) {
      setAppointments(response.data)
    } else {
      setError(response.error || "Failed to load appointments")
    }
    setLoading(false)
  }

  if (user?.role !== "VETERINARIAN" && user?.role !== "RECEPTIONIST" && user?.role !== "ADMIN") {
    return <DashboardLayout>Không có quyền truy cập</DashboardLayout>
  }

  const todayAppointments = appointments.filter((a) => a.status !== "COMPLETED" && a.status !== "CANCELLED")
  const completedAppointments = appointments.filter((a) => a.status === "COMPLETED")

  const totalToday = todayAppointments.length
  const completedToday = todayAppointments.filter((a) => a.status === "CONFIRMED").length
  const pendingToday = todayAppointments.filter((a) => a.status === "PENDING").length

  return (
    <DashboardLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-3xl font-bold">Quản lý ca khám</h1>
          <p className="text-muted-foreground">Xem lịch khám chi tiết theo ngày</p>
        </div>

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="day" className="w-full">
          <TabsList>
            <TabsTrigger value="day">Hôm nay</TabsTrigger>
            <TabsTrigger value="week">Tuần này</TabsTrigger>
            <TabsTrigger value="month">Tháng này</TabsTrigger>
          </TabsList>

          <TabsContent value="day" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Tổng lịch khám</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalToday}</div>
                  <p className="text-xs text-muted-foreground">Bệnh nhân</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedToday}</div>
                  <p className="text-xs text-muted-foreground">Bệnh nhân</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Chờ khám</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingToday}</div>
                  <p className="text-xs text-muted-foreground">Bệnh nhân</p>
                </CardContent>
              </Card>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Lịch khám chi tiết</CardTitle>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length === 0 ? (
                    <p className="text-center text-muted-foreground">Không có lịch khám nào hôm nay</p>
                  ) : (
                    <div className="space-y-3">
                      {todayAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 font-medium">
                                <Clock className="h-4 w-4" />
                                {appointment.time}
                              </div>
                              <div>
                                <p className="font-medium">{appointment.petName}</p>
                                <p className="text-sm text-muted-foreground">{appointment.ownerName}</p>
                              </div>
                            </div>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>{appointment.reason}</span>
                            </div>
                          </div>
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                              appointment.status === "CONFIRMED"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {appointment.status === "CONFIRMED"
                              ? "Đã xác nhận"
                              : appointment.status === "PENDING"
                                ? "Chờ xác nhận"
                                : "Hoàn thành"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê tuần này</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { day: "Thứ 2", date: "21/10", appointments: 6, completed: 6 },
                    { day: "Thứ 3", date: "22/10", appointments: 7, completed: 7 },
                    { day: "Thứ 4", date: "23/10", appointments: 5, completed: 5 },
                    { day: "Thứ 5", date: "24/10", appointments: 8, completed: 6 },
                    { day: "Thứ 6", date: "25/10", appointments: 8, completed: 5 },
                    { day: "Thứ 7", date: "26/10", appointments: 4, completed: 0 },
                  ].map((day) => (
                    <Card key={day.date}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">
                          {day.day} - {day.date}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Tổng lịch hẹn</span>
                          <span className="font-medium">{day.appointments}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Đã hoàn thành</span>
                          <span className="font-medium text-green-600">{day.completed}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê tháng 10/2025</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Tổng lịch hẹn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{appointments.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{completedAppointments.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Hủy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {appointments.filter((a) => a.status === "CANCELLED").length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Chờ xác nhận</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {appointments.filter((a) => a.status === "PENDING").length}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
