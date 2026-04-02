<template>
  <div
    class="upload-zone"
    :class="{ dragging }"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="onDrop"
  >
    <input
      ref="fileInput"
      type="file"
      accept=".md,.docx,.pdf"
      class="hidden-input"
      @change="onFileChange"
    />
    <div v-if="uploading" class="status">
      <span class="spinner" />
      업로드 중...
    </div>
    <div v-else class="hint">
      <p>파일을 드래그하거나</p>
      <button class="pick-btn" @click="fileInput?.click()">파일 선택</button>
      <p class="ext-hint">md · docx · pdf</p>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadDocument } from '../api/client'

const emit = defineEmits<{ uploaded: [] }>()

const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const uploading = ref(false)
const error = ref<string | null>(null)

async function upload(file: File): Promise<void> {
  error.value = null
  uploading.value = true
  try {
    await uploadDocument(file)
    emit('uploaded')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '업로드 실패'
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function onDrop(event: DragEvent): void {
  dragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) upload(file)
}

function onFileChange(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) upload(file)
}
</script>

<style scoped>
.upload-zone {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 28px 20px;
  text-align: center;
  transition: border-color 0.2s, background 0.2s;
  background: #fafafa;
}

.upload-zone.dragging {
  border-color: #4a90e2;
  background: #f0f7ff;
}

.hidden-input {
  display: none;
}

.hint p {
  margin: 4px 0;
  color: #777;
  font-size: 0.9rem;
}

.ext-hint {
  font-size: 0.78rem;
  color: #aaa;
}

.pick-btn {
  margin: 6px 0;
  padding: 6px 18px;
  border: 1px solid #4a90e2;
  border-radius: 6px;
  background: #fff;
  color: #4a90e2;
  cursor: pointer;
  font-size: 0.9rem;
}

.pick-btn:hover {
  background: #f0f7ff;
}

.status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #555;
  font-size: 0.9rem;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-top-color: #4a90e2;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  margin-top: 8px;
  color: #e53935;
  font-size: 0.82rem;
}
</style>
