import React, { Component } from 'react'
import { render } from 'react-dom'

class App extends Component {
    constructor () {
        super()
    }

    render () {
        return (
            <div>This app has been setup</div>
        )
    }
}

render(<App />, document.querySelector('#root'))
