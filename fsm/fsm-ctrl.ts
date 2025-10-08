/**
 * 狀態機控制
 */
export class FsmCtrl<T> {
    /**
     * 狀態機持有人
     */
    protected declare _owner: T;

    /**
     * 狀態機持有人
     */
    get owner(): T { return this._owner; }

    /**
     * 變更狀態
     * @param id 狀態編號
     * @param params 新狀態onEnter()使用的參數
     */
    changeState(id: number, ...params: any[]): void {
        // TODO
    }
}