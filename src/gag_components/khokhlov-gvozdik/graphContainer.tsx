import styles from "./khokhlov-gvozdik.module.scss" 
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';  
import { ZoomedLambertGraph } from "../ZoomedLambertGraph/ZoomedLambertGraph";
import { generateGrid, calculateCenterZone } from "./gridCalculation";
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import React, { createElement as e, useEffect, useState, useRef } from 'react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

export function GraphContainer() {

    const { 
        centerZone,
        gridPoints,
        isCACGraphVisible,
    } = useAppSelector(state => state.cacParamsReducer);

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
        <div className={styles.graph_container + ' ' + styles.commonContainer}>
                    
            <div className={styles.interfaceTooltip}>
                <HelpCenterOutlinedIcon className={styles.question}/>
                <FileDownloadOutlinedIcon onClick={handleDownloadSVG} className={styles.question}/>
            </div>

            <ZoomedLambertGraph
                centerZone={centerZone}
                gridPoints={gridPoints}
                // gridColor={grid_color}
                // polygonColor={poly_color}
                svgRef={svgRef}
            />
        </div>
    )
}

