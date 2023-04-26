# PacketDecorator Library

This library provides a simple and efficient way to handle serialization and deserialization of binary packets. It allows you to create custom packet structures with various fields and data types using TypeScript decorators.

## Features

- Easy-to-use decorators for defining custom packet fields
- Automatic serialization and deserialization of packet data
- Support for multiple data types, including custom types
- Built on top of the Reflect Metadata API

## Example Usage

```typescript
import { PacketDecorator, BYTE, BUFFER } from 'packet-decorator'

class MyPacket extends PacketDecorator {
    @BYTE
    public messageType!: number

    @BUFFER(() => 4)
    public payload!: Buffer
}

const myPacket = new MyPacket()
myPacket.messageType = 1
myPacket.payload = Buffer.from([0x01, 0x02, 0x03, 0x04])

const serialized = myPacket.toBuffer()

const deserializedPacket = MyPacket.fromBuffer(serialized)
```

## Installation

To install the library, you can use your preferred package manager:

```
npm install packet-decorator
```

or

```
yarn add packet-decorator
```

## Dependencies

- `reflect-metadata`: This library uses the Reflect Metadata API, so you need to import 'reflect-metadata' at the top of your entry file.

## API

- `PacketDecorator`: Base class for creating custom packet structures.
- `createFieldMetadata(options: Omit<PacketFieldInfo, 'key'>)`: A utility function for creating custom field metadata decorators.
- `BUFFER(length: (instance: any) => number)`: A decorator for defining buffer fields with a dynamic length.
- `BYTE`: A decorator for defining byte (UInt8) fields.

## Contributing

If you have any suggestions or improvements, feel free to open an issue or submit a pull request on the project's GitHub repository.

## License

This library is released under the MIT License.
