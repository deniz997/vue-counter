import axios from "axios";
/**
 * Gets configs from .env file.
 */
const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
const API_TYPE = import.meta.env.VITE_API_TYPE;

/**
 * Constructs api address based on the environment variables
 * given in the .env file.
 */
const api = API_TYPE + "://" + API_HOST + ":" + API_PORT;

//Websocket connection
let connection;

const CounterApi = {
  serverType: API_TYPE,
  /**
   * Makes a get request to the api and parse its response
   * @returns the parsed response
   */
  clientHello: async () => {
    if (API_TYPE === ServerType.HTTP) {
      return await axios.get(api + "/hello").then((response) => {
        console.log(response);
        return parseHelloResponse(response);
      });
    }
  },
  /**
   * Sets up the websocket connection to the api and registers
   * listeners for events. If a message received, parses the message
   * in JSON format and check if the necessary properties exist on response.
   * @param result if there is no problem, logs otherwise
   */
  setupConnection: function (updateCounter) {
    connection = new WebSocket(api);
    connection.onopen = function () {
      console.log("Successfully connected to the websocket server...");
    };
    connection.onmessage = function (messageEvent) {
      const jsonResponse = JSON.parse(messageEvent.data);
      if (jsonResponse && jsonResponse.message) {
        console.log(jsonResponse.message);
      } else if (jsonResponse && jsonResponse.error) {
        console.log(jsonResponse.error);
      } else {
        const result = parseSuccessResponse(jsonResponse);
        updateCounter(result);
      }
    };
  },
  /**
   * If http protocol is used, makes a post request to the api
   * to run the increment command. Then, handles with the response.
   * If websocket protocol is used, sends an increment message to the api.
   * @returns the updated state or the error message if http; if websocket, then void
   */
  increment: async () => {
    if (API_TYPE === ServerType.HTTP) {
      return await axios
        .post(api + "/api", {
          command: "INCREMENT",
          value: 1,
        })
        .then(
          (response) => {
            return parseSuccessResponse(response.data);
          },
          (error) => {
            return handleError(error);
          }
        );
    } else if (API_TYPE === ServerType.WS && connection) {
      const incrementMessage = {
        command: "INCREMENT",
        value: 1,
      };
      connection.send(JSON.stringify(incrementMessage));
    }
  },
};

/**
 * A util function to parse and check if hello response has desired properties
 * @param helloResponse received from the api
 * @returns hello message and the state, if errors then logs error and returns it
 */
const parseHelloResponse = (helloResponse) => {
  const jsonResponse = helloResponse.data;
  let message;
  let successResponse;
  if (jsonResponse.message && jsonResponse.state) {
    const messageResponse = jsonResponse.message;
    if (messageResponse.message) {
      message = messageResponse.message;
    }
    successResponse = parseSuccessResponse(jsonResponse.state);
  }
  if (message && !successResponse.error) {
    return { message, ...successResponse };
  } else {
    console.log("Can not parse success response!");
    return {
      error: successResponse.error
        ? successResponse.error
        : "Can not parse hello response!",
    };
  }
};

/**
 * A util function to parse and check if success response has desired properties
 * @param successResponse received from the api
 * @returns updated state and the history, if errors then logs error and returns it
 */
const parseSuccessResponse = (successResponse) => {
  let currentValue;
  let history;
  if (!isNaN(successResponse.currentValue)) {
    currentValue = successResponse.currentValue;
  }
  if (successResponse.updatedHistory) {
    history = successResponse.updatedHistory;
  }
  if (!isNaN(currentValue) && history) {
    return { currentValue, history };
  } else {
    console.log("Can not parse success response!");
    return { error: "Can not parse success response!" };
  }
};

/**
 * Receives the error from the error response
 * @param error to be handled and parsed
 * @returns error object with its message
 */
const handleError = (error) => {
  if (error.response && error.response.data && error.response.data.error) {
    console.log(error.response.data.error);
    return { error: error.response.data.error };
  } else {
    console.log(error.message);
    return { error: error.message };
  }
};

/**
 * Supported protocols
 */
export const ServerType = {
  HTTP: "http",
  WS: "ws",
};

export default CounterApi;
