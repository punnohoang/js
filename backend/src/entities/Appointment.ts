import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Customer } from "./Customer";
import { Pet } from "./Pet";
import { User } from "./User";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    appointmentDate: Date;

    @Column()
    reason: string;

    @Column({ type: 'enum', enum: ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] })
    status: string;

    @ManyToOne(() => Customer, customer => customer.appointments)
    customer: Customer;

    @ManyToOne(() => Pet, pet => pet.appointments)
    pet: Pet;

    @ManyToOne(() => User, user => user.appointments)
    veterinarian: User;

    @Column({ nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}