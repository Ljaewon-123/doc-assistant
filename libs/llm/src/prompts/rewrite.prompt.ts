export const buildRewritePrompt = (
  section: string,
  instruction: string,
): string =>
  `
아래 문서 섹션을 주어진 지시에 따라 수정하세요.
원문의 형식(마크다운, 문체)을 유지하면서 내용만 수정하세요.
수정된 내용만 출력하세요. 설명이나 부연은 하지 마세요.

[원본 섹션]
${section}

[수정 지시]
${instruction}
`.trim();
