import axios from "axios";
import { create } from "zustand";
import getDateRange, { Interval } from "../utils/getDateRange";
import formatDate from "../utils/formateDate";

// Define types for store state
type ChartGridValueAndData = {
  value: number;
  label: string;
  xPosition: number;
};
interface ChartDataStore {
  budget: number;
  buyDate: Date;
  sellDate: Date;
  buyDateDisplay: Date;
  sellDateDisplay: Date;
  selectedItem: string;
  currency: string;
  data: unknown; // Define type according to your fetched data structure
  stockDetails: unknown; // Define type according to your fetched data structure
  chartError: null | string;
  timeSeries: Interval;
  loading: boolean;
  stockSymbol: string;
  currentMode: string;
  buyIndex: number;
  sellIndex: number;
  manualTime: boolean;
  logoUrl: string;
  chartGridValuesAndData: ChartGridValueAndData[];
  buyData: ChartGridValueAndData;
  sellData: ChartGridValueAndData;
  dataReloadTrigger: Boolean;
  getData: () => Promise<void>;
  setBudget: (amount: number) => void;
  setBuyDate: (buyDate: Date) => void;
  setSellDate: (sellDate: Date) => void;
  setBuyDateDisplay: (buyDateDisplay: Date) => void;
  setSellDateDisplay: (SellDateDisplay: Date) => void;

  setManualTime: (manualTime: boolean) => void;
  setCurrency: (currency: string) => void;
  setTimeSeries: (timeSeries: string) => void;
  setStockSymbol: (stockSymbol: string) => void;
  setCurrentMode: (currentMode: string) => void;
  setSellData: (sellIndex: number) => void;
  setBuyData: (buyIndex: number) => void;
  setChartGridValuesAndData: (
    chartGridValuesAndData: ChartGridValueAndData[]
  ) => void;
  setChartError: (err: string) => void;
}
// Create Zustand store
const useChartDataStore = create<ChartDataStore>((set, get) => ({
  budget: 130000,
  buyDate: new Date(),
  sellDate: new Date(),
  selectedItem: "",
  currency: "$",
  data: null,
  stockDetails: null,
  timeSeries: "max",
  loading: true,
  stockSymbol: "tsla",
  currentMode: "stocks",
  logoUrl: "",
  manualTime: false,
  chartGridValuesAndData: [],
  buyIndex: 0,
  chartError: null,
  sellIndex: 60,
  buyDateDisplay: new Date(),
  sellDateDisplay: new Date(),
  sellData: {
    label: "",
    value: 0,
    xPosition: 0,
  },
  buyData: {
    label: "",
    value: 0,
    xPosition: 0,
  },
  dataReloadTrigger: false,
  getData: async () => {
    set({ loading: true });
    const {
      timeSeries,
      stockSymbol,
      currentMode,
      manualTime,
      buyDate,
      sellDate,
    } = get();
    const { formattedStartDate, pointValue } = getDateRange(timeSeries);
    const manualFormattedStartDate = formatDate(buyDate);
    const manualFormattedEndDate = formatDate(sellDate);

    const exchangeQuery =
      currentMode === "stocks" ? "&exchange=NASDAQ" : "&exchange=binance";
    let mainURL = `https://api.twelvedata.com/time_series?symbol=${stockSymbol}&interval=${pointValue}&start_date=${formattedStartDate}${exchangeQuery}`;
    if (manualTime) {
      mainURL = `https://api.twelvedata.com/time_series?symbol=${stockSymbol}&interval=1day&start_date=${manualFormattedStartDate}${exchangeQuery}&end_date=${manualFormattedEndDate}`;
    }
    try {
      // Fetch stock data from an API
      const [chartdetails, stockDetails, logoUrlResponse] = await Promise.all([
        axios
          .get(mainURL, {
            headers: {
              Authorization: import.meta.env.VITE_API_KEY as string,
            },
          })
          .catch((err) => console.log(err, "error inside")),
        axios.get(`https://api.twelvedata.com/quote?symbol=${stockSymbol}`, {
          headers: {
            Authorization: import.meta.env.VITE_API_KEY as string,
          },
        }),
        axios.get(`https://api.twelvedata.com/logo?symbol=${stockSymbol}`, {
          headers: {
            Authorization: import.meta.env.VITE_API_KEY as string,
          },
        }),
      ]); // Set the fetched data to the store's state
      const logoUrlToBeSet =
        currentMode === "stocks"
          ? logoUrlResponse.data.url
          : logoUrlResponse.data.logo_base;
      console.log(chartdetails, "re");

      set({
        data: chartdetails?.data,
        stockDetails: stockDetails.data,
        logoUrl: logoUrlToBeSet,
        chartError: null,
      });
      // if (chartdetails.data.status === "ok") {
      //   set({ chartError: null });
      // }
      if (chartdetails.data.status === "error") {
        const errorMessage = chartdetails.data.message;
        set({ chartError: errorMessage });
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      set({ loading: false });
    }
  },
  setBudget: (amount) => {
    set({ budget: amount });
  },
  setBuyDate: (buyDate) => {
    set({ buyDate });
  },
  setSellDate: (sellDate) => {
    set({ sellDate });
  },
  setBuyDateDisplay: (buyDateDisplay) => {
    set({ buyDateDisplay });
  },
  setSellDateDisplay: (sellDateDisplay) => {
    set({ sellDateDisplay });
  },

  setManualTime: (manualTime) => {
    set({ manualTime });
  },
  setCurrency: (currency) => {
    set({ currency });
  },
  setSellData: (sellIndex) => {
    const { chartGridValuesAndData } = get();
    const sellData = chartGridValuesAndData[sellIndex];
    set({ sellIndex, sellData });
  },
  setBuyData: (buyIndex) => {
    const { chartGridValuesAndData } = get();
    const buyData = chartGridValuesAndData[buyIndex];
    set({ buyIndex, buyData });
  },
  setTimeSeries: (timeSeries: Interval) => {
    set({ timeSeries });
  },
  setReloadData: () => {
    const { dataReloadTrigger } = get();
    set({ dataReloadTrigger: !dataReloadTrigger });
  },
  setStockSymbol: (stockSymbol) => {
    set({ stockSymbol });
  },
  setCurrentMode: (currentMode) => {
    set({ currentMode });
  },
  setBuyIndex: (buyIndex) => {
    set({ buyIndex });
  },
  setSellIndex: (sellIndex) => {
    set({ sellIndex });
  },
  setChartGridValuesAndData: (chartGridValuesAndData) => {
    set({ chartGridValuesAndData });
  },
  setChartError: (err: string) => {
    set({ chartError: err });
  },
}));

export default useChartDataStore;
