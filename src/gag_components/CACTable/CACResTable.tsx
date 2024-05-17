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
  dataToShow?: IDirData | null;
  lat?: number | null | undefined;
  lon?: number | null | undefined;
  RZ?: number | null | undefined;
  alpha95?: number | null | undefined;
  PCaPC?: string | null | undefined;
  q?: number | null | undefined;
  dir_number?: number | null | undefined;
  selectedD?: number | null | undefined;
  gridN?: number | null | undefined;

  
};



const CACResTable: FC<ITables> = ({ dataToShow, lat, lon, RZ, alpha95, PCaPC, q, selectedD, gridN, dir_number}) => {


// export function CACTable({ dataToShow }) {

  const theme = useTheme();
  
  const { currentInterpretation, currentFileInterpretations } = useAppSelector(state => state.dirPageReducer);
  const [interpretations, setInterpretations] = useState<StatisitcsInterpretationFromDIR[] | null>(null);

  useEffect(() => {


    if (currentFileInterpretations && currentFileInterpretations.length) 
      {


        setInterpretations(currentFileInterpretations);
      }
    else if (currentInterpretation && currentInterpretation != null) 
      {

        setInterpretations([currentInterpretation])
      }

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
         gridN={gridN}
        />
      
    </>
  )
};

export default CACResTable;