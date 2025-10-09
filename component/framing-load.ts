import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 分幀加載
 * @summary https://blog.csdn.net/lineage191/article/details/109354896
 */
@ccclass
export abstract class FramingLoad extends Component {
	/**
     * 執行
     * @param count 總執行次數
     */
    async execute(count: number): Promise<void> {
        let tag = `framing load rec spend time, ${this.constructor.name}.`;
        console.time(tag);

        await this.preframe(this.generator(count), 1);

        console.timeEnd(tag);
    }

	/**
     * 生成器
     * @param count 總執行次數
     * @summary es6的協程處理功能, 函式前要加*號做區別
     */
    private *generator(count: number): Generator {
        for (let i = 0; i < count; i++) {
            yield this.business(i);
        }
    }

	/**
     * 實際業務邏輯
     * @param count 當前執行次數
     */
    protected abstract business(count: number): void;

	/**
	 * 分幀處理
	 * @param generator 生成器
	 * @param duration 持續時間(ms), 每次執行生成器時, 最長可持續執行時間, 假設為8ms, 代表1幀分出8ms給此邏輯執行
	 */
	private preframe(generator: Generator, duration: number): Promise<void> {
		 return new Promise((resolve, reject) => {
			let func = function(): void {
				let startTime = new Date().getTime();

				// 然後一直從生成器中, 獲取已經拆分好的代碼段出來執行
				for (let iter = generator.next();; iter = generator.next()) {
					// 判斷是否已經執行完所有任務
					if (iter == null || iter.done) {
						resolve();
						return;
					}

					// 檢查是否已超過本幀分配的時間
					if (new Date().getTime() - startTime > duration) {
						// 已逾時就不再執行, 等下一幀再執行
						this.scheduleOnce(() => func());
						return;
					}
				}
			}.bind(this);

			// 執行
			func();
		});
	}
}
