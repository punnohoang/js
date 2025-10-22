export interface MedicalRecord {
    id: string
    diagnosis: string
    treatment: string
    notes?: string
    prescriptions: string
    petId: string
    veterinarianId: string
    date: string
}

export type CreateMedicalRecordRequest = Omit<MedicalRecord, "id">

export interface MedicalRecordResponse {
    success: boolean
    data?: MedicalRecord
    error?: string
}