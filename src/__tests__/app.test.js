import React, { Component, useState } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import 'isomorphic-fetch'
import { act } from 'react-dom/test-utils'
import "regenerator-runtime/runtime" // Required to use async / await
import App from '../App'

let container

beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
})

afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
    container = null
})

describe('App component', () => {
    test('it shows a list of users', async () => {
        const fakeResponse = {
            "Brastlewark": [
                {
                    "id": 0,
                    "name": "Tobus Quickwhistle",
                    "thumbnail": "http://www.publicdomainpictures.net/pictures/10000/nahled/thinking-monkey-11282237747K8xB.jpg",
                    "age": 306,
                    "weight": 39.065952,
                    "height": 107.75835,
                    "hair_color": "Pink",
                    "professions": [
                        "Metalworker",
                        "Woodcarver",
                        "Stonecarver",
                        " Tinker",
                        "Tailor",
                        "Potter"
                    ],
                    "friends": [
                        "Cogwitz Chillwidget",
                        "Tinadette Chillbuster"
                    ]
                }, {
                    "id": 1,
                    "name": "Fizkin Voidbuster",
                    "thumbnail": "http://www.publicdomainpictures.net/pictures/120000/nahled/white-hen.jpg",
                    "age": 288,
                    "weight": 35.279167,
                    "height": 110.43628,
                    "hair_color": "Green",
                    "professions": [
                        "Brewer",
                        "Medic",
                        "Prospector",
                        "Gemcutter",
                        "Mason",
                        "Tailor"
                    ],
                    "friends": []
                    }
                ]
            }

        jest.spyOn(window, 'fetch').mockImplementation(() => {
            const fetchResponse = {
                json: () => Promise.resolve(fakeResponse)
            }
            return Promise.resolve(fetchResponse)
        })

        await act(async () => {
            render(<App/>, container)
        })
        console.log('CONTENT', container.textContent)
        // expect(container.textContent).toBe('John DoeKevin Mitnick')
        window.fetch.mockRestore()
    })
})
