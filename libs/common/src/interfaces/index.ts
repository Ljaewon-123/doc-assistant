export interface IChunkSearchResult {
  content: string;
  sectionTitle: string | null;
  chunkIndex: number;
  similarity: number;
}

export interface IRewriteResult {
  diff: string;
  downloadUrl: string;
  outputPath: string;
}
