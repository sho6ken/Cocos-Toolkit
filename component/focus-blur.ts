import { _decorator, Component, Game, game, Node, sys } from 'cc';
import { AppModules } from '../app/app-modules';

const { ccclass, property, disallowMultiple, menu } = _decorator;

/**
 * 不支援的瀏覽器
 */
const NOT_SUPPORT_BROWSER = [sys.BrowserType.UC];

/**
 * 聚焦失焦
 */
@disallowMultiple
@menu(`custom/focus blur`)
export class FocusBlur extends Component {
    /**
     * 
     */
    protected onLoad() {
        if (sys.isBrowser && !NOT_SUPPORT_BROWSER.has(sys.browserType)) {
            game.on(Game.EVENT_SHOW, this.onFocus, this);
            game.on(Game.EVENT_HIDE, this.onBlur, this);
            return;
        }

        // 原生
        if (window && window.addEventListener) {
            window.addEventListener(`focus`, this.onFocus.bind(this));
            window.addEventListener(`blur`, this.onBlur.bind(this));
            return;
        }
    }

    /**
     * 
     */
    protected onDestroy(): void {
        if (sys.isBrowser && !NOT_SUPPORT_BROWSER.has(sys.browserType)) {
            game.off(Game.EVENT_SHOW, this.onFocus, this);
            game.off(Game.EVENT_HIDE, this.onBlur, this);
            return;
        }

        if (window && window.removeEventListener) {
            window.removeEventListener(`focus`, this.onFocus.bind(this));
            window.removeEventListener(`blur`, this.onBlur.bind(this));
            return;
        }
    }

    /**
     * 聚焦
     */
    private onFocus(): void {
        AppModules.event.emit("VIEW_FOCUS");
    }

    /**
     * 失焦
     */
    private onBlur(): void {
        AppModules.event.emit("VIEW_BLUR");
    }
}
