export interface FormData {
    name: string;
    email: string;
    subject: string;
    category: string;
    message: string;
}

export interface ValidationErrors {
    name: string;
    email: string;
    subject: string;
    category: string;
    message: string;
}

export interface FieldTouched {
    name: boolean;
    email: boolean;
    subject: boolean;
    category: boolean;
    message: boolean;
}

export type SubmitStatus = 'idle' | 'success' | 'error';

export interface FAQItem {
    question: string;
    answer: string;
}
