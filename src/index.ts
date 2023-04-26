import 'reflect-metadata'

export interface PacketFieldInfo {
    key: string | symbol
    parser: (buffer: Buffer, index: number, instance: any) => { value: any, offset: number }
    serializer: (value: any, instance: any) => Buffer
}

export class PacketDecorator {
    static fromBuffer<T extends PacketDecorator>(this: new () => T, buffer: Buffer): T {
        const instance = new this();
        const metadata: PacketFieldInfo[] = Reflect.getMetadata('packet:fields', this.prototype) || [];

        let index = 0
        for (const field of metadata) {
            const { value, offset } = field.parser(buffer, index, instance)
            index += offset;
            (instance as any)[field.key] = value;
        }

        return instance;
    }

    toBuffer(): Buffer {
        const metadata: PacketFieldInfo[] = Reflect.getMetadata('packet:fields', this.constructor.prototype) || [];

        const buffers: Buffer[] = [];
        for (const field of metadata) {
            const value = (this as any)[field.key];
            const buffer = field.serializer(value, this)
            buffers.push(buffer)
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

export function BUFFER(length: (instance: any) => number) {
    return createFieldMetadata({
        parser: (buffer, index, instance) => {
            return {
                value: buffer.subarray(index, index + length(instance)),
                offset: length(instance)
            }
        },

        serializer: (value: Buffer, instance) => value.subarray(0, length(instance))
    })
}

export const BYTE = createFieldMetadata({
    parser: (buffer, index) => {
        return {
            value: buffer.readUInt8(index),
            offset: 1
        }
    },

    serializer: (value: number) => {
        const buffer = Buffer.alloc(1)
        buffer.writeUint8(value)
        return buffer
    }
})
