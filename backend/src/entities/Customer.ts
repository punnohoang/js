import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Pet } from "./Pet";
import { Appointment } from "./Appointment";
import { Invoice } from "./Invoice";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @OneToMany(() => Pet, pet => pet.owner)
    pets: Pet[];

    @OneToMany(() => Appointment, appointment => appointment.customer)
    appointments: Appointment[];

    @OneToMany(() => Invoice, invoice => invoice.customer)
    invoices: Invoice[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}