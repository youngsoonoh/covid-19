export interface IStore {
    id: number;
    code: string;
    name: string;
    addr: string;
    type: string;
    lat: number;
    lng: number;
    stock_at: string;
    remain_stat: string;
    created_at: string;
}

export class Store implements IStore {
    constructor(
        public id: number,
        public code: string,
        public name: string,
        public addr: string,
        public type: string,
        public lat: number,
        public lng: number,
        public stock_at: string,
        public remain_stat: string,
        public created_at: string
    ) {
    }
}
