/**
 * Level Up Embed Chat
 *
 * Embeds GHL chat widget into a page. Works anywhere the GHL chat widget is embedded.
 *
 * If current browser is mobile or the height is less than maxHeight option,
 * chat widget will be opened and not embedded. This prevents scroll issues
 * on mobile or small screens where the chat widget is larger than the current
 * browser height.
 *
 * Usage:

<div id="ghl-chat-embed"></div>
<script type="module">
  import { embedChat } from "https://cdn.jsdelivr.net/gh/levelupghl/ghlchattools@v1/dist/js/embedChat.min.js";
  embedChat("#ghl-chat-embed", {maxHeight: 700, autoScroll: true});
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
  maxHeight: 650,
  autoScroll: true,
  scrollOffset: 20,
}

interface Options {
  maxHeight: number
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
    if (options.maxHeight) {
      opts.maxHeight =
        typeof options.maxHeight === "number"
          ? options.maxHeight
          : parseInt(options.maxHeight)
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
  if (isMobileBrowser() || browserHeightLessThan(opts.maxHeight)) {
    return window.leadConnector.chatWidget.openWidget()
  }

  const chat = document.querySelector(GHL_CHAT_WIDGET_SELECTOR)
  const root = chat?.shadowRoot

  if (!chat || !root) {
    console.error(`embedChat: unable to find GHL chat widget on page`)
    return
  }

  const button = root.querySelector(".lc_text-widget--btn") as HTMLElement
  const widget = root.querySelector(".lc_text-widget") as HTMLElement
  const box = root.querySelector(".lc_text-widget--box") as HTMLElement
  const heading = root.querySelector(
    ".lc_text-widget_heading--root"
  ) as HTMLElement

  if (!button || !widget || !box || !heading) {
    console.error(
      `embedChat: unable to embed GHL chat widget in page: widget components not found`
    )
    return
  }

  // Remove the chat widget
  chat.parentElement?.removeChild(chat)

  // TODO: if mobile, don't set position: static
  // TODO: set overscroll to auto

  widget.style.position = "static"
  widget.style.width = "100%"
  box.style.maxWidth = "100%"
  // heading.style.background = "white"

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

  button.style.display = "none"

  // Attach the chat widget to the in page container
  embedDiv.appendChild(chat)

  // Open chat widget
  window.leadConnector.chatWidget.openWidget()

  if (opts.autoScroll) {
    setTimeout(() => {
      scrollToElement(embedDiv, opts.scrollOffset)
    }, 100)
  }
}

// CHAT MESSAGE SENT TO USER
// <chat-message id="lc-chat-widget-enter-contact-details-msg" class="hydrated">
//   <!-- #shadow-root -->
//     <ion-item class="item item-has-start-slot md item-lines-none item-fill-none hydrated">
//       <!-- #shadow-root -->
//         <div class="item-native" part="native">
//           <slot name="start"></slot>
//           <div class="item-inner">
//             <div class="input-wrapper">
//               <slot></slot>
//             </div>
//             <slot name="end"></slot>
//             <div class="item-inner-highlight"></div>
//           </div>
//           <div class="item-highlight"></div>
//         </div>
//         <div class="item-bottom">
//           <slot name="error"></slot>
//           <slot name="helper"></slot>
//         </div>
//       <!-- end #shadow-root -->
//       <div class="message-container" slot="start">
//         <div
//           class="thumbnail-img"
//           style='background-image: url("https://widgets.leadconnectorhq.com/chat-widget/assets/defaultAvatar.png");'
//         ></div>
//         <div class="bubble incoming bubble-footer-padding">
//           <slot></slot>
//           <div class="triangle incoming bottom-left"></div>
//         </div>
//         <div class="footer">
//           <span class="footer-text">22 May, 10:46</span>
//           <chat-message-status class="none hydrated"></chat-message-status>
//         </div>
//       </div>
//     </ion-item>
//   <!-- end #shadow-root -->
//   <p>Please enter your contact details</p>
// </chat-message>

// TINY STATUS MESSAGE - CENTERED IN CHAT WINDOW
// <chat-message class="hydrated">
//   <!-- #shadow-root -->
//     <ion-item class="item item-has-start-slot md item-lines-none item-fill-none hydrated">
//       <!-- #shadow-root -->
//         <div class="item-native" part="native">
//           <slot name="start"></slot>
//           <div class="item-inner">
//             <div class="input-wrapper">
//               <slot></slot>
//             </div>
//             <slot name="end"></slot>
//             <div class="item-inner-highlight"></div>
//           </div>
//           <div class="item-highlight"></div>
//           <div class="item-bottom">
//             <slot name="error"></slot>
//             <slot name="helper"></slot>
//           </div>
//         </div>
//       <div class="message-container info-message-container" slot="start">
//         <div class="bubble informational bubble-footer-padding">
//           <slot></slot>
//         </div>
//         <div class="footer">
//           <chat-message-status class="none hydrated"></chat-message-status>
//         </div>
//       </div>
//     </ion-item>
//   <p>
//     Our AI bot and support team are currently busy. Please leave your contact
//     details. We will let you know when we're back online.
//   </p>
// </chat-message>

// CHAT CONTACT FORM
// GHL ADDS THIS TO THE CHAT WHEN IT TIMES OUT.
// IT DOES NOT GET PRE-FILLED WITH USER DATA.
// <chat-form class="hydrated">
//   <!-- #shadow-root -->
//   <div id="lc_text-widget">
//     <link rel="stylesheet" href="https://stcdn.leadconnectorhq.com/intl-tel-input/17.0.12/css/intlTelInput.min.css">
//     <div class="submit-contact-container">
//       <div class="lc_live-widget--form">
//         <form id="msgsndr_message-form" class="msgsndr_message-form--hidden">
//           <div class="lc_text-widget--text-input"><input name="name" type="text"
//               class="lc_text-widget--text-input-input" id="msgsndr_name" required=""><label
//               for="msgsndr_name">Name</label>
//             <div class="lc_text-widget--text-input__Bar"></div>
//           </div>
//           <div class="lc_text-widget--text-input">
//             <div class="iti iti--allow-dropdown">
//               <div class="iti__flag-container">
//                 <div class="iti__selected-flag" role="combobox" aria-controls="iti-0__country-listbox"
//                   aria-owns="iti-0__country-listbox" aria-expanded="false" tabindex="0" title="United States: +1"
//                   aria-activedescendant="iti-0__item-us-preferred">
//                   <div class="iti__flag iti__us"></div>
//                   <div class="iti__arrow"></div>
//                 </div>
//               </div><input name="phone" type="text" class="lc_text-widget--text-input-input" id="msgsndr_mobile_phone"
//                 required="" autocomplete="off" data-intl-tel-input-id="0"><label for="msgsndr_mobile_phone"
//                 style="margin-left: 54px;">Mobile Phone</label>
//             </div>
//             <div class="lc_text-widget--text-input__Bar"></div>
//           </div>
//           <div class="lc_text-widget--text-input"><input name="email" type="email"
//               class="lc_text-widget--text-input-input" id="msgsndr_e-mail" required=""><label
//               for="msgsndr_e-mail">E-mail</label>
//             <div class="lc_text-widget--text-input__Bar"></div>
//           </div>
//         </form>
//         <div class="button-container"><ion-button
//             class="md button button-small button-solid ion-activatable ion-focusable hydrated" size="small"
//             style="font-size: 10px; width: fit-content;">Send</ion-button></div>
//       </div>
//       <div id="lc-captcha" style="margin-top: 10px;"></div>
//     </div>
//   </div>
// </chat-form>
