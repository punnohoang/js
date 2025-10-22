import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Customer } from "./Customer";
import { Appointment } from "./Appointment";
import { MedicalRecord } from "./MedicalRecord";

@Entity()
export class Pet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    species: string;

    @Column()
    breed: string;

    @Column()
    dateOfBirth: Date;

    @Column()
    gender: string;

    @Column({ nullable: true })
    weight: number;

    @ManyToOne(() => Customer, customer => customer.pets)
    owner: Customer;

    @OneToMany(() => Appointment, appointment => appointment.pet)
    appointments: Appointment[];

    @OneToMany(() => MedicalRecord, record => record.pet)
    medicalRecords: MedicalRecord[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}