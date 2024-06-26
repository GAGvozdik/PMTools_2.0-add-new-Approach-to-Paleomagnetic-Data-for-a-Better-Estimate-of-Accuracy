import { IPmdData } from "../../../GlobalTypes";
import Coordinates from "../../classes/Coordinates";
import { DotsData, MeanDirection, Reference, TooltipDot } from "../../types";
import toReferenceCoordinates from "../toReferenceCoordinates";
import { dirToCartesian2D } from "../../dirToCartesian";
import { RawStatisticsPCA } from "../../../GlobalTypes";
import { graphSelectedDotColor } from "../../../ThemeConstants";
import createStereoPlaneData from "./createPlaneData/createStereoPlaneData";
 
const dataToStereoPMD = (
  data: IPmdData, 
  graphSize: number, 
  reference: Reference,
  hiddenStepsIDs: Array<number>,
  statistics?: RawStatisticsPCA,
) => {
  const steps = data.steps.filter((step, index) => !hiddenStepsIDs.includes(index + 1));

  // annotations for dots ('id' field added right in the Data.tsx as dot index)
  const labels = steps.map((step) => step.step);

  // 1) rotate dots coords to reference direction 
  // 2) filling arrays of directed and XY data
  const rotatedCoords = steps.map((step) => {
    const xyz = new Coordinates(step.x, step.y, step.z);
    let inReferenceCoords = toReferenceCoordinates(reference, data.metadata, xyz);
    return inReferenceCoords;
  });

  const directionalData: Array<[number, number]> = rotatedCoords.map((step) => {
    const direction = step.toDirection();
    return [direction.declination, direction.inclination];
  });

  const dotsData: DotsData = directionalData.map((di, index) => {
    const coords = dirToCartesian2D(di[0] - 90, di[1], graphSize);
    return {id: steps[index].id, xyData: [coords.x, coords.y]};
  });

  // mean direction calculation
  let meanDirection: MeanDirection = null;
  if (statistics) {
    const direction = toReferenceCoordinates(
      reference, data.metadata, statistics.component.edges
    ).toDirection();
    const [declination, inclination] = direction.toArray(); // mean dec and inc
    const meanXYData = dirToCartesian2D(declination - 90, inclination, graphSize);
    const confidenceCircle = createStereoPlaneData(direction, graphSize, statistics.MAD);
    const greatCircle = createStereoPlaneData(direction, graphSize);

    const tooltip: TooltipDot = {
      title: 'Mean dot',
      dec: +declination.toFixed(1),
      inc: +inclination.toFixed(1),
      MAD: +statistics.MAD.toFixed(1),
      meanType: statistics.code,
    };

    meanDirection = {
      dirData: direction.toArray(),
      xyData: [meanXYData.x, meanXYData.y],
      confidenceCircle: {
        xyData: confidenceCircle.all, 
        xyDataSplitted: confidenceCircle, 
        color: graphSelectedDotColor('mean')
      },
      greatCircle: (statistics.code === 'gc' || statistics.code === 'gcn') 
        ? {
            xyData: greatCircle.all, 
            xyDataSplitted: greatCircle, 
            color: graphSelectedDotColor('mean')
          }
        : undefined,
      tooltip,
    };
  };

  // tooltip data for each dot on graph
  const tooltipData: Array<TooltipDot> = steps.map((step, index) => {
    const xyz = new Coordinates(step.x, step.y, step.z);
    const direction = xyz.toDirection();
    return {
      '№': index + 1,
      step: step.step,
      x: step.x,
      y: step.y,
      z: step.z,
      dec: +directionalData[index][0].toFixed(1),
      inc: +directionalData[index][1].toFixed(1),
      mag: step.mag.toExponential(2).toUpperCase(),
    };
  });
  
  return {
    directionalData, 
    dotsData,
    tooltipData,
    labels,
    meanDirection,
  };
}

export default dataToStereoPMD;
