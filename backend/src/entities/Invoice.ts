import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Customer } from "./Customer";
import { InvoiceItem } from "./InvoiceItem";

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    invoiceDate: Date;

    @Column()
    dueDate: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ type: 'enum', enum: ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'] })
    status: string;

    @ManyToOne(() => Customer, customer => customer.invoices)
    customer: Customer;

    @OneToMany(() => InvoiceItem, item => item.invoice)
    items: InvoiceItem[];

    @Column({ nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}