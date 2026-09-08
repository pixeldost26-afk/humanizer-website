import { GrammarCorrection } from "./provider";

export interface HeuristicRule {
  pattern: RegExp;
  replacement: string;
  type: GrammarCorrection["type"];
  explanation: string;
}

export const COMMON_GRAMMAR_RULES: HeuristicRule[] = [
  {
    pattern: /\bteh\b/gi,
    replacement: "the",
    type: "spelling",
    explanation: 'Typing error: "teh" should be "the".',
  },
  {
    pattern: /\brecieve\b/gi,
    replacement: "receive",
    type: "spelling",
    explanation: 'Spelling rule: "i" before "e" except after "c".',
  },
  {
    pattern: /\btheir is\b/gi,
    replacement: "there is",
    type: "grammar",
    explanation: 'Homophone error: use "there" to refer to existence or location.',
  },
  {
    pattern: /\btheir are\b/gi,
    replacement: "there are",
    type: "grammar",
    explanation: 'Homophone error: use "there" to refer to existence or location.',
  },
  {
    pattern: /\bthere is many\b/gi,
    replacement: "there are many",
    type: "grammar",
    explanation: 'Subject-verb agreement: plural noun requires "there are".',
  },
  {
    pattern: /\baffect the results\b/gi,
    replacement: "influence the results",
    type: "style",
    explanation: 'Word choice: consider a more descriptive verb like "influence".',
  },
  {
    pattern: /\bvery unique\b/gi,
    replacement: "unique",
    type: "clarity",
    explanation: '"Unique" is absolute and should not be modified by "very".',
  },
  {
    pattern: /\byour welcome\b/gi,
    replacement: "you're welcome",
    type: "grammar",
    explanation: 'Contraction required: "you\'re" (you are), not possessive "your".',
  },
  {
    pattern: /\bshould of\b/gi,
    replacement: "should have",
    type: "grammar",
    explanation: 'Modal verb error: "should have", not "should of".',
  },
  {
    pattern: /\bcould of\b/gi,
    replacement: "could have",
    type: "grammar",
    explanation: 'Modal verb error: "could have", not "could of".',
  },
  {
    pattern: /\bwould of\b/gi,
    replacement: "would have",
    type: "grammar",
    explanation: 'Modal verb error: "would have", not "would of".',
  },
  {
    pattern: /\balot\b/gi,
    replacement: "a lot",
    type: "spelling",
    explanation: '"a lot" is two words.',
  },
  {
    pattern: /\bseperate\b/gi,
    replacement: "separate",
    type: "spelling",
    explanation: 'Spelling error: "separate" with an "a".',
  },
  {
    pattern: /\bdefinately\b/gi,
    replacement: "definitely",
    type: "spelling",
    explanation: 'Spelling error: "definitely".',
  },
  {
    pattern: /\boccured\b/gi,
    replacement: "occurred",
    type: "spelling",
    explanation: 'Spelling error: double "r" in "occurred".',
  },
  {
    pattern: /\buntill\b/gi,
    replacement: "until",
    type: "spelling",
    explanation: 'Spelling error: single "l" in "until".',
  },
  {
    pattern: /\bthier\b/gi,
    replacement: "their",
    type: "spelling",
    explanation: 'Spelling error: "their".',
  },
  {
    pattern: /\bwierd\b/gi,
    replacement: "weird",
    type: "spelling",
    explanation: 'Spelling error: "weird".',
  },
];

export function runHeuristicGrammarCheck(text: string): GrammarCorrection[] {
  if (!text || typeof text !== "string") return [];
  const corrections: GrammarCorrection[] = [];

  COMMON_GRAMMAR_RULES.forEach((rule, idx) => {
    const flags = rule.pattern.flags.includes("g") ? rule.pattern.flags : rule.pattern.flags + "g";
    const regex = new RegExp(rule.pattern.source, flags);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      // Avoid duplicate overlapping matches
      const existing = corrections.find(
        (c) => match!.index >= c.start && match!.index < c.end
      );
      if (!existing) {
        corrections.push({
          id: `h-corr-${idx}-${match.index}`,
          original: match[0],
          replacement: rule.replacement,
          start: match.index,
          end: match.index + match[0].length,
          type: rule.type,
          explanation: rule.explanation,
        });
      }
    }
  });

  return corrections;
}
