import { useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';

interface RamProps {
    viewBox: { x: number; y: number; width: number; height: number }; 
}
export function Ram({viewBox}: RamProps) {
    const theme = useTheme();

    // const { 
    //     scale, 
    //     // viewBox
    // } = useAppSelector(state => state.cacParamsReducer);

    const baseSize = 0.4; // Фиксированный размер рамки на экране

    // Новый способ расчета рамки, чтобы она оставалась неизменной
    const lamberWidth = (baseSize * viewBox.width) / 1; // Теперь зависим от viewBox.width

    // Центр viewBox
    const centerX = viewBox.x + viewBox.width / 2;
    const centerY = viewBox.y + viewBox.height / 2;

    // Координаты рамки относительно центра
    const ram = [
        [centerX + lamberWidth, centerY + lamberWidth],
        [centerX + lamberWidth, centerY - lamberWidth],
        [centerX - lamberWidth, centerY - lamberWidth],
        [centerX - lamberWidth, centerY + lamberWidth],
        [centerX + lamberWidth, centerY + lamberWidth]
    ]
        .map(([x, y]) => `${x},${y}`)
        .join(' ');
    const ram1 = [
        [centerX + lamberWidth * 1.5, centerY + lamberWidth * 1.5],
        [centerX + lamberWidth * 1.5, centerY - lamberWidth * 1.5],
        [centerX - lamberWidth * 1.5, centerY - lamberWidth * 1.5],
        [centerX - lamberWidth * 1.5, centerY + lamberWidth * 1.5],
        [centerX + lamberWidth * 1.5, centerY + lamberWidth * 1.5]
    ]
        .map(([x, y]) => `${x},${y}`)
        .join(' ');

    return (
        <g>
            <polyline
                points={ram}
                stroke={theme.palette.mode === 'dark' ? 'grey' : 'grey'}
                fill="none"
                strokeWidth={viewBox.width * 0.006}
            />
            {/* <polyline
                points={ram1}
                stroke={theme.palette.mode === 'dark' ? '#424242' : 'white'}
                fill="none"
                strokeWidth={lamberWidth} // Толщина тоже пропорциональна viewBox
            /> */}
        </g>
    );
}
