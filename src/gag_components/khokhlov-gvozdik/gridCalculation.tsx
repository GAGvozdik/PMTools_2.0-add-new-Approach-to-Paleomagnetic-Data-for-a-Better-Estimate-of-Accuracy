import {
    NormalizeV,
    angle_between_v,
    GridVdek,
} from "../gag_functions";

/**
 * Генерирует точки сетки с заданным количеством точек.
 * @param pointsNumb Количество точек
 * @param dirList Список направлений [x, y, z]
 * @param angleList Список углов
 * @returns Массив точек сетки [[x, y, z], ...]
 */

export function generateGrid(
        pointsNumb: number,
        dirList: number[][],
        angleList: number[]
    ): number[][] {

    let x: number;
    let y: number;
    let m: number[];
    let gridPoints: number[][] = [];
    let printPoint: number = 0;

    let phi = 0.013;

    for (let i = 0; i < pointsNumb; i++) {
        x = (i * phi - Math.round(i * phi)) * 360;
        y = (i / pointsNumb - Math.round(i / pointsNumb)) * 360;

        m = GridVdek(x, y);

        for (let j = 0; j < dirList.length; j++) {
            if (angle_between_v(dirList[j], m) < angleList[j] * Math.PI / 180) {
                printPoint = 1;
            } else {
                printPoint = 0;
                break;
            }
        }

        if (printPoint === 1) {
            gridPoints.push(m);
        }
        printPoint = 0;
    }

    return gridPoints;
}

/**
 * Вычисляет центр зоны по заданным точкам сетки.
 * @param gridPoints Массив точек сетки [[x, y, z], ...]
 * @returns Нормализованный центр зоны [x, y, z]
 */

export function calculateCenterZone(gridPoints: number[][]): number[] {
    let centerZone: number[] = [0, 0, 0];

    for (let i = 0; i < gridPoints.length; i++) {
        centerZone[0] += gridPoints[i][0];
        centerZone[1] += gridPoints[i][1];
        centerZone[2] += gridPoints[i][2];
    }

    centerZone = NormalizeV(centerZone);

    return centerZone;
}