export interface GetLongPollServerResponse {
	key: string; // ключ доступа к серверу
	server: string; // адрес сервера
	ts: string; // номер очереди сообщений
}