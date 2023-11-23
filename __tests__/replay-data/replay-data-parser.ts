import * as fs from 'fs';
import * as util from 'util';
import { parse } from 'csv-parse';
import ReplayData from './replay-data';
import { FillTradeType, LiquidityIndicatorTypes, OrderSide } from 'coinbase-advanced-node';

const dataDirectory = './__tests__/replay-data/data';
const readDirectoryAsync = util.promisify(fs.readdir);

export async function loadReplayData(): Promise<ReplayData[]> {
    let data: ReplayData[] = [];
    const files = await readDirectoryAsync(dataDirectory);
    for (const file of files) {
        const parser = fs
            .createReadStream(`${dataDirectory}/${file}`)
            .pipe(parse({
                columns: false,
                trim: true
            }));
        for await (const row of parser) {
            data.push(fileRowToReplayData(row));
        }
    }
    return data;
}

function fileRowToReplayData(row: any): ReplayData {
    return {
        timestamp: new Date(row[0]),
        productId: row[1],
        action: row[2],
        price: parseFloat(row[3]),
        averagePrice: parseFloat(row[4]),
        cryptoBalance: parseFloat(row[5]),
        fiatBalance: parseFloat(row[6]),
        budget: parseFloat(row[8]),
        fills: {
            data: [{
                commission: '',
                entry_id: '',
                liquidity_indicator: LiquidityIndicatorTypes.UNKNOWN_LIQUIDITY_INDICATOR,
                trade_time: '',
                sequence_timestamp: '',
                size_in_quote: false,
                user_id: '',
                trade_type: FillTradeType.FILL,
                order_id: '',
                price: '',
                product_id: '',
                side: OrderSide.BUY,
                size: '',
                trade_id: '',
            },
            {
                commission: '',
                entry_id: '',
                liquidity_indicator: LiquidityIndicatorTypes.UNKNOWN_LIQUIDITY_INDICATOR,
                trade_time: '',
                sequence_timestamp: '',
                size_in_quote: false,
                user_id: '',
                trade_type: FillTradeType.FILL,
                order_id: '',
                price: '',
                product_id: '',
                side: OrderSide.SELL,
                size: '',
                trade_id: '',
            }],
            pagination: {
                after: '',
                before: ''
            }
        },
        trendAnalysis: {
            sevenDayAverage: parseFloat(row[9]),
            sevenDayHighPrice: parseFloat(row[10]),
            sevenDayLowPrice: parseFloat(row[11]),
            thirtyDayAverage: parseFloat(row[12]),
            thirtyDayHighPrice: parseFloat(row[13]),
            thirtyDayLowPrice: parseFloat(row[14]),
            sixtyDayAverage: parseFloat(row[15]),
            sixtyDayHighPrice: parseFloat(row[16]),
            sixtyDayLowPrice: parseFloat(row[17]),
            ninetyDayAverage: parseFloat(row[18]),
            ninetyDayHighPrice: parseFloat(row[19]),
            ninetyDayLowPrice: parseFloat(row[20]),
            oneTwentyDayAverage: parseFloat(row[21]),
            oneTwentyDayHighPrice: parseFloat(row[22]),
            oneTwentyDayLowPrice: parseFloat(row[23]),
        }
    };
}
