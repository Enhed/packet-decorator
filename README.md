# Packet Decorator

Packet Decorator is a TypeScript library that helps you easily create classes for encoding and decoding binary packets. It provides decorators and helper functions to define fields in your classes with specific binary parsing and serialization rules.

## Features

- Define packet fields with decorators
- Automatically parse and serialize packet fields from/to binary buffers
- Customizable field lengths and parsing/serialization rules
- Supports fixed and dynamic field lengths

## Installation

Install the library using npm:

```
npm install --save packet-decorator
```

## Usage

Here's an example of how to define a simple packet class with two fields, `id` and `payload`:

```typescript
import { PacketDecorator, BYTE, BUFFER } from 'packet-decorator';

class MyPacket extends PacketDecorator {
  @BYTE
  id: number;

  @BUFFER((instance: MyPacket) => instance.id)
  payload: Buffer;
}
```

To create a new instance of the packet class and serialize it to a binary buffer:

```typescript
const packet = new MyPacket();
packet.id = 5;
packet.payload = Buffer.from('Hello, World!');

const buffer = packet.toBuffer();
```

To parse a binary buffer and create a new instance of the packet class:

```typescript
const buffer = Buffer.from([...]);
const packet = MyPacket.fromBuffer(buffer);

console.log(packet.id); // 5
console.log(packet.payload.toString()); // 'Hello, World!'
```

## API

### PacketDecorator

The base class for your packet classes. Extend this class to create a new packet class.

### createFieldMetadata(options: Omit<PacketFieldInfo, 'key'>)

A function to create custom field decorators. Takes an object with the following properties:

- `length`: The fixed length of the field or a function that returns the length based on the instance.
- `parser`: A function that takes a buffer, index, and length and returns the parsed value.
- `serializer`: A function that takes a value, buffer, index, and length and serializes the value into the buffer.

### BUFFER(length: number | ((instance: any) => number))

A decorator for fields with binary buffer values. Takes a fixed length or a function that returns the length based on the instance.

### BYTE

A decorator for fields with 8-bit unsigned integer values. Fixed length of 1 byte.