const { GEMINI_API_KEY } = require('../config/env');
const Expense = require('../models/Expense.model');
const Budget = require('../models/Budget.model');
const SavingsGoal = require('../models/SavingsGoal.model');
const Category = require('../models/Category.model');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

// Models to try in order of preference — if one model's quota is exhausted, try the next
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.0-flash',
];

const getGeminiUrl = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

/**
 * Sleep utility for retry backoff.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Core function to call Gemini with automatic model fallback and retry on 429.
 * Tries each model in GEMINI_MODELS; on quota/rate-limit errors, falls back to the next model.
 */
const callGeminiWithFallback = async (bodyContents, generationConfig) => {
  if (!GEMINI_API_KEY) {
    throw ApiError.badRequest(
      'Gemini API key not configured. Add GEMINI_API_KEY to your server/.env file. Get a free key at https://aistudio.google.com/apikey'
    );
  }

  const MAX_RETRIES = 2;
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const url = `${getGeminiUrl(model)}?key=${GEMINI_API_KEY}`;
        console.log(`🤖 Trying model: ${model} (attempt ${attempt + 1})`);

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: bodyContents,
            generationConfig,
          }),
        });

        if (response.status === 429) {
          const errData = await response.json().catch(() => ({}));
          console.warn(`⚠️ Rate limited on ${model}:`, errData.error?.message || 'Quota exceeded');

          // Check if quota limit is 0 (account-level block) — skip retries, try next model
          const errMsg = errData.error?.message || '';
          if (errMsg.includes('limit: 0')) {
            console.warn(`🚫 ${model} has zero quota, skipping to next model...`);
            lastError = errData;
            break; // Break retry loop, move to next model
          }

          // Transient rate limit — wait and retry
          if (attempt < MAX_RETRIES) {
            const waitMs = Math.pow(2, attempt + 1) * 1000; // 2s, 4s
            console.log(`⏳ Retrying in ${waitMs / 1000}s...`);
            await sleep(waitMs);
            continue;
          }

          lastError = errData;
          break; // Exhausted retries for this model
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.error(`Gemini API error (${model}):`, errData);
          lastError = errData;
          break; // Non-429 error, try next model
        }

        // Success!
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          throw ApiError.badRequest('AI returned an empty response. Please try again.');
        }

        console.log(`✅ Success with model: ${model}`);
        try {
          return JSON.parse(text);
        } catch {
          return { raw: text };
        }
      } catch (err) {
        if (err instanceof ApiError) throw err;
        console.error(`Error calling ${model}:`, err.message);
        lastError = err;
        break; // Network error, try next model
      }
    }
  }

  // All models failed
  const errorMsg = lastError?.error?.message || '';
  if (errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('limit: 0')) {
    throw ApiError.badRequest(
      'Gemini API quota exhausted on all available models. ' +
      'This usually means your API key has no free quota remaining. ' +
      'Please either: (1) enable billing at https://aistudio.google.com, ' +
      '(2) generate a new API key, or (3) wait 24 hours for quota to reset.'
    );
  }

  throw ApiError.badRequest('AI service temporarily unavailable. Please try again later.');
};

/**
 * Call the Gemini API with a text prompt.
 */
const callGemini = async (prompt) => {
  return callGeminiWithFallback(
    [{ parts: [{ text: prompt }] }],
    {
      temperature: 0.7,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    }
  );
};

/**
 * Call Gemini with a vision prompt (image + text).
 */
const callGeminiVision = async (base64Image, mimeType, prompt) => {
  return callGeminiWithFallback(
    [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      },
    ],
    {
      temperature: 0.2,
      maxOutputTokens: 1024,
      responseMimeType: 'application/json',
    }
  );
};

/**
 * Generate AI-powered financial insights for a user.
 */
const generateInsights = async (userId) => {
  const userObjId = mongoose.Types.ObjectId.createFromHexString(userId.toString());
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  // Gather user's financial data in parallel
  const [expenses, budgets, savingsGoals, categories] = await Promise.all([
    Expense.find({ userId: userObjId, date: { $gte: threeMonthsAgo } })
      .populate('categoryId', 'name icon color')
      .sort({ date: -1 })
      .lean(),
    Budget.find({
      userId: userObjId,
      $or: [
        { month: now.getMonth() + 1, year: now.getFullYear() },
        { month: now.getMonth(), year: now.getFullYear() },
        { month: now.getMonth() - 1, year: now.getFullYear() },
      ],
    })
      .populate('categoryId', 'name icon color')
      .lean(),
    SavingsGoal.find({ userId: userObjId }).lean(),
    Category.find({ userId: userObjId }).lean(),
  ]);

  if (expenses.length === 0) {
    throw ApiError.badRequest(
      'Not enough data to generate insights. Add some expenses first!'
    );
  }

  // Prepare concise data summaries for the prompt
  const expenseSummary = expenses.map((e) => ({
    title: e.title,
    amount: e.amount,
    category: e.categoryId?.name || 'Other',
    date: e.date.toISOString().split('T')[0],
  }));

  const budgetSummary = budgets.map((b) => ({
    category: b.categoryId?.name || b.name,
    limit: b.limit,
    spent: b.spent,
    month: b.month,
    year: b.year,
    utilizationPercent: b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0,
  }));

  const savingsSummary = savingsGoals.map((s) => ({
    name: s.name,
    target: s.targetAmount,
    current: s.currentAmount,
    targetDate: s.targetDate?.toISOString().split('T')[0],
    status: s.status,
    progressPercent: s.targetAmount > 0 ? Math.round((s.currentAmount / s.targetAmount) * 100) : 0,
  }));

  const totalExpensesThisMonth = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const prompt = `You are a smart personal finance advisor for an Indian user. Analyze the following financial data and provide actionable insights in Indian Rupees (₹).

USER'S FINANCIAL DATA (last 3 months):
=== EXPENSES (${expenses.length} transactions) ===
${JSON.stringify(expenseSummary.slice(0, 50))}

=== BUDGETS (current & recent months) ===
${JSON.stringify(budgetSummary)}

=== SAVINGS GOALS ===
${JSON.stringify(savingsSummary)}

=== SUMMARY ===
Total expenses this month: ₹${totalExpensesThisMonth}
Number of categories: ${categories.length}
Today's date: ${now.toISOString().split('T')[0]}

RESPOND with a JSON object containing these exact keys:
{
  "spendingAnalysis": {
    "topCategories": [{"name": "category", "amount": number, "percentage": number}],
    "monthOverMonthChange": "description of trend",
    "anomalies": ["any unusual spending patterns detected"],
    "dailyAverage": number
  },
  "budgetHealth": {
    "status": "healthy | warning | critical",
    "atRiskBudgets": [{"category": "name", "utilization": number, "suggestion": "tip"}],
    "overallUtilization": number,
    "summary": "brief assessment"
  },
  "savingsForecast": {
    "onTrackGoals": [{"name": "goal", "projectedCompletion": "date or status"}],
    "behindGoals": [{"name": "goal", "gap": number, "suggestion": "tip"}],
    "summary": "brief assessment"
  },
  "recommendations": [
    {"icon": "emoji", "title": "short title", "description": "actionable advice", "impact": "high | medium | low"}
  ],
  "cashFlowForecast": {
    "projectedExpenses": number,
    "trend": "increasing | stable | decreasing",
    "summary": "1-2 sentence forecast for next month"
  }
}

Be specific with numbers. Use ₹ symbol. Give 3-5 recommendations. Be encouraging but honest.`;

  return callGemini(prompt);
};

/**
 * Parse a receipt image using Gemini Vision.
 */
const parseReceipt = async (base64Image, mimeType, userCategories) => {
  const categoryNames = userCategories.map((c) => c.name).join(', ');

  const prompt = `You are a receipt parser. Analyze this receipt image and extract the following information.

The user has these expense categories: ${categoryNames}

RESPOND with a JSON object containing:
{
  "title": "Store/merchant name or a short description of the purchase",
  "amount": number (total amount paid, just the number without currency symbol),
  "date": "YYYY-MM-DD format (best guess if unclear, use today if not visible)",
  "category": "Best matching category from the user's list above",
  "notes": "Brief summary of key items purchased (if visible)",
  "confidence": "high | medium | low"
}

If the image is not a receipt or is unreadable, respond with:
{
  "error": "description of the issue",
  "confidence": "low"
}

Important: amount must be a number (not a string). Parse Indian Rupee amounts (₹) correctly.`;

  return callGeminiVision(base64Image, mimeType, prompt);
};

module.exports = { generateInsights, parseReceipt };
