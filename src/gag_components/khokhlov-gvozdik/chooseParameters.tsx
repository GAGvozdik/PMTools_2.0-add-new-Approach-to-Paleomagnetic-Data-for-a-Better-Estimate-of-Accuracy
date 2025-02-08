import styles from "./chooseParameters.module.scss" 
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';
import { 
    setDegreeGridVisible,
    setSelectedD,
    setSelectedP,
    setSelectedNumber,
    setPCaPC,
    setAPC,
    setIsGrid,
    setIsVis

} from '../../services/reducers/cacParams';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { useTheme } from '@mui/material/styles';

export default function ChooseParameters() {

    const { 
        selectedD,
        selectedP,
        selectedNumber,
        apc,
        isGrid,
        isDegreeVisible,
        isVis,

    } = useAppSelector(state => state.cacParamsReducer);

    const dispatch = useAppDispatch();

    const theme = useTheme();

    const degreeCheckboxChange = () => {
        dispatch(setIsGrid(!isGrid));
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const number = parseInt(event.target.value);
        dispatch(setSelectedNumber(number));
    };

    const handleDChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const number = parseInt(event.target.value);
        dispatch(setSelectedD(number));
    };

    const handlePChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const number = parseInt(event.target.value);
        dispatch(setSelectedP(number));
    };
        
    const gridCheckboxChange = () => {
        dispatch(setDegreeGridVisible(!isDegreeVisible));
    };

    const handleAPCChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const number = parseInt(event.target.value);
        dispatch(setAPC(number));
        
        if (number == 0.0) {
            dispatch(setPCaPC('PC'));
        }
        else {
            dispatch(setPCaPC('aPC'));
        }
    };

    const handleCheckboxChange = () => {
        dispatch(setIsVis(!isVis));
    };

    return (
        <>
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

            <div className={styles.infoItem1}>
                <label className={styles.my_input}><div className={styles.info} style={{ color: theme.palette.mode == 'dark' ? 'lightGrey' : "black"}}>Show zone</div>
                    <input type="checkbox" checked={isVis} onChange={handleCheckboxChange}/>
                    <span className={styles.checkmark}></span>
                </label>
            </div>

            <div className={styles.infoItem2}>
                <label className={styles.my_input}><div className={styles.info} style={{ color: theme.palette.mode == 'dark' ? 'lightGrey' : "black"}}>Show grid</div>
                    <input type="checkbox" checked={isDegreeVisible} onChange={gridCheckboxChange}/>
                    <span className={styles.checkmark}></span>
                </label>
            </div>

            <div className={styles.infoItem3}>
                <label className={styles.my_input}><div className={styles.info} style={{ color: theme.palette.mode == 'dark' ? 'lightGrey' : "black"}}>show degree grid</div>
                    <input type="checkbox" checked={isGrid} onChange={degreeCheckboxChange}/>
                    <span className={styles.checkmark}></span>
                </label>
            </div>

            <div className={styles.chooseButtonItem}></div>
        </>
    );
}


