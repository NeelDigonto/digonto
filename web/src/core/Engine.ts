import {
  RootWSClientRequest,
  RootWSServerResponse,
  rootWSServerResponseSchema,
  WSClientEventType,
} from "@gateway/src/types/core";
import { useWebSocketStore } from "@/stores/websocketState";

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
      setTimeout(() => {
        useWebSocketStore.setState({ open: true });
      }, 100);
      // useWebSocketStore((state) => state.setOPEN());
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      useWebSocketStore.setState({ open: false });
    };

    this.ws.onmessage = (event) => {
      if (event.type === "text" || event.type === "message") {
        // console.log("Received text message from server:", event.data);
        if (event.data === "PING") {
          // console.log("Received PING from server.");

          if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send("PONG");
            // console.log("Sent PONG in response to PING.");
          }

          return;
        }

        const __serverEvent: RootWSServerResponse = JSON.parse(event.data);
        const parsedServerEvent: RootWSServerResponse =
          rootWSServerResponseSchema.parse(__serverEvent);
        console.log("Received server event:", parsedServerEvent);

        if (
          parsedServerEvent.referenceId &&
          this.eventHandlers.has(parsedServerEvent.referenceId)
        ) {
          this.eventHandlers.get(parsedServerEvent.referenceId)!(
            parsedServerEvent
          );
          return;
        }
      }
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      useWebSocketStore.setState({ open: false });
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

  private _sendEvent(
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

    console.log("Sending event to server:", wsClientMessage);
    this.ws.send(JSON.stringify(wsClientMessage));

    return () => {
      this.deregisterEventhandler(wsClientMessage.id);
    };
  }

  rpc<T>(type: WSClientEventType, data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const cleanup = this._sendEvent(
        type,
        data,
        (event: RootWSServerResponse) => {
          if (event.error) {
            reject(new Error(event.error.code + ": " + event.error.message));
          } else {
            resolve(event.data as T);
          }
          cleanup();
        }
      );
    });
  }

  stream<T>(
    type: WSClientEventType,
    data: any,
    handleChange: (event: RootWSServerResponse) => void
  ): () => void {
    return this._sendEvent(type, data, handleChange);
  }
}
