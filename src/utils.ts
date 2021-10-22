export class Str {
    public static random(length = 15) {
        let text       = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( let i = 0; i < length; i ++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    public static ensureLeft(str: string, left: string): string {
        if ( false === str.startsWith(left) ) {
            return left + str;
        }
        return str;
    }

    public static ensureRight(str: string, right: string): string {
        if ( false === str.endsWith(right) ) {
            return str + right;
        }
        return str;
    }

    public static stripLeft(str: string, left: string): string {
        if ( str.startsWith(left) ) {
            return str.substr(left.length);
        }
        return str;
    }

    public static stripRight(str: string, right: string): string {
        if ( str.endsWith(right) ) {
            return str.substr(0, str.length - right.length);
        }
        return str;
    }

    public static ucfirst(string) {
        return string[ 0 ].toUpperCase() + string.slice(1);
    }

    public static lcfirst(string) {
        return string[ 0 ].toLowerCase() + string.slice(1);
    }

    public static parameters(str: string, params: Record<string, string>) {
        Object.entries(params).forEach(([ key, value ]) => str = str.replace(new RegExp(':'+key,'g'), value));
        return str;
    }

}
