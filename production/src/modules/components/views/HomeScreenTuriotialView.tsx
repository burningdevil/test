import * as React from 'react';
import { connect } from 'react-redux';
import { Layout, Carousel } from 'antd';
import { TAGS } from '../HomeScreenConfigConstant';
import { selectFeatures } from 'src/store/selectors/HomeScreenConfigEditorSelector';
import { RootState } from 'src/types/redux-state/HomeScreenConfigState';
import * as Actions from '../../../store/actions/ActionsCreator';

let availableTags: Array<TAGS> = [TAGS.action, TAGS.info, TAGS.share];

type AppearanceEditorProps = {
  features: Array<TAGS>
}

class HomeScreenTuriotialView extends React.Component<any, any> {
    render(): React.ReactNode {
      // const [tags, setTags] = React.useState(availableTags);
      const { features } = this.props;
      const onChange = (currentSlide: number) => {
        console.log(currentSlide);
      };
      const items = features.features.map(
        (item: TAGS) => <HomeScreenTuriotialViewComponent item={item}/>
      )

      return (
        <Carousel afterChange={onChange}>
            {items}
        </Carousel>
      );
    }
}

const mapState = (state: RootState) => ({
  features: selectFeatures(state)
})

const connector = connect(mapState, {
  setfeatures: Actions.setFeatures
})



const overStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  textAlign: 'center',
  // background: '#364d79',
};

const headerStyle: React.CSSProperties = {
  height: '30px',
  color: '#f00'
};

const contentStyle: React.CSSProperties = {
  marginTop: '30px',
  height: '100px',
};

// 1 question and 2 options
const HomeScreenTuriotialViewComponent: React.FC<any> = (props: any) => {
  const onChange = (item) => {
    console.log(item)
  }

  return <div>
    <h3 style={overStyle}>
      <Layout>
        <Layout.Header style={headerStyle}>{props.item}</Layout.Header>
        <Layout.Content style={contentStyle}>
          <button onClick={onChange}>YES</button>
          <button onClick={onChange}>NO</button>
        </Layout.Content>
      </Layout>
    </h3>
  </div>
}

export default connector(HomeScreenTuriotialView);
