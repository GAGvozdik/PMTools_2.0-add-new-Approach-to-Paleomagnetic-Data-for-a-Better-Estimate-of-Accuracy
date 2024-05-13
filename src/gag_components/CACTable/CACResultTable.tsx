import React, { FC, useEffect, useState, useCallback } from "react";
import styles from './CACResultTable.module.scss';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridActionsCellItem, GridColumnHeaderParams, GridValueFormatterParams, GridCellParams, MuiEvent } from '@mui/x-data-grid';
import StatisticsDataTablePMDSkeleton from '../../components/AppLogic/DataTablesDIR/StatisticsDataTable/StatisticsDataTableDIRSkeleton';
import { GetDataTableBaseStyle } from "../../components/AppLogic/DataTablesDIR/styleConstants";
import { DataGridDIRFromDIRRow, StatisitcsInterpretationFromDIR } from "../../utils/GlobalTypes";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useAppDispatch, useAppSelector } from "../../services/store/hooks";
import { deleteInterpretation, setAllInterpretations, updateCurrentFileInterpretations} from "../../services/reducers/dirPage";
import DIRStatisticsDataTableToolbar from "../../components/Common/DataTable/Toolbar/DIRStatisticsDataTableToolbar";
import equal from "deep-equal"
import { acitvateHotkeys, deactivateHotkeys } from "../../services/reducers/appSettings";

interface IStatisticsDataTableDIR {
  data: Array<StatisitcsInterpretationFromDIR> | null;
};

const CACDataTable: FC<IStatisticsDataTableDIR> = ({ data }) => {

  return (

    <>
  </>


  );
};

export default CACDataTable;

