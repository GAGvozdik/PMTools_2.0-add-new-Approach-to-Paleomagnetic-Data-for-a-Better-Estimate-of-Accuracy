import React, { FC } from 'react';
import styles from './CACGraphButton.module.scss';
import { Button, ButtonGroup } from '@mui/material';

import { setStatisticsMode } from '../../services/reducers/dirPage';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { StatisticsModeDIR } from '../../utils/graphs/types';


  interface ICACGraphButton {
    mode: StatisticsModeDIR;
    changeGraph?: () => void;
  };
  
  const CACGraphButton: FC<ICACGraphButton> = ({ mode, changeGraph }) => {


  
    const dispatch = useAppDispatch();
    const { statisticsMode } = useAppSelector(state => state.dirPageReducer); 
  
    const onStatisticsModeClick = (mode: StatisticsModeDIR) => {
      if (statisticsMode === mode) mode = null;
        
      // dispatch(setStatisticsMode(mode));

      if (changeGraph) {
        changeGraph(); // Вызываем функцию changeGraph, если она была передана в props
      }
    };
  
    return (
      <>

        <Button
          color={statisticsMode === mode ? 'secondary' : 'primary'}
          sx={{
            fontWeight: statisticsMode === mode ? 600 : 400
          }}
          onClick={() => onStatisticsModeClick(mode)}
        >
          { mode?.toUpperCase() }
        </Button>

      </>
    );
  };
  
export default CACGraphButton;
