import type { SignFn } from "../util/sign-fn.type.js";

export interface ISigner {
  sign: SignFn;
}
