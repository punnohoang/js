import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import { Appointment } from "./Appointment";
import { MedicalRecord } from "./MedicalRecord";
import * as bcrypt from "bcryptjs";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false })
    password!: string;

    @Column()
    role: string;

    @Column({ nullable: true })
    specialization: string;

    @OneToMany(() => Appointment, appointment => appointment.veterinarian)
    appointments: Appointment[];

    @OneToMany(() => MedicalRecord, record => record.veterinarian)
    medicalRecords: MedicalRecord[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}