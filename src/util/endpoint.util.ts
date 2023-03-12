import { CredentialType } from "../types/index.js";
import { urlCredentialType } from "./credential-type.util.js";

export function issueEP(type: CredentialType) {
  return `/api/v1/vcs/${urlCredentialType(type)}/issue`;
}

export function challengeEP(type: CredentialType) {
  return `/api/v1/vcs/${urlCredentialType(type)}/payload`;
}

export function canIssueEP(type: CredentialType) {
  return `/api/v1/vcs/${urlCredentialType(type)}/can-issue`
}
