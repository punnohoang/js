"use client"

import type React from "react"

import { useEffect } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { apiClient, type MedicalRecord } from "@/lib/api-client"

export default function MedicalRecordsPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState("")
  const [formData, setFormData] = useState({
    diagnosis: "",
    treatment: "",
    medicines: "",
  })

  useEffect(() => {
    if (selectedPetId) {
      loadRecords()
    }
  }, [selectedPetId])

  const loadRecords = async () => {
    setLoading(true)
    setError(null)
    const response = await apiClient.getMedicalRecords(selectedPetId)
    if (response.success && response.data) {
      setRecords(response.data)
    } else {
      setError(response.error || "Failed to load medical records")
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newRecord = {
      petId: selectedPetId,
      date: new Date().toISOString().split("T")[0],
      veterinarianId: user?.id || "",
      diagnosis: formData.diagnosis,
      treatment: formData.treatment,
      medicines: formData.medicines.split(",").map((m) => m.trim()),
    }

    const response = await apiClient.createMedicalRecord(newRecord)
    if (response.success) {
      await loadRecords()
      setShowForm(false)
      setFormData({ diagnosis: "", treatment: "", medicines: "" })
    } else {
      setError(response.error || "Failed to create medical record")
    }
  }

  if (user?.role !== "VETERINARIAN" && user?.role !== "CUSTOMER") {
    return <DashboardLayout>Không có quyền truy cập</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-3xl font-bold">Hồ sơ bệnh án</h1>
          <p className="text-muted-foreground">Quản lý hồ sơ y tế của thú cưng</p>
        </div>

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {user?.role === "VETERINARIAN" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Chọn thú cưng</label>
                <Input
                  placeholder="Nhập ID thú cưng"
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  className="mt-2 max-w-xs"
                />
              </div>
              <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm hồ sơ
              </Button>
            </div>

            {showForm && selectedPetId && (
              <Card>
                <CardHeader>
                  <CardTitle>Thêm hồ sơ bệnh án mới</CardTitle>
                  <CardDescription>Ghi lại thông tin khám bệnh</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Chẩn đoán</label>
                      <Input
                        placeholder="Nhập chẩn đoán"
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Điều trị</label>
                      <Input
                        placeholder="Nhập phương pháp điều trị"
                        value={formData.treatment}
                        onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Thuốc (cách nhau bằng dấu phẩy)</label>
                      <Input
                        placeholder="Thuốc 1, Thuốc 2, ..."
                        value={formData.medicines}
                        onChange={(e) => setFormData({ ...formData, medicines: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Lưu hồ sơ</Button>
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        Hủy
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Danh sách hồ sơ</CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <p className="text-center text-muted-foreground">Không có hồ sơ bệnh án nào</p>
              ) : (
                <div className="space-y-4">
                  {records.map((record) => (
                    <div key={record.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium">Ngày: {record.date}</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Chẩn đoán:</p>
                          <p>{record.diagnosis}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Điều trị:</p>
                          <p>{record.treatment}</p>
                        </div>
                        {record.medicines.length > 0 && (
                          <div>
                            <p className="text-muted-foreground">Thuốc:</p>
                            <p>{record.medicines.join(", ")}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
