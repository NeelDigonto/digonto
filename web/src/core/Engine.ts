import {
  RootWSClientRequest,
  RootWSServerResponse,
  WSClientEventType,
} from "@gateway/src/types/core";

export type EventHandler = (event: RootWSServerResponse) => void;

export class Engine {
  private ws: WebSocket;
  eventHandlers: Map<string, EventHandler> = new Map<string, EventHandler>();

  constructor() {
    this.ws = new WebSocket("ws://localhost:8080");
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onmessage = (event) => {
      if (event.type === "text" || event.type === "message") {
        console.log("Received text message from server:", event.data);
        if (event.data === "PING") {
          // console.log("Received PING from server.");

          if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send("PONG");
            // console.log("Sent PONG in response to PING.");
          }

          return;
        }

        const serverEvent: RootWSServerResponse = JSON.parse(event.data);
        console.log("Received server event:", serverEvent);

        if (
          serverEvent.referenceId &&
          this.eventHandlers.has(serverEvent.referenceId)
        ) {
          this.eventHandlers.get(serverEvent.referenceId)!(serverEvent);
          return;
        }
      }
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
    };
  }

  registerEventhandler(id: string, eventHandler: EventHandler) {
    this.eventHandlers.set(id, eventHandler);
  }

  deregisterEventhandler(id: string) {
    this.eventHandlers.delete(id);
  }

  // sendMessage<T>(type: WSClientEventType, data: T) {
  //   if (this.ws.readyState === WebSocket.OPEN) {
  //     this.ws.send(JSON.stringify(data }));
  //     console.log("Message sent to server:", { type, data });
  //   } else {
  //     console.error("WebSocket is not open. Cannot send message.");
  //   }
  // }

  sendEvent(
    type: WSClientEventType,
    data: any,
    handleChange: (event: RootWSServerResponse) => void
  ): () => void {
    const wsClientMessage: RootWSClientRequest = {
      timestamp: new Date().toISOString(),
      id: crypto.randomUUID(),
      type,
      data,
    };

    if (this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not open. Cannot send message.");
    }

    this.registerEventhandler(
      wsClientMessage.id,
      (event: RootWSServerResponse) => handleChange(event)
    );

    this.ws.send(JSON.stringify(wsClientMessage));

    return () => {
      this.deregisterEventhandler(wsClientMessage.id);
    };
  }
}
