export class User {
    id!: number;
    firstName!: string;
    lastName!: string;
    email!: string;
    phone?: string;
    role!: string; // e.g., 'admin', 'user', 'organizer'
    createdAt!: Date;
    updatedAt!: Date;

    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}