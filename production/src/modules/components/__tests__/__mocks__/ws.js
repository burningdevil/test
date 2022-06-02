
let workstation = {
    dialogs: {
      confirmation: jest
        .fn()
        .mockImplementation(async () => DialogValues.OK),
      error: jest.fn().mockImplementation(async () => DialogValues.OK),
      objectSelector: jest.fn().mockImplementation(async () => ({
        selectedObjects: [
          {
            projectId: 'CE52831411E696C8BD2F0080EFD5AF44',
            name: 'Demo Report',
            id: 'D18B61FF480D324F346C66B8278CD3C5',
            type: 3,
            path: 'testPath',
            subType: 768,
          },
        ],
      })),
      openObjectEditor: jest.fn().mockImplementation(async () => ({
        windowId: 'testWindowId',
      })),
    },

    environments: {
      getCurrentEnvironment: jest.fn().mockImplementation(async () => {
        return {
          id: 4,
          name: 'Test Environment',
          status: 2,
          subType: -1,
          url: 'http://10.23.2.141:32880/web-dossier/',
          webVersion: '20.0.0000.0000J',
          projects: [
            {
              id: '6A255B7411E9EFB63EFE0080EFB5EF05',
              name: 'Platform Analytics',
              type: 32,
              subType: 8192,
              privileges: [182, 183, 165, 169, 171, 48, 54, 144, 143, 58],
            },
          ]
        }
      }),
      onEnvironmentChange: jest
        .fn()
        .mockImplementation((callback) => callback()),
      offEnvironmentChange: jest.fn(),
    },
    selectedObject: {
      getCurrent: jest.fn().mockImplementation(async () => {
        return {
          id: '54F3D26011D2896560009A8E67019608',
          name: 'Administrator',
          type: 34,
          subType: 8704,
        }
      }),
      getCurrentProject: jest.fn().mockImplementation(async () => ({
          id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
          name: 'MicroStrategy Tutorial',
          type: 32,
          subType: 8192,
        })),
    },
    menus: {
      trigger: jest.fn().mockImplementation(async () => ({
        Url: 'https://www.microstrategy.com/',
        ResponseValue: true,
      })),
    },
    utils: {
      getHelpBaseUrl: jest
        .fn()
        .mockImplementation(
          async () =>
            'http://www2.microstrategy.com/producthelp/2019/Workstation/WebHelp/Lang_1033/Content/'
        ),
      addHandler: jest
        .fn()
        .mockImplementation()
    },
    window: {
      addHandler: jest.fn().mockImplementation((windowEvent, callback) => {
        callback({'Message': {'CloseInfo': '{}'}})
        return true
      }),
      removeHandler: jest
        .fn()
        .mockImplementation((windowEvent, callback) => {
          return true
        }),
      close: jest.fn().mockImplementation(),
      postMessage: jest.fn().mockImplementation((message) => {}),
      setTitle: jest.fn().mockImplementation((newTitle) => {}),
      getExtraContext: jest.fn().mockImplementation(() => {
        return '[{}]'
      }),
    },
  }
global.workstation = workstation; 