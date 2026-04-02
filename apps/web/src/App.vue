<template>
  <div class="app">
    <header class="app-header">
      <h1>Doc Assistant</h1>
    </header>
    <main class="app-body">
      <aside class="sidebar">
        <section class="sidebar-section">
          <h2>문서 업로드</h2>
          <UploadZone @uploaded="documentList?.load()" />
        </section>
        <section class="sidebar-section">
          <h2>문서 목록</h2>
          <DocumentList ref="documentList" @select="selectedId = $event" />
        </section>
      </aside>
      <section class="chat-area">
        <h2>채팅{{ selectedId ? '' : ' (문서를 선택하세요)' }}</h2>
        <ChatPanel :document-id="selectedId" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UploadZone from './components/UploadZone.vue'
import DocumentList from './components/DocumentList.vue'
import ChatPanel from './components/ChatPanel.vue'

const documentList = ref<InstanceType<typeof DocumentList> | null>(null)
const selectedId = ref<string | undefined>(undefined)
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f6fa;
  color: #222;
}
</style>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 14px 24px;
}

.app-header h1 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #4a90e2;
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  min-width: 240px;
  border-right: 1px solid #e0e0e0;
  background: #fff;
  padding: 20px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-section h2,
.chat-area h2 {
  font-size: 0.85rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  overflow: hidden;
}
</style>
