import QuickSearchPage from './QuickSearchPage';

function PageBuilder() {
  const quickSearchPage = new QuickSearchPage();

  return {
    quickSearchPage
  };
}

module.exports = PageBuilder;