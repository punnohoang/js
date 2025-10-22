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
    petType: "",
    customerId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    veterinarianId: "",
  })

  const [customers, setCustomers] = useState<any[]>([])
  const [pets, setPets] = useState<any[]>([])
  const [vets, setVets] = useState<any[]>([])

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
    // client-side validation
    setError(null)
    // If receptionist selected a pet but didn't pick a customer, try to derive customerId from the pet object
    let customerIdToSend = formData.customerId || (user?.role === 'CUSTOMER' ? user.id : '')
    if (!customerIdToSend && formData.petId) {
      const selectedPet = pets.find((p) => String(p.id) === String(formData.petId))
      // API pets may include owner or ownerId
      if (selectedPet) {
        customerIdToSend = selectedPet.ownerId || (selectedPet.owner && String(selectedPet.owner.id)) || ''
      }
    }
    if (!customerIdToSend) return setError('Vui lòng chọn khách hàng')
    if (!formData.petId && !formData.petName) return setError('Vui lòng nhập hoặc chọn thú cưng')
    if (!formData.petType) return setError('Vui lòng nhập loại thú cưng')
    if (!formData.appointmentDate) return setError('Vui lòng chọn ngày hẹn')
    if (!formData.appointmentTime) return setError('Vui lòng chọn giờ hẹn')

    const newAppointment: any = {
      customerId: customerIdToSend,
      date: formData.appointmentDate,
      time: formData.appointmentTime,
      reason: formData.reason,
      veterinarianId: formData.veterinarianId || undefined,
    }

    // If a petId was selected, send it. Otherwise include basic pet details so backend can accept a free-text pet.
    if (formData.petId) {
      newAppointment.petId = formData.petId
    } else {
      newAppointment.pet = {
        name: formData.petName,
        species: formData.petType,
      }
    }

    const customerObj = customers.find((c) => String(c.id) === String(customerIdToSend))
    const ownerName = customerObj ? `${customerObj.firstName || ''} ${customerObj.lastName || ''}`.trim() : ''

    // apiClient expects petName and ownerName fields in the Appointment payload shape
    const payload = {
      ...newAppointment,
      petName: formData.petName,
      ownerName,
    }

    try {
      console.log('Creating appointment with payload', payload)
      const response = await apiClient.createAppointment(payload as any)
      if (response.success && response.data) {
        await loadAppointments()
        setShowForm(false)
        setFormData({ petName: "", petId: "", petType: "", customerId: "", appointmentDate: "", appointmentTime: "", reason: "", veterinarianId: "" })
      } else {
        // show detailed server error when available
        const serverError = (response && (response.error || (response as any).message)) || 'Failed to create appointment'
        console.error('Create appointment failed', serverError, response)
        setError(typeof serverError === 'string' ? serverError : JSON.stringify(serverError))
      }
    } catch (err) {
      console.error('Unexpected error creating appointment', err)
      setError(err instanceof Error ? err.message : 'Unexpected error')
    }
  }

  useEffect(() => {
    // Load customers and vets when receptionist opens form
    const loadLists = async () => {
      const customersResp = await apiClient.getUsers('CUSTOMER')
      if (customersResp.success && customersResp.data) {
        // Ensure we only show actual customer accounts (defensive filter)
        const onlyCustomers = (customersResp.data as any[]).filter((u) => u.role === 'CUSTOMER')
        setCustomers(onlyCustomers)
      }

      const vetsResp = await apiClient.getUsers('VETERINARIAN')
      if (vetsResp.success && vetsResp.data) setVets(vetsResp.data)
    }

    if (showForm && user?.role === 'RECEPTIONIST') {
      loadLists()
    }
  }, [showForm, user?.role])

  useEffect(() => {
    // when customer selected, load that customer's pets
    const loadPets = async () => {
      if (!formData.customerId) return setPets([])
      const resp = await apiClient.getPets(formData.customerId)
      if (resp.success && resp.data) setPets(resp.data)
    }
    loadPets()
  }, [formData.customerId])

  useEffect(() => {
    // when pet selected, set petName and petType to selected pet's values
    const sel = pets.find((p) => String(p.id) === String(formData.petId))
    if (sel) setFormData((f) => ({ ...f, petName: sel.name, petType: sel.species || f.petType }))
  }, [formData.petId, pets])

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
                    {/* For receptionists/customers choose an existing pet from the customer's pets; fallback to entering a name */}
                    {user?.role === 'RECEPTIONIST' ? (
                      <>
                        <label className="text-sm font-medium">Khách hàng</label>
                        <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn khách hàng" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.firstName} {c.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <label className="text-sm font-medium">Thú cưng</label>
                        <Select value={formData.petId} onValueChange={(value) => setFormData({ ...formData, petId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn thú cưng" />
                          </SelectTrigger>
                          <SelectContent>
                            {pets.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)}>
                                {p.name} {p.species ? `- ${p.species}` : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      // Customer role: list their pets (loaded when form opens)
                      <Select value={formData.petId} onValueChange={(value) => setFormData({ ...formData, petId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thú cưng" />
                        </SelectTrigger>
                        <SelectContent>
                          {pets.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name} {p.species ? `- ${p.species}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
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
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${appointment.status === "CONFIRMED"
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
