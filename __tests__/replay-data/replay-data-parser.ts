import * as fs from 'fs';
import * as util from 'util';
import { parse } from 'csv-parse';
import ReplayData from './replay-data';
import { OrderSide } from 'coinbase-pro-node';

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
                created_at: '',
                fee: '',
                liquidity: null,
                order_id: '',
                price: row[7],
                product_id: '',
                profile_id: '',
                settled: true,
                side: OrderSide.BUY,
                size: '',
                trade_id: 0,
                usd_volume: '',
                user_id: '',
            },
            {
                created_at: '',
                fee: '',
                liquidity: null,
                order_id: '',
                price: '',
                product_id: '',
                profile_id: '',
                settled: true,
                side: OrderSide.SELL,
                size: '',
                trade_id: 0,
                usd_volume: '',
                user_id: '',
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
