import React, { FC, useMemo } from "react";
import styles from "./ZijdGraph.module.scss";
import { useAppSelector } from "../../../services/store/hooks";
import { useGraphSelectableNodesPCA, useGraphSelectedIDs, usePMDGraphSettings } from "../../../utils/GlobalHooks";
import { IGraph, RawStatisticsPCA } from "../../../utils/GlobalTypes";
import { IPmdData } from "../../../utils/GlobalTypes";
import dataToStereoPMD from "../../../utils/graphs/formatters/stereo/dataToStereoPMD";
import { SelectableGraph, GraphSymbols } from "../../Common/Graphs";
import { stereoAreaConstants } from "./StereoConstants";
import AxesAndData from "./AxesAndData";
import getInterpretationIDs from "../../../utils/graphs/formatters/getInterpretationIDs";
import CoordinateSystem from "../../Common/Graphs/CoordinateSystem/CoordinateSystem";
import { GraphSettings, TMenuItem } from "../../../utils/graphs/types";

export interface IStereoGraph extends IGraph {
  data: IPmdData;
  menuSettings: {
    menuItems: TMenuItem[];
    settings: GraphSettings;
  }
}

const StereoGraph: FC<IStereoGraph> = ({ graphId, width, height, data, menuSettings }) => {
  const { reference, currentInterpretation, hiddenStepsIDs } = useAppSelector(state => state.pcaPageReducer);
  const { menuItems, settings } = menuSettings;
  const selectableNodes = useGraphSelectableNodesPCA(graphId, false); 
  const selectedIDs = useGraphSelectedIDs();

  const {viewHeight, viewWidth, ...areaConstants} = stereoAreaConstants(width, height);
  const dataConstants = useMemo(() => 
    dataToStereoPMD(data, width / 2, reference, hiddenStepsIDs, currentInterpretation?.rawData as RawStatisticsPCA),
  [reference, width, currentInterpretation, data, hiddenStepsIDs]);

  const inInterpretationIDs = getInterpretationIDs(currentInterpretation, data);

  return (
    <>
      <SelectableGraph
        graphId={graphId}
        width={viewWidth}
        height={viewHeight}
        selectableNodes={selectableNodes}
        nodesDuplicated={false}
        menuItems={menuItems}
        extraID={data.metadata.name}
        graphName={`${data.metadata.name}_stereo_pca`}
      >
        <g>
          <AxesAndData 
            graphId={graphId}
            width={width}
            height={height}
            areaConstants={areaConstants}
            dataConstants={dataConstants}
            inInterpretationIDs={inInterpretationIDs}
            selectedIDs={selectedIDs}
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
    </>
  )
}

export default StereoGraph;