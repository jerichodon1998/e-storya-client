class ClientWebSocketService {
	backoffDelay = 2_000;
	isWebsocketConnected = false;
	websocket: WebSocket = null;
	intervalId: NodeJS.Timeout;
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

		if (this.websocket) {
			return;
		}

		const { url, onopen, onmessage, onerror, onclose } = params;
		const ws = new WebSocket(url);

		ws.onopen = (event) => {
			console.log(`${this.name} connected to websocket`);
			this.isWebsocketConnected = true;
			this.websocket = ws;
			this.backoffDelay = 2_000;
			clearInterval(this.intervalId);
			this.intervalId = null;
			onopen?.(event);
		};

		ws.onmessage = (event) => {
			onmessage?.(event);
		};

		ws.onerror = async (event) => {
			console.log(`${this.name} websocket error`, event);
			this.isWebsocketConnected = false;
			onerror?.(event);
		};

		ws.onclose = async (event) => {
			console.log(`${this.name} websocket closed`, event);
			this.isWebsocketConnected = false;
			clearInterval(this.intervalId);
			this.intervalId = null;

			if (this.isWebsocketConnected) {
				return;
			}

			const delay = Math.floor(Math.random() * this.backoffDelay);

			console.log("delay", delay);
			console.log("backoffDelay", this.backoffDelay);

			this.intervalId = setInterval(() => {
				this.websocketInit(params);
			}, delay);

			if (this.backoffDelay < 60_000) {
				this.backoffDelay = this.backoffDelay + 2000;
			}
			onclose?.(event);
		};
	}

	close() {
		this.websocket?.close();
		clearInterval(this.intervalId);
	}
}

export { ClientWebSocketService };
