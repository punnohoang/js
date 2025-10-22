import "reflect-metadata";
import { AppDataSource } from "../src/data-source";
import { User } from "../src/entities/User";
import { Customer } from "../src/entities/Customer";
import { Pet } from "../src/entities/Pet";
import { Appointment } from "../src/entities/Appointment";
import { MedicalRecord } from "../src/entities/MedicalRecord";
import { Invoice } from "../src/entities/Invoice";
import { InvoiceItem } from "../src/entities/InvoiceItem";

async function seed() {
    await AppDataSource.initialize();
    console.log("DB initialized for seeding");

    const userRepo = AppDataSource.getRepository(User);
    const customerRepo = AppDataSource.getRepository(Customer);
    const petRepo = AppDataSource.getRepository(Pet);
    const appointmentRepo = AppDataSource.getRepository(Appointment);
    const recordRepo = AppDataSource.getRepository(MedicalRecord);
    const invoiceRepo = AppDataSource.getRepository(Invoice);
    const itemRepo = AppDataSource.getRepository(InvoiceItem);

    // Create or get users
    let admin = await userRepo.findOne({ where: { email: 'admin@clinic.local' } });
    if (!admin) {
        admin = userRepo.create({ firstName: 'Admin', lastName: 'User', email: 'admin@clinic.local', password: 'admin123', role: 'ADMIN' });
        await userRepo.save(admin);
        console.log('Created admin user');
    } else {
        console.log('Admin user exists, reusing');
    }

    let vet = await userRepo.findOne({ where: { email: 'vet@clinic.local' } });
    if (!vet) {
        vet = userRepo.create({ firstName: 'Vet', lastName: 'Doctor', email: 'vet@clinic.local', password: 'vet123', role: 'VETERINARIAN' });
        await userRepo.save(vet);
        console.log('Created veterinarian user');
    } else {
        console.log('Veterinarian user exists, reusing');
    }

    // Create customer
    let customer = await customerRepo.findOne({ where: { email: 'customer@local' } });
    if (!customer) {
        customer = customerRepo.create({ firstName: 'Nguyen', lastName: 'Minh', email: 'customer@local', phone: '0912345678', address: '123 Street' });
        await customerRepo.save(customer);
        console.log('Created customer');
    } else {
        console.log('Customer exists, reusing');
    }

    // Create pet
    let pet = await petRepo.findOne({ where: { name: 'Bobby' }, relations: ['owner'] });
    if (!pet || (pet.owner && pet.owner.id !== customer.id)) {
        pet = petRepo.create({ name: 'Bobby', species: 'Dog', breed: 'Labrador', dateOfBirth: new Date('2020-01-01'), gender: 'Male', weight: 12, owner: customer });
        await petRepo.save(pet);
        console.log('Created pet');
    } else {
        console.log('Pet exists, reusing');
    }

    // Create appointment
    let appointment = await appointmentRepo.findOne({ where: { reason: 'Regular check' }, relations: ['customer', 'pet'] });
    if (!appointment) {
        appointment = appointmentRepo.create({ appointmentDate: new Date(), reason: 'Regular check', status: 'SCHEDULED', customer, pet, veterinarian: vet, notes: 'No notes' });
        await appointmentRepo.save(appointment);
        console.log('Created appointment');
    } else {
        console.log('Appointment exists, reusing');
    }

    // Create medical record
    let record = await recordRepo.findOne({ where: { diagnosis: 'Healthy' }, relations: ['pet'] });
    if (!record) {
        record = recordRepo.create({ date: new Date(), diagnosis: 'Healthy', treatment: 'Vaccination', notes: 'All good', prescriptions: 'Vaccine', pet, veterinarian: vet });
        await recordRepo.save(record);
        console.log('Created medical record');
    } else {
        console.log('Medical record exists, reusing');
    }

    // Create invoice and items
    let invoice = await invoiceRepo.findOne({ where: { customer: { id: customer.id } }, relations: ['customer'] });
    if (!invoice) {
        invoice = invoiceRepo.create({ invoiceDate: new Date(), dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000), totalAmount: 100.0, status: 'PENDING', customer, notes: 'Invoice for services' });
        await invoiceRepo.save(invoice);
        const item = itemRepo.create({ description: 'Consultation', unitPrice: 100.0, quantity: 1, total: 100.0, invoice });
        await itemRepo.save(item);
        console.log('Created invoice and items');
    } else {
        console.log('Invoice exists, reusing');
    }

    console.log('Seeding complete');
    await AppDataSource.destroy();
}

seed().catch((err) => {
    console.error('Seeding error:', err);
    process.exit(1);
});
