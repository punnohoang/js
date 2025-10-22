const USE_MOCK_AUTH = false // Set to true to use mock data
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Mock data for testing
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "admin@gmail.com": {
    password: "123456",
    user: {
      id: "1",
      email: "admin@gmail.com",
      firstName: "Quản",
      lastName: "Trị viên",
      role: "ADMIN",
      phone: "0123456789",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  },
  "vet@gmail.com": {
    password: "123456",
    user: {
      id: "2",
      email: "vet@gmail.com",
      firstName: "Bác sĩ",
      lastName: "Nguyễn",
      role: "VETERINARIAN",
      phone: "0987654321",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vet",
    },
  },
  "receptionist@gmail.com": {
    password: "123456",
    user: {
      id: "3",
      email: "receptionist@gmail.com",
      firstName: "Nhân viên",
      lastName: "Trang",
      role: "RECEPTIONIST",
      phone: "0912345678",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=receptionist",
    },
  },
  "customer@gmail.com": {
    password: "123456",
    user: {
      id: "4",
      email: "customer@gmail.com",
      firstName: "Khách hàng",
      lastName: "Minh",
      role: "CUSTOMER",
      phone: "0901234567",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=customer",
    },
  },
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: "CUSTOMER" | "VETERINARIAN" | "RECEPTIONIST" | "ADMIN"
  }
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "CUSTOMER" | "VETERINARIAN" | "RECEPTIONIST" | "ADMIN"
  phone?: string
  avatar?: string
}

export interface Pet {
  id: string
  name: string
  type: string
  breed: string
  age: number
  weight: number
  ownerId: string
}

export interface Appointment {
  id: string
  petId: string
  petName: string
  ownerName: string
  date: string
  time: string
  reason: string
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
  veterinarianId?: string
}

export interface MedicalRecord {
  id: string
  petId: string
  date: string
  veterinarianId: string
  diagnosis: string
  treatment: string
  medicines: string[]
}

export interface Invoice {
  id: string
  customerId: string
  petId: string
  date: string
  services: Array<{ name: string; price: number }>
  total: number
  status: "PAID" | "PENDING"
}

class ApiClient {
  private token: string | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    return headers
  }

  private async mockLogin(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockUser = MOCK_USERS[email]
    if (!mockUser || mockUser.password !== password) {
      return {
        success: false,
        error: "Email hoặc mật khẩu không chính xác",
      }
    }

    const token = `mock_token_${email}_${Date.now()}`
    return {
      success: true,
      data: {
        token,
        user: mockUser.user,
      },
    }
  }

  private async mockRegister(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
  ): Promise<ApiResponse<LoginResponse>> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (MOCK_USERS[email]) {
      return {
        success: false,
        error: "Email đã được đăng ký",
      }
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      firstName,
      lastName,
      role: role as "CUSTOMER" | "VETERINARIAN" | "RECEPTIONIST" | "ADMIN",
      phone: "",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    }

    MOCK_USERS[email] = {
      password,
      user: newUser,
    }

    const token = `mock_token_${email}_${Date.now()}`
    return {
      success: true,
      data: {
        token,
        user: newUser,
      },
    }
  }

  private async mockGetCurrentUser(): Promise<ApiResponse<User>> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (!this.token) {
      return {
        success: false,
        error: "Not authenticated",
      }
    }

    // Extract email from token (mock token format: mock_token_email_timestamp)
    const tokenParts = this.token.split("_")
    if (tokenParts.length < 3) {
      return {
        success: false,
        error: "Invalid token",
      }
    }

    const email = tokenParts.slice(2, -1).join("_")
    const mockUser = MOCK_USERS[email]

    if (!mockUser) {
      return {
        success: false,
        error: "User not found",
      }
    }

    return {
      success: true,
      data: mockUser.user,
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "An error occurred",
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    if (USE_MOCK_AUTH) {
      return this.mockLogin(email, password)
    }

    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string, firstName: string, lastName: string, role: string): Promise<ApiResponse<LoginResponse>> {
    if (USE_MOCK_AUTH) {
      return this.mockRegister(email, password, firstName, lastName, role)
    }

    return this.request<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        role
      }),
    })
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (USE_MOCK_AUTH) {
      return this.mockGetCurrentUser()
    }

    return this.request<User>("/auth/me", {
      method: "GET",
    })
  }

  async logout(): Promise<ApiResponse<void>> {
    this.clearToken()
    return { success: true }
  }

  // Pet endpoints
  async getPets(customerId: string): Promise<ApiResponse<Pet[]>> {
    return this.request<Pet[]>(`/pets?customerId=${customerId}`, {
      method: "GET",
    })
  }

  async createPet(pet: Omit<Pet, "id">): Promise<ApiResponse<Pet>> {
    return this.request<Pet>("/pets", {
      method: "POST",
      body: JSON.stringify(pet),
    })
  }

  async updatePet(id: string, pet: Partial<Pet>): Promise<ApiResponse<Pet>> {
    return this.request<Pet>(`/pets/${id}`, {
      method: "PUT",
      body: JSON.stringify(pet),
    })
  }

  async deletePet(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/pets/${id}`, {
      method: "DELETE",
    })
  }

  // Appointment endpoints
  async getAppointments(filters?: { customerId?: string; veterinarianId?: string; date?: string }): Promise<
    ApiResponse<Appointment[]>
  > {
    const params = new URLSearchParams()
    if (filters?.customerId) params.append("customerId", filters.customerId)
    if (filters?.veterinarianId) params.append("veterinarianId", filters.veterinarianId)
    if (filters?.date) params.append("date", filters.date)

    return this.request<Appointment[]>(`/appointments?${params.toString()}`, {
      method: "GET",
    })
  }

  async createAppointment(appointment: Omit<Appointment, "id" | "status">): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>("/appointments", {
      method: "POST",
      body: JSON.stringify(appointment),
    })
  }

  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(appointment),
    })
  }

  async cancelAppointment(id: string): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${id}/cancel`, {
      method: "POST",
    })
  }

  // Medical Record endpoints
  async getMedicalRecords(petId: string): Promise<ApiResponse<MedicalRecord[]>> {
    return this.request<MedicalRecord[]>(`/medical-records?petId=${petId}`, {
      method: "GET",
    })
  }

  async createMedicalRecord(record: Omit<MedicalRecord, "id">): Promise<ApiResponse<MedicalRecord>> {
    return this.request<MedicalRecord>("/medical-records", {
      method: "POST",
      body: JSON.stringify(record),
    })
  }

  async updateMedicalRecord(id: string, record: Partial<MedicalRecord>): Promise<ApiResponse<MedicalRecord>> {
    return this.request<MedicalRecord>(`/medical-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(record),
    })
  }

  // Invoice endpoints
  async getInvoices(customerId?: string): Promise<ApiResponse<Invoice[]>> {
    const params = customerId ? `?customerId=${customerId}` : ""
    return this.request<Invoice[]>(`/invoices${params}`, {
      method: "GET",
    })
  }

  async createInvoice(invoice: Omit<Invoice, "id" | "date">): Promise<ApiResponse<Invoice>> {
    return this.request<Invoice>("/invoices", {
      method: "POST",
      body: JSON.stringify(invoice),
    })
  }

  async updateInvoiceStatus(id: string, status: "PAID" | "PENDING"): Promise<ApiResponse<Invoice>> {
    return this.request<Invoice>(`/invoices/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  }

  // User management endpoints
  async getUsers(role?: string): Promise<ApiResponse<User[]>> {
    const params = role ? `?role=${role}` : ""
    return this.request<User[]>(`/users${params}`, {
      method: "GET",
    })
  }

  async createUser(user: Omit<User, "id">): Promise<ApiResponse<User>> {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(user),
    })
  }

  async updateUser(id: string, user: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    })
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: "DELETE",
    })
  }

  // Statistics endpoints
  async getStatistics(
    startDate?: string,
    endDate?: string,
  ): Promise<
    ApiResponse<{
      totalRevenue: number
      totalAppointments: number
      totalCustomers: number
      totalVeterinarians: number
      appointmentsByStatus: Record<string, number>
      revenueByService: Record<string, number>
    }>
  > {
    const params = new URLSearchParams()
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)

    return this.request(`/statistics?${params.toString()}`, {
      method: "GET",
    })
  }
}

export const apiClient = new ApiClient()
