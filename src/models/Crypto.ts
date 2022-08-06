interface CryptoPriceModel {
    id: number,
    symbol: string,
    priceChangePercent: string,
    lastPrice: string,
    closeDate: Date,
    name: string,
}

export default CryptoPriceModel;