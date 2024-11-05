import React, { FC, useCallback, useEffect, useState } from 'react';
import styles from './ToolsDIR.module.scss';
import DropdownSelect from '../../components/Common/DropdownSelect/DropdownSelect';
import ButtonGroupWithLabel from '../../components/Common/Buttons/ButtonGroupWithLabel/ButtonGroupWithLabel';
import { Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { IDirData } from '../../utils/GlobalTypes';
import ModalWrapper from '../../components/Common/Modal/ModalWrapper';
import ToolsPMDSkeleton from '../../components/AppLogic/ToolsDIR/ToolsDIRSkeleton';
import StatModeButton from '../../components/AppLogic/ToolsDIR/StatModeButton';
import { setCurrentDIRid } from '../../services/reducers/parsedData';
import InputApply from '../../components/Common/InputApply/InputApply';
import parseDotsIndexesInput from '../../utils/parsers/parseDotsIndexesInput';
import DropdownSelectWithButtons from '../../components/Common/DropdownSelect/DropdownSelectWithButtons';
import ShowHideDotsButtons from '../../components/AppLogic/ToolsDIR/ShowHideDotsButtons';
import { referenceToLabel } from '../../utils/parsers/labelToReference';
import { enteredIndexesToIDsDIR } from '../../utils/parsers/enteredIndexesToIDs';
import { 
  setReference, 
  setSelectedDirectionsIDs, 
  setStatisticsMode, 
  updateCurrentFileInterpretations, 
  deleteInterepretationByParentFile,
  setHiddenDirectionsIDs,
  deleteAllInterpretations,
} from '../../services/reducers/dirPage';
import { Reference } from '../../utils/graphs/types';
// import OutputDataTableDIR from '../../components/AppLogic/DataTablesDIR/OutputDataTable/OutputDataTableDIR';
import VGPModalContent from '../../components/AppLogic/VGP/VGPmodalContent';
// import { setDirStatFiles } from '../../services/reducers/files';
import FoldTestContainer from '../../components/AppLogic/ToolsDIR/PMTests/FoldTestContainer';
import PMTestsModalContent from '../../components/AppLogic/ToolsDIR/PMTests/PMTestsModalContent';
import ReversePolarityButtons from '../../components/AppLogic/ToolsDIR/ReversePolarityButtons';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';


interface IToolsDIR {
  data: IDirData | null;
};

const CACToolDIR: FC<IToolsDIR> = ({ data }) => {



  return (
    <>
    
    </>
  )
}

export default CACToolDIR;