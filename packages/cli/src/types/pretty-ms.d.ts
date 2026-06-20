declare module "pretty-ms" {
  function prettyMs(ms: number, options?: { compact?: boolean; verbose?: boolean }): string;
  export default prettyMs;
}
