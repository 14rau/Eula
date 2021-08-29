const fs = require("fs");

export class DataLoader<T> {

    public data: T;

    constructor(private fileName: string, private defaultData: any = {}, private callback?: (loader: DataLoader<T>) => void) {
        this.loadFrom = this.loadFrom.bind(this);
        this.init = this.init.bind(this);
        this.save = this.save.bind(this);
        this.callback?.(this);
    }

    public loadFrom(from: string) {
        setTimeout(() => {
            this.data = require(from);
        }, 100);
    }

    public async init() {
        // check if file exists, otherwise create it
        await fs.exists(this.fileName, async (exists) => {
            if(exists) {
                
            } else {
                await fs.writeFile(this.fileName,JSON.stringify(this.defaultData), () => {
                    this.data = this.defaultData;
                })
            }
        });
    }

    public async save(to?: string) {
        await fs.writeFile(to ?? this.fileName, JSON.stringify(this.data), () => {})
    }
}