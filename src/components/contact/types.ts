export interface FormData {
    name: string;
    email: string;
    subject: string;
    category: string;
    message: string;
    file: File | null;
    fileData: string | null;
    fileName: string | null;
    fileType: string | null;
    phone: string;
    preferredContactMethod: string;
    budgetRange: string;
}

export interface ValidationErrors {
    name: string;
    email: string;
    subject: string;
    category: string;
    message: string;
    phone: string;
    preferredContactMethod: string;
    budgetRange: string;
    file: string;
}

export interface FieldTouched {
    name: boolean;
    email: boolean;
    subject: boolean;
    category: boolean;
    message: boolean;
    phone: boolean;
    file: boolean;
    preferredContactMethod: boolean;
    budgetRange: boolean;
}

export type SubmitStatus = 'idle' | 'success' | 'error';

export interface FAQItem {
    question: string;
    answer: string;
}
