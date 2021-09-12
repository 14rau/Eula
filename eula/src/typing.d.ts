declare module "*.json" {
    const value: any;
    export default value;
}

declare global {
    namespace NodeJS {
      interface Global {
          eulaDb: EulaDb;
      }
    }
  }

