const app = Vue.createApp({
  setup() {
    document.body.removeAttribute("hidden");
  },
  data() {
    return {
      animFade: false,
      isScroll: false,
      showTarget: null,
      orderItemList: [],
    };
  },
  methods: {
    onFadeAfterEnter: function () {
      this.$controller.onFadeAfterEnter();
    },
    onScrollAnimationIteration: function () {
      this.$controller.onScrollAnimationIteration();
    },
    onScrollAnimationEnd: function () {
      this.$controller.onScrollAnimationEnd();
    },
    onFadeAfterLeave: function () {
      this.$controller.onFadeAfterLeave();
    },
  },
  mounted() {
    this.$controller = new Controller(this);

    OneSDK.setup({
      permissions: OneSDK.usePermission([OneSDK.PERM.ORDER]),
    });

    OneSDK.subscribe({
      action: "connected",
      callback: () => {
        OneSDK.getOrders().then((orderItemList) =>
          OneSDK.getConfig().then((config) =>
            this.$controller.onUpdateOrderItemList(orderItemList, config)
          )
        );
      },
    });

    OneSDK.subscribe({
      action: "waitingList",
      callback: (orderItemList) => {
        OneSDK.getConfig().then((config) =>
          this.$controller.onUpdateOrderItemList(orderItemList, config)
        );
      },
    });

    OneSDK.connect();
  },
});

OneSDK.ready().then(() => {
  app.mount("#container");
});
