import * as _ from 'lodash';


export const mockColorPalettes = [
  {
      id: '001',
      name: 'Ocean',
      colors: [
          '#DB6657',
          '#D76322',
          '#E69912',
          '#83C962',
          '#55BFC3',
          '#1C8DD4',
      ],
      paletteType: 1
  },
  {
      id: '002',
      name: 'Beach',
      colors: [
          '#DB6657',
          '#D76322',
          '#E69912',
          '#83C962',
          '#55BFC3',
          '#1C8DD4',
          '#4F60D6',
          '#834FBD',
          '#000000',
          '#35383A',
          '#6C6C6C',
          '#ABABAB',
          '#DEDEDE',
          '#EBEBEB',
          '#F4F4F4',
          '#FFFFFF'
      ],
      paletteType: 1
  },
  {
      id: '003',
      name: 'Desert',
      colors: [
        "8636385",
        "9218428",
        "7560292",
        "7585731",
        "12167304",
        "5522787",
        "6599838",
        "11767682",
        "3879533",
        "6860425",
        "9860465",
        "921711"
      ],
      paletteType: 2
  },
  {
    id: '004',
    name: 'Albumn',
    colors: [
      "7585731",
      "12167304",
      "5522787",
      "6599838",
      "11767682",
      "3879533",
    ],
    paletteType: 2
  },
  {
    id: '005',
    name: 'Albumn',
    colors: [
      "#DB6657",
    ],
    paletteType: 2
}
];


const listColorPalettes = (req, res) => {
  res.json(
    {
      'code': 200,
      'message': '操作成功',
      'data': mockColorPalettes,
      'success': true
    }
  );
};
const getColorPalette = (req, res) => {
  const badResp = {
    'code': 400,
      'message': 'bad params',
      'success': false
  }
  if(!req.params.id){
    res.json(badResp)
  }
  const targetItem = mockColorPalettes.filter(v => v.id === req.params.id);
  if(!targetItem){
    res.json(badResp);
  }else {
    res.json(
      {
        'code': 200,
        'message': '操作成功',
        'data': targetItem,
        'success': true
      }
    )
  }
}
const putColorPalette = (req, res) => {
  const badResp = {
    'code': 400,
      'message': 'bad params',
      'success': false
  }
  if(!req.body){
    res.json(badResp); 
  }
  const targetItem = mockColorPalettes.filter(v => v.id === req.params.id);
  if(!targetItem){
    res.json(badResp);
  }else {
    res.json(
      {
        'code': 200,
        'message': '操作成功',
        'data': targetItem,
        'success': true
      }
    )
  }
  
}
const postColorPalettes = (req, res) => {
  const badResp = {
    'code': 400,
      'message': 'bad params',
      'success': false
  }
  if(!req.body){
    res.json(badResp); 
  }
  res.json({
      'code': 200,
      'message': '操作成功',
      'data': mockColorPaletteList,
      'success': true
  })
}
const delColorPalette = (req, res) => {
  
  res.json({
    'code': 204,
    'message': '操作成功',
    'success': true
})
}

export default {
  'POST /colorPalettes': postColorPalettes,
  'GET /colorPalettes/:id': getColorPalette,
  'PUT /colorPalettes/:id': putColorPalette,
  'DELETE /colorPalettes/:id': delColorPalette,
  'GET /colorPalettes': listColorPalettes,

};
