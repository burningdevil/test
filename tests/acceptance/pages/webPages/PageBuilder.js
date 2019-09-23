import HyperPage from './HyperPage';
import MetricEditor from './MetricEditor';
import QuickSearchPage from './QuickSearchPage';

function PageBuilder() {
  const hyperPage = new HyperPage();
  const metricEditor = new MetricEditor();
  const quickSearchPage = new QuickSearchPage();

  return {
    hyperPage,
    metricEditor,
    quickSearchPage
  };
}

module.exports = PageBuilder;