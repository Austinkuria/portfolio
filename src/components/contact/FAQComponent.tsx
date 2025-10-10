'use client';

import React, { useState } from 'react';
import { m } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { MotionDiv } from '@/lib/motion';
import { FAQItem } from './types';

interface FAQComponentProps {
  faqData: FAQItem[];
}

export default function FAQComponent({ faqData }: FAQComponentProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-20"
    >
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Common questions about my services, process, and collaboration approach
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="bg-card rounded-lg border border-border/30 overflow-hidden">
            <button
              onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-muted/30 transition-colors"
            >
              <span className="font-medium text-card-foreground">{faq.question}</span>
              <FaChevronDown 
                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                  openFaqIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openFaqIndex === index && (
              <m.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-4"
              >
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </m.div>
            )}
          </div>
        ))}
      </div>
    </MotionDiv>
  );
}
