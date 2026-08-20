import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
	schema: z.object({
		page: z.number(),
		title: z.string(),
	}),
});

const cards = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cards' }),
	schema: z.object({
		page: z.number(),
		title: z.string(),
	}),
});

export const collections = { pages, cards };
