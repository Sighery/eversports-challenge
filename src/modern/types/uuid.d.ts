// When I try to CommonJS import uuid, TS is not detecting the included types.
// I think this might be due to the current tsconfig configuration to support
// both a JS project + a TS project side-by-side? So I have to declare it here.
declare module "uuid" {
  export function v4(): string;
}
