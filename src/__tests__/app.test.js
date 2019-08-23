import React, { Component } from 'react'
import { create } from 'react-test-renderer'
import 'isomorphic-fetch'
import "regenerator-runtime/runtime" // Required to use async / await
import App from '../App'


describe('App component', () => {
    test('the get data method should set the users in state successfully', async () => {
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
        const component = create(<App />)
        const instance = component.getInstance()

        jest.spyOn(window, 'fetch').mockImplementation(() => {
            const fetchResponse = {
                json: () => Promise.resolve(fakeResponse)
            }
            return Promise.resolve(fetchResponse)
        })

        await instance.getData()
        expect(instance.state.users).toBe(fakeResponse.Brastlewark)
    })
})
