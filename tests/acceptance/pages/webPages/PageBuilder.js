import QuickSearchPage from './QuickSearchPage';
import HyperPage from './HyperPage';
import LdapConfigPage from './LdapConfigPage';

function PageBuilder() {
  const quickSearchPage = new QuickSearchPage();
  const hyperPage = new HyperPage();
  const ldap = new LdapConfigPage();

  return {
    hyperPage,
    ldap,
    quickSearchPage,
  };
}

module.exports = PageBuilder;