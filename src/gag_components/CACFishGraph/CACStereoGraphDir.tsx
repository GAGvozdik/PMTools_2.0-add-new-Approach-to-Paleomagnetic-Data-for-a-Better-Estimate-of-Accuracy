import React, { FC, useMemo, useState } from "react";
import styles from "./CACStereoGraphDir.module.scss";
import { useAppSelector } from "../../services/store/hooks";
import { useGraphSelectableNodesDIR, useGraphSelectedIDs, useDIRGraphSettings } from "../../utils/GlobalHooks";
import { Cutoff, IDirData, IGraph, RawStatisticsDIR, VGPData } from "../../utils/GlobalTypes";
import { SelectableGraph, GraphSymbols } from "../../../src/components/Common/Graphs";
import { stereoAreaConstants } from "../../../src/components/AppGraphs/StereoGraphDIR/StereoConstants";
import AxesAndData from "../../../src/components/AppGraphs/StereoGraphDIR/AxesAndData";
import getInterpretationIDs from "../../utils/graphs/formatters/getInterpretationIDs";
import CoordinateSystem from "../../../src/components/Common/Graphs/CoordinateSystem/CoordinateSystem";
import dataToStereoDIR from "../../utils/graphs/formatters/stereo/dataToStereoDIR";
import { GraphSettings, TMenuItem } from "../../utils/graphs/types";

export interface IStereoGraphDIR extends IGraph {
  data: IDirData;
  centeredByMean: boolean;
  setCenteredByMean: React.Dispatch<React.SetStateAction<boolean>>;
  cutoff: Cutoff;
  menuSettings: {
    menuItems: TMenuItem[];
    settings: GraphSettings;
  }
};

const CACStereoGraphDIR: FC<IStereoGraphDIR> = ({ 
  graphId, 
  width, 
  height, 
  data,
  centeredByMean,
  setCenteredByMean,
  cutoff,
  menuSettings,
}) => {

  const { menuItems, settings } = menuSettings;
  const { reference, currentInterpretation, hiddenDirectionsIDs, reversedDirectionsIDs } = useAppSelector(state => state.dirPageReducer);
  const selectableNodes = useGraphSelectableNodesDIR(graphId); 

  const selectedIDs = useGraphSelectedIDs('dir');
  const {viewHeight, viewWidth, ...areaConstants} = stereoAreaConstants(width, height);
  const dataConstants = useMemo(() => 
    dataToStereoDIR(
      data, width / 2, reference, 
      hiddenDirectionsIDs, reversedDirectionsIDs, 
      centeredByMean, currentInterpretation?.rawData as RawStatisticsDIR,
      cutoff.enabled
    ),
    [
      reference, width, 
      currentInterpretation, data, 
      hiddenDirectionsIDs, 
      reversedDirectionsIDs, 
      centeredByMean, cutoff
    ]
  );

  return (
    <>
    <div className={styles.gr}>
      <SelectableGraph
        graphId={graphId}
        width={viewWidth}
        height={viewHeight}
        selectableNodes={selectableNodes}
        nodesDuplicated={false}
        menuItems={menuItems}
        extraID={data.name}
        graphName={`${data.name}_stereo_dir`}
        onCenterByMean={() => setCenteredByMean(!centeredByMean)}
        centeredByMean={centeredByMean}
        cutoff={{
          toggle: () => cutoff.setEnableCutoff(!cutoff.enabled),
          isEnabled: cutoff.enabled,
          toggleBorderVisibility: () => cutoff.borderCircle?.setShow(!cutoff.borderCircle?.show),
          isBorderVisible: cutoff.borderCircle?.show || false,
          toggleOuterDotsVisibility: () => cutoff.outerDots?.setShow(!cutoff.outerDots?.show),
          isDotsHidden: !cutoff.outerDots?.show || false
        }}
      >
        
        <g>
            
            <AxesAndData 
                graphId={graphId}
                width={width}
                height={height}
                areaConstants={areaConstants}
                dataConstants={dataConstants}
                inInterpretationIDs={[]}
                selectedIDs={selectedIDs}
                cutoff={cutoff}
                settings={settings}
            />
            <CoordinateSystem reference={reference} top={-15}/>  
            <GraphSymbols 
                title1="Down" id1={`${graphId}-d-data`} 
                title2="Up" id2={`${graphId}-u-data`}
                viewHeight={viewHeight} viewWidth={viewWidth}
                disabled={true}
            />

            
        </g>
        
      </SelectableGraph>
      </div>
    </>
  )
}

export default CACStereoGraphDIR;