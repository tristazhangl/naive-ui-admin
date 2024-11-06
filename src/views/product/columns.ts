import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';
export interface ListData {
  equipmentInfoId: string;
  equipmentInfoName: string;
  equipmentKind: string;
  equipmentInfoModel: string;
  mainParameter: string;
  manufacturerId: string;
  equMaterial: string;
  unitName: string;
  remark: string;
}

export const columns: BasicColumn<ListData>[] = [
  // 仓库明细编号：equipmentDetailId
  /* {
    title: '仓库名称',
    key: 'cargoName',
    fixed: 'left',
    minWidth: 120,
  },
  {
    title: '货位号',
    key: 'cargoName',
    fixed: 'left',
    minWidth: 120,
  }, */
  {
    title: '设材名称',
    key: 'equipmentInfoName',
    fixed: 'left',
    minWidth: 120,
  },
  {
    title: '设材种类',
    key: 'equipmentKind',
    minWidth: 120,
  },
  {
    title: '规格型号',
    key: 'equipmentInfoModel',
    minWidth: 120,
  },
  {
    title: '参数',
    key: 'mainParameter',
    minWidth: 120,
  },
  {
    title: '制造商',
    key: 'manufacturerId',
    minWidth: 120,
  },
  {
    title: '材质',
    key: 'equMaterial',
    minWidth: 120,
  },
  {
    title: '图号',
    key: 'drawingNo',
    minWidth: 120,
  },
  /* {
    title: '数量',
    key: 'number',
    minWidth: 120,
  }, */
  {
    title: '单位',
    key: 'unitName',
    minWidth: 120,
  },

  /* {
    title: '入库类型',   // 盘库、采购、加工、代管、调拔、修旧、退库
    key: 'docType',
    minWidth: 120,
  },
  {
    title: '入库价格',
    key: 'inPrice',
    minWidth: 120,
  },
  {
    title: '出库价格',
    key: 'outPrice',
    minWidth: 120,
  },
  {
    title: '除税单价',
    key: 'noTaxPrice',
    minWidth: 120,
  },
  {
    title: '含税总价',
    key: 'totalPrice',
    minWidth: 120,
  },
  {
    title: '除税总价',
    key: 'noTaxTotalPrice',
    minWidth: 120,
  }, */
  {
    title: '备注',
    key: 'remark',
    minWidth: 120,
  },
];
