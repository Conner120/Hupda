import { observable } from 'mobx';

export default class AppState {
  @observable authenticated: number = 0;
}
