import React, { FC, useCallback } from 'react';
import style from './ExportButton.module.scss';
import IconButton from '@mui/material/IconButton';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { handleExportGraph } from '../../../../../utils/graphs/export';
import { useDIRGraphSettings, usePMDGraphSettings } from '../../../../../utils/GlobalHooks';

interface IExportButton {
  graphId: string;
  name?: string;
}

const ExportButton: FC<IExportButton> = ({ graphId, name }) => {
  const dir = useDIRGraphSettings();
  const pmd = usePMDGraphSettings();

  const handleClick = useCallback(() => 
    handleExportGraph(graphId, name),
    [graphId, name, dir.settings, pmd.settings]
  );

  return (
    <div className={style.exportButton}>
      <IconButton 
        color="primary" 
        component="span"
        // onClick={() => handleExportGraph(graphId, name)}
        onClick={handleClick}
        sx={{p: '4px'}}
      >
        <FileDownloadOutlinedIcon />
      </IconButton>
    </div>
  );
};

export default ExportButton;