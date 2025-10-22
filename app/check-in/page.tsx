"use client"

import { useEffect } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search, CheckCircle, Clock, Loader2 } from "lucide-react"
import { apiClient, type Appointment } from "@/lib/api-client"

export default function CheckInPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

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

  if (user?.role !== "RECEPTIONIST") {
    return <DashboardLayout>Không có quyền truy cập</DashboardLayout>
  }

  const handleCheckIn = async (appointmentId: string) => {
    const response = await apiClient.updateAppointment(appointmentId, { status: "CONFIRMED" })
    if (response.success) {
      await loadAppointments()
      setSelectedPatient(null)
    } else {
      setError(response.error || "Failed to check in")
    }
  }

  const todayAppointments = appointments.filter((a) => a.status !== "COMPLETED" && a.status !== "CANCELLED")
  const checkedInCount = todayAppointments.filter((a) => a.status === "CONFIRMED").length
  const pendingCheckIn = todayAppointments.filter((a) => a.status === "PENDING").length

  const filteredAppointments = todayAppointments.filter(
    (a) =>
      a.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.ownerName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedAppointment = selectedPatient ? todayAppointments.find((a) => a.id === selectedPatient) : null

  return (
    <DashboardLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-3xl font-bold">Tiếp nhận khách hàng</h1>
          <p className="text-muted-foreground">Quản lý check-in và nhập thông tin bệnh nhân</p>
        </div>

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Hôm nay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Lịch hẹn</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Đã check-in</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{checkedInCount}</div>
              <p className="text-xs text-muted-foreground">Bệnh nhân</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Chờ check-in</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCheckIn}</div>
              <p className="text-xs text-muted-foreground">Bệnh nhân</p>
            </CardContent>
          </Card>
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
                  placeholder="Tìm theo tên hoặc số điện thoại"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Lịch hẹn hôm nay</CardTitle>
                <CardDescription>Danh sách bệnh nhân cần check-in</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredAppointments.length === 0 ? (
                  <p className="text-center text-muted-foreground">Không có lịch hẹn nào</p>
                ) : (
                  <div className="space-y-3">
                    {filteredAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`cursor-pointer rounded-lg border p-4 transition-colors ${selectedPatient === appointment.id ? "border-primary bg-primary/5" : ""}`}
                        onClick={() => setSelectedPatient(appointment.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">{appointment.time}</span>
                              <span className="font-medium">{appointment.petName}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{appointment.ownerName}</p>
                          </div>
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                              appointment.status === "CONFIRMED"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {appointment.status === "CONFIRMED" ? "Đã check-in" : "Chờ check-in"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedAppointment && (
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết bệnh nhân</CardTitle>
                  <CardDescription>
                    {selectedAppointment.petName} - {selectedAppointment.time}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Chủ nhân: {selectedAppointment.ownerName}</p>
                    <p className="text-sm font-medium">Thú cưng: {selectedAppointment.petName}</p>
                    <p className="text-sm font-medium">Lý do: {selectedAppointment.reason}</p>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleCheckIn(selectedAppointment.id)}
                      className="w-full gap-2"
                      disabled={selectedAppointment.status === "CONFIRMED"}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {selectedAppointment.status === "CONFIRMED" ? "Đã check-in" : "Check-in"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPatient(null)}
                      className="w-full bg-transparent"
                    >
                      Hủy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
