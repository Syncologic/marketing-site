import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { USE_CASES, LOCALES } from './lib/validation';

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
  updatedAt: z.coerce.date(),
  relatedSlugs: z.array(z.string()).default([]),
});

export const collections = {
  'use-cases': defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/use-cases' }),
    schema: useCaseSchema,
  }),
  guides: defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/guides' }),
    schema: guideSchema,
  }),
};
