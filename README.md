# Angular Chatbot Integration Sample

A small Angular sample that adds a chat window to an app using the Nebular chat components and Angular's `HttpClient`. Each message the user types is sent to a Dialogflow gateway endpoint, and the reply is shown in the chat.

This repo holds only the files you add to an Angular project, not a complete project.

## Features

- Chat window built with Nebular's `nb-chat`, `nb-chat-message` and `nb-chat-form`
- Sends every user message to the gateway with a random session ID, so the whole conversation can stay in one Dialogflow session
- Shows a spinner message while waiting for the bot's reply
- Shows an error message in the chat if the request fails

## Tech stack

- Angular (NgModule setup) with `HttpClient`
- Nebular (`@nebular/theme`, `@nebular/eva-icons`)
- Dialogflow, reached through a backend gateway that is not part of this repo

## Project structure

```
src/app/
├── app.module.ts                 # HttpClient, animations, Nebular modules, ChatbotComponent
└── chatbot/
    ├── chatbot.component.ts      # messages, session ID and the HTTP call
    ├── chatbot.component.html    # Nebular chat template
    └── chatbot.component.scss    # size of the chat window
```

## Setup

1. Create an Angular app and add Nebular:

   ```bash
   ng new my-app --routing --no-standalone
   cd my-app
   ng add @nebular/theme
   ```

   `--no-standalone` keeps the `app.module.ts` setup this sample uses (Angular 17 and later create standalone apps by default). Use a Nebular version that matches your Angular version.

2. Copy `src/app/chatbot/` into your project's `src/app/` folder and merge `src/app/app.module.ts` into yours. If `ng new` created different file names for the root component or routing module, update those two imports in the module.

3. Show the chat in `app.component.html`:

   ```html
   <nb-layout>
     <nb-layout-column>
       <app-chatbot></app-chatbot>
     </nb-layout-column>
   </nb-layout>
   ```

4. Add a bot avatar image that the app serves at `/assets/bot.jpeg` (for example `src/assets/bot.jpeg`, or `public/assets/bot.jpeg` in newer Angular projects), or change `botAvatar` in `chatbot.component.ts`.

5. Set `dialogflowURL` in `chatbot.component.ts` to the URL of your gateway.

6. Start the dev server and open http://localhost:4200:

   ```bash
   ng serve
   ```

## Gateway API

The component sends a `POST` request with this body (the language code is fixed to `en-US`):

```json
{
  "sessionId": "k3j9x",
  "queryInput": {
    "text": { "text": "Hello", "languageCode": "en-US" }
  }
}
```

and reads `fulfillmentText` from the JSON response:

```json
{ "fulfillmentText": "Hi! How can I help you?" }
```

A common way to build the gateway is a small cloud function that calls Dialogflow's `detectIntent` with the session ID and query input and returns the query result. It must allow CORS requests from the Angular app.

## License

MIT, see [LICENSE](LICENSE).
