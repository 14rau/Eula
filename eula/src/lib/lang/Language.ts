import { get } from "lodash";

export class LanguageManager {
    // load languages
    private languages = require("./langs");
    // lang map
    private langMap = new Map<string, Language>();
    constructor() {
        for(const key in this.languages) {
            this.langMap.set(key, new Language(this.languages[key]));
        }
    }

    public getLanguage(language: string) {
        return this.langMap.get(language);
    }
}


export class Language {
    constructor(private lang: any) {

    }

    public get(key: string, args?: Record<string, string>) {
        const str: string = get(this.lang, key);
        if(args) {
            for(const arg in args) {
                
                str.replace(new RegExp(`{:${arg}}`, "g"), args[arg])
            }
        }
        return str;
    }
}