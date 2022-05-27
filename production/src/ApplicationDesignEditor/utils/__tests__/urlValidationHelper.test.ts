import { URLErrorTypes, validateUrl } from '../urlValidationHelper'

describe('validateUrl function test', () => {
  const mockFn = jest.fn()
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logo url empty', () => {
    validateUrl('', mockFn, 'web')
    expect(mockFn).toHaveBeenCalledWith(true, '')
  })

  it('logo url invalid', () => {
    validateUrl('http:/asas.com/asas.png', mockFn, 'web')
    expect(mockFn).toHaveBeenCalledWith(false, URLErrorTypes.protocalSyntaxError)
  })

  it('logo url valid', () => {
    validateUrl('https://www.svgrepo.com/show/419492/political.svg', mockFn, 'web')
    expect(mockFn).toHaveBeenCalledWith(true, '')
  })
})
