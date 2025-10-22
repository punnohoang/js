"use client"

import type React from "react"
import { useEffect } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react"
import { apiClient, type Pet } from "@/lib/api-client"

export default function PetsPage() {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    weight: "",
  })

  useEffect(() => {
    if (user?.id) {
      loadPets()
    }
  }, [user?.id])

  const loadPets = async () => {
    setLoading(true)
    setError(null)
    const response = await apiClient.getPets(user?.id || "")
    if (response.success && response.data) {
      setPets(response.data)
    } else {
      setError(response.error || "Failed to load pets")
    }
    setLoading(false)
  }

  if (user?.role !== "CUSTOMER") {
    return <DashboardLayout>Không có quyền truy cập</DashboardLayout>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newPet = {
      name: formData.name,
      type: formData.type,
      breed: formData.breed,
      age: Number.parseInt(formData.age) || 0,
      weight: Number.parseFloat(formData.weight) || 0,
      ownerId: user?.id || "",
    }

    const response = await apiClient.createPet(newPet)
    if (response.success) {
      await loadPets()
      setShowForm(false)
      setFormData({ name: "", type: "", breed: "", age: "", weight: "" })
    } else {
      setError(response.error || "Failed to create pet")
    }
  }

  const handleDelete = async (petId: string) => {
    const response = await apiClient.deletePet(petId)
    if (response.success) {
      await loadPets()
    } else {
      setError(response.error || "Failed to delete pet")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý thú cưng</h1>
            <p className="text-muted-foreground">Thông tin chi tiết về thú cưng của bạn</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm thú cưng
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
              <CardTitle>Thêm thú cưng mới</CardTitle>
              <CardDescription>Điền thông tin chi tiết về thú cưng</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tên thú cưng</label>
                    <Input
                      placeholder="Nhập tên"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Loại thú cưng</label>
                    <Input
                      placeholder="Chó, Mèo, v.v."
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Giống loại</label>
                    <Input
                      placeholder="Nhập giống loại"
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tuổi (năm)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cân nặng (kg)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Thêm thú cưng</Button>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pets.length === 0 ? (
              <Card className="md:col-span-2 lg:col-span-3">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Chưa có thú cưng nào. Hãy thêm thú cưng đầu tiên!</p>
                </CardContent>
              </Card>
            ) : (
              pets.map((pet) => (
                <Card key={pet.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{pet.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(pet.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Loại</p>
                      <p className="font-medium">{pet.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Giống loại</p>
                      <p className="font-medium">{pet.breed}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Tuổi</p>
                        <p className="font-medium">{pet.age} năm</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cân nặng</p>
                        <p className="font-medium">{pet.weight} kg</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
