# React Brastlewark Application
A react application that displays a list of gnomes from Brastlewark in an organized and clean interface featuring endless scroll and filtering functions.

It is made with React, the css-preprocessor Stylus and Webpack.

## How to use
Clone the repository, install the dependencies with `npm i` and run the application with `npm start`. You'll then be able to see the web app at `localhost:8080`.

If you want to modify the code, be sure to use `npm run watch` to setup webpack watch for changes. You can also run `npm run dev` for development.

## Folder structure

The web app contains 2 main folders:
- dist/: Where all the files sent to the end user will be located.
- src/: The source code containing all the javascript, html and css code.

In the root directory you have `package.json` and `webpack.config.js`. Those are the essential files for extending the application.

The main component, `App.js` is where all the javascript logic goes. The file `index.ejs` is used by webpack to generate a dynamic html file that gets updated with the most recent build when developing so that you can add stylesheets and external script files. In this case, I've added 2 fonts: Open Sans and Lato which are used extensively.

Fortunately, the application is also responsive, adapting to all kinds of screens by adding or removing rows. Feel free to take a look at the documented functions inside `App.js` for a better understand of how everything works internally.
