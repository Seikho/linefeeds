export function stream(filename: string, lineEnding: string): NodeJS.ReadableStream;

export function convert(filename: string, lineEnding: string, targetFile: string): void;

export function convertSync(filename: string, lineEnding: string, targetFile: string): void;

export var ending: Ending;

export interface Ending {
    lf: string;
    crlf: string;
}

