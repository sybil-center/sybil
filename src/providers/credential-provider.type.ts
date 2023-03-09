import type { SignFn } from "../util/sign-fn.type.js";

export interface ICredentialProvider<TChallengeReq, TChallenge, TCredentialReq, TCredential> {
  getPayload(challengeReq: TChallengeReq): Promise<TChallenge>;
  canIssue(sessionId: string): Promise<boolean>;
  issueVC(signFn: SignFn, credentialReq: TCredentialReq): Promise<TCredential>;
}
