declare const TextEncoder: {
  new (utfLabel?: string): TextEncoder;
  prototype: TextEncoder;
};

declare const TextDecoder: {
  new (
    utfLabel?: string,
    options?: TextDecoderOptions
  ): TextDecoder;
  prototype: TextDecoder;
};
