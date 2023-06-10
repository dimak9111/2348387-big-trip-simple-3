import { RenderPosition, render, remove } from '../framework/render.js';
import PointListView from '../view/eventList.js';
import SortView from '../view/sort.js';
import EmptyListView from '../view/eventList.js';
import PointPresenter from './presenterPoints.js';
import { updateItem, sortPointsByDay, sortPointsByPrice } from '../util/utils.js';
import { SortType } from '../mock/const.js';

class TripPointsPresenter {
  #container = null;
  #pointsModel = null;

  #pointListComponent = new PointListView();
  #sortComponent = new SortView();
  #noPointsComponent = new EmptyListView();
  #pointList = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointList = [...this.#pointsModel.points];
    this.#renderMain();
  }

  #renderMain = () => {
    if (this.#pointList.length === 0) {
      render(this.#noPointsComponent, this.#container);
      return;
    }

    this.#renderSort(this.#currentSortType);
    this.#renderList();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointList = updateItem(this.#pointList, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints = (sortType) => {
    switch(sortType) {
      case SortType.DAY:
        this.#pointList.sort(sortPointsByDay);
        break;
      case SortType.PRICE:
        this.#pointList.sort(sortPointsByPrice);
        break;
    }
    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#updateSortMarkup();
    this.#clearPointList();
    this.#renderList();
  };

  #renderSort = () => {
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  #updateSortMarkup = () => {
    remove(this.#sortComponent);
    this.#renderSort();
  };

  #renderList = () => {
    render(this.#pointListComponent, this.#container);
    this.#pointList.forEach((point) => this.#renderListItemComponent(point));
  };

  #renderListItemComponent = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };
}

export default TripPointsPresenter;
