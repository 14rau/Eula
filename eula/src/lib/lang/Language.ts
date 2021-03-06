import { get } from "lodash";

export class LanguageManager {
    public get allLanguages(): { name: string, short: string }[] {
        const languages = [];
        for(const key in this.languages) {
            languages.push({
                name: this.languages[key].name,
                short: this.languages[key].short
            })
        }
        return languages;
    }

    // load languages
    private languages = require("./langs").default;
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
        let str: string = get(this.lang, key);
        if(args) {
            for(const arg in args) {
                str = str.replace(new RegExp(`{:${arg}}`, "gm"), args[arg])
            }
        }
        return str;
    }
}