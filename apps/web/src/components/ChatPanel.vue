<template>
  <div class="chat-panel">
    <div v-if="!documentId" class="no-doc">
      문서를 선택하면 해당 문서에 대해 질문할 수 있습니다.
    </div>
    <template v-else>
      <div class="messages" ref="messagesEl">
        <div v-if="messages.length === 0" class="empty-hint">
          질문을 입력해보세요.
        </div>
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="message"
          :class="msg.role"
        >
          <div class="bubble">{{ msg.text }}</div>
          <div v-if="msg.role === 'assistant' && msg.sources?.length" class="sources">
            <details>
              <summary>출처 {{ msg.sources.length }}개</summary>
              <div
                v-for="(src, j) in msg.sources"
                :key="j"
                class="source-item"
              >
                <span v-if="src.sectionTitle" class="section">{{ src.sectionTitle }}</span>
                <span class="similarity">{{ (src.similarity * 100).toFixed(0) }}%</span>
                <p class="src-content">{{ truncate(src.content) }}</p>
              </div>
            </details>
          </div>
        </div>
        <div v-if="loading" class="message assistant">
          <div class="bubble loading-bubble">
            <span class="dot" /><span class="dot" /><span class="dot" />
          </div>
        </div>
      </div>
      <form class="input-row" @submit.prevent="send">
        <input
          v-model="question"
          type="text"
          placeholder="질문을 입력하세요..."
          :disabled="loading"
          class="question-input"
        />
        <button type="submit" :disabled="loading || !question.trim()" class="send-btn">
          전송
        </button>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { askQuestion, type AskResultDto } from '../api/client'

interface Message {
  role: 'user' | 'assistant'
  text: string
  sources?: AskResultDto['sources']
}

const props = defineProps<{ documentId?: string }>()

const messages = ref<Message[]>([])
const question = ref('')
const loading = ref(false)
const messagesEl = ref<HTMLElement | null>(null)

watch(
  () => props.documentId,
  () => {
    messages.value = []
    question.value = ''
  },
)

async function send(): Promise<void> {
  const text = question.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', text })
  question.value = ''
  loading.value = true
  await scrollBottom()

  try {
    const result = await askQuestion(text, props.documentId)
    messages.value.push({ role: 'assistant', text: result.answer, sources: result.sources })
  } catch {
    messages.value.push({ role: 'assistant', text: '오류가 발생했습니다. 다시 시도해주세요.' })
  } finally {
    loading.value = false
    await scrollBottom()
  }
}

async function scrollBottom(): Promise<void> {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

function truncate(text: string, max = 120): string {
  return text.length > max ? text.slice(0, max) + '...' : text
}
</script>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.no-doc {
  color: #aaa;
  font-size: 0.9rem;
  padding: 16px 0;
  text-align: center;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.empty-hint {
  color: #bbb;
  font-size: 0.85rem;
  text-align: center;
  padding: 20px 0;
}

.message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 85%;
}

.message.user {
  align-self: flex-end;
  align-items: flex-end;
}

.bubble {
  padding: 9px 13px;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.message.user .bubble {
  background: #4a90e2;
  color: #fff;
  border-bottom-right-radius: 3px;
}

.message.assistant .bubble {
  background: #f1f3f5;
  color: #222;
  border-bottom-left-radius: 3px;
}

.loading-bubble {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 12px 16px;
}

.dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #aaa;
  animation: bounce 1s ease-in-out infinite;
}

.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.3s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.1); opacity: 1; }
}

.sources {
  margin-top: 4px;
  width: 100%;
}

.sources summary {
  font-size: 0.75rem;
  color: #888;
  cursor: pointer;
  user-select: none;
}

.source-item {
  border-left: 2px solid #ddd;
  padding: 4px 8px;
  margin-top: 4px;
}

.section {
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
  margin-right: 6px;
}

.similarity {
  font-size: 0.72rem;
  color: #aaa;
}

.src-content {
  font-size: 0.78rem;
  color: #666;
  margin: 2px 0 0;
}

.input-row {
  display: flex;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.question-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s;
}

.question-input:focus {
  border-color: #4a90e2;
}

.send-btn {
  padding: 8px 18px;
  background: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn:hover:not(:disabled) {
  background: #357abd;
}
</style>
