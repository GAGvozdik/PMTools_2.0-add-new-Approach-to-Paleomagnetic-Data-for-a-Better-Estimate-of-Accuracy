import React, { FC, ReactNode } from 'react';
import styles from './CACGraphSkeleton.module.scss';
import { useTheme } from '@mui/material/styles';
import {
  bgColorMain,
  bgColorBlocks,
  boxShadowStyle,
  bgColorCharts
} from '../../utils/ThemeConstants';

interface IGraphsSkeleton {
  graph: {node: ReactNode, ref: React.RefObject<HTMLDivElement>} | null ;
  graphToExport: {node: ReactNode, ref: React.RefObject<HTMLDivElement>} | null ;
};

const CACGraphSkeleton: FC<IGraphsSkeleton> = ({ 
  graph,  
  graphToExport,
}) => {
  
  const theme = useTheme();

  return (
    <div className={styles.graph_container}>

        { graph?.node }

      {/* <div
        ref={graphToExport?.ref}
        style={{display: 'none'}}
      >
        { graphToExport?.node }
      </div> */}
    </div>
  )
};

export default CACGraphSkeleton;
