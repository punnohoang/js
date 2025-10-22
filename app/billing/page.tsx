"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

export default function BillingPage() {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [services, setServices] = useState<Array<{ id: number; name: string; price: number }>>([])
  const [formData, setFormData] = useState({
    petName: "",
    ownerName: "",
    service: "",
    price: "",
    notes: "",
  })

  if (user?.role !== "RECEPTIONIST") {
    return <DashboardLayout>Không có quyền truy cập</DashboardLayout>
  }

  const handleAddService = () => {
    if (formData.service && formData.price) {
      setServices([
        ...services,
        {
          id: Date.now(),
          name: formData.service,
          price: Number.parseFloat(formData.price),
        },
      ])
      setFormData({ ...formData, service: "", price: "" })
    }
  }

  const handleRemoveService = (id: number) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Invoice created:", { ...formData, services })
    setShowForm(false)
    setFormData({ petName: "", ownerName: "", service: "", price: "", notes: "" })
    setServices([])
  }

  const total = services.reduce((sum, s) => sum + s.price, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lập hóa đơn</h1>
            <p className="text-muted-foreground">Tạo và quản lý hóa đơn cho khách hàng</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Lập hóa đơn mới
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Lập hóa đơn mới</CardTitle>
              <CardDescription>Nhập thông tin dịch vụ và tính tiền</CardDescription>
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
                    <label className="text-sm font-medium">Tên chủ nhân</label>
                    <Input
                      placeholder="Nhập tên chủ nhân"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dịch vụ</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Tên dịch vụ"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Giá"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-24"
                      />
                      <Button type="button" onClick={handleAddService}>
                        Thêm
                      </Button>
                    </div>
                  </div>

                  {services.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Danh sách dịch vụ</label>
                      <div className="space-y-2">
                        {services.map((service) => (
                          <div key={service.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {service.price.toLocaleString("vi-VN")} VND
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveService(service.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-lg bg-primary/10 p-3">
                        <p className="text-sm font-medium">Tổng cộng: {total.toLocaleString("vi-VN")} VND</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ghi chú</label>
                  <Textarea
                    placeholder="Ghi chú thêm (nếu có)"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="min-h-20"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={services.length === 0}>
                    Lập hóa đơn
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="bg-transparent">
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Hóa đơn hôm nay</CardTitle>
            <CardDescription>Danh sách hóa đơn đã lập</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  id: "INV-001",
                  pet: "Mèo Miu",
                  owner: "Nguyễn Văn A",
                  amount: 500000,
                  status: "Đã thanh toán",
                },
                {
                  id: "INV-002",
                  pet: "Chó Vàng",
                  owner: "Trần Thị B",
                  amount: 700000,
                  status: "Chưa thanh toán",
                },
              ].map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.pet} - {invoice.owner}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{invoice.amount.toLocaleString("vi-VN")} VND</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        invoice.status === "Đã thanh toán"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
