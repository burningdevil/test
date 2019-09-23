import HyperPage from './HyperPage';
import LdapConfigPage from './LdapConfigPage';
import MetricEditor from './MetricEditor';
import QuickSearchPage from './QuickSearchPage';


function PageBuilder() {
  const hyperPage = new HyperPage();
  const ldap = new LdapConfigPage();
  const metricEditor = new MetricEditor();
  const quickSearchPage = new QuickSearchPage();

  return {
    hyperPage,
    ldap,
    metricEditor,
    quickSearchPage
  };
}

module.exports = PageBuilder;