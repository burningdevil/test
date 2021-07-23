import * as React from 'react';
import { Table } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import '../scss/DragToSortTable.scss';

const DragHandle = sortableHandle(() => <span className='item-drag'/> );

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

class DragToSortTable extends React.Component {
  state = {
    dataSource: this.props.dataSource,
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.state;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
      this.setState({ dataSource: newData });
    }
  };

  DraggableContainer = props => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.index === restProps['data-row-key']);
    return <SortableItem className='drag-to-sort-row' index={index} {...restProps} />;
  };

  render() {
    const { columns } = this.props;
    const displaycolumns = columns.concat({
      title: 'Sort',
      dataIndex: 'sort',
      width: '5%',
      className: 'drag-visible',
      render: () => <DragHandle />
    });
    const { dataSource } = this.state;

    return (
      <Table
        showHeader={false}
        pagination={false}
        dataSource={dataSource}
        columns={displaycolumns}
        rowKey="index"
        components={{
          body: {
            wrapper: this.DraggableContainer,
            row: this.DraggableBodyRow,
          },
        }}
      />
    );
  }
}

export default DragToSortTable;