export class Event {
    id!: number;
    title!: string;
    description!: string;
    startDate!: Date;
    endDate!: Date;
    place!: string;
    capacityMax!: number;
    price!: number;
    nbParticipantsActuels!: number;
    feedbacks?: any[];
    
    // ✅ QR CODE - OPTIONNEL
    qrCodeBase64?: string;
    qrToken?: string;

    constructor() {
        this.qrCodeBase64 = undefined;
        this.qrToken = undefined;
    }
}
