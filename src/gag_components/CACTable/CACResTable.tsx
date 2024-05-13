import React, { FC, useEffect, useState } from 'react';
import styles from '../khokhlov-gvozdik/khokhlov-gvozdik.module.scss';
import { useAppSelector } from '../../services/store/hooks';
import { IDirData, StatisitcsInterpretationFromDIR } from "../../utils/GlobalTypes";
import { DataTableDIR, StatisticsDataTableDIR } from '../../components/AppLogic';
import { useTheme } from '@mui/material/styles';
import {
  bgColorMain,
} from '../../utils/ThemeConstants';
import CACResultTable from './CACResultTable';

interface ITables {
  dataToShow: IDirData | null;
  lat?: number | null;
  lon?: number | null;
  RZ?: number | null;
  alpha95?: number | null;
  PCaPC?: string | null;
  q?: number | null;
  dir_number?: number | null;
  selectedD?: number | null;
};


const CACResTable: FC<ITables> = ({ dataToShow, lat, lon, RZ, alpha95, PCaPC, q, dir_number, selectedD}) => {


// export function CACTable({ dataToShow }) {

  const theme = useTheme();
  
  const { currentInterpretation, currentFileInterpretations } = useAppSelector(state => state.dirPageReducer);
  const [interpretations, setInterpretations] = useState<StatisitcsInterpretationFromDIR[] | null>(null);

  useEffect(() => {
    if (currentFileInterpretations && currentFileInterpretations.length) setInterpretations(currentFileInterpretations);
    else if (currentInterpretation) setInterpretations([currentInterpretation]);
    else setInterpretations(null);
  }, [currentInterpretation, currentFileInterpretations]);

  return (
    <>

      
        {/* <DataTableDIR data={dataToShow}/> */}
        <CACResultTable 
          currentFileInterpretations={interpretations}
          RZ={RZ}
          lat={lat}
          lon={lon}
          alpha95={alpha95}
          PCaPC={PCaPC}
          q={q}
          dir_number={dir_number}
          selectedD={selectedD}
        />
      
    </>
  )
};

export default CACResTable;