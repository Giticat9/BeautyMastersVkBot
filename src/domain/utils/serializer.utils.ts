import { getSerializedName } from '../decorators/serialized-name.decorator';
import { camelToSnakeCase } from './snake-case.utils';

export class Serializer {
	static serialize<T>(instance: T): any {
		if (Array.isArray(instance)) {
			return instance.map(item => this.serialize(item));
		}

		if (typeof instance === 'object' && instance !== null) {
			const serializedObject: Record<string, any> = {};

			Object.keys(instance).forEach(key => {
				const value = instance[key];
				const target = Object.getPrototypeOf(instance);

				const serializedName = getSerializedName(target, key) || camelToSnakeCase(key);

				if (value === undefined || value === null) {
					return;
				}

				serializedObject[serializedName] = this.serialize(value);
			});

			return serializedObject;
		}

		return instance;
	}
}