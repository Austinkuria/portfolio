import { contactConfig } from '@/config';
import { FormData, ValidationErrors } from './types';
import {
    validateName as validateNameShared,
    validateEmail as validateEmailShared,
    validateSubject as validateSubjectShared,
    validateCategory as validateCategoryShared,
    validateMessage as validateMessageShared,
} from '@/lib/validation';

export const validateName = (name: string): string => {
    const result = validateNameShared(name);
    return result.isValid ? '' : (result.error || '');
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
    const result = validateEmailShared(email);
    return result.isValid ? '' : (result.error || '');
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
    const result = validateSubjectShared(subject);
    return result.isValid ? '' : (result.error || '');
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
    const result = validateCategoryShared(category);
    return result.isValid ? '' : (result.error || '');
};

export const validateMessage = (message: string): string => {
    const result = validateMessageShared(message);
    return result.isValid ? '' : (result.error || '');
};

// Comprehensive form validation
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
    };
};
