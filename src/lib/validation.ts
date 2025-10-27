// Shared validation constants and functions
// Used by both client-side forms and server-side API routes

export const VALIDATION_RULES = {
    name: {
        min: 2,
        max: 100,
        pattern: /^[a-zA-Z\s-]+$/,
    },
    email: {
        pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    },
    subject: {
        min: 5,
        max: 100,
    },
    message: {
        min: 10,
        max: 2000,
    },
} as const;

export const VALID_CATEGORIES = [
    'build-website',
    'design-redesign',
    'ecommerce',
    'maintenance-support',
    'other'
] as const;

export type ValidCategory = typeof VALID_CATEGORIES[number];

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

// Name validation
export function validateName(name: string): ValidationResult {
    if (!name || !name.trim()) {
        return { isValid: false, error: 'Name is required' };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < VALIDATION_RULES.name.min) {
        return { isValid: false, error: `Name must be at least ${VALIDATION_RULES.name.min} characters` };
    }

    if (trimmedName.length > VALIDATION_RULES.name.max) {
        return { isValid: false, error: `Name must be less than ${VALIDATION_RULES.name.max} characters` };
    }

    if (!VALIDATION_RULES.name.pattern.test(trimmedName)) {
        return { isValid: false, error: 'Name should only contain letters, spaces, and hyphens' };
    }

    return { isValid: true };
}

// Email validation
export function validateEmail(email: string): ValidationResult {
    if (!email || !email.trim()) {
        return { isValid: false, error: 'Email is required' };
    }

    const trimmedEmail = email.trim();

    if (!VALIDATION_RULES.email.pattern.test(trimmedEmail)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true };
}

// Subject validation
export function validateSubject(subject: string): ValidationResult {
    if (!subject || !subject.trim()) {
        return { isValid: false, error: 'Subject is required' };
    }

    const trimmedSubject = subject.trim();

    if (trimmedSubject.length < VALIDATION_RULES.subject.min) {
        return { isValid: false, error: `Subject must be at least ${VALIDATION_RULES.subject.min} characters` };
    }

    if (trimmedSubject.length > VALIDATION_RULES.subject.max) {
        return { isValid: false, error: `Subject must be less than ${VALIDATION_RULES.subject.max} characters` };
    }

    return { isValid: true };
}

// Category validation
export function validateCategory(category: string): ValidationResult {
    // Category is optional
    if (!category || !category.trim()) {
        return { isValid: true };
    }

    if (!VALID_CATEGORIES.includes(category as ValidCategory)) {
        return { isValid: false, error: 'Please select a valid category' };
    }

    return { isValid: true };
}

// Message validation
export function validateMessage(message: string): ValidationResult {
    if (!message || !message.trim()) {
        return { isValid: false, error: 'Message is required' };
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length < VALIDATION_RULES.message.min) {
        return { isValid: false, error: `Message must be at least ${VALIDATION_RULES.message.min} characters` };
    }

    if (trimmedMessage.length > VALIDATION_RULES.message.max) {
        return { isValid: false, error: `Message must be less than ${VALIDATION_RULES.message.max} characters` };
    }

    return { isValid: true };
}

// Validate all required fields
export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    category?: string;
    message: string;
}

export interface ValidationErrors {
    name?: string;
    email?: string;
    subject?: string;
    category?: string;
    message?: string;
}

export function validateContactForm(data: ContactFormData): ValidationErrors {
    const errors: ValidationErrors = {};

    const nameResult = validateName(data.name);
    if (!nameResult.isValid) errors.name = nameResult.error;

    const emailResult = validateEmail(data.email);
    if (!emailResult.isValid) errors.email = emailResult.error;

    const subjectResult = validateSubject(data.subject);
    if (!subjectResult.isValid) errors.subject = subjectResult.error;

    const categoryResult = validateCategory(data.category || '');
    if (!categoryResult.isValid) errors.category = categoryResult.error;

    const messageResult = validateMessage(data.message);
    if (!messageResult.isValid) errors.message = messageResult.error;

    return errors;
}

// Check if form has any validation errors
export function hasValidationErrors(errors: ValidationErrors): boolean {
    return Object.values(errors).some(error => error !== undefined && error !== '');
}
