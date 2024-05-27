// Define custom event type
interface LCChatWidgetLoadedEvent extends Event {
  // Define custom properties here if needed
}

interface WindowEventMap {
  LC_chatWidgetLoaded: LCChatWidgetLoadedEvent
}

// Extend the Window interface
interface Window {
  leadConnector: {
    chatWidget: {
      isLoaded: boolean
      openWidget: Function
    }
  }
}
