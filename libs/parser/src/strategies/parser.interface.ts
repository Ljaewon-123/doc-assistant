export interface IParserStrategy {
  parse(filePath: string): Promise<string>;
}
