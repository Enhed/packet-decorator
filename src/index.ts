import 'reflect-metadata'

export interface PacketFieldInfo {
    key: string | symbol;
    parser: (buffer: Buffer, index: number, length: number) => any;
    serializer: (value: any, buffer: Buffer, index: number, length: number) => void;
    length: number | ((instance: any) => number);
}

export class PacketDecorator {
    static fromBuffer<T extends PacketDecorator>(this: new () => T, buffer: Buffer): T {
        const instance = new this();
        const metadata: PacketFieldInfo[] = Reflect.getMetadata('packet:fields', this.prototype) || [];

        let index = 0;
        for (const field of metadata) {
            const length = typeof field.length === 'function' ? field.length(instance) : field.length;
            (instance as any)[field.key] = field.parser(buffer, index, length);
            index += length;
        }

        return instance;
    }

    toBuffer(): Buffer {
        const metadata: PacketFieldInfo[] = Reflect.getMetadata('packet:fields', this.constructor.prototype) || [];

        const buffers: Buffer[] = [];
        for (const field of metadata) {
            const value = (this as any)[field.key];
            const length = typeof field.length === 'function' ? field.length(this) : field.length;
            const fieldBuffer = Buffer.alloc(length);
            field.serializer(value, fieldBuffer, 0, length);
            buffers.push(fieldBuffer);
        }

        return Buffer.concat(buffers);
    }
}

export function createFieldMetadata(options: Omit<PacketFieldInfo, 'key'>) {
    return function (target: Object, propertyKey: string | symbol) {

        const metadata: PacketFieldInfo[] = Reflect.getMetadata('packet:fields', target) || []

        metadata.push({
            ...options,
            key: propertyKey
        })

        Reflect.defineMetadata('packet:fields', metadata, target);
    };
}

export function BUFFER(length: number | ((instance: any) => number)) {
    return createFieldMetadata({
        length: length,
        parser: (buffer: Buffer, index: number, length: number) => buffer.slice(index, index + length),
        serializer: (value: Buffer, buffer, index, length) => value.copy(buffer, index, 0, length + index)
    })
}

export const BYTE = createFieldMetadata({
    length: 1,
    parser: (buffer, index) => buffer.readUInt8(index),
    serializer: (value, buffer, index) => buffer.writeUint8(value, index)
})