import * as _ from 'lodash';

const defaultColorPalette = {
  'id': 'cp001',
  'name': 'default mock color palette'
};

let mockColorPaletteList = [
    defaultColorPalette
];

const listColorPalettes = (req, res) => {
  console.log('listColorPalettes');
  res.json(
    {
      'code': 200,
      'message': '操作成功',
      'data': mockColorPaletteList,
      'success': true
    }
  );
};

export default {
  'GET /colorPalettes': listColorPalettes
};
