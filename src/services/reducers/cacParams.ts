import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDirData, MeanDir, VGPData } from "../../utils/GlobalTypes";
import { StatisitcsInterpretationFromDIR } from "../../utils/GlobalTypes";
import { Reference, StatisticsModeDIR } from "../../utils/graphs/types";

interface IInitialState {
        selectedD : number;
        selectedP: number;
        selectedNumber: number;

        dirList: [number, number, number][];
        angleList: number[];

        meanDir: number[];
        alpha95: number;
        apc: number;
        stepList: number[] | undefined;
        dirNumber  : number;
        zoneSquare: number;

        probability: number;
        PCaPCString: string;

        centerZone: number[];


        dataToShow: IDirData | null;
        RZ: number;
        isCACGraphVisible: boolean; // ????

        isGrid: boolean; // ????
        isDegreeVisible: boolean;
        isVis: boolean; // ????

        gridPoints: number[][];
    interpretation: number;
};

//  step_list = dataToShow?.interpretations.map(interpretation => interpretation.stepCount);

const initialState: IInitialState = {
        selectedD : 10,
        selectedP: 990,
        selectedNumber: 10000,
        PCaPCString  : 'PC',
        apc : 0,
        dirList: [],
        angleList: [0],
        meanDir: [0, 0, 1],
        alpha95: 0,
        stepList: [],
        dirNumber  : 0,
        zoneSquare: 0,
        probability: 0,
        RZ: 999,

        dataToShow: null,

        isCACGraphVisible: false, // ????

        isGrid: true, // ????
        isDegreeVisible: true,
        isVis: true,
        gridPoints: [],
        centerZone: [],

    interpretation: 0,

};

const cacParams = createSlice({
  name: 'cacParams',
  initialState,
  reducers: {

    setDegreeGridVisible(state, action) {
      state.isDegreeVisible = action.payload;
    },

    setSelectedD(state, action) {
      state.selectedD = action.payload;
    },

    setSelectedP(state, action) {
      state.selectedP = action.payload;
    },

    setSelectedNumber(state, action) {
      state.selectedNumber = action.payload;
    },

    setPCaPC(state, action) {
      state.PCaPCString = action.payload;
    },

    setAPC(state, action) {
      state.apc = action.payload;
    },

    setDirList(state, action) {
        state.dirList = action.payload;
    },

    setAngleList(state, action) {
        state.angleList = action.payload;
    },

    setMeanDir(state, action) {
        state.meanDir = action.payload;
    },

    setAlpha95(state, action) {
        state.alpha95 = action.payload;
    },

    setStepList(state, action) {
        state.stepList = action.payload;
    },

    setDirNumber(state, action) {
        state.dirNumber = action.payload;
    },

    setZoneSquare(state, action) {
        state.zoneSquare = action.payload;
    },

    setProbability(state, action) {
        state.probability = action.payload;
    },

    setRZ(state, action) {
        state.RZ = action.payload;
    },

    setIsCACGraphVisible(state, action) {
        state.isCACGraphVisible = action.payload;
    },

    setDataToShow(state, action) {
        state.dataToShow = action.payload;
    },

    setCenterZone(state, action) {
        state.centerZone = action.payload;
    },

    setGridPoints(state, action) {
        state.gridPoints = action.payload;
    },

    setIsGrid(state, action) {
        state.isGrid = action.payload;
    },

    setIsVis(state, action) {
        state.isVis = action.payload;
    },

  },

});

export const {
    setDegreeGridVisible,
    setSelectedD,
    setSelectedP,
    setSelectedNumber,
    setPCaPC,
    setAPC,
    setDirList,
    setAngleList,
    setMeanDir,
    setAlpha95,
    setStepList,
    setDirNumber,
    setZoneSquare,
    setProbability,
    setRZ,
    setIsCACGraphVisible,
    setDataToShow,
    setCenterZone,
    setGridPoints,
    setIsGrid,
    setIsVis,

} = cacParams.actions;

const cacParamsReducer = cacParams.reducer;
export default cacParamsReducer;