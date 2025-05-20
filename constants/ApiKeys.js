/**
 * @fileoverview
 * This file contains the API keys required for integrating with external services such as Google Translate
 * and OpenAI. These keys should be kept secure and not exposed in production environments.
 *
 * @module ApiKeys
 */

export const googleApiKey = process.env.GOOGLE_API_KEY;

export const openAiKey = process.env.OPENAI_API_KEY;
