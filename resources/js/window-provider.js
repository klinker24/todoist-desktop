/*
 *  Copyright 2018 Luke Klinker
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

// Add a command line arg to see if the user wants to hide the gui on first launch
let noGui = process.argv.indexOf("--no-gui") > -1;

(function() {
  const { BrowserWindow, BrowserView, app } = require('electron')

  const windowStateKeeper = require('electron-window-state')
  const configurator = require('./browserview-configurator.js')
  const path = require('path')
  const url = require('url')

  let mainWindow = null
  let browserView = null

  var createMainWindow = () => {
    var mainWindowState, mainWindow, bounds

    try {
      mainWindowState = windowStateKeeper( { defaultWidth: 1000, defaultHeight: 750 } )
      bounds = {
        title: "Todoist", icon: path.join(__dirname, '../../build/icon.png'),
        show: !noGui, x: mainWindowState.x, y: mainWindowState.y,
        width: mainWindowState.width, height: mainWindowState.height,
      }
    } catch (err) {
      bounds = {
        title: "Todoist", icon: path.join(__dirname, '../../build/icon.png'),
        show: !noGui, x: 0, y: 0,
        width: 1000, height: 750,
      }
    }

    mainWindow = new BrowserWindow(bounds)

    // always re-enable showing the GUI after first launch
    if (noGui) {
      noGui = false;
    }

    browserView = new BrowserView( { webPreferences: { nodeIntegration: false } } )

    mainWindow.setBrowserView(browserView)
    configurator.prepare(mainWindow, browserView)

    mainWindow.on('close', (event) => {
      event.preventDefault()
      getWindow().hide()

      if (process.platform === 'darwin') {
        app.dock.hide()
      }
    })

    mainWindow.on('closed', (event) => {
      setWindow(null)
    })

    setWindow(mainWindow)
    mainWindowState.manage(mainWindow)

    return mainWindow
  }

  var setWindow = (w) => {
    mainWindow = w
  }

  var getWindow = () => {
    return mainWindow
  }

  var getBrowserView = () => {
    return browserView
  }

  var setReplyWindow = (w) => {
    replyWindow = w
  }

  module.exports.createMainWindow = createMainWindow
  module.exports.getWindow = getWindow
  module.exports.setWindow = setWindow
  module.exports.getBrowserView = getBrowserView
}())
