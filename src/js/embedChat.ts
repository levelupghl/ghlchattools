/**
 * Level Up Embed Chat
 *
 * Embeds GHL chat widget into a page. Works anywhere the GHL chat widget is embedded.
 *
 * If current browser is mobile or the height is less than minHeight option,
 * chat widget will be opened and not embedded. This prevents scroll issues
 * on mobile or small screens where the chat widget is larger than the current
 * browser height.
 *
 * Usage:

<div id="ghl-chat-embed"></div>
<script type="module">
  import { embedChat } from "https://cdn.jsdelivr.net/gh/levelupghl/ghlchattools@v1/dist/js/embedChat.min.js";
  embedChat("#ghl-chat-embed", {minHeight: 700, autoScroll: true});
</script>

 **/

import {
  browserHeightLessThan,
  isMobileBrowser,
  scrollToElement,
} from "./lib/utils"

const CHAT_EMBED_CONTAINER_SELECTOR = "#ghl-chat-embed"
const GHL_CHAT_WIDGET_SELECTOR = "chat-widget"
const DEFAULT_OPTIONS: Options = {
  minHeight: 650,
  autoScroll: false,
  scrollOffset: 20,
}

interface Options {
  minHeight: number
  autoScroll: boolean
  scrollOffset: number
}

async function waitForChatLoad(): Promise<void> {
  return new Promise<void>((resolve) => {
    const handler = (event: LCChatWidgetLoadedEvent) => {
      resolve()
      window.removeEventListener("LC_chatWidgetLoaded", handler)
    }
    window.addEventListener("LC_chatWidgetLoaded", handler, false)
  })
}

function getOptions(options: Options | undefined): Options {
  const opts = { ...DEFAULT_OPTIONS }
  if (!options) {
    return opts
  }
  try {
    if (options.minHeight) {
      opts.minHeight =
        typeof options.minHeight === "number"
          ? options.minHeight
          : parseInt(options.minHeight)
    }
    if (options.autoScroll) {
      opts.autoScroll = true
      if (options.scrollOffset) {
        opts.scrollOffset =
          typeof options.scrollOffset === "number"
            ? options.scrollOffset
            : parseInt(options.scrollOffset)
      }
    }
  } catch (err) {
    console.error(`embedChat: invalid options, using defaults`)
  }
  return opts
}

export const embedChat = async (
  containerSelector: string | undefined,
  options: Options | undefined
) => {
  const selector = containerSelector || CHAT_EMBED_CONTAINER_SELECTOR
  const opts = getOptions(options)
  const embedDiv = document.querySelector(selector) as HTMLElement

  if (!embedDiv) {
    console.error(
      `embedChat: "${selector}" not found on page: unable to embed GHL chat widget`
    )
    return
  }
  if (!window.leadConnector?.chatWidget?.isLoaded) {
    await waitForChatLoad()
  }

  // Open chat widget instead of embedding on mobile or small screens
  if (isMobileBrowser() || browserHeightLessThan(opts.minHeight)) {
    return window.leadConnector.chatWidget.openWidget()
  }

  const chat = document.querySelector(GHL_CHAT_WIDGET_SELECTOR)
  const root = chat?.shadowRoot

  if (!chat || !root) {
    console.error(`embedChat: unable to find GHL chat widget on page`)
    return
  }

  const bubble = root.querySelector(".lc_text-widget--bubble") as HTMLElement
  const widget = root.querySelector(".lc_text-widget") as HTMLElement
  const box = root.querySelector(".lc_text-widget--box") as HTMLElement

  if (!bubble || !widget || !box) {
    console.error(
      `embedChat: unable to embed GHL chat widget in page: widget components not found`
    )
    return
  }

  // Remove the chat widget
  chat.parentElement?.removeChild(chat)

  // TODO: set overscroll to auto

  widget.style.position = "static"
  widget.style.width = "100%"
  box.style.maxWidth = "100%"

  // Hide the chat bubble
  bubble.style.display = "none"

  // Attach the chat widget to the in page container
  embedDiv.appendChild(chat)

  // Open chat widget
  window.leadConnector.chatWidget.openWidget()

  if (opts.autoScroll) {
    setTimeout(() => {
      scrollToElement(embedDiv, opts.scrollOffset)
    }, 100)
  }

  // TODO: wait until after button click or observe DOM before attempting to get inner-scroll
  // const innerscroll = root
  //   .querySelector("chat-pane")
  //   .shadowRoot.querySelector("chat-conversation")
  //   .shadowRoot.querySelector("ion-content")
  //   .shadowRoot.querySelector(".inner-scroll") as HTMLElement
  // if (inner?.style) {
  //   inner.style.overscrollBehavior = "auto"
  // }
  // TODO: set ::slotted(.informational) fontSize = 14px
}

