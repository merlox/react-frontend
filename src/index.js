import React, { Component } from 'react'
import { render } from 'react-dom'
import App from './App'
import './index.styl'

Array.prototype.asyncForEach = function (callback) {
    return new Promise(resolve => {
        for(let i = 0; i < this.length; i++) {
            callback(this[i], i, this)
        }
        resolve()
    })
}

render(<App />, document.querySelector('#root'))
