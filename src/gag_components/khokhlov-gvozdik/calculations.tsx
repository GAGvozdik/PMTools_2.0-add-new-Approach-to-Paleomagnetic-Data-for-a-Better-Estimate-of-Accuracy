import styles from "./khokhlov-gvozdik.module.scss" 
import { generateGrid, calculateCenterZone } from "./gridCalculation";
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import React, { createElement as e, useEffect, useState, useRef } from 'react';
import { fisherStat, get_quantiles } from "../gag_functions";
import { 
    setAlpha95,
    setGridPoints,
    setCenterZone,
    setAlpha95Square,
    setAngleList
} from '../../services/reducers/cacParams';

export function Calculations() {

    const dispatch = useAppDispatch();
    const { 
        selectedD,
        selectedP,
        selectedNumber,
        dirList,
        angleList,
        apc,
        dirNumber,  
        stepList
    } = useAppSelector(state => state.cacParamsReducer);
    //-----------------------------------------------------------------------
    // fisher stat
    //-----------------------------------------------------------------------

    useEffect(() => {
        if (dirList.length > 0) {
            let a95: number = fisherStat(dirList)[1];
            dispatch(setAlpha95(a95));
            dispatch(setAlpha95Square(2 * Math.PI * (1 - Math.cos(a95 * Math.PI / 180))));
            console.log('a95 = ', a95)
        }
    }, [dirList]);

    //-----------------------------------------------------------------------
    // Grid Points & Center Zone Calculation
    //-----------------------------------------------------------------------

    useEffect(() => {
        if (dirList.length > 0 && angleList.length > 0) {
            const newGridPoints = generateGrid(selectedNumber, dirList, angleList);
            dispatch(setGridPoints(newGridPoints));

            const newCenterZone = calculateCenterZone(newGridPoints);
            dispatch(setCenterZone(newCenterZone));
        }
    }, [selectedNumber, dirList, angleList, dispatch]); // Зависимости

    //-----------------------------------------------------------------------
    // 
    //-----------------------------------------------------------------------
    useEffect(() => {
        if (stepList && stepList.length > 0) { // ✅ Проверяем, что stepList определён
            let quantiles = get_quantiles(selectedD, apc, selectedP);
            let new_ang_list = stepList.map(step => quantiles[step - 3]); // ✅ Безопасная работа с `stepList`

            dispatch(setAngleList(new_ang_list));
        }
    }, [selectedD, apc, selectedP, dirNumber, stepList, dispatch]);


    return null
}

