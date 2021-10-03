export default interface LogEntry {
    product: string;
    timestamp: Date;
    price: number;
    average: number;
    threshold: number;
    message: string;
}
