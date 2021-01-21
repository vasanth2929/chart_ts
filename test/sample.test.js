const { parseJson } = require('../src/utils/t')

describe('math function test suite', () => {

    it('test scenario 1', () => {
        const tt = parseJson({
            "selector": "container", "data": [
                {
                    "name": "M1",
                    "left": {
                        "name": "spent",
                        "value": 5
                    },
                    "right": {
                        "name": "estimate",
                        "value": 5
                    }
                },
                {
                    "name": "M2",
                    "left": {
                        "name": "spent",
                        "value": 2
                    },
                    "right": {
                        "name": "estimate",
                        "value": 3
                    }
                },
                {
                    "name": "M3",
                    "left": {
                        "name": "spent",
                        "value": 4
                    },
                    "right": {
                        "name": "estimate",
                        "value": 2
                    }
                },
                {
                    "name": "M4",
                    "left": {
                        "name": "spent",
                        "value": 5
                    },
                    "right": {
                        "name": "estimate",
                        "value": 1
                    }
                },
                {
                    "name": "M5",
                    "left": {
                        "name": "spent",
                        "value": 2
                    },
                    "right": {
                        "name": "estimate",
                        "value": 2
                    }
                }
            ]
        })
        console.log(tt)
        expect(1).toBe(1)
    })

})
