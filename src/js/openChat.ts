/**
 * Level Up Open GHL Chat
 *
 * Auto opens High Level chat widget and adds support for clickable buttons or elements on page to open chat.
 *
 * Usage:

<script type="module">
  import { openChat } from "https://cdn.jsdelivr.net/gh/levelupghl/ghlchattools@v1/dist/js/openChat.min.js";
  openChat(true, ".open-chat-button");
</script>

 **/

async function openWhenChatLoads(): Promise<void> {
  return new Promise<void>((resolve) => {
    const handler = (event: LCChatWidgetLoadedEvent) => {
      resolve()
      window.removeEventListener("LC_chatWidgetLoaded", handler)
      openChatWidget()
    }
    window.addEventListener("LC_chatWidgetLoaded", handler, false)
  })
}

function addListeners(selector: string) {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("click", (event) => {
      event.stopPropagation()
      event.preventDefault()
      openChatWidget()
    })
  })
}

function openChatWidget() {
  window.leadConnector.chatWidget.openWidget()
}

export const openChat = (
  autoOpen: boolean = true,
  elemSelector: string | undefined
) => {
  if (autoOpen) {
    if (!window.leadConnector?.chatWidget?.isLoaded) {
      openWhenChatLoads()
    } else {
      openChatWidget()
    }
  }
  if (elemSelector) {
    document.addEventListener("hydrationDone", () => {
      addListeners(elemSelector)
    })
    addListeners(elemSelector)
  }
}
