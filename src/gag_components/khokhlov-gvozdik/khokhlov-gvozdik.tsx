import React, { createElement as e, useEffect, useState, useRef } from 'react';
import { ZoomedLambertGraph } from "../ZoomedLambertGraph/ZoomedLambertGraph";
import styles from "./khokhlov-gvozdik.module.scss" 
import CACTable from "../CACTable/CACTable";

import { 
    addInterpretation, 
    setStatisticsMode, 
    showSelectionInput,
  } from '../../services/reducers/dirPage';

import ButtonGroupWithLabel from '../../components/Common/Buttons/ButtonGroupWithLabel/ButtonGroupWithLabel';

import {
    GeoVdek,
    getRandomfloat,
    NormalizeV,
    RotateAroundV,
    angle_between_v,
    fisherStat,
    getRandomInt,
    get_quantiles,
    DekVgeo,
    get_perp,
    GridVdek,
    centering,
} from "../gag_functions";

import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';  
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useMediaQuery } from 'react-responsive';
import CACResTable from '../CACTable/CACResTable';
import { DataGridDIRFromDIRRow, IDirData } from "../../../src/utils/GlobalTypes";
import CACGraphButton from '../CACToolDIR/CACGraphButton';
import CACFishGraph from '../CACFishGraph/CACFishGraph';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { useTheme } from '@mui/material/styles';
import { setCurrentDIRid } from '../../services/reducers/parsedData';
import InterpretationSetter from '../../../src/pages/DIRPage/InterpretationSetter';

import { 
    setDirList,
    setAngleList,
    setMeanDir,
    setAlpha95,
    setDirNumber,
    setZoneSquare,
    setProbability,
    setIsCACGraphVisible,
} from '../../services/reducers/cacParams';

import ChooseParameters from './chooseParameters';

export function Khokhlov_Gvozdik() {

    const { 
        centerZone,
        gridPoints,
        selectedD,
        selectedP,
        selectedNumber,
        PCaPCString,
        apc,
        dirList,
        angleList,
        meanDir,
        alpha95,
        dirNumber,  
        zoneSquare,
        probability,
        isCACGraphVisible,
        isGrid,
        isDegreeVisible,
        isVis,

    } = useAppSelector(state => state.cacParamsReducer);

        const [alpha95Square, setAlpha95Square] = useState<number>(0);
        const [dataToShow, setDataToShow] = useState<IDirData | null>(null);
        let [stepList, setStepList] = useState<number[] | undefined >([]);
	    const [RZ, setRZ] = useState<number>(999);

    const outsideVariable = selectedNumber;
    var points_numb = outsideVariable;

    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

    //---------------------------------------------------------------------------------------
    // Interface
    //---------------------------------------------------------------------------------------




    const [selectedButton, setSelectedButton] = useState<string | null>(null);

    const handleButtonSelection = (mode: string) => {
        if (mode === 'Fisher' && !isCACGraphVisible) {
            setSelectedButton(mode);
            dispatch(setIsCACGraphVisible(true));
        } else if (mode === 'CAC' && isCACGraphVisible) {
            setSelectedButton(mode);
            dispatch(setIsCACGraphVisible(false));
        }
    };

    useEffect(() => {
        var quantiles = get_quantiles(selectedD, apc, selectedP);
        // setQuantiles(quantiles);

        var new_ang_list = [];
        
        if (stepList != undefined){
            for ( var i = 0; i < dirNumber; i ++ ) {
                new_ang_list.push(quantiles[stepList[i] - 3]);
            }
            dispatch(setAngleList(new_ang_list));
        }
    }, [selectedD, apc, selectedP, dirNumber, stepList]);

    stepList = dataToShow?.interpretations.map(interpretation => interpretation.stepCount);

    let igeoList: number[] | undefined = dataToShow?.interpretations.map(interpretation => interpretation.Igeo);
    let dgeoList: number[] | undefined = dataToShow?.interpretations.map(interpretation => interpretation.Dgeo);
    let idList: number[] | undefined = dataToShow?.interpretations.map(interpretation => interpretation.id);
    
    let paleo_data: number[] = [];
    
    //---------------------------------------------------------------------------------------
    // Ванин код из DIRTable
    //---------------------------------------------------------------------------------------
    
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const widthLessThan720 = useMediaQuery({ maxWidth: 719 });
    const heightLessThan560 = useMediaQuery({ maxHeight: 559 });
    const unsupportedResolution = widthLessThan720 || heightLessThan560;
  
    let { dirStatData, currentDataDIRid } = useAppSelector(state => state.parsedDataReducer);
    const { hiddenDirectionsIDs } = useAppSelector(state => state.dirPageReducer);


    useEffect(() => {
      if (dirStatData && dirStatData.length > 0) {
        if (!currentDataDIRid) {
          dispatch(setCurrentDIRid(0));
        }
        const dirID = currentDataDIRid || 0;
        let interpretationToUpdate = { ...dirStatData[dirID] };
        const output = interpretationToUpdate && interpretationToUpdate.interpretations ? interpretationToUpdate.interpretations.map((direction, index) => {

            return {
                ...direction, 
                lat: isNaN(RZ) ? null : DekVgeo(center_zone)[0], 
                lon: isNaN(RZ) ? null : DekVgeo(center_zone)[1],

                RZ:RZ, 
                alpha95:alpha95, 
                alpha95Square:alpha95Square, 
                zoneSquare:zoneSquare, 
                
                PCaPC:PCaPCString, 
                q:selectedP, 
                selectedD:selectedD, 
                gridN:selectedNumber,
                probability:probability
            };
          
        }) : [];
        interpretationToUpdate.interpretations = output;
        setDataToShow(interpretationToUpdate);
      } else setDataToShow(null);

    }, [
        dirStatData, 
        currentDataDIRid, 
        hiddenDirectionsIDs, 
        selectedP, 
        selectedD, 
        PCaPCString, 
        selectedP, 
        selectedNumber, 
        alpha95,
        RZ
    ]);

    useEffect(() => {
      if (!dataToShow) setShowUploadModal(true);
      else setShowUploadModal(false);
    }, [dataToShow]);


    const { 
        statisticsMode, 
        selectedDirectionsIDs, 
        reversedDirectionsIDs,
        currentFileInterpretations,
        allInterpretations
    } = useAppSelector(state => state.dirPageReducer);

    const getData = () => {
        
        let dirNumber = 0;
        let dirList: [number, number, number][] = [];

        if (igeoList != undefined && dgeoList != undefined && idList != undefined){

            dirNumber = igeoList.length;

            for ( var i = 0; i < igeoList.length; i ++ ) {   
                
                if (selectedDirectionsIDs != null){
                    for ( var j = 0; j < selectedDirectionsIDs.length; j ++ ) { 
                        if (idList[i] == selectedDirectionsIDs[j]){
                            paleo_data = NormalizeV(GeoVdek(igeoList[i], dgeoList[i]));
                            // НУЖНО ЛИ НОРМАЛИЗОВЫВАТЬ???
                            dirList.push([paleo_data[0], paleo_data[1], paleo_data[2]]);
                        }
                    }
                }

            }
        }
        dispatch(setDirList(dirList));
        

        setStepList(stepList);
        dispatch(setDirNumber(dirNumber));
        dispatch(setAngleList([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        dispatch(setMeanDir(fisherStat(dirList)[0]));
        dispatch(setZoneSquare(2 * Math.PI * (1 - Math.cos(RZ * Math.PI / 180))));
        dispatch(setStatisticsMode('fisher'));
        dispatch(setProbability(Math.pow(selectedP / 1000, dirList.length)));

        dispatch(setDirList(centering(dirList, meanDir)));
    };

    //-----------------------------------------------------------------------
    // fisher stat
    //-----------------------------------------------------------------------

    useEffect(() => {
        let a95:number = fisherStat(dirList)[1];
        dispatch(setAlpha95(a95));
        setAlpha95Square( 2 * Math.PI * (1 - Math.cos(a95 * Math.PI / 180)));

        // setMeanDir(fisherStat(dirList)[0]);

    }, [dirList]);

    //-----------------------------------------------------------------------
    // making grid dots
    //-----------------------------------------------------------------------
    
    var x;
    var y;
    var m;
    var grid_points = [];

    var print_point = 0;
    var print_point = 0;

    var phi = 0.013;
    
    for (var i = 0; i < points_numb; i++)
    {
        x = (i * phi - Math.round(i * phi)) * 360;
        y = (i / points_numb - Math.round(i / points_numb)) * 360;

        m = GridVdek(x, y);

        for (var j = 0; j < dirList.length; j++ )
        {
            if (angle_between_v(dirList[j], m) < angleList[j] * Math.PI / 180)
            {
                print_point = 1;
            }
            else { print_point = 0; break; }
        }
        if (print_point == 1)
        {
            grid_points.push(m);

        }
        print_point = 0;
    }

    //---------------------------------------------------------------------------------------
    // center zone calc
    //---------------------------------------------------------------------------------------

    var center_zone = [0,0,0];

    for (var i = 0; i < grid_points.length; i++)
    {
        center_zone[0] += grid_points[i][0];
        center_zone[1] += grid_points[i][1];
        center_zone[2] += grid_points[i][2];
    }
    center_zone = NormalizeV(center_zone);


    //---------------------------------------------------------------------------------------
    // Download picture
    //---------------------------------------------------------------------------------------

    const svgRef = useRef<SVGSVGElement>(null);

    const handleDownloadSVG = () => {
      if (svgRef.current) {
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
  
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
  
    useEffect(() => {
        let svgElement = svgRef.current;
    
        const handleWheel = (event: WheelEvent) => {
          event.preventDefault();
          const scaleAmount = event.deltaY > 0 ? 0.9 : 1.1; // Уменьшаем масштаб при прокрутке вниз, увеличиваем - при прокрутке вверх
          if (svgElement) {
            const point = svgElement.createSVGPoint();
            point.x = 0;
            point.y = 0;
    
            const ctm = svgElement.getScreenCTM();
            if (ctm) {
              const invertedPoint = point.matrixTransform(ctm.inverse());
              const oldScale = 1;
              const newScale = oldScale * scaleAmount;
    
              const dx = (point.x - svgElement.viewBox.baseVal.width / 2) * (1 - scaleAmount);
              const dy = (point.y - svgElement.viewBox.baseVal.height / 2) * (1 - scaleAmount);
    
              svgElement.setAttribute('viewBox', `${svgElement.viewBox.baseVal.x - dx} ${svgElement.viewBox.baseVal.y - dy} ${svgElement.viewBox.baseVal.width * newScale} ${svgElement.viewBox.baseVal.height * newScale}`);
            //   svgElement.setAttribute('viewBox', `${0} ${0} ${1} ${1}`);
            //   svgElement.setAttribute('viewBox', '0 0 1 1');
            }
          }
        };
    
        if (svgElement) {
          svgElement.addEventListener('wheel', handleWheel, { passive: false });
        }
    
        return () => {
          if (svgElement) {
            svgElement.removeEventListener('wheel', handleWheel);
          }
        };
      }, [svgRef, isCACGraphVisible]);

    return (
        <div className={`${styles.main_container} ${theme.palette.mode == 'dark' ? styles.dark : ''}`}>

            <h3 className={styles.lowScreen}>Размер окна должен быть не меньше чем 720x560</h3>

            {isCACGraphVisible ? (

                <div className={styles.graph_container + ' ' + styles.commonContainer}>
                    <CACFishGraph dataToShow={dataToShow}/>     
                </div>

            ) : (

                <div className={styles.graph_container + ' ' + styles.commonContainer}>
                            
                    <div className={styles.interfaceTooltip}>

                        <HelpCenterOutlinedIcon className={styles.question}/>
                        <FileDownloadOutlinedIcon onClick={handleDownloadSVG} className={styles.question}/>
                        
                    </div>
                        <ZoomedLambertGraph
                            centerZone={center_zone}
                            gridPoints={grid_points}
                            // gridColor={grid_color}
                            // polygonColor={poly_color}
                            setRZ={setRZ}
                            svgRef={svgRef}
                        />
                
                </div>
            )}

            <div className={styles.cac_fish_container + ' ' + styles.commonContainer}>

                <ButtonGroupWithLabel label={'Change show mode'}>
                    <CACGraphButton mode='CAC' changeGraph={() => handleButtonSelection('CAC')}/>
                    <CACGraphButton mode='Fisher' changeGraph={() => handleButtonSelection('Fisher')}/>
                </ButtonGroupWithLabel>
                
                <InterpretationSetter dataToShow={dataToShow} />

            </div>        

            <CACTable dataToShow={dataToShow}/> 

            <CACResTable dataToShow={dataToShow}/>  
            

            <div className={styles.container + ' ' + styles.commonContainer}>

                <div className={styles.interfaceTooltip}>
                    <HelpCenterOutlinedIcon className={styles.question}/>
                </div>

                <div className={styles.interface}>
                    <ChooseParameters />
                    <div className={styles.buttonItem + ' ' + styles.item}>
                        {isCACGraphVisible ? (
                            <></>
                        ) : (
                            <button className={styles.button} onClick={getData}>Calculate results</button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}






// TODO 

// зум не работает после переключения на fisher mode
// сетку отладить
// подпись кто выпустил и благодарности

// экспорт таблицы результатов

// подписи штрихов сетки в полярной области слишком близко


// в деплое вылет при расчетах без первой строчки

// почисти код
// анимация фишер/cac

// fix zoom graph 

// del cac reducer
// select points dont work on fisher view
// fix size of fisher graph
// button on main window
// tooltips

// eng language


// mouse zone select of points don`t work
// drag on dot turn on random point. del it
