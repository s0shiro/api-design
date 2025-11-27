import { GoogleGenAI } from '@google/genai'
import env from '../../env.ts'
import type { Request, Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import { getHabitsWithTagsByUser } from '../services/habitServices.ts'

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })

export const askGemeni = async (req: Request, res: Response) => {
  try {
    const prompt: string = req.body?.prompt
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // match docs snippet
      contents: prompt,
    })

    res.json({ reply: response.text })
  } catch (err: any) {
    console.error('Gemini error:', err)
    res.status(502).json({
      error: 'Gemini request failed',
      details: err?.message ?? 'Unknown error',
    })
  }
}

export const aiInsights = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userHabits = await getHabitsWithTagsByUser(req.user.id)

    console.log('userHabits raw:', userHabits)

    const prompt = `You are an assistant generating compact, helpful habit insights.
    Return ONLY a raw JSON object. No markdown, no backticks, no prose outside JSON.

    Input (JSON array of habits):
    ${JSON.stringify(userHabits)}

    Fields per habit: id, name, description, frequency (daily|weekly|monthly), targetCount (number), tags: [{id,name,slug}].

    Output (strict JSON):
    {
    "insights": ["..."],                // max 3 items, each <= 90 chars
    "data_gaps": ["..."],               // max 2 items, each <= 90 chars
    "recommendations": [                // max 3 items
        { "action": "...", "reason": "...", "priority": 1 } // action<=90, reason<=90; priorities 1..3 unique
    ],
    "summary": "..."                    // <= 140 chars
    }

    Rules:
    - Do NOT invent performance/completion data.
    - Prefer punchy verbs and concrete phrasing; avoid filler.
    - If habit count < 3, include diversification.
    - If many habits are daily, note cadence variety risk.
    - If targetCount lacks units in name/description, flag it.
    - If >60% of tags share one domain, note imbalance.
    - If any habit lacks tags or description, call it out.
    - No duplicates; each item adds a new point.
    - Valid JSON only; no trailing commas; no escaped \\n sequences.`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    res.json({ reply: response.text })
  } catch (err: any) {
    console.error('Gemini error:', err)
    res.status(502).json({
      error: 'Gemini request failed',
      details: err?.message ?? 'Unknown error',
    })
  }
}
