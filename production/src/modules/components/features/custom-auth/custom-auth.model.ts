

export enum AuthModeConstants {
    Standard = 1,
    WindowsNT = 2,
    Passthrough = 4,
    Anonymous = 8,
    LDAP = 16,
    Warehouse = 32,
    Trusted = 64,
    Kerberos = 128,
    SAML = 1048576,
    OIDC =  4194304
}

export const supportCustomAuthModes: any[] = [
    {
        'label': 'Standard',
        'value': AuthModeConstants.Standard
    },
    {
        'label': 'OIDC',
        'value': AuthModeConstants.OIDC
    },
    {
        'label': 'SAML',
        'value': AuthModeConstants.SAML
    },
    {
        'label': 'LDAP',
        'value': AuthModeConstants.LDAP
    }
]
 export interface CustomAuthModes {
    enabled: boolean;
    availableModes: number[];
    defaultMode: number;
 }

 export const DEFAULT_AUTH_MODE: CustomAuthModes =  {
    availableModes: [],
    defaultMode: 0,
    enabled: false

 }