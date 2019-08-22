import React, { Component } from 'react'
import { render } from 'react-dom'

Array.prototype.asyncForEach = function (callback) {
    return new Promise(resolve => {
        for(let i = 0; i < this.length; i++) {
            callback(this[i], i, this)
        }
        resolve()
    })
}

class App extends Component {
    constructor () {
        super()
        this.state = {
            users: [],
            formattedUsers: [],
        }
        this.getData()
    }

    async getData () {
        console.log('Getting data from the server...')
        const request = await fetch('https://raw.githubusercontent.com/rrafols/mobile_test/master/data.json')
        const jsonResponse = await request.json()
        this.setState({
            users: jsonResponse.Brastlewark
        })
        this.formatUsers()
    }

    async formatUsers () {
        console.log('Formatting users...')
        let formattedUsers = this.state.users.map(user => {
            return (
                <User
                    id={user.id}
                    name={user.name}
                    thumbnail={user.thumbnail}
                    age={user.age}
                    weight={user.weight}
                    height={user.height}
                    hair_color={user.hair_color}
                    professions={user.professions}
                    friends={user.friends}
                    key={user.id}
                />
            )
        })
        this.setState({formattedUsers})
    }

    render () {
        return (
            <div>
                <h1>Brastlewark Population</h1>
                <div>
                    {this.state.formattedUsers}
                </div>
            </div>
        )
    }
}

const User = (props) => {
    const professions = props.professions.map(profession => (
        <li key={profession}>{profession}</li>
    ))
    const friends = props.friends.map(friend => (
        <li key={friend}>{friend}</li>
    ))
    return (
        <div data-id={props.id}>
            <p>Name: {props.name}</p>
            <img src={props.thumbnail} alt={props.name} />
            <p>Age: {props.age}</p>
            <p>Weight: {props.weight}</p>
            <p>Height: {props.height}</p>
            <p>Hair color: {props.hair_color}</p>
            <ul>
                {professions}
            </ul>
            <ul>
                {friends}
            </ul>
        </div>
    )
}

render(<App />, document.querySelector('#root'))
