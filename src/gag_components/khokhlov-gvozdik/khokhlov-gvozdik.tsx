import React, { createElement as e, useEffect, useState, useRef } from 'react';
import styles from "./khokhlov-gvozdik.module.scss" 
import CACTable from "../CACTable/CACTable";
import {GraphContainer} from "./graphContainer";
import {Calculations} from "./calculations";
import { setStatisticsMode } from '../../services/reducers/dirPage';
import ButtonGroupWithLabel from '../../components/Common/Buttons/ButtonGroupWithLabel/ButtonGroupWithLabel';
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';  
import { useMediaQuery } from 'react-responsive';
import CACResTable from '../CACTable/CACResTable';
import { DataGridDIRFromDIRRow, IDirData } from "../../../src/utils/GlobalTypes";
import CACGraphButton from '../CACToolDIR/CACGraphButton';
import CACFishGraph from '../CACFishGraph/CACFishGraph';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { useTheme } from '@mui/material/styles';
import { setCurrentDIRid } from '../../services/reducers/parsedData';
import InterpretationSetter from '../../../src/pages/DIRPage/InterpretationSetter';
import ChooseParameters from './chooseParameters';

import { 
    setDirList,
    setAngleList,
    setMeanDir,
    setDirNumber,
    setZoneSquare,
    setProbability,
    setIsCACGraphVisible, setStepList
} from '../../services/reducers/cacParams';

import {
    GeoVdek,
    NormalizeV,
    fisherStat,
    get_quantiles,
    DekVgeo,
} from "../gag_functions";

export function Khokhlov_Gvozdik() {
    const dispatch = useAppDispatch();
    const { 
        centerZone,
        selectedD,
        selectedP,
        selectedNumber,
        PCaPCString,
        apc,
        alpha95,
        dirNumber,  
        zoneSquare,
        probability,
        isCACGraphVisible,
        RZ,
        alpha95Square, 
        stepList
    } = useAppSelector(state => state.cacParamsReducer);

    const [dataToShow, setDataToShow] = useState<IDirData | null>(null);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

    //---------------------------------------------------------------------------------------
    // Interface
    //---------------------------------------------------------------------------------------

    useEffect(() => {
        if (dataToShow?.interpretations) {
            const steps = dataToShow.interpretations.map(interpretation => interpretation.stepCount);
            dispatch(setStepList(steps || [])); 
        }
    }, [dataToShow, dispatch]); 

    let igeoList: number[] | undefined = dataToShow?.interpretations.map(interpretation => interpretation.Igeo);
    let dgeoList: number[] | undefined = dataToShow?.interpretations.map(interpretation => interpretation.Dgeo);
    let idList: number[] | undefined = dataToShow?.interpretations.map(interpretation => interpretation.id);
    let paleo_data: number[] = [];

    useEffect(() => {
        if (!dataToShow) setShowUploadModal(true);
        else setShowUploadModal(false);
    }, [dataToShow]);

    const { selectedDirectionsIDs } = useAppSelector(state => state.dirPageReducer);

    const getData = () => {
        
        let dirNumber = 0;
        let dirList: [number, number, number][] = [];

        if (igeoList != undefined && dgeoList != undefined && idList != undefined){

            dirNumber = igeoList.length;

            for ( let i = 0; i < igeoList.length; i ++ ) {   
                
                if (selectedDirectionsIDs != null){
                    for ( let j = 0; j < selectedDirectionsIDs.length; j ++ ) { 
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
        dispatch(setStepList(stepList));
        dispatch(setDirNumber(dirNumber));
        dispatch(setAngleList([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        dispatch(setMeanDir(fisherStat(dirList)[0]));
        dispatch(setZoneSquare(2 * Math.PI * (1 - Math.cos(RZ * Math.PI / 180))));
        dispatch(setStatisticsMode('fisher'));
        dispatch(setProbability(Math.pow(selectedP / 1000, dirList.length)));
    };

    //---------------------------------------------------------------------------------------
    // Ванин код из DIRTable
    //---------------------------------------------------------------------------------------
    
    const theme = useTheme();
    
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
                lat: isNaN(RZ) ? null : DekVgeo(centerZone)[0], 
                lon: isNaN(RZ) ? null : DekVgeo(centerZone)[1],
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

    return (
        <div className={`${styles.main_container} ${theme.palette.mode == 'dark' ? styles.dark : ''}`}>
            <Calculations />
            <h3 className={styles.lowScreen}>Размер окна должен быть не меньше чем 720x560</h3>

            {isCACGraphVisible ? (

                <div className={styles.graph_container + ' ' + styles.commonContainer}>
                    <CACFishGraph dataToShow={dataToShow}/>     
                </div>

            ) : (
                <GraphContainer />
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








  

    



