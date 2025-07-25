//calculator.ts

export type PTXT = 'TSA' | 'THPT' | 'HSA' | 'HOCBA';

export interface AllMethodReturnType {
    tsa: number | null,
    thpt: number | null,
    hsa: number | null,
    hocba: number | null
}

interface ScoreRange {
    min: number;
    max: number;
}

interface ConversionTable {
    [key: number]: {
        TSA: ScoreRange;
        THPT: ScoreRange;
        HSA: ScoreRange;
        HOCBA: ScoreRange;
    };
}

const CONVERSION_TABLE: ConversionTable = {
    1: {
        TSA: { min: 83.98, max: 100 },
        THPT: { min: 29.25, max: 30.00 },
        HSA: { min: 118, max: 127 },
        HOCBA: { min: 29.50, max: 30.00 }
    },
    2: {
        TSA: { min: 76.23, max: 83.98 },
        THPT: { min: 28.46, max: 29.25 },
        HSA: { min: 109.81, max: 118 },
        HOCBA: { min: 28.97, max: 29.50 }
    },
    3: {
        TSA: { min: 69.88, max: 76.23 },
        THPT: { min: 27.55, max: 28.46 },
        HSA: { min: 103.13, max: 109.81 },
        HOCBA: { min: 28.36, max: 28.97 }
    },
    4: {
        TSA: { min: 59.71, max: 69.88 },
        THPT: { min: 25.08, max: 27.55 },
        HSA: { min: 88.23, max: 103.13 },
        HOCBA: { min: 26.71, max: 28.36 }
    },
    5: {
        TSA: { min: 55.22, max: 59.71 },
        THPT: { min: 23.46, max: 25.08 },
        HSA: { min: 80.84, max: 88.23 },
        HOCBA: { min: 25.63, max: 26.71 }
    },
    6: {
        TSA: { min: 46.95, max: 55.22 },
        THPT: { min: 19.50, max: 23.46 },
        HSA: { min: 67.00, max: 80.84 },
        HOCBA: { min: 22.99, max: 25.63 }
    },
    7: {
        TSA: { min: 37.44, max: 46.95 },
        THPT: { min: 15.00, max: 19.50 },
        HSA: { min: 53.60, max: 67.00 },
        HOCBA: { min: 19.98, max: 22.99 }
    }
};


function findScoreRange(score: number, method: PTXT): number | null {
    for (let i = 1; i <= 7; i++) {
        const range = CONVERSION_TABLE[i][method];
        if (score >= range.min && score <= range.max) {
            return i;
        }
    }
    return null;
}

/**
 * Công thức: y = y1 + ((x - x1)(y2 - y1))/(x2 - x1)
 *
 * @param score - điểm nhập
 * @param fromMethod - Source evaluation method
 * @param toMethod - Target evaluation method
 * @returns Converted score or null if conversion is not possible
 */
export function convertScore(
    score: number,
    fromMethod: PTXT,
    toMethod: PTXT
): number | null {
    if (fromMethod === toMethod) {
        return score;
    }
    const rangeIndex = findScoreRange(score, fromMethod);
    if (rangeIndex === null) {
        return null; // Score is outside valid ranges
    }

    const sourceRange = CONVERSION_TABLE[rangeIndex][fromMethod];
    const targetRange = CONVERSION_TABLE[rangeIndex][toMethod];

    // y = y1 + ((x - x1)(y2 - y1))/(x2 - x1)
    const x = score; // input score
    const x1 = sourceRange.min;
    const x2 = sourceRange.max;
    const y1 = targetRange.min;
    const y2 = targetRange.max;

    const convertedScore = y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);

    return convertedScore
}

/**
 * Get the valid score range for a specific method
 */
export function getScoreRange(method: PTXT): { min: number; max: number } {
    const allRanges = Object.values(CONVERSION_TABLE).map(range => range[method]);
    const min = Math.min(...allRanges.map(r => r.min));
    const max = Math.max(...allRanges.map(r => r.max));
    return { min, max };
}

export function isValidScore(score: number, method: PTXT): boolean {
    const range = getScoreRange(method);
    return score >= range.min && score <= range.max;
}

export function getAllMethodConverted(score: number, method: PTXT): AllMethodReturnType {
    return {
        hsa: convertScore(score, method, 'HSA'),
        hocba: convertScore(score, method, 'HOCBA'),
        thpt: convertScore(score, method, 'THPT'),
        tsa: convertScore(score, method, 'TSA')
    }
}