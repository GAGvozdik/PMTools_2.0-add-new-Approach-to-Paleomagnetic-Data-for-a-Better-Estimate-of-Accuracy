import React, { FC, useEffect, useState, useCallback } from "react";
import styles from '../khokhlov-gvozdik/khokhlov-gvozdik.module.scss';
import { useTheme } from '@mui/material/styles';

import StatisticsDataTablePMDSkeleton from '../../components/AppLogic/DataTablesDIR/StatisticsDataTable/StatisticsDataTableDIRSkeleton';
import { GetDataTableBaseStyle } from "../../components/AppLogic/DataTablesDIR/styleConstants";
import { DataGridDIRFromDIRRow, StatisitcsInterpretationFromDIR } from "../../utils/GlobalTypes";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useAppDispatch, useAppSelector } from "../../services/store/hooks";

import CACResultToolbar from "../../components/Common/DataTable/Toolbar/CACResultToolbar";
import equal from "deep-equal"
import { acitvateHotkeys, deactivateHotkeys } from "../../services/reducers/appSettings";

// import styles from './StatisticsDataTableDIR.module.scss';

import { DataGrid, GridActionsCellItem, GridValueFormatterParams, GridCellParams, MuiEvent, useGridApiRef } from '@mui/x-data-grid';
// import StatisticsDataTablePMDSkeleton from './StatisticsDataTableDIRSkeleton';
// import { GetDataTableBaseStyle } from "../styleConstants";
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { useAppDispatch, useAppSelector } from "../../../../services/store/hooks";
import { deleteInterpretation, setAllInterpretations, updateCurrentFileInterpretations, setLastInterpretationAsCurrent, setCurrentInterpretationByLabel, setNextOrPrevInterpretationAsCurrent } from "../../services/reducers/dirPage";
// import DIRStatisticsDataTableToolbar from "../../../Common/DataTable/Toolbar/DIRStatisticsDataTableToolbar";
// import { acitvateHotkeys, deactivateHotkeys } from "../../../../services/reducers/appSettings";
import { useCellModesModel } from "../../components/AppLogic/hooks";
import { StatisticsDataTableRow, StatisticsDataTableColumns } from "../../components/AppLogic/DataTablesDIR/types";
import { useScrollToInterpretationRow } from "../../components/AppLogic/hooks/useScrollToInterpretationRow";
import { useTranslation } from 'react-i18next';


interface IStatisticsDataTableDIR {
  currentFileInterpretations?: Array<StatisitcsInterpretationFromDIR> | null;
  lat?: number | null;
  lon?: number | null;
  RZ?: number | null;
  alpha95?: number | null;
  PCaPC?: string | null;
  q?: number | null;
  dir_number?: number | null;
  selectedD?: number | null; 
  gridN?: number | null;
  alpha95Square?: number | null;
  zoneSquare?: number | null;

};

// interface IStatisticsDataTableDIR {
//   data: Array<StatisitcsInterpretationFromDIR> | null;
// };

// const CACDataTable: FC<IStatisticsDataTableDIR> = ({ data }) => {


  const CACDataTable: FC<IStatisticsDataTableDIR> = ({ currentFileInterpretations}) => {

    const dispatch = useAppDispatch();
    const theme = useTheme();
    const apiRef = useGridApiRef();
    const { cellModesModel, handleCellModesModelChange } = useCellModesModel();
    const { t, i18n } = useTranslation('translation');
    const { currentInterpretation, allInterpretations } = useAppSelector(state => state.dirPageReducer);
    const [currentClass, setCurrentClass] = useState(styles.current_dark);
  
    useEffect(() => {
      setCurrentClass(theme.palette.mode === 'dark' ? styles.current_dark : styles.current_light);
    }, [theme]);
  
    useScrollToInterpretationRow({apiRef, pageType: 'dir'});
  
    useEffect(() => {
      window.addEventListener("keydown", handleArrowBtnClick);
      return () => {
        window.removeEventListener("keydown", handleArrowBtnClick);
      };
    }, []);
  
    const handleArrowBtnClick = (e: any) => {
      const key = (e.code as string);
      const { shiftKey } = e; 
      if ((shiftKey) && key === 'ArrowUp') {
        dispatch(setNextOrPrevInterpretationAsCurrent({ changeDirection: 'up' }));
      };
      if ((shiftKey) && key === 'ArrowDown') {
        dispatch(setNextOrPrevInterpretationAsCurrent({ changeDirection: 'down' }));
      };
    }
  
    const handleRowDelete = (id: string) => (event: any) => {
      event.stopPropagation();
      dispatch(deleteInterpretation(id));
      if (currentFileInterpretations) {
        dispatch(updateCurrentFileInterpretations(currentFileInterpretations[0].parentFile));
        dispatch(setLastInterpretationAsCurrent());
      };
    };
  
    const handleDeleteAllRows = (event: any) => {
      event.stopPropagation();
      if (currentFileInterpretations) {
        currentFileInterpretations.forEach(interpretation => {
          dispatch(deleteInterpretation(interpretation.label));
        });
        dispatch(updateCurrentFileInterpretations(currentFileInterpretations[0].parentFile));
        dispatch(setLastInterpretationAsCurrent());
      };
    };
  
    const handleRowUpdate = useCallback((newRow: StatisticsDataTableRow) => {
      if (!currentFileInterpretations) return;
  
      const newInterpretIndex = allInterpretations.findIndex(interpet => interpet.label === newRow.id);
      const updatedAllInterpretations = [...allInterpretations];
      updatedAllInterpretations[newInterpretIndex] = {...updatedAllInterpretations[newInterpretIndex], comment: newRow.comment};
  
      dispatch(setAllInterpretations(updatedAllInterpretations));
      dispatch(updateCurrentFileInterpretations(currentFileInterpretations[0].parentFile));
    }, [allInterpretations, currentFileInterpretations]);
  
    const setRowAsCurrentInterpretation = (rowId: string) => {
      dispatch(setCurrentInterpretationByLabel({label: rowId}));
    }
  



    const columns: StatisticsDataTableColumns = [
      {
        field: 'actions',
        type: 'actions',
        minWidth: 40,
        width: 40,
        renderHeader: () => (
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete all interpretations"
            onClick={handleDeleteAllRows}
            color="inherit"
          />
        ),
        getActions: ({ id }) => {
          return [
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete interpretation"
              onClick={handleRowDelete(id as string)}
              color="inherit"
            />,
          ];
        },
      },

      { field: 'id', headerName: t('CACPage.Label'), type: 'string', width: 80 },
      { field: 'codeCAC', headerName: t('CACPage.Code'), type: 'string', width: 60 },
      // { field: 'stepRange', headerName: 'StepRange', type: 'string', width: 90 },
      { field: 'stepCount', headerName: 'N', type: 'number', minWidth: 30, width: 30 },

      // { field: 'accuracyGeo', headerName: 'Kgeo', type: 'string', width: 60,
      //   valueFormatter: (params: GridValueFormatterParams) => (params.value as number)?.toFixed(1)
      // },
      // { field: 'confidenceRadiusGeo', headerName: 'MADgeo', type: 'string', width: 70,
        // valueFormatter: (params: GridValueFormatterParams) => (params.value as number)?.toFixed(1)
      // },

      // { field: 'accuracyStrat', headerName: 'Kstrat', type: 'string', width: 60,
      //   valueFormatter: (params: GridValueFormatterParams) => (params.value as number)?.toFixed(1)
      // },

    { field: 'lat', headerName: t('CACPage.lat'), type: 'string', width: 65},
    { field: 'lon', headerName: t('CACPage.lon'), type: 'string', width: 65},
    { field: 'RZ', headerName: t('CACPage.RZ'), type: 'number', width: 60},
    { field: 'Igeo', headerName: t('CACPage.FishI'), type: 'number', width: 120,
      valueFormatter: (params: GridValueFormatterParams) => (params.value as number)?.toFixed(1)
    },
    { field: 'Dgeo', headerName: t('CACPage.FishD'), type: 'number', width: 120,
      valueFormatter: (params: GridValueFormatterParams) => (params.value as number)?.toFixed(1)
    },
    { field: 'confidenceRadiusStrat', headerName: t('CACPage.MADstrat'), type: 'string', width: 95,
      valueFormatter: (params: GridValueFormatterParams) => (params.value as number)?.toFixed(1)
    },
    { field: 'alpha95', headerName: 'α95', type: 'number', width: 40},
    // { field: 'alpha95Square', headerName: 'Sα95', type: 'number', width: 40},
    // { field: 'zoneSquare', headerName: 'zoneSquare', type: 'number', width: 40},
    { field: 'PCaPC', headerName: 'PC/aPC', type: 'string', width: 60},
    { field: 'q', headerName: t('CACPage.quantile'), type: 'number', width: 80},
    { field: 'selectedD', headerName: 'd', type: 'number', width: 25},
    { field: 'gridN', headerName: t('CACPage.gridN'), type: 'number', width: 140},
    { field: 'probability', headerName: t('CACPage.probability'), type: 'number', width: 120},
    { field: 'comment', headerName: t('CACPage.Comment'), type: 'string', minWidth: 40, flex: 1, 
    editable: true, cellClassName: styles[`editableCell_${theme.palette.mode}`] },
  
    ];
  
    columns.forEach((col) => {
      col.align = 'center';
      col.headerAlign = 'center';
      col.hideSortIcons = true;
      col.disableColumnMenu = true;
    });
    
    if (!currentFileInterpretations || !currentFileInterpretations.length) {
      return (
        <div className={styles.table2_container + ' ' + styles.commonContainer + ' ' +  styles.grant}>
          {t('CACPage.grant1')}
            <a className={styles.grantLink} href="">075-00439-25-01</a>
          {t('CACPage.grant2')}
            <a className={styles.grantLink} href="">075-00603-25-00</a>
          {t('CACPage.grant3')}


        </div>
      )
    };
  
    const rows: StatisticsDataTableRow[] = currentFileInterpretations.map((statistics) => {

      // let RZInRow: number = 10;
      // let a95InRow: number = 10;
      // let PCaPCInRow: string = 'aPC';
      // let qInRow: number = 10; 
  
      const { 
        label, 
        stepRange, 
        stepCount, 
        Dgeo, 
        Igeo, 
        Dstrat, 
        Istrat, 
        confidenceRadiusGeo, 
        Kgeo, 
        confidenceRadiusStrat, 
        Kstrat, 
        comment, 
        lat, 
        lon, 
        RZ, 
        alpha95, 
        PCaPC, 
        q, 
        gridN, 
        d,
        alpha95Square,
        zoneSquare,
        probability
      } = statistics;


      return {
        id: label,
        codeCAC: 'cac',
        stepRange,
        stepCount,
        Dgeo: +Dgeo.toFixed(1),
        Igeo: +Igeo.toFixed(1),
        Dstrat: +Dstrat.toFixed(1),
        Istrat: +Istrat.toFixed(1),
        confidenceRadiusGeo: +confidenceRadiusGeo.toFixed(1),
        accuracyGeo: +(Kgeo || 0).toFixed(1),
        confidenceRadiusStrat: +confidenceRadiusStrat.toFixed(1),
        accuracyStrat: +(Kstrat || 0).toFixed(1),
        comment, 
        lat: Number(lat?.toFixed(1)),
        lon: Number(lon?.toFixed(1)),
        RZ: Number(RZ?.toFixed(1)), 
        alpha95: Number(alpha95?.toFixed(1)), 
        PCaPC: PCaPC, 
        q: q,
        selectedD:d,
        gridN:gridN,
        probability:Number(probability?.toFixed(3)),
        // alpha95Square:alpha95Square, 
        // zoneSquare:zoneSquare,

      };
    }).reverse();
  
    return (
      <div className={styles.table2_container + ' ' + styles.commonContainer}>
        <DataGrid 
          apiRef={apiRef}
          rows={rows} 
          columns={columns} 
          cellModesModel={cellModesModel}
          onCellModesModelChange={handleCellModesModelChange}
          onCellEditStart={(params: GridCellParams, event: MuiEvent) => {
            dispatch(deactivateHotkeys());
          }}
          onCellEditStop={(params: GridCellParams, event: MuiEvent) => {
            dispatch(acitvateHotkeys());
          }}
          sx={{
            ...GetDataTableBaseStyle(),
            '& .MuiDataGrid-cell': {
              padding: '0px 0px',
            },
            '& .MuiDataGrid-columnHeader': {
              padding: '0px 0px',
            },
            p: '0 4px 0 0'
          }}
          hideFooter={rows.length < 100}
          density={'compact'}
          disableRowSelectionOnClick={true}
          getRowClassName={
            (params) => params.row.id === currentInterpretation?.label ? currentClass : ''
          }
          components={{
            Toolbar: CACResultToolbar
          }}
          onRowClick={(params) => setRowAsCurrentInterpretation(params.row.id)}
          processRowUpdate={(newRow, oldRow) => {
            handleRowUpdate(newRow);
            return newRow;
          }}
        />
      </div>
    );
  };

export default CACDataTable;

