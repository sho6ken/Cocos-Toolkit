import { FsmState } from "./fsm-state";

/**
 * 狀態機控制
 */
export class FsmCtrl<T> {
    /**
     * 名稱
     */
    get name(): string { return this.constructor.name; }

    /**
     * 狀態機持有人
     */
    protected declare _owner: T;

    /**
     * 狀態機持有人
     */
    get owner(): T { return this._owner; }

    /**
     * 狀態列表
     */
    protected declare _states: Map<number, FsmState<T>>;

    /**
     * 當前狀態
     */
    protected declare _currState: FsmState<T>;

    /**
     * 當前狀態編號
     */
    get currStateID(): number { return this._currState ? this._currState.id : -1; }

    /**
     * 
     * @param owner 狀態機持有人
     */
    constructor(owner: T) {
        if (owner == null) {
            console.warn(`fsm ${this.name} create failed, owner is null.`);
            return;
        }

        this._states = new Map();
        this._owner = owner;
    }

    /**
     * 關閉
     */
    shutdown(): void {
        this._states.forEach(state => {
            state.shutdown();
            state = null;
        });
        this._states.clear();
    }

    /**
     * 新增狀態
     * @param states 狀態列表
     */
    addStates(...states: FsmState<T>[]): FsmCtrl<T> {
        if (!states || states.length <= 0) {
            console.warn(`fsm ${this.name} add states failed, states are null.`);
            return null;
        }

        let len = states.length;

        for (let i = 0; i < len; i++) {
            let state = states[i];

            if (state == null) {
                console.warn(`fsm ${this.name} add states failed, state ${i} is null.`);
                return null;
            }

            let id = state.id;

            if (this._states.has(id)) {
                console.warn(`fsm ${this.name} add states failed, state ${i}-${state.name} repeat.`);
                return null;
            }

            this._states.set(id, state);
        }

        return this;
    }

    /**
     * 初始化
     * @param params 初始化參數
     * @summary 在新增狀態後才能調用
     */
    init(...params: any[]): void {
        if (this._states.size <= 0) {
            console.warn(`fsm ${this.name} init failed, do add states before init.`);
            return;
        }

        Array.from(this._states.values()).forEach(state => state.init(this, ...params), this);
    }

    /**
     * 更新
     */
    update(dt: number): void {
        this._currState && this._currState.onDraw(dt);
    }

    /**
     * 變更狀態
     * @param id 狀態編號
     * @param params 新狀態onEnter()使用的參數
     */
    changeState(id: number, ...params: any[]): void {
        if (id == this.currStateID) {
            console.warn(`fsm ${this.name} change state ${id} failed, the same state.`);
            return;
        }

        if (!this._states.has(id)) {
            console.warn(`fsm ${this.name} change state ${id} failed, state not found.`);
            return;
        }

        let oldID = this.currStateID;

        // 舊狀態
        if (oldID != -1) {
            let oldState = this._states.get(oldID);
            oldState.onLeave();
        }

        // 新狀態
        this._currState = this._states.get(id);
        this._currState.onEnter(...params);

        //console.log(`fsm ${this.name} change state from ${oldID} to ${id} succeed.`);
    }
}