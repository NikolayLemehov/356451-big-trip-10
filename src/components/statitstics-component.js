import AbstractSmartComponent from "./abstract-smart-component";
import {renderMoneyChart, renderTimeSpendChart, renderTransportChart} from "../utils/renderChart";
import {Statistic} from "../const";

const createStatisticTemplate = (diagramType) => {
  return (
    `<div class="statistics__item statistics__item--${diagramType}">
      <canvas class="statistics__chart  statistics__chart--${diagramType}" width="900"></canvas>
    </div>`
  );
};

const createStatisticsTemplate = () => {
  const diagramsTemplate = Object.values(Statistic).map((it) => createStatisticTemplate(it)).join(``);

  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>
      ${diagramsTemplate}
    </section>`
  );
};

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor(eventsModel) {
    super();
    this._eventsModel = eventsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time-spend`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._eventsModel.getEvents());
    this._transportChart = renderTransportChart(transportCtx, this._eventsModel.getEvents());
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, this._eventsModel.getEvents());
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }
    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }
    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }
}
