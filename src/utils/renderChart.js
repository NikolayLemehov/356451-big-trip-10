import Chart from 'chart.js';
import moment from 'moment';
import {EURO_SYMBOL, GroupType, Statistic, typeToGroup} from '../const';
import ChartDataLabels from 'chartjs-plugin-datalabels';

class DefaultChartConfig {
  static get() {
    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        datasets: [{
          backgroundColor: `white`,
        }],
      },
      options: {
        title: {
          display: true,
          position: `left`,
          fontSize: 22,
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
            },
            ticks: {
              callback() {
                return ``;
              },
              min: 0,
            },
          }],
          yAxes: [{
            gridLines: {
              display: false,
            },
            tick: false,
          }],
        },
        plugins: {
          datalabels: {
            align: `start`,
            anchor: `end`,
          },
        },
      },
    };
  }
}

const getTransportToEventCount = (events) => {
  const ctxTransports = new Set();
  const transportToEventCount = new Map();
  events.forEach((it) => {
    if (typeToGroup.get(it.type) !== GroupType.TRANSFER) {
      return;
    }
    if (!ctxTransports.has(it.type)) {
      ctxTransports.add(it.type);
      transportToEventCount.set(it.type, 1);
    } else {
      transportToEventCount.set(it.type, transportToEventCount.get(it.type) + 1);
    }
  });
  return transportToEventCount;
};
const getTypeToEventHour = (events) => {
  const ctxType = new Set();
  const typeToEventCount = new Map();
  const getHoursDuration = (event) => moment.duration(event.date.end - event.date.start).hours();
  events.forEach((it) => {
    if (!ctxType.has(it.type)) {
      ctxType.add(it.type);
      typeToEventCount.set(it.type, getHoursDuration(it));
    } else {
      typeToEventCount.set(it.type, typeToEventCount.get(it.type) + getHoursDuration(it));
    }
  });
  return typeToEventCount;
};
const getTypeToTotalCost = (events) => {
  const ctxType = new Set();
  const typeToTotalCost = new Map();
  events.forEach((it) => {
    if (!ctxType.has(it.type)) {
      ctxType.add(it.type);
      typeToTotalCost.set(it.type, it.price);
    } else {
      typeToTotalCost.set(it.type, typeToTotalCost.get(it.type) + it.price);
    }
  });
  return typeToTotalCost;
};
const getSortKeys = (map) => Array.from(map.keys()).sort((a, b) => map.get(b) - map.get(a));

const renderMoneyChart = (moneyCtx, events) => {
  const typeToTotalCost = getTypeToTotalCost(events);
  const sortTypes = getSortKeys(typeToTotalCost);

  const chartConfig = DefaultChartConfig.get();
  chartConfig.data.labels = sortTypes;
  chartConfig.data.datasets[0].data = sortTypes.map((it) => typeToTotalCost.get(it));
  chartConfig.options.title.text = Statistic.MONEY.toUpperCase();
  chartConfig.options.plugins.datalabels.formatter = (value) => `${EURO_SYMBOL} ${value}`;

  return new Chart(moneyCtx, chartConfig);
};

const renderTransportChart = (transportsCtx, events) => {
  const transportToEventCount = getTransportToEventCount(events);
  const sortTransports = getSortKeys(transportToEventCount);

  const chartConfig = DefaultChartConfig.get();
  chartConfig.data.labels = sortTransports;
  chartConfig.data.datasets[0].data = sortTransports.map((it) => transportToEventCount.get(it));
  chartConfig.options.title.text = Statistic.TRANSPORT.toUpperCase();
  chartConfig.options.plugins.datalabels.formatter = (value) => `${value}x`;

  return new Chart(transportsCtx, chartConfig);
};

const renderTimeSpendChart = (timeSpendCtx, events) => {
  const typeToEventHour = getTypeToEventHour(events);
  const sortTypes = getSortKeys(typeToEventHour);

  const chartConfig = DefaultChartConfig.get();
  chartConfig.data.labels = sortTypes;
  chartConfig.data.datasets[0].data = sortTypes.map((it) => typeToEventHour.get(it));
  chartConfig.options.title.text = Statistic.TIME_SPEND.toUpperCase();
  chartConfig.options.plugins.datalabels.formatter = (value) => `${value}H`;

  return new Chart(timeSpendCtx, chartConfig);
};

export {renderMoneyChart, renderTransportChart, renderTimeSpendChart};
