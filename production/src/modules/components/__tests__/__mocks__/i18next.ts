export default {
    createInstance: jest.fn(() => ({
        init: jest.fn(),
        t: (str: string) => str,
    })),
    use: jest.fn(() => ({
        init: jest.fn()
    })),
}