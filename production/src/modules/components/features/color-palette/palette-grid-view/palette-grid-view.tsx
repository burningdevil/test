import { Table } from "antd";
import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllColorPalettes } from "../../../../../store/selectors/HomeScreenConfigEditorSelector";
import "../color-palette.scss";
import { store } from "../../../../../main";
interface PaletteGridViewProps {
  paletteList?: any[];
  paletteType: number;
}
const renderPaletteColors = (colors: Array<string>) => {
  return colors.map((c) => {
    return (
      <div
        className="color-block"
        style={{
          backgroundColor: c,
          width: "16px",
          height: "16px",
          float: "left",
        }}
      />
    );
  });
};
const getColumns = (isDefault: boolean) => {
  let columns = [
    {
      title: "Name",
      dataIndex: "name",
      className: "name-col",
      width: "10%",
    },
    {
      title: "Default",
      dataIndex: "default",
      className: "default-col",
      width: "5%",
    },
    {
      title: "Colors",
      dataIndex: "colors",
      width: "60%",
      render: (d: Array<string>) => {
        return (
          <div className={`${classNamePrefix}-color-palette-item-colors-col`}>
            {renderPaletteColors(d)}
          </div>
        );
      },
    },
    {
      title: "operation",
      dataIndex: "operation",
      width: "20%",
      render: (_: any, record: any) => {
        return (
          <div className="row-operation">
            <span className="set-default-col">{"Set as Default"}</span>
            <span className="item-edit" />
            <span className="item-duplicate" />
            <span className="item-delete" />
          </div>
        );
      },
    },
  ];
  if (isDefault) {
    columns.find((v) => v.dataIndex === "operation").render = () =>  <></>;
  }
  return columns;
};

const classNamePrefix = "home-screen-dossiersetting";

const PaletteGridView: React.FC<PaletteGridViewProps> = (props) => {
  // const dispatch = useDispatch();
  const paletteList: any[] = useSelector(selectAllColorPalettes);
  const isDefault = props.paletteType === 1 ? true : false;
  console.log("test the color", paletteList, store.getState());
  const dataSource = paletteList.filter(
    (v) => v.paletteType === props.paletteType
  );

  return (
    paletteList?.length && (
      <>
        <div id={`color-pallete-grid-${props.paletteType}`} className={"test"}>
          <Table
            showHeader={false}
            pagination={false}
            rowKey="index"
            dataSource={dataSource}
            columns={getColumns(isDefault)}
          />
        </div>
      </>
    )
  );
};
export default PaletteGridView;
