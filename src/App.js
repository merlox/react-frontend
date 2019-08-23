import React, { Component } from 'react'
import { render } from 'react-dom'
import './index.styl'

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
            renderStart: 0, // To determine what range of elements is being rendered
            renderFinish: 30,
            initialElements: 30,
            growthRate: 10, // Growth rate has to always be smaller to avoid getting stuck in the same position
            goingDown: true,
            previousScrollPosition: 0,
            cachedImages: {},
        }
        this.getData()
    }

    componentDidMount () {
        window.addEventListener('scroll', () => {
            this.handleScroll()
        })
    }

    handleScroll () {
        // Activate only every 10 scroll lines to recalculate direction
        if(window.scrollY % 10 == 0) {
            this.setState({
                goingDown: window.scrollY > this.state.previousScrollPosition,
                previousScrollPosition: window.scrollY,
            })
        }

        // When going up, remove elements up until you reach the initial state
        if(!this.state.goingDown && window.scrollY < document.documentElement.scrollHeight * 0.30) {
            const startPosition = this.state.renderStart - this.state.growthRate
            const finishPosition = this.state.renderFinish - this.state.growthRate
            this.setState({
                renderStart: startPosition <= 0 ? 0 : startPosition,
                renderFinish: finishPosition <= this.state.initialElements ? this.state.initialElements : finishPosition,
            }, () => {
                this.formatUsers(this.state.renderStart, this.state.renderFinish)
            })
        }

        // If we scrolled 50% of the page, render new items while removing old ones
        if(this.state.goingDown && window.scrollY > document.documentElement.scrollHeight * 0.70) {
            this.setState({
                renderStart: this.state.renderStart + this.state.growthRate,
                renderFinish: this.state.renderFinish + this.state.growthRate,
            }, () => {
                this.formatUsers(this.state.renderStart, this.state.renderFinish)
            })
        }
    }

    async getData () {
        console.log('Getting data from the server...')
        const request = await fetch('https://raw.githubusercontent.com/rrafols/mobile_test/master/data.json', {
            cache: 'default'
        })
        const jsonResponse = await request.json()
        this.setState({
            users: jsonResponse.Brastlewark
        })

        this.formatUsers(this.state.renderStart, this.state.renderFinish)
    }

    // To cache images as you scroll. They will stay loaded for repeated offenders
    async cacheImages (thumbnails) {
        // Create a hash map to store the images in the local storage for caching accesing a map takes linear time O(1) so it's optimal
        let thumbnailsMap = this.state.cachedImages
        let addedImage = false
        thumbnails.map(async (img, index) => {
            // Get the image object and store it in the map as the loaded image
            if(!thumbnailsMap[img.props.src]) {
                addedImage = true
                thumbnailsMap[img.props.src] = thumbnails[index]
            }
        })
        if(addedImage) {
            this.setState({ cachedImages: thumbnailsMap })
        }
    }

    async formatUsers (renderStart, renderFinish) {
        // Render only the first 100 and load the rest on scroll
        const firstHundred = this.state.users.slice(renderStart, renderFinish)
        let thumbnails = []
        let formattedUsers = firstHundred.map(user => {
            const thumbnail = this.state.cachedImages[user.thumbnail] ?
                (this.state.cachedImages[user.thumbnail]) :
                (<img src={user.thumbnail} alt={user.name}/>)
            thumbnails.push(thumbnail)
            return (
                <User
                    className="user"
                    id={user.id}
                    name={user.name}
                    age={user.age}
                    weight={user.weight}
                    height={user.height}
                    hair_color={user.hair_color}
                    professions={user.professions}
                    friends={user.friends}
                    key={user.id}
                >{thumbnail}</ User>
            )
        })
        this.setState({
            formattedUsers
        }, () => {
            this.cacheImages(thumbnails)
        })
    }

    render () {
        return (
            <div className="main-container">
                <h1 className="title">Brastlewark Population</h1>
                <div className="users-container">
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
        <div data-id={props.id} className={props.className}>
            <h3>{props.name}</h3>
            <div className="image-cropper">
                {props.children}
            </div>
            <p>Has a {props.hair_color} hair color</p>
            <p>{props.age} years old</p>
            <p>{props.weight.toFixed(2)} Kg</p>
            <p>{props.height.toFixed(2)} cm tall</p>
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
