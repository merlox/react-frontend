import React from 'react'
import { create } from 'react-test-renderer'

function Button (props) {
    return <button>This is a button</button>
}

describe('button component', () => {
    test('matches the screenshot', () => {
        const button = create(<Button />)
        expect(button.toJSON()).toMatchSnapshot()
    })
})
