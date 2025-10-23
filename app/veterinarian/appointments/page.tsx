"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Loader2 } from "@/lib/icons/index"
import { ThumbsUp, ThumbsDown } from "@/lib/icons/thumbs"
import { apiClient, type Appointment } from "@/lib/api-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function VetAppointmentsPage() {
    const { user } = useAuth()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showRejectDialog, setShowRejectDialog] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [rejectReason, setRejectReason] = useState("")

    useEffect(() => {
        loadAppointments()
    }, [user?.id])

    const loadAppointments = async () => {
        if (!user?.id) return
        setLoading(true)
        setError(null)
        // Load appointments assigned to this vet or unassigned
        const filters = { veterinarianId: user.id, status: "CONFIRMED" }
        const response = await apiClient.getAppointments(filters)
        if (response.success && response.data) {
            setAppointments(response.data)
        } else {
            setError(response.error || "Failed to load appointments")
        }
        setLoading(false)
    }

    const handleApprove = async (appointment: Appointment) => {
        try {
            setError(null)
            const response = await apiClient.updateAppointment(appointment.id, {
                status: "CONFIRMED",
                veterinarianId: user?.id
            })

            if (response.success) {
                await loadAppointments()
            } else {
                setError(response.error || "Failed to approve appointment")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unexpected error")
        }
    }

    const handleReject = async (appointment: Appointment) => {
        setSelectedAppointment(appointment)
        setRejectReason("")
        setShowRejectDialog(true)
    }

    const submitReject = async () => {
        if (!selectedAppointment) return
        try {
            setError(null)
            const response = await apiClient.updateAppointment(selectedAppointment.id, {
                status: "CANCELLED",
                veterinarianId: user?.id
            })

            if (response.success) {
                setShowRejectDialog(false)
                await loadAppointments()
            } else {
                setError(response.error || "Failed to reject appointment")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unexpected error")
        }
    }

    if (user?.role !== "VETERINARIAN") {
        return <DashboardLayout>Không có quyền truy cập</DashboardLayout>
    }

    const pendingAppointments = appointments.filter(a => a.status === "CONFIRMED")

    return (
        <DashboardLayout>
            <div className="space-y-6 p-8">
                <div>
                    <h1 className="text-3xl font-bold">Lịch hẹn chờ duyệt</h1>
                    <p className="text-muted-foreground">Xem xét và phê duyệt lịch hẹn từ nhân viên tiếp tân</p>
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
                    <div className="grid gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Lịch hẹn cần phê duyệt</CardTitle>
                                <CardDescription>Lịch hẹn đã được tiếp tân xác nhận, chờ bác sĩ duyệt</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingAppointments.length === 0 ? (
                                    <p className="text-center text-muted-foreground">Không có lịch hẹn nào chờ duyệt</p>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingAppointments.map((appointment) => (
                                            <div key={appointment.id} className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-1">
                                                    <p className="font-medium">{appointment.petName}</p>
                                                    <p className="text-sm text-muted-foreground">Khách hàng: {appointment.ownerName}</p>
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
                                                    <p className="text-sm">Lý do: {appointment.reason}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button onClick={() => handleApprove(appointment)} className="gap-2" variant="default">
                                                        <ThumbsUp className="h-4 w-4" />
                                                        Chấp nhận
                                                    </Button>
                                                    <Button onClick={() => handleReject(appointment)} className="gap-2" variant="destructive">
                                                        <ThumbsDown className="h-4 w-4" />
                                                        Từ chối
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Từ chối lịch hẹn</DialogTitle>
                            <DialogDescription>
                                Vui lòng cho biết lý do từ chối lịch hẹn này
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Lý do từ chối</label>
                                <Input
                                    placeholder="Nhập lý do từ chối lịch hẹn"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowRejectDialog(false)}>
                                Hủy
                            </Button>
                            <Button type="button" variant="destructive" onClick={submitReject} disabled={!rejectReason}>
                                Xác nhận từ chối
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}