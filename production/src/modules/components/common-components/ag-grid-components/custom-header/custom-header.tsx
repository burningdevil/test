import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '@mstr/rc';
import './custom-header.scss';
import { useParams } from 'react-router-dom';
export default (props: any) => {
  const [ascSort, setAscSort] = useState('inactive');
  const [descSort, setDescSort] = useState('inactive');
  const [noSort, setNoSort] = useState('inactive');

  const [checkedList, setCheckedList] = React.useState([]);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);
  const refButton = useRef(null);

  const onMenuClicked = () => {
    props.showColumnMenu(refButton.current);
  };

  const onSortChanged = () => {
    setAscSort(props.column.isSortAscending() ? 'active' : 'inactive');
    setDescSort(props.column.isSortDescending() ? 'active' : 'inactive');
    setNoSort(
      !props.column.isSortAscending() && !props.column.isSortDescending()
        ? 'active'
        : 'inactive'
    );
  };
  const onSelectionChanged  = (e: any) => {
    const selectNodes = e.api.getSelectedRows();
    const rowModel = e.api.getModel();
    if(!selectNodes.length){
        setIndeterminate(false);
        setCheckAll(false);
        return
    }
    if(selectNodes?.length < rowModel.getRowCount()){
        setIndeterminate(true);
        return
    }
    if(selectNodes?.length === rowModel.getRowCount()){
        setIndeterminate(false);
        setCheckAll(true);
        return;
    }
  }
  const onSortRequested = (order: any, event: any) => {
    props.setSort(order, event.shiftKey);
  };

  useEffect(() => {
    props.column.addEventListener('sortChanged', onSortChanged);
    onSortChanged();
    props.api.addEventListener('selectionChanged', onSelectionChanged);
  }, []);

  let menu = null;
  if (props.enableMenu) {
    menu = (
      <div
        ref={refButton}
        className="customHeaderMenuButton"
        onClick={() => onMenuClicked()}
      >
        <i className={`fa ${props.menuIcon}`}></i>
      </div>
    );
  }

  let sort = null;
  if (props.enableSorting) {
    sort = (
      <div style={{ display: 'inline-block' }}>
        <div
          onClick={(event) => onSortRequested('asc', event)}
          onTouchEnd={(event) => onSortRequested('asc', event)}
          className={`customSortDownLabel ${ascSort}`}
        >
          <i className="fa fa-long-arrow-alt-down"></i>
        </div>
        <div
          onClick={(event) => onSortRequested('desc', event)}
          onTouchEnd={(event) => onSortRequested('desc', event)}
          className={`customSortUpLabel ${descSort}`}
        >
          <i className="fa fa-long-arrow-alt-up"></i>
        </div>
        <div
          onClick={(event) => onSortRequested('', event)}
          onTouchEnd={(event) => onSortRequested('', event)}
          className={`customSortRemoveLabel ${noSort}`}
        >
          <i className="fa fa-times"></i>
        </div>
      </div>
    );
  }
  const onCheckAllChange = (e: any) => {
    // setCheckedList(e.target.checked ? [] : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    props.api.forEachNode(function(node: any) {
        node.setSelected(e.target.checked);
     });
  };
  let selectAll = null;
  if (props.enableCheck) {
    selectAll = (
        <div className="customHeaderSelectAll">
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        </Checkbox>
        </div>
    );
  }

  return (
    <div>
      {menu}
      {selectAll}
      <div className="customHeaderLabel">{props.displayName}</div>
      {sort}
    </div>
  );
};