import { config } from 'dotenv';
config();

import '@/ai/flows/answer-product-question.ts';
import '@/ai/flows/assess-product-popularity.ts';
import '@/ai/flows/check-product-availability.ts';