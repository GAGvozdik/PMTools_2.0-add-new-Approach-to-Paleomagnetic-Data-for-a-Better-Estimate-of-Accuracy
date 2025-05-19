import React, { FC } from 'react';
import styles from './CACGraphButton.module.scss';
import { Button, ButtonGroup } from '@mui/material';

import { setStatisticsMode } from '../../services/reducers/dirPage';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { StatisticsModeCAC } from '../../utils/graphs/types';
import { useTranslation } from 'react-i18next';

  interface ICACGraphButton {
    mode: StatisticsModeCAC;
    changeGraph?: () => void;
  };
  
  const CACGraphButton: FC<ICACGraphButton> = ({ mode, changeGraph }) => {

    const { t, i18n } = useTranslation('translation');
    
  
    const dispatch = useAppDispatch();
    const { statisticsMode } = useAppSelector(state => state.dirPageReducer); 
  
    const onStatisticsModeClick = (mode: StatisticsModeCAC) => {
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
          { mode ? t(`CACPage.${mode}`) : null }

        </Button>

      </>
    );
  };
  
export default CACGraphButton;
