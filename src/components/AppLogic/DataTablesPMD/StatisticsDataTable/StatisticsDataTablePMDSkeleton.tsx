import React, { FC } from "react";
import styles from './StatisticsDataTablePMD.module.scss';
import { useTheme } from '@mui/material/styles';
import {
  bgColorMain,
  bgColorBlocks,
  boxShadowStyle
} from '../../../../utils/ThemeConstants';
import InfoButton from "../../../Common/Buttons/InfoButton/InfoButton";

const StatisticsDataTablePMDSkeleton: FC = ({ children }) => {

  const theme = useTheme();

  return (
    <div 
      className={styles.tableSmall}
      style={{
        backgroundColor: bgColorBlocks(theme.palette.mode),
        WebkitBoxShadow: boxShadowStyle(theme.palette.mode),
        MozBoxShadow: boxShadowStyle(theme.palette.mode),
        boxShadow: boxShadowStyle(theme.palette.mode),
      }}
    >
      { children }
      <InfoButton contentType="statisticsDataTable" position={{right: 0}} />
    </div>
  )

}

export default StatisticsDataTablePMDSkeleton;
