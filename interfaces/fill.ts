import { Actions } from '../utils/enums';

export default interface Fill {
    action: Actions.Buy | Actions.Sell,
    date: Date,
    price: number,
}
