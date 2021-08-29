import { DataLoader } from "./lib/DataLoader";

declare module "*.json" {
    const value: any;
    export default value;
}

declare global {
    namespace NodeJS {
      interface Global {
          settings: DataLoader;
      }
    }
  }