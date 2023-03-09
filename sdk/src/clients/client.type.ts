import type { SignFn } from "../util/sign-fn.type.js";

export interface IClient<TCredential, TOptions> {
  issueCredential(signFn: SignFn, options?: TOptions): Promise<TCredential>;
}
