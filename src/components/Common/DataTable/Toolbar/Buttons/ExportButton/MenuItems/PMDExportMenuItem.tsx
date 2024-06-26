import { MenuItem } from '@mui/material';
import {
  GridExportMenuItemProps,
} from '@mui/x-data-grid';
import { FC } from 'react';
import { toCSV_PMD, toPMD, toXLSX_PMD } from '../../../../../../../utils/files/converters';
import { IPmdData } from '../../../../../../../utils/GlobalTypes'; 

interface PMDExport {
  as: 'pmd' | 'csv' | 'xlsx';
  data: IPmdData;
};

const PMDExportMenuItem: FC<PMDExport> = ({as, data}, props: GridExportMenuItemProps<{}>) => {

  const { hideMenu } = props;

  const exportAs = {
    pmd: {export: () => toPMD(data), label: 'Export as PMD'},
    csv: {export: () => toCSV_PMD(data), label: 'Export as CSV'},
    xlsx: {export: () => toXLSX_PMD(data), label: 'Export as XLSX'}
  };

  return (
    <MenuItem
      onClick={() => {
        exportAs[as].export();
        hideMenu?.();
      }}
    >
      {exportAs[as].label}
    </MenuItem>
  );
};

export default PMDExportMenuItem;
