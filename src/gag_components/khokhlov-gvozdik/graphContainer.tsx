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
    const [scale, setScale] = useState(1);
    const [viewBox, setViewBox] = useState({ x: -0.5, y: -0.5, width: 1, height: 1 });

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


    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const scaleAmount = event.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.5, Math.min(5, scale * scaleAmount));

        const centerX = viewBox.x + viewBox.width / 2;
        const centerY = viewBox.y + viewBox.height / 2;
        const newWidth = viewBox.width * scaleAmount;
        const newHeight = viewBox.height * scaleAmount;

        setScale(newScale);
        setViewBox({
            x: centerX - newWidth / 2,
            y: centerY - newHeight / 2,
            width: newWidth,
            height: newHeight,
        });
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
    }, [scale, viewBox]);

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
                viewBox={viewBox}
                scale={scale}
            />
        </div>
    )
}

