"use client"

import { useEffect } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { Clock, CheckCircle, Loader2 } from "lucide-react"
import { apiClient, type Appointment, type MedicalRecord } from "@/lib/api-client"

export default function ExaminationsPage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedExam, setSelectedExam] = useState<string | null>(null)
  const [diagnosis, setDiagnosis] = useState("")
  const [treatment, setTreatment] = useState("")
  const [medicines, setMedicines] = useState("")

  useEffect(() => {
    loadExaminations()
  }, [])

  const loadExaminations = async () => {
    setLoading(true)
    setError(null)
    const response = await apiClient.getAppointments()
    if (response.success && response.data) {
      setAppointments(response.data)
    } else {
      setError(response.error || "Failed to load examinations")
    }
    setLoading(false)
  }

  if (user?.role !== "VETERINARIAN") {
    return <DashboardLayout>Không có quyền truy cập</DashboardLayout>
  }

  const handleSaveExamination = async () => {
    if (!selectedExam) return

    const selectedAppointment = appointments.find((a) => a.id === selectedExam)
    if (!selectedAppointment) return

    const newRecord = {
      petId: selectedAppointment.petId,
      date: new Date().toISOString().split("T")[0],
      veterinarianId: user?.id || "",
      diagnosis,
      treatment,
      medicines: medicines.split(",").map((m) => m.trim()),
    }

    const response = await apiClient.createMedicalRecord(newRecord)
    if (response.success) {
      setSelectedExam(null)
      setDiagnosis("")
      setTreatment("")
      setMedicines("")
      await loadExaminations()
    } else {
      setError(response.error || "Failed to save examination")
    }
  }

  const todayAppointments = appointments.filter((a) => a.status !== "COMPLETED" && a.status !== "CANCELLED")
  const completedAppointments = appointments.filter((a) => a.status === "COMPLETED")

  return (
    <DashboardLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-3xl font-bold">Khám bệnh</h1>
          <p className="text-muted-foreground">Quản lý lịch khám và cập nhật hồ sơ bệnh án</p>
        </div>

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="today" className="w-full">
          <TabsList>
            <TabsTrigger value="today">Hôm nay</TabsTrigger>
            <TabsTrigger value="upcoming">Sắp tới</TabsTrigger>
            <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Lịch khám hôm nay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayAppointments.length}</div>
                  <p className="text-xs text-muted-foreground">Bệnh nhân</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Đang khám</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {todayAppointments.filter((a) => a.status === "CONFIRMED").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Bệnh nhân</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {todayAppointments.filter((a) => a.status === "PENDING").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Hồ sơ bệnh án</p>
                </CardContent>
              </Card>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                  {todayAppointments.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Không có lịch khám nào hôm nay</p>
                      </CardContent>
                    </Card>
                  ) : (
                    todayAppointments.map((exam) => (
                      <Card
                        key={exam.id}
                        className={`cursor-pointer transition-colors ${selectedExam === exam.id ? "border-primary bg-primary/5" : ""}`}
                        onClick={() => setSelectedExam(exam.id)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{exam.petName}</CardTitle>
                              <CardDescription>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {exam.time} - {exam.ownerName}
                                </div>
                              </CardDescription>
                            </div>
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                exam.status === "CONFIRMED"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {exam.status === "CONFIRMED" ? "Đang khám" : "Chờ khám"}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">Lý do: {exam.reason}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {selectedExam && (
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle>Cập nhật hồ sơ bệnh án</CardTitle>
                      <CardDescription>
                        {appointments.find((a) => a.id === selectedExam)?.petName} -{" "}
                        {appointments.find((a) => a.id === selectedExam)?.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Chẩn đoán</label>
                        <Textarea
                          placeholder="Nhập chẩn đoán"
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          className="min-h-20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Điều trị</label>
                        <Textarea
                          placeholder="Nhập phương pháp điều trị"
                          value={treatment}
                          onChange={(e) => setTreatment(e.target.value)}
                          className="min-h-20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Kê đơn thuốc</label>
                        <Textarea
                          placeholder="Nhập danh sách thuốc (cách nhau bằng dấu phẩy)"
                          value={medicines}
                          onChange={(e) => setMedicines(e.target.value)}
                          className="min-h-20"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveExamination} className="flex-1">
                          Lưu
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedExam(null)}
                          className="flex-1 bg-transparent"
                        >
                          Hủy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {appointments
              .filter((a) => a.status === "PENDING")
              .slice(0, 5)
              .map((exam) => (
                <Card key={exam.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{exam.petName}</CardTitle>
                        <CardDescription>
                          {exam.date} - {exam.time} - {exam.ownerName}
                        </CardDescription>
                      </div>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        Xem chi tiết
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Lý do: {exam.reason}</p>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedAppointments.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Không có lịch khám đã hoàn thành</p>
                </CardContent>
              </Card>
            ) : (
              completedAppointments.slice(0, 5).map((exam) => (
                <Card key={exam.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          {exam.petName}
                        </CardTitle>
                        <CardDescription>
                          {exam.date} - {exam.ownerName}
                        </CardDescription>
                      </div>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        Xem hồ sơ
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Lý do: {exam.reason}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
