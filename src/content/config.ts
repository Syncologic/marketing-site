import { defineCollection, z } from 'astro:content';
import { USE_CASES, LOCALES } from '../lib/validation';

const waitlistSegmentEnum = z.enum(USE_CASES);
const localeEnum = z.enum(LOCALES);

const ctaSchema = z.object({
  label: z.string(),
  href: z.string().default('#waitlist'),
});

const useCaseSchema = z.object({
  locale: localeEnum,
  title: z.string().min(8).max(70),
  description: z.string().min(40).max(180),
  ogImage: z.string().optional(),
  eyebrow: z.string(),
  headline: z.string(),
  subheading: z.string(),
  primaryCta: ctaSchema,
  secondaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
  waitlistSegment: waitlistSegmentEnum,
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

const guideSchema = z.object({
  locale: localeEnum,
  title: z.string().min(8).max(70),
  description: z.string().min(40).max(180),
  ogImage: z.string().optional(),
  eyebrow: z.string(),
  headline: z.string(),
  subheading: z.string(),
  primaryCta: ctaSchema,
  waitlistSegment: waitlistSegmentEnum.optional(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export const collections = {
  'use-cases': defineCollection({ type: 'content', schema: useCaseSchema }),
  guides: defineCollection({ type: 'content', schema: guideSchema }),
};
