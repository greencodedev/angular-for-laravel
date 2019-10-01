interface ChartData {
    data: number[];
    items: {
        amount: number,
        sales: number,
        name: string,
        envato_id: number,
        percentage: number,
    }[];
    monthly: MonthlyEarningChartData;
    sales: {
        date: string,
        day: number,
        order_id: number,
        item_id: number,
        amount: number,
        item: string,
        type: 'Sale',
    }[];
    totals: {
        sales: number,
        earnings: number,
    };
    yearly?: {
        sales: number,
        amount: number,
        month: number,
    };
}

export interface MonthlyEarningChartData {
    [key: number]: {
        amount: number,
        sales: number
    };
}

export interface EarningsChartData {
    primary: Partial<ChartData>;
    secondary: Partial<ChartData>;
}
