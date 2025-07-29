export interface History {
    id: number;
    fullName: string; // Nombre completo del usuario que realizó la predicción
    email: string;
    brand: string;
    kerasPrediction: number;
    linearPrediction: number;
    createdAt: Date;
}
