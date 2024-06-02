import React, { createElement as e, useEffect, useState, useRef } from 'react';
import { ZoomedLambertGraph } from "../ZoomedLambertGraph/ZoomedLambertGraph";
import styles from "./khokhlov-gvozdik.module.scss" 
import { Footer, NavPanel } from "../../components/MainPage";
import CACTable from "../CACTable/CACTable";
// import {CACResultTable} from "../CACResultTableTest/CACResultTable";

import Tables from '../../pages/DIRPage/Tables';
import Graphs from '../../pages/DIRPage/Graphs';


// import { IDirData } from '../../utils/GlobalTypes';

import { filesToData } from '../../services/axios/filesAndData';
import { 
    addInterpretation, 
    setStatisticsMode, 
    showSelectionInput,
  } from '../../services/reducers/dirPage';
import calculateStatisticsDIR from '../../utils/statistics/calculateStatisticsDIR';

import StatModeButton from '../../components/AppLogic/ToolsDIR/StatModeButton';
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
    GridVdek
   
    } from "../gag_functions";

import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';
import Tooltip from '@mui/material/Tooltip';   
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useMediaQuery } from 'react-responsive';
import CACResTable from '../CACTable/CACResTable';
import Direction from "../../../src/utils/graphs/classes/Direction";
import { DataGridDIRFromDIRRow, IDirData } from "../../../src/utils/GlobalTypes";
import selectedRows from '../CACTable/CACDataTable';
import CACGraphButton from '../CACToolDIR/CACGraphButton';
import CACFishGraph from '../CACFishGraph/CACFishGraph';
import CACToolDIR from '../CACToolDIR/CACToolDIR';


    import { useAppDispatch, useAppSelector } from '../../services/store/hooks';

    import { ToolsDIR } from '../../components/AppLogic';
    import { useTheme } from '@mui/material/styles';
    import { bgColorMain } from '../../utils/ThemeConstants';
    import ModalWrapper from '../../components/Common/Modal/ModalWrapper';
    import UploadModal from '../../components/Common/Modal/UploadModal/UploadModal';

    import { setCurrentDIRid } from '../../services/reducers/parsedData';
    import InterpretationSetter from '../../../src/pages/DIRPage/InterpretationSetter';

    import { Button, Typography } from '@mui/material';

    import { setColorMode } from "../../services/reducers/appSettings";

    import { StatisticsModeDIR } from '../../../src/utils/graphs/types';


export function Khokhlov_Gvozdik() {


    const [selectedNumber, setSelectedNumber] = useState<number>(10000);

    const [alpha95, setAlpha95] = useState<number>(0);
    const [alpha95Square, setAlpha95Square] = useState<number>(0);
    const [zoneSquare, setZoneSquare] = useState<number>(0);
    const [probability, setProbability] = useState<number>(0);
    const [sred_dir, setSredDir] = useState<number[]>([0,0,1]);



    //-----------------------------------------------------------
    // input data generating
    //-----------------------------------------------------------
    const [dataToShow, setDataToShow] = useState<IDirData | null>(null);

    let [step_list, setStepList] = useState<number[] | undefined >([]);

    const [dir_list, setDirList] = useState<[number, number, number][]>([]);



    const [dir_number, setDirNumb] = useState<number>(0);

    const [apc, setSelectedAPC] = useState<number>(0);

    const [PCaPCString, setPCaPC] = useState<string>('PC');


    const [selectedP, setSelectedP] = useState<number>(990);
    const [selectedD, setSelectedD] = useState<number>(10);


    const [quantiles, setQuantiles] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

	const [angle_list, setAngleList] = useState<number[]>([]);

	const [RZ, setRZ] = useState<number>(999);




    useEffect(() => {
        var quantiles = get_quantiles(selectedD, apc, selectedP);
        setQuantiles(quantiles);

        var new_ang_list = [];
        
        if (step_list != undefined){
            for ( var i = 0; i < dir_number; i ++ ) {
                new_ang_list.push(quantiles[step_list[i] - 3]);
            }
            setAngleList(new_ang_list);
        }

        
    }, [selectedD, apc, selectedP, dir_number, step_list]);


    const handleDChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const number = parseInt(event.target.value);
        setSelectedD(number);
    };


    const handlePChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const number = parseInt(event.target.value);
        setSelectedP(number);
    };


    const handleAPCChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const number = parseInt(event.target.value);
        setSelectedAPC(number);

        
        if (number == 0.0) {
            setPCaPC('PC');
        }
        else {
            setPCaPC('aPC');
        }
    };

    const [selectedRows, setSelectedRows] = useState<Array<DataGridDIRFromDIRRow>>([]);

    step_list = dataToShow?.interpretations.map(interpretation => interpretation.stepCount);

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
  

    

    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  
    useEffect(() => {
      if (dirStatData && dirStatData.length > 0) {
        if (!currentDataDIRid) {
          dispatch(setCurrentDIRid(0));
        }

        const dirID = currentDataDIRid || 0;
          
        let interpretationToUpdate = { ...dirStatData[dirID] };


        const output = interpretationToUpdate && interpretationToUpdate.interpretations ? interpretationToUpdate.interpretations.map((direction, index) => {

        // const output = interpretationToUpdate.interpretations.map((direction, index) => {

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



        console.log('gkhkhkhkhkhkh');
        console.log(interpretationToUpdate);

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
    console.log('RZ');
    console.log(RZ);
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
        

        let dir_number = 0;
        let dir_list: [number, number, number][] = [];


        if (igeoList != undefined && dgeoList != undefined && idList != undefined){

            dir_number = igeoList.length;

            for ( var i = 0; i < igeoList.length; i ++ ) {   
                
                if (selectedDirectionsIDs != null){
                    for ( var j = 0; j < selectedDirectionsIDs.length; j ++ ) { 
                        if (idList[i] == selectedDirectionsIDs[j]){

                            paleo_data = NormalizeV(GeoVdek(igeoList[i], dgeoList[i]));

                            // НУЖНО ЛИ НОРМАЛИЗОВЫВАТЬ???
                            dir_list.push([paleo_data[0], paleo_data[1], paleo_data[2]]);

                            
                        }
                    }
                }

            }
        }

        setDirList(dir_list);
        setStepList(step_list);
        setDirNumb(dir_number);
        setAngleList([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

        setSredDir(fisherStat(dir_list)[0]);

        setZoneSquare(2 * Math.PI * (1 - Math.cos(RZ * Math.PI / 180)));

        dispatch(setStatisticsMode('fisher'));

        setProbability(Math.pow(selectedP / 1000, dir_list.length));


    };

    const [isvis, setIsVisible] = useState(true);
    const handleCheckboxChange = () => {
        setIsVisible(!isvis);
    };


    const [isvisgrid, setisvisgrid] = useState(false);
    const gridCheckboxChange = () => {
        setisvisgrid(!isvisgrid);
    };
    

    const handleNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const number = parseInt(event.target.value);
        setSelectedNumber(number);
    };

    const outsideVariable = selectedNumber;
    var points_numb = outsideVariable;

    const [degree_grid_isvis, setDegree] = useState(true);
    const degreeCheckboxChange = () => {
        setDegree(!degree_grid_isvis);
    };

    //-----------------------------------------------------------------------
    // fisher stat
    //-----------------------------------------------------------------------

    useEffect(() => {
        let a95:number = fisherStat(dir_list)[1];
        setAlpha95(a95);
        setAlpha95Square( 2 * Math.PI * (1 - Math.cos(a95 * Math.PI / 180)));

        // setSredDir(fisherStat(dir_list)[0]);

    }, [dir_list]);

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


        for (var j = 0; j < dir_list.length; j++ )
        {
            if (angle_between_v(dir_list[j], m) < angle_list[j] * Math.PI / 180)
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
    // Interface
    //---------------------------------------------------------------------------------------

    var poly_color = "#AAE1BF";
    var grid_color = '#16732f';

    var poly_color = "#5badff";
    var grid_color = '#1975d2';



    // Choce fisher or cac
    const [isCACGraphVisible, setIsCACGraphVisible] = useState<boolean>(false);

    const toggleCACGraphVisibility = () => {
      setIsCACGraphVisible((prev) => !prev);
    };


    const [selectedButton, setSelectedButton] = useState<string | null>(null);

    const handleButtonSelection = (mode: string) => {
        if (mode === 'Fisher' && !isCACGraphVisible) {
            setSelectedButton(mode);
            setIsCACGraphVisible(true);
        } else if (mode === 'CAC' && isCACGraphVisible) {
            setSelectedButton(mode);
            setIsCACGraphVisible(false);
        }
    };

    // choice debug or result

    
    const [isCACDebugVisible, setIsCACDebugVisible] = useState<boolean>(true);

    const toggleCACDebugVisibility = () => {
      setIsCACDebugVisible((prev) => !prev);
    };

    const [selectedDebugButton, setSelectedDebugButton] = useState<string | null>(null);
    // here you can add result debug change button animation
    const handleDebugButtonSelection = (mode: string) => {
        if (mode === 'result' && !isCACDebugVisible) {
            setSelectedDebugButton(mode);
            setIsCACDebugVisible(true);
        } else if (mode === 'debug' && isCACDebugVisible) {
            setSelectedDebugButton(mode);
            setIsCACDebugVisible(false);
        }
    };


    //---------------------------------------------------------------------------------------
    // Dark theme
    //---------------------------------------------------------------------------------------

    
    let isDarkTheme = false;
    if (theme.palette.mode == 'dark'){
        isDarkTheme = false;
    }
    else {
        isDarkTheme = true;
    }

    const [isDarkMode, setIsDarkMode] = useState(isDarkTheme); //  false - светлая тема по умолчанию

    const toggleTheme = () => {

        if (theme.palette.mode == 'dark'){
            setIsDarkMode(true);
        }
        else {
            setIsDarkMode(false);
        }
      
    };


    useEffect(() => {

        toggleTheme();
    }, [theme.palette.mode]);
    

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


    return (
        <div className={`${styles.main_container} ${isDarkMode ? styles.dark : ''}`}>

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
                            dirList={dir_list}
                            angleList={angle_list}
                            gridPoints={grid_points}
                            meanDir={sred_dir}
                            alpha95={alpha95}
                            gridColor={grid_color}
                            polygonColor={poly_color}
                            showGrid={isvisgrid}
                            showDegreeGrid={degree_grid_isvis}
                            showPolygon={isvis}
                            setRZ={setRZ}
                            // handleDownload={handleDownloadSVG}
                            svgRef={svgRef}
                        />
                
                </div>

            )}


            <div className={styles.cac_fish_container + ' ' + styles.commonContainer}>

                <ButtonGroupWithLabel label={'Change show mode'}>
                    <CACGraphButton mode='CAC' changeGraph={() => handleButtonSelection('CAC')}/>
                    <CACGraphButton mode='Fisher' changeGraph={() => handleButtonSelection('Fisher')}/>
                </ButtonGroupWithLabel>

                {/* <ModalWrapper
                    open={showUploadModal}
                    setOpen={setShowUploadModal}
                    size={{width: '60vw', height: widthLessThan720 ? 'fit-content' : '60vh'}}
                    showBottomClose
                >

                <UploadModal page='cac' />

                </ModalWrapper> */}
                
                <InterpretationSetter dataToShow={dataToShow} />

            </div>        

            <CACTable dataToShow={dataToShow}/> 

            <CACResTable dataToShow={dataToShow}/>  
                        
            <div className={styles.container + ' ' + styles.commonContainer}>

                <div className={styles.interfaceTooltip}>
                    <HelpCenterOutlinedIcon className={styles.question}/>
                </div>

                <div className={styles.interface}>
                    <select className={styles.select1Item + ' ' + styles.item + ' ' + styles.my_select} value={selectedNumber} onChange={handleNumberChange}>
                        <option value={10000}>N = 10 000</option>
                        <option value={50000}>N = 50 000</option>
                        <option value={100000}>N = 100 000</option>
                        <option value={250000}>N = 250 000</option>
                        <option value={500000}>N = 500 000</option>
                        <option value={1000000}>N = 1 000 000</option>
                    </select>
                    
                    <select className={styles.select2Item + ' ' + styles.item + ' ' + styles.my_select} value={selectedD} onChange={handleDChange}>
                        <option value={10}>d = 10</option>
                        <option value={5}>d = 5</option>
                    </select>

                    <select className={styles.select3Item + ' ' + styles.item + ' ' + styles.my_select} value={selectedP} onChange={handlePChange}>
                        <option value={950}>quantile = 0.950</option>
                        <option value={975}>quantile = 0.975</option>
                        <option value={990}>quantile = 0.99</option>
                    </select>

                    <select className={styles.select4Item + ' ' + styles.item + ' ' + styles.my_select} value={apc} onChange={handleAPCChange}>
                        <option className={styles.selectOption} value={1}>aPC</option>
                        <option className={styles.selectOption} value={0}>PC</option>
                    </select>

                    <div className={styles.buttonItem + ' ' + styles.item}>
                        
                        {isCACGraphVisible ? (
                            <></>
                        ) : (
                            <button className={styles.button} onClick={getData}>Calculate results</button>
                        )}

                    </div>

                    <div className={styles.infoItem1}>
                        <label className={styles.my_input}><div className={styles.info}>Show zone</div>
                            <input type="checkbox" checked={isvis} onChange={handleCheckboxChange}/>
                            <span className={styles.checkmark}></span>
                        </label>
                    </div>

                    <div className={styles.infoItem2}>
                        <label className={styles.my_input}><div className={styles.info}>Show grid</div>
                            <input type="checkbox" checked={isvisgrid} onChange={gridCheckboxChange}/>
                            <span className={styles.checkmark}></span>
                        </label>
                    </div>

                    <div className={styles.infoItem3}>
                        <label className={styles.my_input}><div className={styles.info}>show degree grid</div>
                            <input type="checkbox" checked={degree_grid_isvis} onChange={degreeCheckboxChange}/>
                            <span className={styles.checkmark}></span>
                        </label>
                    </div>

                    <div className={styles.chooseButtonItem}>

                    </div>

                </div>
            </div>
        </div>
    );
}


