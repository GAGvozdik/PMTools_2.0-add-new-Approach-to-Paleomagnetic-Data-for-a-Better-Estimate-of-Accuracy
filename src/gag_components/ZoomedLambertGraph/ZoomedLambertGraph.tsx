import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Cutoff } from "../../utils/GlobalTypes";
import { DotsData, GraphSettings, MeanDirection, TooltipDot } from "../../utils/graphs/types";
import { graphSelectedDotColor } from "../../utils/ThemeConstants";
import { Axis, Data, Dot } from "../../components/Common/Graphs";
import { PlaneData, DotSettings, DotType} from "../../utils/graphs/types";
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { setCurrentDIRid } from '../../services/reducers/parsedData';
// import Graphs from '../pages/DIRPage/Graphs';
// import { Rumbs } from "./rumbs";
import InterpretationSetter from '../../../src/pages/DIRPage/InterpretationSetter';
import { DegreeGrid } from "./degreeGrid";
import { setRZ } from '../../services/reducers/cacParams';
import styles from "./ZoomedLabertGraph.module.scss" 
import {Ram} from "./ram";
import { 
    addInterpretation, 
    setStatisticsMode, 
    showSelectionInput,
  } from '../../services/reducers/dirPage';
import {
    RotateAroundV,
    PlotCircle,
    make_coords,
    centering,
    poly_contour,
    convertToLambert,
    lambertMass,
    to_center,
    points_dist_2d,
    points_dist,
    getViewBoxSize,
    getPointSize,
    angle_between_v,
    vector_length,
    centerToBack
} from "../gag_functions";

import { DataGridDIRFromDIRRow, IDirData } from "../../../src/utils/GlobalTypes";

const dotSettings: DotSettings = {
    annotations: false,
    tooltips: false,
    // Другие свойства
  };

interface HGGraph {
    centerZone: number[],
    gridPoints: number[][],
    svgRef: React.RefObject<SVGSVGElement>,
    viewBox: { x: number; y: number; width: number; height: number };    
}


export function ZoomedLambertGraph({
    centerZone,
    gridPoints, svgRef, viewBox
}: HGGraph) {

    const { 
        // centerZone,
        // gridPoints,
        dirList,
        angleList,
        meanDir,
        alpha95,
        isGrid,
        isDegreeVisible,
        isVis,
        scale, 
        // viewBox,
        // svgRef
    } = useAppSelector(state => state.cacParamsReducer);

    const centerZoneColor = '#2b3bb3';
    let plotPointsCount = 150; 
    const dispatch = useAppDispatch();

    // dispatch(centering(dirList, meanDir));
    let centeredDirList = centering(dirList, meanDir);


    let polyColor = "#5badff";
    let gridColor = '#1975d2';

    // let viewBoxSize = getViewBoxSize(centeredDirList, angleList, meanDir, 1.0);
    let viewBoxSize = getViewBoxSize(centeredDirList, angleList, meanDir, 0.15);
    let fullViewBoxSize = viewBoxSize;
    // let fullViewBoxSize = getViewBoxSize(centeredDirList, angleList, meanDir, 0);
    // fullViewBoxSize = getViewBoxSize(centeredDirList, angleList, meanDir, 0.6);

    let parallelsCount = 36;
    let meridianCount = 36;

    let circlesRadius = getPointSize(viewBoxSize);
    let gridRadius = circlesRadius;
    let centerZoneRadius = 3 * circlesRadius;
    let fisherRadius = 2.5 * circlesRadius;
    let alphaCircleWidth = 1.5 * circlesRadius;


    let gmaxRad: number = 888;
    
    useEffect(() => {
        // Логика для вычисления результатов 2 на основе calculationResult1
        
        dispatch(setRZ(gmaxRad));
      }, [gmaxRad, centerZone]);

    // setRZ(gmaxRad);

    // to see all sphere
    // fullViewBoxSize = '-0.5 -0.5 1 1';
    // viewBoxSize = '-0.5 -0.5 1 1';
    // fullViewBoxSize = '-1 -1 2 2';
    // viewBoxSize = '-1 -1 2 2';


    // if (angleList[0] == 0) {
    //   return (
    //     <div>
    //       <svg className={styles.svg + ' ' + styles.interface} key={6534324} viewBox={"-1 -1 2 2"} />
    //     </div>
    //   );
    // }

    //---------------------------------------------------------------------------------------
    // CENTER ZONE
    //---------------------------------------------------------------------------------------
    
    const rotationCenterZone = convertToLambert(to_center(centerZone, meanDir), meanDir);

    //---------------------------------------------------------------------------------------
    // SMALL CIRCLES
    //---------------------------------------------------------------------------------------

    let smallCircles: number[][] = [];
    let circle: number[][] = [];

    for (let i = 0; i < centeredDirList.length; i++) {
        
        circle = lambertMass(
                        PlotCircle(
                            centeredDirList[i], 
                            angleList[i], 
                            plotPointsCount
                        ), 
                        meanDir
                    );

        smallCircles = smallCircles.concat(circle);
    }
        
    //---------------------------------------------------------------------------------------
    // SPGERAL GRID
    //---------------------------------------------------------------------------------------
    
    let gridPointsCentered = lambertMass(centering(gridPoints, meanDir), meanDir);

    //---------------------------------------------------------------------------------------
    // POLYGON ZONE
    //---------------------------------------------------------------------------------------
    
    const circlePointsToCalculateCount = 720 * 8;
    let input: [number, number][] = [];
    let circlePoints = [];
    let circlePoint = [];

    for (let i = 0; i < centeredDirList.length; i++) {
          circlePoint = lambertMass(
                            PlotCircle(
                                centeredDirList[i], 
                                angleList[i], 
                                circlePointsToCalculateCount
                            ), 
                            meanDir
                        );

        for (let j = 0; j < circlePoint.length; j++){
            circlePoints.push(circlePoint[j]);
        }
    }

    for (let i = 0; i < circlePoints.length; i++) {
        input.push([circlePoints[i][0], circlePoints[i][1]]);
    }

    let polygonPoints2d = poly_contour(input, [rotationCenterZone[0], rotationCenterZone[1]]);
    let polygonPoints3d: number[][] = [];

    for (let i = 0; i < polygonPoints2d.length; i++) {
        polygonPoints3d.push([polygonPoints2d[i][0], polygonPoints2d[i][1], 1 - polygonPoints2d[i][0] * polygonPoints2d[i][0] - polygonPoints2d[i][1] * polygonPoints2d[i][1]]);
    }

    let polygonPoints = make_coords(polygonPoints3d);

    let maxRad = -1;
    let onePointNumb = -1;
    for (let i = 0; i < polygonPoints3d.length; i++) {
        if (points_dist(rotationCenterZone, polygonPoints3d[i]) > maxRad) {
            onePointNumb = i;
            maxRad = points_dist(rotationCenterZone, polygonPoints3d[i]);
        }
    }
    
    // maxRad

    let maxRPt: number[] = rotationCenterZone;
    if (onePointNumb != -1){
        maxRPt = polygonPoints3d[onePointNumb];

    }
    gmaxRad = angle_between_v(rotationCenterZone, maxRPt) * 180 / Math.PI;

    // if (gmaxRad > 180) { gmaxRad -= 180; }

    // let gmaxRad: number;
    // let gmaxRad = angle_between_v(rotationCenterZone, polygonPoints3d[onePointNumb]);

    // gmaxRad += 1;
    //---------------------------------------------------------------------------------------
    // DEGREE GRID
    //---------------------------------------------------------------------------------------
    
    let degreeGrid: number[][][] = [];

    let point = [0, 0, 1];


    for (let i = 0; i < meridianCount; i++) {
        point = RotateAroundV(point, [0, 1, 0], 360/ meridianCount );
        point = RotateAroundV(point, [1, 0, 0], 89);
        const meridian = lambertMass(centering(PlotCircle(point, 90, 90), meanDir), meanDir);
        // degreeGrid.push(meridian);
    }


    // for (let i = 0; i < parallelsCount; i++) {
    //     const parallel = lambertMass(centering(PlotCircle([0, 0, 1], i * (360 / meridianCount), 90), meanDir), meanDir);
    //     degreeGrid.push(parallel);
    // }

    // let paralel = lambertMass(PlotCircle([0, 1, 0], 90, 90), meanDir);
    // degreeGrid.push(paralel);

    //---------------------------------------------------------------------------------------
    // RUMBS
    //---------------------------------------------------------------------------------------
    
    // ToDo: Вообще все тут удалить (что связано с румбами). Происходят 
    // какие то непонятные преобразования, хотя стоит лишь
    // взять компонент Axis и настроить его под себя. В качестве 
    // примера смотри на 
    // components/AppGraphs/StereoGraphDIR/AxesAndData.tsx

    //---------------------------------------------------------------------------------------
    // making fisher stat
    //---------------------------------------------------------------------------------------

    // ToDo: перейти на использование уже подгтовленных компонентов для графиков, 
    // в частности тут надо использовать Dot
    // в этой директории ищи: components/Sub/Graphs/
    // Использование компонента Dot сразу даст тебе и тултип, и 
    // круг доверия (он опциональный), и в целом единый стиль со всем приложением


    //---------------------------------------------------------------------------------------
    // RETURN
    //---------------------------------------------------------------------------------------
    
    return (
        <div>
        {/* <svg className={styles.graph_interface} ref={svgRef}> */}
        <svg className={styles.graph_interface} ref={svgRef} viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}>
            {/* <InterpretationSetter dataToShow={dataToShow} /> */}
            {/* Градусная сетка */}
            { isGrid && 
                <DegreeGrid
                    viewBoxSize={viewBoxSize}
                    meridianCount={meridianCount}
                    parallelsCount={parallelsCount}
                    meanDir={meanDir}
                    gridColor={gridColor}
                />
            }

            {/* Закраска зоны пересечения кругов */}
            { isVis && 
                <polygon 
                    points={ polygonPoints } 
                    fill={ polyColor } 
                />
            }

            {/* Спиральный грид в зоне пересечения */}
            { isDegreeVisible && gridPointsCentered.map((gridPoints) => (
                <Dot 
                    x={gridPoints[0]} 
                    y={gridPoints[1]} 
                    r={gridRadius}
                    id={'1'} 
                    type={'cac'}
                    annotation={{id: '', label: ''}}
                    fillColor={gridColor}
                    strokeColor={gridColor}
                    strokeWidth={0}
                    settings={dotSettings}
                />
            ))}

            {/* Круги вокруг палеонаправлений */}
            { smallCircles.map((circles) => (
                <Dot 
                    x={circles[0]} 
                    y={circles[1]} 
                    r={circlesRadius}
                    id={'1'} 
                    type={'cac'}
                    annotation={{id: '', label: ''}}
                    fillColor={"black"}
                    strokeColor={"black"}
                    strokeWidth={0}
                    settings={dotSettings}
                />
            ))}  

            {/* Точка max rad */}
            <Dot 
                x={maxRPt[0]} 
                y={maxRPt[1]} 
                r={circlesRadius * 4}
                id={'1'} 
                type={'cac'}
                annotation={{id: '', label: ''}}
                fillColor={"black"}
                strokeColor={"black"}
                strokeWidth={0}
                settings={dotSettings}
            />
     
            <Dot 
                x={maxRPt[0]} 
                y={maxRPt[1]} 
                r={circlesRadius * 2.5}
                id={'1'} 
                type={'cac'}
                annotation={{id: '', label: ''}}
                fillColor={"white"}
                strokeColor={"white"}
                strokeWidth={0}
                settings={dotSettings}
            />
     
            {/* Истинное направление по фишеру (удалю когда сравню результаты) */}
            <Dot 
                x={to_center(meanDir, meanDir)[0]} 
                y={to_center(meanDir, meanDir)[1]} 
                r={fisherRadius}
                id={'1'} 
                type={'cac'}
                annotation={{id: '', label: ''}}
                fillColor={'red'}
                strokeColor={'red'}
                strokeWidth={0}
                settings={dotSettings}
            />

            {/* Круг альфа 95 */}
            <polyline 
                points={ make_coords(PlotCircle([0, 0, 1], alpha95, 90)) } 
                stroke={ "red" }
                fill={'none'}
                strokeWidth={alphaCircleWidth} 
                strokeDasharray={"0.01px, 0.003px"}
            />

            {/* Круг альфа 95
            <polyline 
                points={ make_coords(PlotCircle(maxRPt, 1, 90)) } 
                stroke={ "red" }
                fill={'none'}
                strokeWidth={alphaCircleWidth} 
                strokeDasharray={"0.01px, 0.003px"}
            /> */}

            { degreeGrid.map((line) => (
                <polyline 
                    points={ make_coords(line) } 
                    stroke={ "red" }
                    fill={'none'}
                    strokeWidth={alphaCircleWidth} 
                    strokeDasharray={"0.01px, 0.003px"}
                    scale={scale}
                />
            ))}

            {/* Истинное направление по Хохлову */}
            <Dot 
                x={rotationCenterZone[0]} 
                y={rotationCenterZone[1]} 
                r={centerZoneRadius}
                id={'1'} 
                type={'cac'}
                annotation={{id: '', label: ''}}
                fillColor={centerZoneColor}
                strokeColor={'purple'}
                strokeWidth={0}
                settings={dotSettings}
            />
            {/* <Dot 
                x={centerToBack(rotationCenterZone, meanDir)[0]} 
                y={centerToBack(rotationCenterZone, meanDir)[1]} 
                r={centerZoneRadius}
                id={'1'} 
                type={'cac'}
                annotation={{id: '', label: ''}}
                fillColor={centerZoneColor}
                strokeColor={'purple'}
                strokeWidth={0}
                settings={dotSettings}
            /> */}
            {/* <Ram viewBox={viewBox} /> */}
        </svg>
        </div>
    );
}



    


































