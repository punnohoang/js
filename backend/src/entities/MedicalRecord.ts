import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Pet } from "./Pet";
import { User } from "./User";

@Entity()
export class MedicalRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    diagnosis: string;

    @Column()
    treatment: string;

    @Column({ type: 'text' })
    notes: string;

    @Column({ nullable: true })
    prescriptions: string;

    @ManyToOne(() => Pet, pet => pet.medicalRecords)
    pet: Pet;

    @ManyToOne(() => User, user => user.medicalRecords)
    veterinarian: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}