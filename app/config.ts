// Alex: Endpoint für Websocket-Backend eintragen (wenn nicht im env-file angegeben)
export const WS_URL: string = import.meta.env.VITE_WS_URL ?? "ws://localhost:8080";