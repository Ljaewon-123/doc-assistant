export const configuration = () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
  llmModel: process.env.LLM_MODEL ?? 'claude-haiku-4-5-20251001',
  databaseUrl: process.env.DATABASE_URL ?? '',
  uploadDir: process.env.UPLOAD_DIR ?? './uploads',
  outputDir: process.env.OUTPUT_DIR ?? './outputs',
  embeddingModel: process.env.EMBEDDING_MODEL ?? 'Xenova/all-MiniLM-L6-v2',
  embeddingDimension: parseInt(process.env.EMBEDDING_DIMENSION ?? '384', 10),
  chunkSize: parseInt(process.env.CHUNK_SIZE ?? '1000', 10),
  chunkOverlap: parseInt(process.env.CHUNK_OVERLAP ?? '200', 10),
});

export type AppConfig = ReturnType<typeof configuration>;
