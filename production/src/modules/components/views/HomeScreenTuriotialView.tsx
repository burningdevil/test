import * as React from 'react';
import { connect } from 'react-redux';
import { Timeline, Layout } from 'antd';
import { TAGS } from '../HomeScreenConfigConstant';
import { selectFeatures } from 'src/store/selectors/HomeScreenConfigEditorSelector';
import { RootState } from 'src/types/redux-state/HomeScreenConfigState';
import * as Actions from '../../../store/actions/ActionsCreator';

let availableTags: Array<TAGS> = [TAGS.action, TAGS.info, TAGS.share];

class HomeScreenTuriotialView extends React.Component<any, any> {
    render(): React.ReactNode {
        return <HomeScreenTuriotialViewComponent></HomeScreenTuriotialViewComponent>
    }
}

const mapState = (state: RootState) => ({
  features: selectFeatures(state)
})

const connector = connect(mapState, {
  setfeatures: Actions.setFeatures
})

const HomeScreenTuriotialViewComponent: React.FC<any> = (any) => {
    const [tags, setTags] = React.useState(availableTags);
    const items = tags.map(
      (item) => <Timeline.Item>{item}</Timeline.Item>
    );
    return (
      <Timeline >
        {items}
      </Timeline>
    );
}

export default connector(HomeScreenTuriotialView);
