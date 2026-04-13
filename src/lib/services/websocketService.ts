class ClientWebSocketService {
	backoffDelay = 2_000;
	websocket: WebSocket = null;
	timeoutId: NodeJS.Timeout;
	/**
	 * Controls whether the websocket should reconnect after closing.
	 *
	 * - "temporary": allows automatic reconnection using backoff logic
	 * - "permanent": prevents any reconnection and fully terminates the connection
	 */
	websocketCloseType: "permanent" | "temporary" = "temporary";
	name: string;

	constructor(params: {
		url: string;
		name: string;
		onopen?: (event: Event) => any;
		onmessage?: (event: MessageEvent<any>) => any;
		onerror?: (event: Event) => any;
		onclose?: (event: CloseEvent) => any;
	}) {
		const { name, ...rest } = params;
		this.name = name;
		this.websocketInit(rest);
	}

	websocketInit(params: {
		url: string;
		onopen?: (event: Event) => any;
		onmessage?: (event: MessageEvent<any>) => any;
		onerror?: (event: Event) => any;
		onclose?: (event: CloseEvent) => any;
	}) {
		console.log("connecting ws");

		const { url, onopen, onmessage, onerror, onclose } = params;
		const ws = new WebSocket(url);

		this.websocket = ws;

		ws.onopen = (event) => {
			console.log(`${this.name} connected to websocket`);
			this.backoffDelay = 2_000;
			clearInterval(this.timeoutId);
			this.timeoutId = null;
			onopen?.(event);
		};

		ws.onmessage = (event) => {
			onmessage?.(event);
		};

		ws.onerror = (event) => {
			console.log(`${this.name} websocket error`, event);
			onerror?.(event);
		};

		ws.onclose = (event) => {
			console.log(`${this.name} websocket closed`, event);
			clearTimeout(this.timeoutId);
			this.websocket = null;
			this.timeoutId = null;

			if (this.websocketCloseType !== "permanent") {
				const delay = Math.floor(Math.random() * this.backoffDelay);

				console.log("delay", delay);
				console.log("backoffDelay", this.backoffDelay);

				this.timeoutId = setTimeout(() => {
					this.websocketInit(params);
				}, delay);

				if (this.backoffDelay < 60_000) {
					this.backoffDelay = this.backoffDelay + 2000;
				}
			}

			onclose?.(event);
		};
	}

	close() {
		this.websocketCloseType = "permanent";
		clearTimeout(this.timeoutId);

		if (this.websocket) {
			this.websocket.close(1000, "client closed");
		}
	}
}

export { ClientWebSocketService };
