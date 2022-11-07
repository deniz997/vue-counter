<script>
/**
 * Contains the logic and the template of the counter
 * Author: Deniz Mert Tecimer
 */
import CounterApi, { ServerType } from "./counterApi";
export default {
  data() {
    return {
      //Current value
      count: 0,
      //Error to be shown or logged
      error: undefined,
      //Timer to poll the api
      timer: undefined,
    };
  },
  mounted() {
    /**
     * When the component is mounted and if the http protocol is used,
     * it sends and initial hello request to the api to retrieve the
     * state and command list.
     * In order to update on changes of the state in the api, it has to
     * poll the api. Polling time interval is set as 0.5 seconds.
     */
    if (CounterApi.serverType === ServerType.HTTP) {
      this.hello(false);
      this.timer = setInterval(this.hello, 500, true);
    }
  },
  created() {
    /**
     * When the component is created and if the websocket protocol is used,
     * then a connection to the api will be created.
     */
    if (CounterApi.serverType === ServerType.WS) {
      CounterApi.setupConnection(this.updateCounter);
    }
  },
  methods: {
    /**
     * Sends an increment request to the server
     * and updates the component state based on the response
     * to reflect on the UI, then logs the history received
     * from the api.
     */
    increment: function () {
      CounterApi.increment().then((response) => {
        if (CounterApi.serverType === ServerType.HTTP) {
          if (response.error) {
            this.error = response.error;
            clearInterval(this.timer);
            this.timer = null;
          } else {
            console.log("History:" + history.toString());
            this.count = response.currentValue;
            this.error = null;
            this.timer = setInterval(this.hello, 500, true);
          }
        }
      });
    },
    /**
     * Sends a hello request to the api and updates the UI
     * based on the retrieved response (welcome message and
     * the current state), then logs the history.
     * @param isPing to log the welcome message to the console
     */
    hello: function (isPing) {
      CounterApi.clientHello().then((response) => {
        if (response.error) {
          this.error = response.error;
          clearInterval(this.timer);
        } else {
          if (!isPing) {
            console.log(response.message);
          }
          this.logHistory(response.history);
          this.count = response.currentValue;
        }
      });
    },
    /**
     * If a websocket connection is used and another client
     * updates the value, the component state must be updated
     * by the api.
     * @param result to update the UI
     */
    updateCounter: function (result) {
      if (!result.error) {
        this.count = result.currentValue;
        this.logHistory(result.history);
      } else {
        this.error = result.error;
      }
    },
    /**
     * Logs the history array.
     * @param history array containing recent values
     */
    logHistory: function (history) {
      let historyString = "History: ";
      history.map((item) => {
        historyString = historyString + item + " ";
      });
      console.log(historyString);
    },
  },
};
</script>

<template>
  <div id="counter">
    <div id="counterContainer">
      <h1>{{ count }}</h1>
      <button class="button-24" @click="increment">Increment</button>
      <p class="error" vue-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
#counterContainer {
  width: fit-content;
  text-align: center;
  margin-top: 8px;
  margin-right: auto;
  margin-left: auto;
}

h1 {
  font-family: nunito, roboto, proxima-nova, "proxima nova", sans-serif;
  color: #4a4949;
  font-size: 400%;
  margin: 0;
  margin-bottom: 6px;
}

.error {
  color: #9c1616;
  font-family: nunito, roboto, proxima-nova, "proxima nova", sans-serif;
  margin-bottom: 0;
}

.button-24 {
  background: #009999;
  border: 1px solid #009999;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-family: nunito, roboto, proxima-nova, "proxima nova", sans-serif;
  font-size: 16px;
  font-weight: 800;
  line-height: 16px;
  min-height: 40px;
  outline: 0;
  padding: 12px 14px;
  text-align: center;
  text-rendering: geometricprecision;
  text-transform: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
}

.button-24:hover,
.button-24:active {
  background-color: initial;
  background-position: 0 0;
  color: #009999;
}

.button-24:active {
  opacity: 0.5;
}
</style>
