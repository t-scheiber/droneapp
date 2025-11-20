declare module "*.json" {
  const value: Array<{
    id: string;
    name: string;
    description: string;
    file: string;
  }>;
  export default value;
}
