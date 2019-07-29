import QuickSearchPage from './QuickSearchPage';
import HyperPage from './HyperPage';

function PageBuilder() {
  const quickSearchPage = new QuickSearchPage();
  const hyperPage = new HyperPage();

  return {
    quickSearchPage,
    hyperPage
  };
}

module.exports = PageBuilder;