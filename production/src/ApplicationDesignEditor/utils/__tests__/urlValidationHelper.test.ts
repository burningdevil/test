import { validateUrl } from '../urlValidationHelper'

describe('validateUrl function test', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logo url empty', () => {
    const isValid = validateUrl('', ()=>{}, 'web')
    expect(isValid).toBe(false)
  })

  it('logo url invalid', () => {
    const isValid = validateUrl('http:/asas.com/asas.png', ()=>{}, 'web')
    expect(isValid).toBe(false)
  })

  it('logo url valid', () => {
    const isValid = validateUrl('http://asas.com/asas.png', ()=>{}, 'web')
    expect(isValid).toBe(true)
  })
})
