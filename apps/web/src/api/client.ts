import { $fetch } from 'ofetch';

export interface DocumentDto {
  id: string;
  filename: string;
  fileType: string;
  filePath: string;
  isEditable: boolean;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AskResultDto {
  answer: string;
  sources: {
    content: string;
    sectionTitle: string | null;
    chunkIndex: number;
    similarity: number;
  }[];
}

export const api = $fetch.create({ baseURL: '/api' });

export function getDocuments(): Promise<DocumentDto[]> {
  return api<DocumentDto[]>('/documents');
}

export function deleteDocument(id: string): Promise<void> {
  return api<void>(`/documents/${id}`, { method: 'DELETE' });
}

export function uploadDocument(file: File): Promise<DocumentDto> {
  const form = new FormData();
  form.append('file', file);
  return api<DocumentDto>('/documents/upload', { method: 'POST', body: form });
}

export function askQuestion(
  question: string,
  documentId?: string,
): Promise<AskResultDto> {
  return api<AskResultDto>('/chat/ask', {
    method: 'POST',
    body: { question, documentId },
  });
}
