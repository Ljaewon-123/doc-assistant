export const buildQaPrompt = (question: string, context: string): string =>
  `
당신은 문서 기반 질문 답변 전문가입니다.
아래 문서 내용을 참고하여 질문에 답변하세요.
문서에 없는 내용은 "문서에서 찾을 수 없습니다"라고 답하세요.

[문서 내용]
${context}

[질문]
${question}
`.trim();
