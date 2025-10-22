import { CreateMedicalRecordRequest, MedicalRecordResponse } from "../types/medical-record"

export const createMedicalRecord = async (data: CreateMedicalRecordRequest): Promise<MedicalRecordResponse> => {
    try {
        const response = await fetch("/api/medical-records", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error("Network response was not ok")
        }

        return await response.json()
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Có lỗi xảy ra",
        }
    }
}