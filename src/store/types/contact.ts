export interface IPhone {
    number: string;
}

export interface IContact {
    id: number;
    first_name: string;
    last_name: string;
    phones: IPhone[];
    is_favorite?: boolean;
}