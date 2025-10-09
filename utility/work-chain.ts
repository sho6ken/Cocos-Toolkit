/**
 * 工作鏈
 */
export abstract class WorkChain {
    /**
     * 子鏈
     */
    private _next: WorkChain = null;

    /**
     * 加入
     * @param chain 子鏈
     * @returns 子鏈實際的父鏈
     * @summary 當此鏈已經有子鏈時, 會持續向後搜尋, 直到發現空位
     */
    push(chain: WorkChain): WorkChain {
        if (this._next) {
            return this._next.push(chain);
        }
        else {
            this._next = chain;
            return this;
        }
    }

    /**
     * 插入
     * @param chain 子鏈
     * @returns 原本的子鏈
     * @summary 會將原本的父子鏈斷開並插入, 取代原本的父子關係
     */
    insert(chain: WorkChain): WorkChain {
        chain._next = this._next;
        this._next = chain;
        return chain._next;
    }

    /**
     * 負責處理的業務
     * @param params 往下傳遞的參數
     * @returns 是否執行成功
     */
    protected abstract business(...params: any[]): Promise<boolean>

    /**
     * 開始執行
     * @param params 往下傳遞的參數
     * @summary 是否所有子鏈都執行完成
     */
    async execute(...params: any[]): Promise<boolean> {
        if (await this.business(...params) == false) {
            return false;
        }

        // 繼續向下
        return this._next ? await this._next.execute(...params) : true;
    }
}
