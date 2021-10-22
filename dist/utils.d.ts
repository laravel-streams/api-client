export declare class Str {
    static random(length?: number): string;
    static ensureLeft(str: string, left: string): string;
    static ensureRight(str: string, right: string): string;
    static stripLeft(str: string, left: string): string;
    static stripRight(str: string, right: string): string;
    static ucfirst(string: any): any;
    static lcfirst(string: any): any;
    static parameters(str: string, params: Record<string, string>): string;
}
