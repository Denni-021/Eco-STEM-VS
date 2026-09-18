import OpenAI from 'openai';
import { env } from '../config/env.js';

const client = env.openai.apiKey ? new OpenAI({ apiKey: env.openai.apiKey }) : null;

export function isOpenAIConfigured() {
  return Boolean(client);
}

function ensureClient() {
  if (!client) {
    const error = new Error('OPENAI_API_KEY no configurada.');
    error.statusCode = 400;
    throw error;
  }
}

export async function getPlantChatAnswer({ message, context }) {
  ensureClient();
  const response = await client.responses.create({
    model: env.openai.model,
    input: [
      {
        role: 'system',
        content:
          'Eres Eco-STEM, un asistente experto en plantas y agricultura de precision. Responde en espanol, con precision, sin inventar diagnosticos definitivos. Si faltan datos, dilo con claridad. Da pasos concretos y breves.'
      },
      {
        role: 'user',
        content: `Pregunta: ${message}\nContexto: ${JSON.stringify(context)}`
      }
    ]
  });

  return response.output_text;
}

export async function analyzePlantImages({ images, context }) {
  ensureClient();

  const content = [
    {
      type: 'input_text',
      text:
        'Analiza estas imagenes de una planta. Debes evaluar coloracion, manchas, textura, turgencia, bordes, tallos, senales de plaga, dano mecanico, exceso de agua, falta de agua, luz insuficiente o exceso de luz. No digas automaticamente que falta agua si no hay evidencia. Si no puedes concluir algo con seguridad, dilo.'
    },
    {
      type: 'input_text',
      text: `Contexto adicional: ${JSON.stringify(context)}`
    },
    ...images.map(image => ({
      type: 'input_image',
      image_url: image.dataUrl
    }))
  ];

  const response = await client.responses.create({
    model: env.openai.visionModel,
    input: [{ role: 'user', content }],
    text: {
      format: {
        type: 'json_schema',
        name: 'plant_analysis',
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            severity: { type: 'string', enum: ['healthy', 'warning', 'critical'] },
            title: { type: 'string' },
            summary: { type: 'string' },
            confidence: { type: 'number' },
            recommendations: {
              type: 'array',
              items: { type: 'string' }
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  label: { type: 'string' },
                  value: { type: 'string' },
                  color: { type: 'string' }
                },
                required: ['label', 'value', 'color']
              }
            }
          },
          required: ['severity', 'title', 'summary', 'confidence', 'recommendations', 'details']
        }
      }
    }
  });

  const parsed = JSON.parse(response.output_text);
  return {
    ...parsed,
    confidence: Number(parsed.confidence || 0),
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    details: Array.isArray(parsed.details) ? parsed.details : []
  };
}

export async function getPlantRecommendations({ filters, location, sensors }) {
  ensureClient();

  const response = await client.responses.create({
    model: env.openai.model,
    input: [
      {
        role: 'system',
        content:
          'Eres Eco-STEM, un asistente experto en horticultura urbana, ornamentales y siembra doméstica. Responde en español. Debes recomendar plantas realistas según clima, vivienda, pronóstico y objetivo del usuario. No prometas resultados absolutos y explica el porqué de cada recomendación de forma breve.'
      },
      {
        role: 'user',
        content: `Genera 4 recomendaciones de plantas para estas condiciones. Filtros: ${JSON.stringify(filters)}. Ubicación: ${JSON.stringify(location)}. Sensores: ${JSON.stringify(sensors)}.`
      }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'plant_recommendations',
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            recommendations: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  name: { type: 'string' },
                  goal: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  score: { type: 'number' },
                  summary: { type: 'string' },
                  evidence: { type: 'string' },
                  reasons: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  carePlan: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                },
                required: ['name', 'goal', 'score', 'summary', 'evidence', 'reasons', 'carePlan']
              }
            }
          },
          required: ['recommendations']
        }
      }
    }
  });

  const parsed = JSON.parse(response.output_text);
  return {
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : []
  };
}
