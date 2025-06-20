export class Engine {
  private ws: WebSocket;

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
      // console.log("Message received from server:", event.data);

      if (event.data === "PING") {
        // console.log("Received PING from server.");

        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send("PONG");
          // console.log("Sent PONG in response to PING.");
        }
      }
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
    };
  }

  sendMessage(message: object) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      console.log("Message sent to server:", message);
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  }
}
