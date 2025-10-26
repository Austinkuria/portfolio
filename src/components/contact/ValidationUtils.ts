import { contactConfig } from '@/config';
import { FormData, ValidationErrors } from './types';

export const validateName = (name: string): string => {
    if (!name.trim()) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 50) return 'Name must be less than 50 characters';

    // Adjust regex to allow valid names with spaces and hyphens
    if (/[^a-zA-Z\s-]/.test(name)) {
        return 'Name should only contain letters, spaces, and hyphens';
    }

    return '';
};

// Simplified email validation - pattern-based only
export const validateEmailPattern = (email: string): { valid: boolean; reason?: string } => {
    const emailLower = email.toLowerCase();
    const emailParts = emailLower.split('@');
    const localPart = emailParts[0] || '';

    // Block obvious fake patterns
    if (
        emailLower.includes('test@test.') ||
        emailLower.includes('fake@fake.') ||
        emailLower.includes('dummy@dummy.') ||
        emailLower.includes('sample@sample.') ||
        emailLower === 'test@test.com' ||
        emailLower === 'fake@fake.com' ||
        emailLower === 'admin@admin.com' ||
        /^(test|fake|dummy|sample)\d*@(test|fake|dummy|sample)\d*\.(com|org|net)$/.test(emailLower) ||

        // Block common test patterns that are clearly not real
        /^(user|student|admin|testuser)\d+@/.test(emailLower) || // user123@, student5@, admin1@, testuser2@
        /^(test|fake|dummy|sample)\d*@/.test(emailLower) // test@, test123@, fake2@, etc.
    ) {
        console.log('Email rejected due to obvious fake pattern:', email, 'localPart:', localPart);
        return { valid: false, reason: 'Please use your real email address' };
    }

    // All other emails are considered valid (pattern-based validation only)
    return { valid: true };
};

export const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';

    // Fast pattern check only - full validation happens on blur/submit
    return '';
};

// Full validation with all checks - only called on blur or submit
export const validateEmailFull = (email: string): string => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';

    // Check for suspicious domains using configuration
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (
        emailDomain &&
        contactConfig.suspiciousEmailDomains.some((d: string) => d === emailDomain)
    ) {
        console.log('Email rejected due to suspicious domain:', emailDomain);
        return 'Please use a valid email address';
    }

    // Use pattern-based validation
    const patternResult = validateEmailPattern(email);
    if (!patternResult.valid) {
        return patternResult.reason || 'Please use your real email address';
    }

    console.log('Email validation passed for:', email);
    return '';
};

export const validateSubject = (subject: string): string => {
    if (!subject.trim()) return 'Subject is required';
    if (subject.length < 5) return 'Subject must be at least 5 characters';
    if (subject.length > 100) return 'Subject must be less than 100 characters';
    return '';
};

// Category display names for validation and UI
export const categoryDisplayNames = {
    'build-website': 'Build New Website (Startup or Redesign)',
    'design-redesign': 'Design & UX Improvement',
    'ecommerce': 'E-commerce / Online Store',
    'maintenance-support': 'Maintenance & Support',
    'other': 'Something Else (Tell me more)'
} as const;

export const validateCategory = (category: string): string => {
    const validCategories = [
        'build-website',
        'design-redesign',
        'ecommerce',
        'maintenance-support',
        'other'
    ];
    // Category is optional - only validate if a value is provided
    if (!category) return '';
    if (!validCategories.includes(category)) return 'Please select a valid category';
    return '';
}; export const validateMessage = (message: string): string => {
    if (!message.trim()) return 'Message is required';
    if (message.length < 10) return 'Message must be at least 10 characters';
    if (message.length > 1000) return 'Message must be less than 1000 characters';
    return '';
};

export const validatePhone = (phone: string): string => {
    if (!phone.trim()) return '';

    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-()]/g, '');

    if (!phoneRegex.test(cleanPhone)) {
        return 'Please enter a valid phone number';
    }

    if (cleanPhone.length < 7) {
        return 'Phone number is too short';
    }

    if (cleanPhone.length > 15) {
        return 'Phone number is too long';
    }

    return '';
};

export const validatePreferredContactMethod = (method: string): string => {
    const validMethods = ['Email', 'Phone', 'WhatsApp'];
    if (!method) return '';
    if (!validMethods.includes(method)) return 'Please select a valid contact method';
    return '';
};

export const validateBudgetRange = (budget: string): string => {
    const validBudgets = ['Under $1,000', '$1,000 - $5,000', '$5,000 - $10,000', 'Over $10,000', 'Discuss'];
    if (!budget) return '';
    if (!validBudgets.includes(budget)) return 'Please select a valid budget range';
    return '';
};

export const isFormValid = (formData: FormData, validationErrors: ValidationErrors): boolean => {
    const requiredFields = ['name', 'email', 'subject', 'message'];
    const hasRequiredFields = requiredFields.every(field =>
        formData[field as keyof FormData] && String(formData[field as keyof FormData]).trim() !== ''
    );

    const hasNoErrors = Object.values(validationErrors).every(error => error === '');

    return hasRequiredFields && hasNoErrors;
};

export const performFullValidation = (formData: FormData): ValidationErrors => {
    return {
        name: validateName(formData.name),
        email: validateEmail(formData.email),
        subject: validateSubject(formData.subject),
        category: validateCategory(formData.category),
        message: validateMessage(formData.message),
        phone: validatePhone(formData.phone),
        preferredContactMethod: validatePreferredContactMethod(formData.preferredContactMethod),
        budgetRange: validateBudgetRange(formData.budgetRange),
        file: '', // File validation would go here if needed\
    };
};
