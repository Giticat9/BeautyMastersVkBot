import 'reflect-metadata'

const SERIALIZED_NAME_KEY = Symbol('SerializedName');

export const SerializedName = (name: string): PropertyDecorator => {
	return (target, propertyKey) => {
		Reflect.defineMetadata(SERIALIZED_NAME_KEY, name, target, propertyKey);
	}
}

export const getSerializedName = (target: any, propertyKey: string): string | undefined => {
	return Reflect.getMetadata(SERIALIZED_NAME_KEY, target, propertyKey);
}