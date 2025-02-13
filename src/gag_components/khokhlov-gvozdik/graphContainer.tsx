import styles from "./khokhlov-gvozdik.module.scss" 
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';  
import { ZoomedLambertGraph } from "../ZoomedLambertGraph/ZoomedLambertGraph";
import { generateGrid, calculateCenterZone } from "./gridCalculation";
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import React, { createElement as e, useEffect, useState, useRef } from 'react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { setRZ, setScale, setViewBox, setSvgRef } from '../../services/reducers/cacParams';

export function GraphContainer() {

    const { 
        centerZone,
        gridPoints,
        isCACGraphVisible,
        scale, 
        viewBox,
        // svgRef
    } = useAppSelector(state => state.cacParamsReducer);

    //---------------------------------------------------------------------------------------
    // Download picture
    //---------------------------------------------------------------------------------------

    // const svgRef = useRef<SVGSVGElement>(null);
    // const dispatch = useAppDispatch();

    // const handleWheel = (event: WheelEvent) => {
    //     event.preventDefault();
    //     const scaleAmount = event.deltaY > 0 ? 0.9 : 1.1;
    //     const newScale = Math.max(0.5, Math.min(5, scale * scaleAmount));

    //     const centerX = viewBox.x + viewBox.width / 2;
    //     const centerY = viewBox.y + viewBox.height / 2;
    //     const newWidth = viewBox.width * scaleAmount;
    //     const newHeight = viewBox.height * scaleAmount;

    //     dispatch(setScale(newScale));
    //     dispatch(setViewBox({
    //         x: centerX - newWidth / 2,
    //         y: centerY - newHeight / 2,
    //         width: newWidth,
    //         height: newHeight,
    //     }));
    // };



    // useEffect(() => {
    //     let svgElement = svgRef.current;
    //     if (svgElement) {
    //         svgElement.addEventListener('wheel', handleWheel, { passive: false });
    //     }
    //     return () => {
    //         if (svgElement) {
    //             svgElement.removeEventListener('wheel', handleWheel);
    //         }
    //     };
    // }, [scale, viewBox]);

    const svgRef = useRef<SVGSVGElement>(null);
    const dispatch = useAppDispatch();

    const [viewBox4Props, setViewBox4Props] = useState<{ x: number; y: number; width: number; height: number }>(
        { x: -0.5, y: -0.5, width: 1, height: 1 }
    );


    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const scaleAmount = event.deltaY > 0 ? 0.9 : 1.1;

        const svgElement = svgRef.current;
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

                let newViewBox = {
                    x: svgElement.viewBox.baseVal.x - dx,
                    y: svgElement.viewBox.baseVal.y - dy,
                    width: svgElement.viewBox.baseVal.width * newScale,
                    height: svgElement.viewBox.baseVal.height * newScale,
                }

                svgElement.setAttribute(
                    'viewBox',
                    `${newViewBox.x} ${newViewBox.y} ${newViewBox.height} ${newViewBox.width}`
                );

                // dispatch(setViewBox(newViewBox));
                setViewBox4Props(newViewBox);

            }
        }
    };

    useEffect(() => {
        const svgElement = svgRef.current;
        if (svgElement) {
            svgElement.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (svgElement) {
                svgElement.removeEventListener('wheel', handleWheel);
            }
        };
    }, []); 



    

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



    return (
        <div className={styles.graph_container + ' ' + styles.commonContainer}>
                    
            <div className={styles.interfaceTooltip}>
                <HelpCenterOutlinedIcon className={styles.question}/>
                <FileDownloadOutlinedIcon onClick={handleDownloadSVG} className={styles.question}/>
            </div>

            <ZoomedLambertGraph
                centerZone={centerZone}
                gridPoints={gridPoints}
                svgRef={svgRef}
                viewBox={viewBox4Props}
            />
        </div>
    )
}

