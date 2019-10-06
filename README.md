# TrackAlgo - Track on Algorand

This project is a platform where a person can track any material. The item details are put onto the algorand blockchain.

The `note` field for any Algorand Transaction is used to store the details of the material.

The project is generic i.e., It can be adapted for any use case. Currently it implements any item with an associated temperature.

## Features

### New Item
- Any new item can be tracked by giving the appropriate details. [Add Item](https://frosty-kepler-77183e.netlify.com/#/new-artifact)
- The site automatically takes the current location of the device to map with the item's Location
- The temperature of the item is currenlty generated randomly but it can be taken from any IOT Device as input.

### Tracked Items

- List of all the items being tracked are listed with a few details, a complete history can be seen after clicking the card.
- Shows the Id, Name, The latest location and the timestamp.
- [List of all the Items Tracked](https://frosty-kepler-77183e.netlify.com/)

### Item Details

- Shows a tracking history of an item with all he coordinates, timestamp in a list form as well as on the map.
- Shows a map of all the previous locations of an item.
- Gives the option to update the location by taking the current location from the user.
- Creates a page for every item like this https://frosty-kepler-77183e.netlify.com/#/artifact-details/UYBN6789GFDFGhtgfbr
- Shows a graph of the temperature changes of the item taken from the IOT Device.

### Search Section

- The end user can see the history of any item by typing the `Item ID` in the search bar.
- He will be shown a similar details page with the overall location and temperature history.
- [Search Item](https://frosty-kepler-77183e.netlify.com/#/search)

## Item Template

The template is a generic one which can be adapted to any other item and with any details wanted with little tweaks.

The one used by the project currenlty is :- 

```
{
  items:[{
    id: 'Paracetamol',
    name: 'Paracetamol',
    latlng: {
      lat: 51.505,
      lng: -0.09,
    },
    temp: 34,
    timestamp: '2018-8-3 11:12:40'.
  }]
}
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
