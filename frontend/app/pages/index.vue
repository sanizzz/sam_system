<script setup lang="ts">
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const messages = ref<Message[]>([])
const input = ref('')
const isListening = ref(false)

useCanvasAnimation({ canvasRef, isListening })

function handleSubmit() {
  if (!input.value.trim()) return

  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: input.value.trim(),
  }

  messages.value.push(userMessage)
  input.value = ''

  // Simulate AI response
  setTimeout(() => {
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'This is a simulated response. Connect to an AI API to get real responses.',
    }
    messages.value.push(assistantMessage)
  }, 1000)
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}

function toggleListening() {
  isListening.value = !isListening.value
}
</script>

<template>
  <div class="chat-container">
    <!-- Messages area -->
    <div class="messages-area">
      <div v-if="messages.length === 0" class="empty-state">
        <p class="hint-text">
          Send a message to begin chatting with the AI assistant
        </p>

        <!-- AI Orb -->
        <div
          class="orb-container"
          :class="{ 'orb-listening': isListening }"
        >
          <canvas ref="canvasRef" class="orb-canvas" />
        </div>
      </div>

      <div v-else class="messages-list">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-wrapper"
          :class="message.role === 'user' ? 'message-user' : 'message-assistant'"
        >
          <div
            class="message-bubble"
            :class="message.role === 'user' ? 'bubble-user' : 'bubble-assistant'"
          >
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>

    <!-- Chat input area -->
    <div class="input-area">
      <div class="input-container">
        <div class="input-card">
          <!-- Input field -->
          <textarea
            ref="textareaRef"
            v-model="input"
            @keydown="handleKeyDown"
            placeholder="Type a message... (Shift+Enter for new line)"
            rows="1"
            class="input-field"
          />

          <!-- Bottom row with icons and send button -->
          <div class="input-actions">
            <div class="action-buttons">
              <!-- Microphone button -->
              <button
                type="button"
                @click="toggleListening"
                class="action-btn"
                :class="{ 'action-btn-active': isListening }"
                aria-label="Voice input"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </button>

              <!-- Attachment button -->
              <button
                type="button"
                class="action-btn"
                aria-label="Attach file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
                  />
                </svg>
              </button>

              <!-- Globe button -->
              <button
                type="button"
                class="action-btn"
                aria-label="Web search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </button>

              <!-- Model label -->
              <span class="model-label">Gemini</span>
            </div>

            <!-- Send button with gradient orb -->
            <button
              type="button"
              @click="handleSubmit"
              :disabled="!input.trim()"
              class="send-btn"
              :class="{ 'send-btn-active': input.trim() }"
              aria-label="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --card: #ffffff;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --primary: #0a0a0a;
  --primary-foreground: #fafafa;
  --border: #e4e4e7;
}

.chat-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  color: #0a0a0a;
}

.messages-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.hint-text {
  font-size: 0.875rem;
  color: #71717a;
}

.orb-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 150ms ease-out;
}

.orb-listening {
  transform: scale(1.1);
}

.orb-canvas {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.messages-list {
  width: 100%;
  max-width: 42rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.message-wrapper {
  display: flex;
}

.message-user {
  justify-content: flex-end;
}

.message-assistant {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.bubble-user {
  background-color: #0a0a0a;
  color: #fafafa;
}

.bubble-assistant {
  background-color: #f4f4f5;
  color: #0a0a0a;
}

.input-area {
  padding: 0 1rem 1.5rem;
}

.input-container {
  max-width: 42rem;
  margin: 0 auto;
}

.input-card {
  border-radius: 1.5rem;
  padding: 1rem;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e4e4e7;
}

.input-field {
  width: 100%;
  resize: none;
  background: transparent;
  outline: none;
  font-size: 0.875rem;
  color: #0a0a0a;
  min-height: 24px;
  max-height: 120px;
  border: none;
  font-family: inherit;
}

.input-field::placeholder {
  color: #71717a;
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms;
  background-color: #f4f4f5;
  color: #71717a;
  border: none;
  cursor: pointer;
}

.action-btn:hover {
  background-color: #e4e4e7;
}

.action-btn-active {
  background-color: #0a0a0a;
  color: #fafafa;
}

.model-label {
  font-size: 0.875rem;
  margin-left: 0.25rem;
  color: #71717a;
}

.send-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms;
  overflow: hidden;
  background-color: #f4f4f5;
  color: #71717a;
  opacity: 0.5;
  border: none;
  cursor: pointer;
}

.send-btn-active {
  background: linear-gradient(135deg, #ade7ff 0%, #00bbff 50%, #ebf4ff 100%);
  color: white;
  opacity: 1;
}

.send-btn:disabled {
  cursor: not-allowed;
}
</style>
