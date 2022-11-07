# Counter
Author: Deniz Mert Tecimer

## Description
This is web application consuming Counter Api for Siemens Energy Working Student Job Application of Deniz Mert Tecimer.
By clicking on the increment button, you can increment the current value on the api. If the value is chanced by someone else,
it will update automatically for you, too. To retrieve changes on the api while using http, the app has to poll the api. 
Polling time interval is set as 0.5 seconds.

## Config
This website can consume the api by making requests both on http and websocket. You can select the desired format and the configuration via **.env** file.

```
Example .env file

//Host of the api
VITE_API_HOST="127.0.0.1"

//Port of the api
VITE_API_PORT="8080"

//Protocol type (either "http" or "ws")
VITE_API_TYPE="http"
```

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm start
```

## Extras
### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).