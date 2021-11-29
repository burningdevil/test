module.exports = {
  // Rally REST API
  apiUrl: 'https://rally1.rallydev.com/slm/webservice/v2.x',
  rallyApiKey: '_QKf6OcL2QQaRGNT5AhHljnORWYGE0v5vPlo3o5QEI',
  // Test result info
  testInfo: {
    // environment: 'On-Prem',
    // iServerOS: 'Docker (Linux on Linux)',
    // metadata: 'Oracle MySQL 8',
    // warehouse: 'MySQL',
    // appServer: 'Tomcat9',
    // jdkjvm: 'Oracle JDK 8',
    clientOS:  process.platform === 'win32' ? 'Mac OS 10.15 Catalina' : 'Microsoft Windows 10',
    // browserType: 'Chrome',
    language: 'English',
    // The reference URL to the user as a tester in Rally
    // Reference Rally API documentation:       https://rally1.rallydev.com/slm/doc/webservice/
    tester: 'https://rally1.rallydev.com/slm/webservice/v2.x/user/146183252292' // Repalce the testerID with your own or team member's ID
  },
  // Create Defect Info
  defectInfo: {
    Project: 'https://rally1.rallydev.com/slm/webservice/v2.x/project/27953347816', // Replace the Proejct ID with the one of your team. 27953347816 for framework,31695518283 for tl-workstation
    State: 'Open',
    ScheduleState: 'Needs Define',
    Priority: 'High Attention',
    FindingSource: 'Automation',
    IssueCategory: 'Functionality',
    Regression: 'Found by new feature testing',
    UCProduct: 'U 208 Architect',
    UPCModule: '091.001 Object Search',
    UPCComponent: '091 Platform Service : Platform'
  }
}
