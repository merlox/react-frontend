import React, { Component } from 'react'
import './index.styl'

export default class App extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            users: [],
            renderElements: [], // The elements from which we render users, used by filters
            formattedUsers: [],
            renderStart: 0, // To determine what range of elements is being rendered
            renderFinish: 50,
            initialElements: 50,
            growthRate: 20, // Growth rate has to always be smaller to avoid getting stuck in the same scrolling position
            goingDown: true,
            previousScrollPosition: 0,
            cachedImages: {},
            filterByOptions: [],
            selectedFilter: 'none',
            allFriends: [],
            allProfessions: [],
        }
        this.getData()
    }

    componentDidMount () {
        window.addEventListener('scroll', () => {
            this.handleScroll()
        })
    }

    /**
     * Loads elements as the user scrolls in either direction using the state variable `growthRate`
     */
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

        // If we scrolled 70% of the page, render new items while removing old ones
        if(this.state.goingDown && window.scrollY > document.documentElement.scrollHeight * 0.70) {
            const startPosition = this.state.renderStart + this.state.growthRate
            const finishPosition = this.state.renderFinish + this.state.growthRate

            this.setState({
                renderStart: (startPosition + this.state.growthRate) >= this.state.renderElements.length ? (this.state.renderElements.length - this.state.growthRate) : startPosition,
                renderFinish: this.state.renderFinish + this.state.growthRate,
            }, () => {
                this.formatUsers(this.state.renderStart, this.state.renderFinish)
            })
        }
    }

    /**
     * Gets the initial data from github and calles `formatUsers()` to display the initial elements
     */
    async getData () {
        const request = await fetch('https://raw.githubusercontent.com/rrafols/mobile_test/master/data.json', {
            cache: 'default'
        })
        const jsonResponse = await request.json()
        this.setState({
            users: jsonResponse.Brastlewark,
            renderElements: jsonResponse.Brastlewark,
        })

        this.formatUsers(this.state.renderStart, this.state.renderFinish)
    }

    /**
     * Loops through all the users and captures the unique professions or friends
     * to set them in the `allProfessions` or `allFriends` state variable required
     * to display the filtering options when the users wants to filter by a type
     * @param  {string}  typeSelected  Whether you want the professions or friends type
     */
    getAllProfessionsOrFriends (typeSelected) {
        let newTypes = false
        let types = []
        let typesJSX = []
        let stateType = 'allFriends'
        let arrayType = 'friends'

        if(typeSelected == 'professions') {
            stateType = 'allProfessions'
            arrayType = 'professions'
        }

        if(this.state[stateType].length == 0) {
            newTypes = true
            types.push('None')
            this.state.users.map(user => {
                user[arrayType].map(type => {
                    if(types.indexOf(type) == -1) {
                        types.push(type)
                    }
                })
            })
            this.setState({
                [stateType]: types
            })
        }
        // If the professions have been generated already, simply recreate the JSX
        if(newTypes) {
            types.map(type => {
                let jsx = (
                    <option value={type} key={type}>{type}</option>
                )
                typesJSX.push(jsx)
            })
        } else {
            this.state[stateType].map(type => {
                let jsx = (
                    <option value={type} key={type}>{type}</option>
                )
                typesJSX.push(jsx)
            })
        }

        this.setState({
            filterByOptions: typesJSX
        })
    }

    /**
     * Caches images in the react state object as you scroll to instantly load repeated images
     * @param  {array}  thumbnails The array of images loaded during this scroll position
     */
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

    /**
     * Displays the formatted data using css and html
     * @param  {int}  renderStart  The starting position from which you can display elements
     * @param  {int}  renderFinish The ending position from which you can display elements
     */
    async formatUsers (renderStart, renderFinish) {
        this.setState({
            loading: true,
        })
        // Render only the first initial slice and load the rest on scroll
        const slice = this.state.renderElements.slice(renderStart, renderFinish)
        let thumbnails = []
        let formattedUsers = slice.map(user => {
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
            formattedUsers,
            loading: false,
        }, () => {
            this.cacheImages(thumbnails)
        })
    }

    /**
     * Updates the state array of `renderElements` to show only those that have the
     * selected profession or friend
     * @param  {string} value The friend or profession selected to filter
     */
    filterByValue (value) {
        let renderElements
        if(value.toLowerCase() == 'none' || this.state.selectedFilter.toLowerCase() == 'none') {
            renderElements = this.state.users
        } else if(this.state.selectedFilter.toLowerCase() == 'profession') {
            renderElements = this.state.users.filter(user => {
                return user.professions.indexOf(value) != -1
            })
        } else if(this.state.selectedFilter.toLowerCase() == 'friend') {
            renderElements = this.state.users.filter(user => {
                return user.friends.indexOf(value) != -1
            })
        }

        this.setState({
            renderElements
        }, () => {
            this.formatUsers(this.state.renderStart, this.state.renderFinish)
        })
    }

    render () {
        return (
            <div className="main-container">
                <h1 className="title">Brastlewark Population</h1>
                <div className="filter">
                    <div>FILTER BY</div>
                    <select onChange={e => {
                        const selectedFilter = e.target.children[e.target.selectedIndex].value
                        this.setState({ selectedFilter })
                        if(selectedFilter == 'profession') {
                            this.getAllProfessionsOrFriends('professions')
                        } else if(selectedFilter == 'friend') {
                            this.getAllProfessionsOrFriends('friends')
                        } else {
                            this.filterByValue('none')
                        }
                    }}>
                        <option value="none">None</option>
                        <option value="profession">Profession</option>
                        <option value="friend">Friend</option>
                    </select>
                    <div className={this.state.selectedFilter == 'none' ? 'hidden' : ''}>&nbsp;></div>
                    <select onChange={e => {
                        const selectedValue = e.target.children[e.target.selectedIndex].value
                        this.filterByValue(selectedValue)
                    }} className={this.state.selectedFilter == 'none' ? 'hidden' : ''}>
                        {this.state.filterByOptions}
                    </select>
                </div>
                <div className="users-container">
                    {this.state.loading ? <img src="spinner.gif" alt="Loading spinner" className="spinner"/> : ''}
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
            <div className="hair-color">{props.hair_color} hair color</div>
            <div className="measurements">
                <div>{props.age} y/o</div>
                <div>{props.weight.toFixed(2)} kg</div>
                <div>{props.height.toFixed(2)} cm</div>
            </div>
            <div className={professions.length == 0 ? 'hidden' : "lists"}>
                <div>PROFESSIONS</div>
                <ul>{professions}</ul>
            </div>
            <div className={friends.length == 0 ? 'hidden' : "lists"}>
                <div>FRIENDS WITH</div>
                <ul>{friends}</ul>
            </div>
        </div>
    )
}
