"use client"

import { useEffect } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, CreditCard, Loader2 } from "lucide-react"
import { useState } from "react"
import { apiClient, type Invoice } from "@/lib/api-client"

export default function InvoicesPage() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInvoices()
  }, [user?.id])

  const loadInvoices = async () => {
    setLoading(true)
    setError(null)
    const customerId = user?.role === "CUSTOMER" ? user.id : undefined
    const response = await apiClient.getInvoices(customerId)
    if (response.success && response.data) {
      setInvoices(response.data)
    } else {
      setError(response.error || "Failed to load invoices")
    }
    setLoading(false)
  }

  const handlePayment = async (invoiceId: string) => {
    const response = await apiClient.updateInvoiceStatus(invoiceId, "PAID")
    if (response.success) {
      await loadInvoices()
    } else {
      setError(response.error || "Failed to update invoice")
    }
  }

  if (user?.role !== "CUSTOMER" && user?.role !== "RECEPTIONIST") {
    return <DashboardLayout>Không có quyền truy cập</DashboardLayout>
  }

  const paidInvoices = invoices.filter((i) => i.status === "PAID")
  const pendingInvoices = invoices.filter((i) => i.status === "PENDING")
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0)
  const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.total, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-3xl font-bold">Hóa đơn</h1>
          <p className="text-muted-foreground">Quản lý hóa đơn và thanh toán</p>
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
              <CardTitle className="text-sm font-medium">Tổng hóa đơn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoices.length}</div>
              <p className="text-xs text-muted-foreground">Tất cả thời gian</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Chưa thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInvoices.length}</div>
              <p className="text-xs text-muted-foreground">Tổng: {totalPending.toLocaleString("vi-VN")} VND</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidInvoices.length}</div>
              <p className="text-xs text-muted-foreground">Tổng: {totalPaid.toLocaleString("vi-VN")} VND</p>
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
              <CardTitle>Danh sách hóa đơn</CardTitle>
              <CardDescription>Tất cả hóa đơn của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p className="text-center text-muted-foreground">Không có hóa đơn nào</p>
              ) : (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{invoice.total.toLocaleString("vi-VN")} VND</p>
                          <Badge variant={invoice.status === "PAID" ? "default" : "secondary"}>
                            {invoice.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                            <Download className="h-4 w-4" />
                          </Button>
                          {invoice.status === "PENDING" && (
                            <Button size="sm" className="gap-2" onClick={() => handlePayment(invoice.id)}>
                              <CreditCard className="h-4 w-4" />
                              Thanh toán
                            </Button>
                          )}
                        </div>
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
