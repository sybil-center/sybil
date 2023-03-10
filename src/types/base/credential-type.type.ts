/**
 * Provided types of VC
 * Can be converted to Kebab case and turn over by {@link toUrlVCType} and {@link toEnumVCType}
 */
export enum CredentialType {
  VerifiableCredential = "VerifiableCredential",
  EmptyCredential = "EmptyCredential",
  EthAddressExistsCredential = "EthAddressExistsCredential",
  EthAccountOwnershipCredential = "EthAccountOwnershipCredential",
  TwitterAccountOwnershipCredential = "TwitterAccountOwnershipCredential",
  GitHubAccountOwnershipCredential = "GitHubAccountOwnershipCredential",
  DiscordAccountOwnershipCredential = "DiscordAccountOwnershipCredential"
}

export function toUrlVCType(credentialType: CredentialType): string {
  return credentialType
    .toString()
    .replace(/([a-z0–9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

export function toEnumVCType(credentialTypeUrl: string): CredentialType {
  const vcTypeStr = credentialTypeUrl.replace(/(^\w|-\w)/g, clearAndUpper);
  // @ts-ignore
  const vcTypeEnum = CredentialType[vcTypeStr];
  if (vcTypeEnum) {
    return vcTypeEnum;
  }
  throw new Error(`can not convert ${credentialTypeUrl} to VCType enum`);
}

function clearAndUpper(text: string) {
  return text.replace(/-/, "").toUpperCase();
}
