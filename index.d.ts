export function convertText(text: string, options: Options, callback?: (error?: any) => void): void;

export function convertTextSync(text: string, options: Options): void;

export function convertTextStream(text: string, options: Options): NodeJS.ReadableStream;

export function stream(filename: string, options: Options): NodeJS.ReadableStream;

export function convert(filename: string, options: Options): Promise<void>;

export function convertSync(filename: string, options: Options): void;

export var ending: Ending;

export interface Ending {
    lf: string;
    crlf: string;
}

export interface Options {
    // Defaults to utf-8
    encoding?: string;
    
    // Target file location
    target?: string;
    
    // Replacement line-ending
    ending: string;   
}