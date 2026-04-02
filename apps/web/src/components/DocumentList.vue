<template>
  <div class="document-list">
    <div v-if="loading" class="loading">불러오는 중...</div>
    <div v-else-if="documents.length === 0" class="empty">
      업로드된 문서가 없습니다.
    </div>
    <div v-else class="cards">
      <div
        v-for="doc in documents"
        :key="doc.id"
        class="card"
        :class="{ selected: selectedId === doc.id }"
        @click="select(doc.id)"
      >
        <div class="card-header">
          <span class="badge" :class="doc.fileType">{{ doc.fileType.toUpperCase() }}</span>
          <span class="filename">{{ doc.filename }}</span>
        </div>
        <div class="card-meta">
          청크 {{ doc.chunkCount }}개 · {{ formatDate(doc.createdAt) }}
        </div>
        <button
          class="delete-btn"
          @click.stop="remove(doc.id)"
          :disabled="deletingId === doc.id"
        >
          {{ deletingId === doc.id ? '삭제 중...' : '삭제' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDocuments, deleteDocument, type DocumentDto } from '../api/client'

const emit = defineEmits<{
  select: [id: string | undefined]
}>()

const documents = ref<DocumentDto[]>([])
const loading = ref(false)
const deletingId = ref<string | null>(null)
const selectedId = ref<string | undefined>(undefined)

async function load(): Promise<void> {
  loading.value = true
  try {
    documents.value = await getDocuments()
  } finally {
    loading.value = false
  }
}

async function remove(id: string): Promise<void> {
  deletingId.value = id
  try {
    await deleteDocument(id)
    documents.value = documents.value.filter((d) => d.id !== id)
    if (selectedId.value === id) {
      selectedId.value = undefined
      emit('select', undefined)
    }
  } finally {
    deletingId.value = null
  }
}

function select(id: string): void {
  selectedId.value = selectedId.value === id ? undefined : id
  emit('select', selectedId.value)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR')
}

defineExpose({ load })

onMounted(load)
</script>

<style scoped>
.document-list {
  min-height: 60px;
}

.loading,
.empty {
  color: #888;
  font-size: 0.9rem;
  padding: 12px 0;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 14px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  background: #fff;
  position: relative;
}

.card:hover {
  border-color: #4a90e2;
}

.card.selected {
  border-color: #4a90e2;
  background: #f0f7ff;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.badge {
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  background: #e0e0e0;
  color: #444;
}

.badge.md {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge.pdf {
  background: #fce4ec;
  color: #c62828;
}

.badge.docx {
  background: #e3f2fd;
  color: #1565c0;
}

.filename {
  font-size: 0.9rem;
  font-weight: 500;
  word-break: break-all;
}

.card-meta {
  font-size: 0.78rem;
  color: #888;
}

.delete-btn {
  margin-top: 8px;
  font-size: 0.8rem;
  padding: 3px 10px;
  border: 1px solid #e57373;
  border-radius: 4px;
  background: #fff;
  color: #e53935;
  cursor: pointer;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-btn:hover:not(:disabled) {
  background: #ffebee;
}
</style>
