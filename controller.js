/**
 * @typedef {object} OrderItem - 予約情報
 * @property {boolean} anonymity
 * @property {string} comment
 * @property {string} commentId
 * @property {boolean} completed
 * @property {number} count
 * @property {string} id
 * @property {string} index
 * @property {boolean} playing
 * @property {string} profileImage
 * @property {string} service
 * @property {string} serviceName
 * @property {string} timestamp
 * @property {string} username
 */

/**
 * @typedef {object} Config
 * @property {APIConfig} api
 * @property {AppConfig} app
 * @property {BackupConfig} backup
 * @property {CommentConfig} comment
 * @property {IntegrationConfig} integration
 * @property {MainViewConfig} mainView
 * @property {NotificationConfig} notification
 * @property {OrderConfig} order
 * @property {PlatformConfig} platform
 * @property {RemoteConfig} remote
 * @property {SetListConfig} setList
 * @property {SpeechConfig} speech
 * @property {SurveyConfig} survey
 * @property {TemplateConfig} template
 * @property {TimestampConfig} timestamp
 * @property {UIConfig} ui
 */

/**
 * @typedef {object} OrderConfig
 * @property {string} declineWords
 * @property {string} emptyText
 * @property {boolean} enabled
 * @property {string} excludeUser
 * @property {boolean} onlyChannelPointFromTwitch
 * @property {boolean} skipConfirm
 * @property {{enabled: boolean, file: string, volume: number}} sound
 * @property {string} templateString
 * @property {"column" | "row"} templateType
 * @property {string} words
 */

/**
 * @typedef {object} ShowData - 予約表示用情報
 * @property {boolean} anonymity
 * @property {string} comment
 * @property {string} commentId
 * @property {boolean} completed
 * @property {number} count
 * @property {string} id
 * @property {string} index
 * @property {boolean} playing
 * @property {string} profileImage
 * @property {string} service
 * @property {string} serviceName
 * @property {string} timestamp
 * @property {string} username
 *
 * @property {number} index
 */

/**
 * @typedef {object} AppData
 * @property {boolean} animFade
 * @property {boolean} isScroll
 * @property {ShowData} showTarget
 * @property {OrderItem[]} orderItemList
 */

/**
 * @typedef {object} AppRefs
 * @property {HTMLElement} commentBlock
 */

class Controller {
  constructor(app) {
    this.app = app;
  }

  /**
   * @returns {AppData}
   */
  _getAppData() {
    return this.app.$data;
  }

  /**
   * @returns {AppRefs}
   */
  _getAppRefs() {
    return this.app.$refs;
  }

  /**
   *
   * @param {OrderItem[]} orderItemList
   * @param {Config} config
   */
  onUpdateOrderItemList(orderItemList, config) {
    let appData = this._getAppData();

    orderItemList.forEach((item, index) => (item.index = index + 1));
    document.documentElement.style.setProperty(
      "--text-scroll-iteration-count",
      orderItemList.length == 1 ? "infinite" : 1
    );
    if (orderItemList.length) {
      if (!appData.showTarget) {
        appData.showTarget = orderItemList[0];
        appData.animFade = true;
      } else {
        let index = orderItemList.findIndex(
          (item) => item.commentId == appData.showTarget.commentId
        );
        if (index < 0) {
          appData.animFade = false;
          index = 0;
        }
        appData.showTarget = orderItemList[index];
      }
    } else {
      appData.showTarget = false;
      appData.animFade = false;
    }
    appData.orderItemList = orderItemList;
  }

  onFadeAfterEnter() {
    this._updateScrollStyleProperty();

    let appData = this._getAppData();
    document.documentElement.style.setProperty(
      "--text-scroll-iteration-count",
      appData.orderItemList.length == 1 ? "infinite" : 1
    );
    appData.isScroll = true;
  }

  onScrollAnimationIteration() {
    this._updateScrollStyleProperty();
  }

  onScrollAnimationEnd() {
    let appData = this._getAppData();
    appData.isScroll = false;
    appData.animFade = false;
  }

  onFadeAfterLeave() {
    let appData = this._getAppData();

    if (appData.orderItemList.length) {
      let index = 0;
      if (!appData.showTarget) {
        appData.showTarget = appData.orderItemList[0];
        appData.animFade = true;
      } else {
        index =
          appData.orderItemList.findIndex(
            (item) => item.commentId == appData.showTarget.commentId
          ) || 0;
        appData.showTarget =
          appData.orderItemList[(index + 1) % appData.orderItemList.length];
        appData.animFade = true;
      }
    }
  }

  _updateScrollStyleProperty() {
    let appRefs = this._getAppRefs();

    let offsetWidth = appRefs.commentBlock?.offsetWidth || 0;
    let scrollWidth = appRefs.commentBlock?.scrollWidth || 0;
    let diffWidth = scrollWidth - offsetWidth;
    let duration = Math.max(Math.min((scrollWidth / offsetWidth) * 2, 2), 4);
    document.documentElement.style.setProperty(
      "--text-scroll-transform-x",
      Math.min(-diffWidth, 0) + "px"
    );
    document.documentElement.style.setProperty(
      "--text-scroll-duration",
      duration + "s"
    );
  }
}
