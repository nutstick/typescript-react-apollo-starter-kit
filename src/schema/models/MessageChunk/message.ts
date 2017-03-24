type IMessageDocument = ITextMessageDocument | IStickerMessageDocument;

interface IMessagePrimitive {
  type: Number;
  owner: string;
  createAt: Date;
}

interface ITextMessageDocument extends IMessagePrimitive {
  type: 1;
  owner: string;
  body: string;
  createAt: Date;
}

function isTextMessage(value: IMessagePrimitive): value is ITextMessageDocument {
  return value.type === 1;
}

interface IStickerMessageDocument extends IMessagePrimitive {
  type: 2;
  owner: string;
  stickerId: string;
  createAt: Date;
}

function isStickerMessage(value: IMessagePrimitive): value is IStickerMessageDocument {
  return value.type === 2;
}

const Message = {
  type: Number,
  owner: String,
  createAt: Date,
};

export { Message, IMessageDocument, isTextMessage, isStickerMessage };
