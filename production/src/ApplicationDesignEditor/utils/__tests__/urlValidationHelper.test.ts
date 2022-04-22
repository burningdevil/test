import { validateUrl, validateImageDimensionFromUrl } from '../urlValidationHelper'

const mockValidateImageDimensionFromUrl = jest.fn() as jest.MockedFunction<typeof validateImageDimensionFromUrl>

describe('validateUrl function test', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logo url empty', () => {
    const isValid = validateUrl('', ()=>{}, 'web')
    expect(isValid).toBe(false)
    expect(mockValidateImageDimensionFromUrl).toHaveBeenCalledTimes(0)
  })

  it('logo url invalid', () => {
    const isValid = validateUrl('http:/asas.com/asas.png', ()=>{}, 'web')
    expect(isValid).toBe(false)
    expect(mockValidateImageDimensionFromUrl).toHaveBeenCalledTimes(0)
  })

  it('logo url valid', () => {
    const isValid = validateUrl('http://asas.com/asas.png', ()=>{}, 'web')
    expect(isValid).toBe(false)
    expect(mockValidateImageDimensionFromUrl).toHaveBeenCalledTimes(1)
  })
})
