import OpenAI from "openai";

import {
  addAiGeneration,
  getConversationMessages,
  getWorkspaceArticles,
  getWorkspaceSettings
} from "@/lib/store";

async function selectRelevantArticles(organisationId: string, conversationText: string) {
  const tokens = conversationText.toLowerCase().split(/\W+/).filter(Boolean);
  return (await getWorkspaceArticles(organisationId))
    .filter((article) => article.state === "ACTIVE")
    .map((article) => {
      const haystack = `${article.title} ${article.summary} ${article.body}`.toLowerCase();
      const score = tokens.reduce((sum, token) => (haystack.includes(token) ? sum + 1 : sum), 0);
      return { article, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.article);
}

function buildFallbackDraft(input: {
  companyName: string;
  tone: string;
  customerMessage: string;
  sourceBodies: string[];
  cannedResponse?: string;
}) {
  const guidance = input.sourceBodies[0]
    ? `Based on our approved guidance: ${input.sourceBodies[0]}`
    : "We do not have enough approved knowledge to answer this confidently yet.";

  return `${input.cannedResponse ? `${input.cannedResponse}\n\n` : ""}Thanks for contacting ${input.companyName}. ${guidance} Please let us know if you can share any extra details so we can help further.`;
}

export async function generateAiDraft(input: {
  organisationId: string;
  conversationId: string;
  cannedResponseBody?: string;
}) {
  const settings = await getWorkspaceSettings(input.organisationId);
  const messages = await getConversationMessages(input.conversationId);
  const customerMessage = messages
    .filter((message) => message.authorType === "customer")
    .map((message) => message.body)
    .join("\n");
  const relevantArticles = await selectRelevantArticles(input.organisationId, customerMessage);
  const sourceBodies = relevantArticles.map((article) => article.body);
  const insufficientContext = relevantArticles.length === 0;
  const warning = insufficientContext
    ? "No suitable knowledge-base article found. Consider adding or activating content for this topic."
    : undefined;

  let draft = buildFallbackDraft({
    companyName: settings.companyName,
    tone: settings.supportTone,
    customerMessage,
    sourceBodies,
    cannedResponse: input.cannedResponseBody
  });

  const apiKey = process.env.OPENAI_API_KEY;
  let tokenEstimate = 320;
  let estimatedCostUsd = 0.01;

  if (apiKey) {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: settings.defaultAiModel,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `You are drafting customer support replies for ${settings.companyName}. Tone: ${settings.supportTone}. Use only the approved business context and keep the reply ready for human review.`
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Customer message:\n${customerMessage}\n\nApproved knowledge:\n${sourceBodies.join("\n\n") || "No approved knowledge available."}\n\nOptional canned response:\n${input.cannedResponseBody ?? "None"}`
            }
          ]
        }
      ]
    });
    draft = response.output_text || draft;
    tokenEstimate = response.usage?.total_tokens ?? tokenEstimate;
    estimatedCostUsd = Number(((tokenEstimate / 1000) * 0.002).toFixed(4));
  }

  return addAiGeneration({
    organisationId: input.organisationId,
    conversationId: input.conversationId,
    draft,
    confidenceLabel: insufficientContext ? "Low" : relevantArticles.length > 1 ? "High" : "Medium",
    sourceArticleIds: relevantArticles.map((article) => article.id),
    sourceSnippetTitles: relevantArticles.map((article) => article.title),
    outcome: "generated",
    warning,
    tokenEstimate,
    estimatedCostUsd
  });
}
