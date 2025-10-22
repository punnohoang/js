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
import { Plus, Edit2, Trash2, Search, Loader2 } from "lucide-react"
import { apiClient, type User } from "@/lib/api-client"

export default function UsersPage() {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "CUSTOMER",
    phone: "",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    const response = await apiClient.getUsers()
    if (response.success && response.data) {
      setUsers(response.data)
    } else {
      setError(response.error || "Failed to load users")
    }
    setLoading(false)
  }

  if (user?.role !== "ADMIN") {
    return <DashboardLayout>Không có quyền truy cập</DashboardLayout>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newUser = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role as "CUSTOMER" | "VETERINARIAN" | "RECEPTIONIST" | "ADMIN",
      phone: formData.phone,
    }

    const response = await apiClient.createUser(newUser)
    if (response.success) {
      await loadUsers()
      setShowForm(false)
      setFormData({ firstName: "", lastName: "", email: "", role: "CUSTOMER", phone: "" })
    } else {
      setError(response.error || "Failed to create user")
    }
  }

  const handleDelete = async (userId: string) => {
    const response = await apiClient.deleteUser(userId)
    if (response.success) {
      await loadUsers()
    } else {
      setError(response.error || "Failed to delete user")
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const customerCount = users.filter((u) => u.role === "CUSTOMER").length
  const vetCount = users.filter((u) => u.role === "VETERINARIAN").length
  const receptionistCount = users.filter((u) => u.role === "RECEPTIONIST").length

  return (
    <DashboardLayout>
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý tài khoản</h1>
            <p className="text-muted-foreground">Quản lý người dùng và phân quyền</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm tài khoản
          </Button>
        </div>

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Tất cả tài khoản</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerCount}</div>
              <p className="text-xs text-muted-foreground">Chủ thú cưng</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Bác sĩ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vetCount}</div>
              <p className="text-xs text-muted-foreground">Thú y</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Nhân viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{receptionistCount}</div>
              <p className="text-xs text-muted-foreground">Lễ tân</p>
            </CardContent>
          </Card>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Thêm tài khoản mới</CardTitle>
              <CardDescription>Tạo tài khoản cho người dùng mới</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Họ</label>
                    <Input
                      placeholder="Nguyễn"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tên</label>
                    <Input
                      placeholder="Văn A"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Số điện thoại</label>
                    <Input
                      placeholder="0123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Loại tài khoản</label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                        <SelectItem value="VETERINARIAN">Bác sĩ thú y</SelectItem>
                        <SelectItem value="RECEPTIONIST">Nhân viên lễ tân</SelectItem>
                        <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Tạo tài khoản</Button>
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
            <CardTitle>Tìm kiếm người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên hoặc email"
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
          <Card>
            <CardHeader>
              <CardTitle>Danh sách người dùng</CardTitle>
              <CardDescription>Tất cả tài khoản trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <p className="text-center text-muted-foreground">Không tìm thấy người dùng nào</p>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <p className="font-medium">{`${u.firstName} ${u.lastName}`}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>
                            {u.role === "CUSTOMER" && "Khách hàng"}
                            {u.role === "VETERINARIAN" && "Bác sĩ thú y"}
                            {u.role === "RECEPTIONIST" && "Nhân viên lễ tân"}
                            {u.role === "ADMIN" && "Quản trị viên"}
                          </span>
                          {u.phone && <span>{u.phone}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          Hoạt động
                        </span>
                        <Button size="sm" variant="ghost">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(u.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
