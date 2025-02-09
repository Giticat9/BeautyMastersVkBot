/**
 * Интерфейс методов репозитория настроек приложения
 */
export interface IAppSettingsRepository {
	/**
	 * Получение последнего сохраненного значения очереди long poll сервера
	 * @return строка со значением текущей очереди
	 */
	getLastTSValueAsync(): Promise<string>;

	/**
	 * Установка нового значения очереди long poll сервера
	 * @param value - новое значение очереди
	 */
	setLastTSValueAsync(value: string): Promise<void>;
}