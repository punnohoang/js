"use client"

import type React from "react"
import { useEffect } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Calendar, Clock, Plus, Loader2 } from "@/lib/icons/index"
import { apiClient, type Appointment } from "@/lib/api-client"

export default function AppointmentsPage() {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    petName: "",
    petId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  })

  useEffect(() => {
    loadAppointments()
  }, [user?.id])

  const loadAppointments = async () => {
    setLoading(true)
    setError(null)
    const filters = user?.role === "CUSTOMER" ? { customerId: user.id } : {}
    const response = await apiClient.getAppointments(filters)
    if (response.success && response.data) {
      setAppointments(response.data)
    } else {
      setError(response.error || "Failed to load appointments")
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newAppointment = {
      petId: formData.petId,
      petName: formData.petName,
      ownerName: user?.name || "",
      date: formData.appointmentDate,
      time: formData.appointmentTime,
      reason: formData.reason,
    }

    const response = await apiClient.createAppointment(newAppointment)
    if (response.success) {
      await loadAppointments()
      setShowForm(false)
      setFormData({ petName: "", petId: "", appointmentDate: "", appointmentTime: "", reason: "" })
    } else {
      setError(response.error || "Failed to create appointment")
    }
  }

  if (user?.role !== "CUSTOMER" && user?.role !== "RECEPTIONIST") {
    return <DashboardLayout>Không có quyền truy cập</DashboardLayout>
  }

  const upcomingAppointments = appointments.filter((a) => a.status !== "COMPLETED" && a.status !== "CANCELLED")
  const completedAppointments = appointments.filter((a) => a.status === "COMPLETED" || a.status === "CANCELLED")

  return (
    <DashboardLayout>
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lịch hẹn</h1>
            <p className="text-muted-foreground">Quản lý lịch khám của thú cưng</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Đặt lịch hẹn mới
          </Button>
        </div>

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Đặt lịch hẹn mới</CardTitle>
              <CardDescription>Điền thông tin để đặt lịch khám cho thú cưng</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tên thú cưng</label>
                    <Input
                      placeholder="Nhập tên thú cưng"
                      value={formData.petName}
                      onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Loại thú cưng</label>
                    <Select
                      value={formData.petId}
                      onValueChange={(value) => setFormData({ ...formData, petId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại thú cưng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Chó</SelectItem>
                        <SelectItem value="cat">Mèo</SelectItem>
                        <SelectItem value="bird">Chim</SelectItem>
                        <SelectItem value="rabbit">Thỏ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ngày hẹn</label>
                    <Input
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Giờ hẹn</label>
                    <Input
                      type="time"
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lý do khám</label>
                  <Input
                    placeholder="Mô tả lý do khám bệnh"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Đặt lịch</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Lịch hẹn sắp tới</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <p className="text-center text-muted-foreground">Không có lịch hẹn sắp tới</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <p className="font-medium">{appointment.petName}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {appointment.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {appointment.time}
                            </div>
                          </div>
                          <p className="text-sm">{appointment.reason}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                              appointment.status === "CONFIRMED"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {appointment.status === "CONFIRMED" ? "Đã xác nhận" : "Chờ xác nhận"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lịch hẹn đã hoàn thành</CardTitle>
              </CardHeader>
              <CardContent>
                {completedAppointments.length === 0 ? (
                  <p className="text-center text-muted-foreground">Không có lịch hẹn đã hoàn thành</p>
                ) : (
                  <div className="space-y-4">
                    {completedAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <p className="font-medium">{appointment.petName}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {appointment.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {appointment.time}
                            </div>
                          </div>
                          <p className="text-sm">{appointment.reason}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Xem chi tiết
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
