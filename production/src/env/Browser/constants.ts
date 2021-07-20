import { DeploymentType, Environment, MCIType } from "@mstr/workstation-types";

export const env: Environment = {
  id: '2D357C22-2AF2-494A-B8AF-7F077BBF8733',
  name: 'Test Env',
  status: 2,
  subType: -1,
  type: -1,
  url: 'http://tec-w-009714.labs.microstrategy.com:8100/MicroStrategyLibrary/',
  webVersion: '11.2.0200.130358J',
  privileges: [],
  projects: [],
  mciType: MCIType.NotMCI,
  deploymentType: DeploymentType.OnPrem
}

export const project = { id: 'B19DEDCC11D4E0EFC000EB9495D0F44F', name: 'MicroStrategy Tutorial', type: 32, subType: 8192 }
export const selectedObj = { id: '78CE13C64CD815C05BCB828475AE2A8F', name: 'Untitled Filter', type: 1, subType: 256 }

export const permissions = {
  canBrowse: true,
  canControl: true,
  canDelete: true,
  canExecute: true,
  canFullPermission: true,
  canRead: true,
  canUse: true,
  canUseExecute: true,
  canWrite: true,
}

export const dialogRes = {
  canOverwrite: true,
  folder: {
    id: '8D67908E11D3E4981000E787EC6DE8A4',
    name: 'My Personal Objects'
  },
  name: 'Untitled Filter',
  shouldCertify: false
}

export const menuRes = {
  Url: 'http://tec-w-009714.labs.microstrategy.com:8100/MicroStrategyLibrary/',
  ResponseValue: true
}

export const helpUrl = 'http://tec-w-009714.labs.microstrategy.com:8100/MicroStrategyLibrary/'

export const apiResp = new Response(new Blob(), { status : 200 })
