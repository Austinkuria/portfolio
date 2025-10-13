# FAQ Data Externalization

## Overview
Moved FAQ (Frequently Asked Questions) data from the Contact page component to the central configuration file for better maintainability and reusability.

## Why Externalize FAQ Data?

### Problems with Component-Level Data
- **Tight Coupling**: FAQ data was hardcoded in the Contact page component
- **Poor Reusability**: Can't use FAQs on other pages (About, Home, etc.)
- **Difficult Updates**: Have to edit component code to update FAQ content
- **No Single Source of Truth**: If FAQs appear on multiple pages, each needs separate updates
- **Testing Complexity**: Component tests coupled with content changes

### Benefits of Centralized Configuration
- ✅ **Single Source of Truth**: One place to manage all FAQ content
- ✅ **Easy Updates**: Non-developers can update FAQs by editing config file
- ✅ **Reusability**: Use FAQ data anywhere in the app
- ✅ **Type Safety**: TypeScript types exported for better DX
- ✅ **Maintainability**: Separation of data from presentation logic
- ✅ **Future-Ready**: Easy to migrate to CMS or database later

## Implementation Details

### Location
**File**: `src/config/index.ts`
**Export**: `contactConfig.faq`

### Data Structure
```typescript
export const contactConfig = {
    // ... other config
    faq: [
        {
            question: "What types of projects do you work on?",
            answer: "I create professional websites, online stores, mobile-responsive designs..."
        },
        {
            question: "What is your typical project timeline?",
            answer: "Project timelines vary based on complexity: Simple websites (1-2 weeks)..."
        },
        // ... more FAQs
    ]
} as const;
```

### Type Export
```typescript
export type FAQItem = typeof contactConfig.faq[number];
```

### Usage in Components
```typescript
import { contactConfig } from '@/config';

// In component
{contactConfig.faq.map((faq, index) => (
    <div key={index}>
        <h3>{faq.question}</h3>
        <p>{faq.answer}</p>
    </div>
))}
```

## Current FAQ Content

### 1. Project Types
**Q**: What types of projects do you work on?  
**A**: Professional websites, online stores, mobile-responsive designs, and business automation solutions.

### 2. Project Timeline
**Q**: What is your typical project timeline?  
**A**: Varies by complexity:
- Simple websites: 1-2 weeks
- Online stores/custom apps: 4-8 weeks
- Design projects: 2-3 weeks
- System integrations: 2-4 weeks

### 3. Maintenance & Support
**Q**: Do you offer ongoing maintenance and support?  
**A**: Yes! Packages include bug fixes, security updates, performance optimization, content updates, and feature enhancements.

### 4. Development Process
**Q**: What is your development process?  
**A**: 6-phase process:
1. Discovery & Planning
2. Design & Wireframing
3. Development & Testing
4. Review & Feedback
5. Deployment & Launch
6. Training & Handover

### 5. Pricing
**Q**: How do you handle project pricing?  
**A**: Both fixed-price and hourly arrangements available. Fixed-price for defined projects, hourly for maintenance/consultation.

### 6. International Clients
**Q**: Do you work with international clients?  
**A**: Absolutely! Based in Nairobi (EAT timezone) but accommodate global clients with flexible meeting times.

## Where FAQs Are Used

### Current Usage
- ✅ **Contact Page** (`/contact`): Primary FAQ section

### Potential Future Usage
- 📋 **About Page**: Service-related FAQs
- 📋 **Home Page**: Quick FAQ preview/snippet
- 📋 **Services Page**: Process and pricing FAQs
- 📋 **Footer**: Common questions quick links
- 📋 **FAQ Dedicated Page**: Comprehensive FAQ listing

## Managing FAQs

### Adding New FAQ
```typescript
// In src/config/index.ts
faq: [
    // ... existing FAQs
    {
        question: "Your new question here?",
        answer: "Your detailed answer here with all relevant information."
    }
]
```

### Updating Existing FAQ
1. Navigate to `src/config/index.ts`
2. Find the FAQ in the `contactConfig.faq` array
3. Update the `question` or `answer` field
4. Save file - changes apply everywhere automatically

### Removing FAQ
1. Locate the FAQ object in the array
2. Delete the entire object `{ question: "...", answer: "..." }`
3. Ensure proper array formatting (commas, brackets)

### Reordering FAQs
Simply rearrange the objects in the array - the display order will update automatically.

## Best Practices

### ✅ Do
- Keep answers concise but informative (2-4 sentences ideal)
- Use clear, jargon-free language
- Update FAQs based on actual client questions
- Order FAQs by importance/frequency
- Include specific details (timelines, prices, processes)

### ❌ Don't
- Write overly long answers (consider splitting into multiple FAQs)
- Use technical jargon without explanation
- Include outdated information
- Duplicate questions with slight variations
- Leave placeholder or incomplete answers

## Migration Path to CMS/Database

If you later want to manage FAQs via CMS or database:

### 1. Create API Endpoint
```typescript
// app/api/faq/route.ts
export async function GET() {
    const faqs = await db.faqs.findMany(); // or fetch from CMS
    return Response.json(faqs);
}
```

### 2. Update Components
```typescript
// Use SWR or React Query
const { data: faqs } = useSWR('/api/faq');

// Fallback to config if API fails
const faqData = faqs || contactConfig.faq;
```

### 3. Benefits of CMS Migration
- Non-technical users can update via UI
- Version history and drafts
- Scheduled publishing
- Multi-language support
- Rich text editing
- Media management

### Recommended CMS Options
- **Sanity**: Excellent DX, real-time updates
- **Contentful**: Enterprise-ready, good APIs
- **Strapi**: Self-hosted, full control
- **Prismic**: Great for structured content

## Testing

### Unit Test Example
```typescript
import { contactConfig, FAQItem } from '@/config';

describe('FAQ Configuration', () => {
    it('should have FAQ items', () => {
        expect(contactConfig.faq.length).toBeGreaterThan(0);
    });

    it('should have required FAQ structure', () => {
        contactConfig.faq.forEach((faq: FAQItem) => {
            expect(faq).toHaveProperty('question');
            expect(faq).toHaveProperty('answer');
            expect(typeof faq.question).toBe('string');
            expect(typeof faq.answer).toBe('string');
        });
    });

    it('should not have empty questions or answers', () => {
        contactConfig.faq.forEach((faq) => {
            expect(faq.question.trim().length).toBeGreaterThan(0);
            expect(faq.answer.trim().length).toBeGreaterThan(0);
        });
    });
});
```

## SEO Benefits

### FAQ Schema Markup
You can now easily generate FAQ schema for SEO:

```typescript
export function generateFAQSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": contactConfig.faq.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}
```

### Benefits
- Better search engine visibility
- Rich snippets in Google results
- Voice search optimization
- Featured snippets eligibility

## Component Comparison

### Before: Component-Level Data
```typescript
// ❌ Tightly coupled
const Contact = () => {
    const faqData = [
        { question: "...", answer: "..." },
        // ... hardcoded data
    ];
    
    return <div>{/* render FAQs */}</div>;
};
```

**Problems**:
- Data lives in component
- Can't reuse elsewhere
- Component tests include content
- Changes require code edits

### After: Externalized Data
```typescript
// ✅ Loosely coupled
import { contactConfig } from '@/config';

const Contact = () => {
    return (
        <div>
            {contactConfig.faq.map(faq => (
                <FAQItem {...faq} />
            ))}
        </div>
    );
};
```

**Benefits**:
- Separation of concerns
- Reusable across components
- Easy content updates
- Type-safe with TypeScript

## Conclusion

Externalizing FAQ data to the configuration file is a significant improvement in code organization and maintainability. It follows the principle of **separation of concerns** and makes the codebase more professional and scalable.

### Key Takeaways
1. **Centralized**: Single source of truth for FAQ content
2. **Reusable**: Use FAQs anywhere in the app
3. **Maintainable**: Easy updates without touching component code
4. **Type-Safe**: TypeScript types ensure consistency
5. **Future-Ready**: Easy migration path to CMS/database
6. **SEO-Friendly**: Can generate structured data easily

This approach is industry-standard and recommended for all static content that might be reused or frequently updated.
